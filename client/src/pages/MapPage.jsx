import React, { useState, useEffect, useCallback, useMemo } from 'react';
import MapView from '../components/MapView';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import MetricsBox from '../components/MetricsBox';
import { fetchNodes, fetchEdges } from '../utils/api';
import { dijkstra, buildGraphFromEdges } from '../utils/dijkstra';
import { nodes as staticNodes, edges as staticEdges } from '../utils/mapData';
import './MapPage.css';

export default function MapPage() {
  const [nodes, setNodes]               = useState({});
  const [graph, setGraph]               = useState({});
  const [source, setSource]             = useState(null);        // origin node name
  const [destination, setDestination]   = useState(null);        // destination node name
  const [pathResult, setPathResult]     = useState(null);
  const [searchResult, setSearchResult] = useState(null);
  const [sidebarPlaceTarget, setSidebarPlaceTarget] = useState(null);
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading]           = useState(true);
  const [toast, setToast]               = useState(null);        // { msg, type }

  // ── Toast helper ─────────────────────────────────────────
  const showToast = useCallback((msg, type = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  }, []);

  // ── Load data (API with static fallback) ─────────────────
  useEffect(() => {
    async function loadData() {
      try {
        const [apiNodes, apiEdges] = await Promise.all([fetchNodes(), fetchEdges()]);
        const nodesMap = {};
        apiNodes.forEach((n) => {
          nodesMap[n.name] = {
            lat: n.lat, lng: n.lng,
            type: n.type, rooms: n.rooms, description: n.description,
          };
        });
        setNodes(nodesMap);
        setGraph(buildGraphFromEdges(apiEdges));
      } catch {
        setNodes(staticNodes);
        const g = {};
        Object.entries(staticEdges).forEach(([from, targets]) => {
          if (!g[from]) g[from] = {};
          Object.entries(targets).forEach(([to, weight]) => {
            g[from][to] = weight;
            if (!g[to]) g[to] = {};
            g[to][from] = weight;
          });
        });
        setGraph(g);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // ── Live location tracking ────────────────────────────────
  useEffect(() => {
    if (!navigator.geolocation) return;
    const watchId = navigator.geolocation.watchPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {},
      { enableHighAccuracy: true, maximumAge: 3000 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // ── Set source (clears existing route) ───────────────────
  const handleSetSource = useCallback((nodeName) => {
    setDestination(null);
    setPathResult(null);
    setSource(nodeName);
    showToast(`📍 Source set: ${nodeName}`, 'source');
  }, [showToast]);

  // ── Set destination + run Dijkstra ───────────────────────
  const handleSetDestination = useCallback((nodeName) => {
    if (!source) {
      showToast('Select a source building first', 'warn');
      return;
    }
    if (nodeName === source) {
      showToast('Source and destination cannot be the same', 'warn');
      return;
    }
    setDestination(nodeName);
    showToast(`🏁 Destination set: ${nodeName}`, 'dest');

    if (graph && Object.keys(graph).length > 0) {
      const result = dijkstra(graph, source, nodeName);
      if (result) {
        setPathResult(result);
      } else {
        showToast('No path found between these locations', 'warn');
        setPathResult(null);
      }
    }
  }, [source, graph, showToast]);

  // ── Full reset on empty map click ────────────────────────
  const handleMapReset = useCallback(() => {
    setSource(null);
    setDestination(null);
    setPathResult(null);
    setSearchResult(null);
    setSidebarPlaceTarget(null);
  }, []);

  // ── Search result (Navbar) ───────────────────────────────
  const handleSearchResult = useCallback((nodeName) => {
    setSearchResult(nodeName);
    setSidebarPlaceTarget(null);
  }, []);

  // ── Sidebar place click → zoom + highlight ───────────────
  const handleSidebarPlaceClick = useCallback((nodeName) => {
    setSidebarPlaceTarget(nodeName);
    setSearchResult(null);
  }, []);

  // ── Memoised path lat/lng array ──────────────────────────
  const pathCoords = useMemo(() => {
    if (!pathResult || !nodes) return [];
    return pathResult.path
      .map((name) => { const n = nodes[name]; return n ? [n.lat, n.lng] : null; })
      .filter(Boolean);
  }, [pathResult, nodes]);

  const highlightedNode = searchResult || sidebarPlaceTarget;

  return (
    <div className={`map-page ${sidebarOpen ? 'map-page--sidebar-open' : ''}`}>

      {/* ── Toast notification ─────────────────────────── */}
      {toast && (
        <div className={`map-toast map-toast--${toast.type}`}>
          {toast.msg}
        </div>
      )}

      <Navbar
        onSearchResult={handleSearchResult}
        onSidebarToggle={() => setSidebarOpen((s) => !s)}
        sidebarOpen={sidebarOpen}
        nodes={nodes}
      />

      <div className="map-page__body">
        <Sidebar
          open={sidebarOpen}
          source={source}
          destination={destination}
          pathResult={pathResult}
          onClose={() => setSidebarOpen(false)}
          onPlaceClick={handleSidebarPlaceClick}
          activePlaceNode={sidebarPlaceTarget}
        />

        <div className="map-page__map-wrap">
          {loading ? (
            <div className="map-loader">
              <div className="map-loader__spinner" />
              <span>Loading campus map…</span>
            </div>
          ) : (
            <MapView
              nodes={nodes}
              source={source}
              destination={destination}
              pathCoords={pathCoords}
              highlightedNode={highlightedNode}
              userLocation={userLocation}
              onSetSource={handleSetSource}
              onSetDestination={handleSetDestination}
              onMapClick={handleMapReset}
              hasSource={!!source}
            />
          )}

          {pathResult && (
            <MetricsBox
              distance={pathResult.distance}
              steps={pathResult.path.length}
              origin={source}
              destination={destination}
            />
          )}
        </div>
      </div>
    </div>
  );
}
