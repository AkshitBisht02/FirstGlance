import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { getNodeType, CAMPUS_CENTER, CAMPUS_ZOOM } from '../utils/mapData';
import './MapView.css';

// Fix default Leaflet icon path issue with bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// ── Custom SVG icon factory ─────────────────────────────
function createSvgIcon(color, size = 26, pulse = false) {
  const html = `
    <div class="custom-marker ${pulse ? 'custom-marker--pulse' : ''}" style="--mc:${color};">
      <div class="custom-marker__dot"></div>
      ${pulse ? '<div class="custom-marker__ring"></div>' : ''}
    </div>`;
  return L.divIcon({
    html,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2 + 6)],
  });
}

const TYPE_COLORS = {
  gate:      '#c9a84c',
  building:  '#60a5fa',
  hostel:    '#a78bfa',
  cafeteria: '#f97316',
  sports:    '#34d399',
  lab:       '#e879f9',
  library:   '#fbbf24',
  other:     '#9ca3af',
};

function getMarkerColor(type) {
  return TYPE_COLORS[type] || TYPE_COLORS.other;
}

// Build popup HTML — button labels change based on whether source is set
function buildPopupHtml(name, node, hasSource) {
  const type = node.type || getNodeType(name);
  const btnLabel = hasSource ? 'Set as Destination' : 'Set as Source';
  const btnClass = hasSource ? 'popup-btn popup-btn--dest' : 'popup-btn popup-btn--source';

  return `
    <div class="popup-content">
      <div class="popup-type">${type.toUpperCase()}</div>
      <div class="popup-name">${name}</div>
      ${node.description ? `<div class="popup-desc">${node.description}</div>` : ''}
      <div class="popup-actions">
        <button class="${btnClass}" data-node="${name}" data-action="${hasSource ? 'dest' : 'source'}">
          ${hasSource ? '🏁' : '📍'} ${btnLabel}
        </button>
        ${hasSource ? `<button class="popup-btn popup-btn--swap" data-node="${name}" data-action="source">
          🔄 Set as Source instead
        </button>` : ''}
      </div>
    </div>`;
}

export default function MapView({
  nodes,
  source,
  destination,
  pathCoords,
  highlightedNode,
  userLocation,
  onSetSource,
  onSetDestination,
  onMapClick,
  hasSource,
}) {
  const mapRef         = useRef(null);
  const leafletMap     = useRef(null);
  const markersRef     = useRef({});
  const pathLayerRef   = useRef(null);
  const userMarkerRef  = useRef(null);

  // Keep latest callbacks in refs so Leaflet handlers always see current values
  const onSetSourceRef      = useRef(onSetSource);
  const onSetDestinationRef = useRef(onSetDestination);
  const onMapClickRef       = useRef(onMapClick);
  const hasSourceRef        = useRef(hasSource);
  const nodesRef            = useRef(nodes);

  useEffect(() => { onSetSourceRef.current      = onSetSource; },      [onSetSource]);
  useEffect(() => { onSetDestinationRef.current = onSetDestination; }, [onSetDestination]);
  useEffect(() => { onMapClickRef.current       = onMapClick; },       [onMapClick]);
  useEffect(() => { hasSourceRef.current        = hasSource; },        [hasSource]);
  useEffect(() => { nodesRef.current            = nodes; },            [nodes]);

  // ── Initialise Leaflet map (once) ───────────────────────
  useEffect(() => {
    if (leafletMap.current) return;

    const map = L.map(mapRef.current, {
      center: CAMPUS_CENTER,
      zoom: CAMPUS_ZOOM,
      zoomControl: true,
      attributionControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 20,
    }).addTo(map);

    // Empty map click → reset
    map.on('click', () => onMapClickRef.current());

    // Popup button click delegation (event bubbles up to map container)
    mapRef.current.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      e.stopPropagation();
      const name   = btn.dataset.node;
      const action = btn.dataset.action;
      map.closePopup();
      if (action === 'source') {
        onSetSourceRef.current(name);
      } else {
        onSetDestinationRef.current(name);
      }
    });

    leafletMap.current = map;

    return () => {
      map.remove();
      leafletMap.current = null;
    };
  }, []); // eslint-disable-line

  // ── Build / rebuild markers when nodes data arrives ──────
  useEffect(() => {
    if (!leafletMap.current || !nodes || Object.keys(nodes).length === 0) return;

    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    const displayNodes = Object.keys(nodes).filter((n) => !n.startsWith('Road Point'));

    displayNodes.forEach((name) => {
      const node = nodes[name];
      const type = node.type || getNodeType(name);
      const color = getMarkerColor(type);
      const icon  = createSvgIcon(color, 24);

      const marker = L.marker([node.lat, node.lng], { icon })
        .addTo(leafletMap.current)
        .bindPopup('', { maxWidth: 260, className: 'fg-popup' });

      // On marker click → open popup with correct button label based on current state
      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        const html = buildPopupHtml(name, node, hasSourceRef.current);
        marker.getPopup().setContent(html).openOn(leafletMap.current);
      });

      markersRef.current[name] = marker;
    });
  }, [nodes]); // eslint-disable-line

  // ── Update marker icon colours reactively ───────────────
  useEffect(() => {
    if (!nodes) return;
    Object.entries(markersRef.current).forEach(([name, marker]) => {
      const node = nodes[name] || {};
      const type = node.type || getNodeType(name);

      if (name === source) {
        marker.setIcon(createSvgIcon('#3ecf8e', 34));
        marker.setZIndexOffset(1000);
      } else if (name === destination) {
        marker.setIcon(createSvgIcon('#f05252', 34));
        marker.setZIndexOffset(1000);
      } else if (name === highlightedNode) {
        marker.setIcon(createSvgIcon('#f6e05e', 30));
        marker.setZIndexOffset(900);
        // Zoom + open popup for sidebar/search result
        if (leafletMap.current && nodes[name]) {
          leafletMap.current.setView([nodes[name].lat, nodes[name].lng], 18, { animate: true });
          const html = buildPopupHtml(name, node, hasSourceRef.current);
          marker.getPopup().setContent(html).openOn(leafletMap.current);
        }
      } else {
        marker.setIcon(createSvgIcon(getMarkerColor(type), 24));
        marker.setZIndexOffset(0);
      }
    });
  }, [source, destination, highlightedNode, nodes]);

  // ── Update popup content when hasSource changes ──────────
  // (so the button label in any open popup stays correct)
  useEffect(() => {
    if (!leafletMap.current) return;
    const openPopup = leafletMap.current._popup;
    if (!openPopup) return;

    // Find which marker owns this popup
    const entry = Object.entries(markersRef.current).find(([, m]) => m.getPopup() === openPopup);
    if (!entry) return;
    const [name] = entry;
    const node = nodesRef.current[name];
    if (!node) return;
    openPopup.setContent(buildPopupHtml(name, node, hasSource));
  }, [hasSource]);

  // ── Draw / clear animated path polyline ─────────────────
  useEffect(() => {
    if (!leafletMap.current) return;

    if (pathLayerRef.current) {
      pathLayerRef.current.remove();
      pathLayerRef.current = null;
    }

    if (pathCoords && pathCoords.length > 1) {
      const polyline = L.polyline(pathCoords, {
        color: '#3ecf8e',
        weight: 5,
        opacity: 0.92,
        dashArray: '10, 6',
        lineCap: 'round',
        lineJoin: 'round',
        className: 'animated-path',
      }).addTo(leafletMap.current);

      pathLayerRef.current = polyline;
      leafletMap.current.fitBounds(polyline.getBounds(), { padding: [70, 70] });
    }
  }, [pathCoords]);

  // ── Live user location marker ────────────────────────────
  useEffect(() => {
    if (!leafletMap.current || !userLocation) return;

    const icon = createSvgIcon('#9f7aea', 30, true);

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng]);
      userMarkerRef.current.setIcon(icon);
    } else {
      userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon })
        .addTo(leafletMap.current)
        .bindPopup('<div class="popup-content"><div class="popup-name">📍 You are here</div></div>');
    }
  }, [userLocation]);

  return <div ref={mapRef} className="map-view" />;
}
