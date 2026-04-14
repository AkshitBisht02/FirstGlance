import React, { useState } from 'react';
import { formatWalkingTime } from '../utils/dijkstra';
import './Sidebar.css';

// ── Campus Places data ────────────────────────────────────
const CAMPUS_PLACES = [
  {
    id: 'canteens',
    icon: '🍽️',
    label: 'Canteens',
    items: [
      'Quick Bite Cafe',
      'Happiness Cafe',
      'Ravi canteen',
      'Coffee Shop',
      'Tuck Shop',
    ],
  },
  {
    id: 'sports',
    icon: '🏀',
    label: 'Sports',
    items: [
      'Basket ball court',
      'Badminton Court',
      'Geu Main Ground',
    ],
  },
  {
    id: 'library',
    icon: '📚',
    label: 'Library',
    items: [
      'Santosh Library',
    ],
  },
  {
    id: 'hostels',
    icon: '🏠',
    label: 'Hostels',
    items: [
      'Sardar patel hostel',
      'Chandra shekhar azad hostel',
      'Laxmi bai Hostel',
      'Sarojini Hostel',
      'Priyadarshani Hostel',
    ],
  },
  {
    id: 'labs',
    icon: '🔬',
    label: 'Labs',
    items: [
      'Param Lab',
      'AryaBhata Lab',
    ],
  },
  {
    id: 'gates',
    icon: '🚪',
    label: 'Gates',
    items: [
      'Gate no. 1',
      'Gate no. 2',
    ],
  },
];

const CAMPUS_INFO = [
  { icon: '🏛️', label: 'Founded',     value: '1993' },
  { icon: '📐', label: 'Campus Area', value: '15 acres' },
  { icon: '🎓', label: 'Students',    value: '8,000+' },
  { icon: '🏗️', label: 'Departments', value: '15+' },
  { icon: '🏠', label: 'Hostels',     value: '5 blocks' },
  { icon: '🍽️', label: 'Canteens',    value: '5 outlets' },
];

export default function Sidebar({
  open,
  source,
  destination,
  pathResult,
  onClose,
  onPlaceClick,
  activePlaceNode,
}) {
  // Track which accordion sections are open (default: first open)
  const [openSections, setOpenSections] = useState({ canteens: true });

  const toggleSection = (id) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <aside className={`sidebar ${open ? 'sidebar--open' : ''}`}>
      <div className="sidebar__header">
        <span className="sidebar__title">Navigation</span>
        <button className="sidebar__close" onClick={onClose} aria-label="Close sidebar">✕</button>
      </div>

      <div className="sidebar__body">

        {/* ── Route Info ────────────────────────────────── */}
        <section className="sidebar__section">
          <h4 className="sidebar__section-title">Current Route</h4>

          <div className="sidebar__route">
            <div className={`sidebar__route-point ${source ? 'active' : 'empty'}`}>
              <span className="sidebar__route-dot sidebar__route-dot--origin" />
              <div>
                <div className="sidebar__route-label">Source</div>
                <div className="sidebar__route-value">
                  {source || 'Tap a marker → Set as Source'}
                </div>
              </div>
            </div>

            {source && <div className="sidebar__route-line" />}

            <div className={`sidebar__route-point ${destination ? 'active' : 'empty'}`}>
              <span className="sidebar__route-dot sidebar__route-dot--dest" />
              <div>
                <div className="sidebar__route-label">Destination</div>
                <div className="sidebar__route-value">
                  {destination || (source ? 'Tap a marker → Set as Destination' : '—')}
                </div>
              </div>
            </div>
          </div>

          {pathResult && (
            <div className="sidebar__metrics">
              <div className="sidebar__metric">
                <span className="sidebar__metric-value">{pathResult.distance}m</span>
                <span className="sidebar__metric-label">Distance</span>
              </div>
              <div className="sidebar__metric">
                <span className="sidebar__metric-value">{formatWalkingTime(pathResult.distance)}</span>
                <span className="sidebar__metric-label">Walk Time</span>
              </div>
              <div className="sidebar__metric">
                <span className="sidebar__metric-value">{Math.max(0, pathResult.path.length - 2)}</span>
                <span className="sidebar__metric-label">Waypoints</span>
              </div>
            </div>
          )}

          {!source && (
            <p className="sidebar__hint">
              Click any building marker on the map, then press <strong>"Set as Source"</strong> in the popup. Then click another building and press <strong>"Set as Destination"</strong>.
            </p>
          )}
        </section>

        {/* ── Campus Places (accordion) ─────────────────── */}
        <section className="sidebar__section">
          <h4 className="sidebar__section-title">🗺️ Campus Places</h4>
          <p className="sidebar__places-hint">
            Tap any place to zoom the map and view its details.
          </p>

          <div className="sidebar__accordion">
            {CAMPUS_PLACES.map((cat) => (
              <div key={cat.id} className={`accordion-item ${openSections[cat.id] ? 'accordion-item--open' : ''}`}>

                {/* Category header */}
                <button
                  className="accordion-header"
                  onClick={() => toggleSection(cat.id)}
                  aria-expanded={!!openSections[cat.id]}
                >
                  <span className="accordion-header__icon">{cat.icon}</span>
                  <span className="accordion-header__label">{cat.label}</span>
                  <span className="accordion-header__count">{cat.items.length}</span>
                  <span className="accordion-header__chevron">
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 6l4 4 4-4" />
                    </svg>
                  </span>
                </button>

                {/* Place list */}
                <div className="accordion-body">
                  <ul className="accordion-list">
                    {cat.items.map((placeName) => (
                      <li key={placeName}>
                        <button
                          className={`accordion-place-btn ${activePlaceNode === placeName ? 'accordion-place-btn--active' : ''}`}
                          onClick={() => onPlaceClick(placeName)}
                        >
                          <span className="accordion-place-btn__dot" />
                          <span className="accordion-place-btn__name">{placeName}</span>
                          <svg className="accordion-place-btn__arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 8h8M9 5l3 3-3 3" />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Campus Info ───────────────────────────────── */}
        <section className="sidebar__section">
          <h4 className="sidebar__section-title">🏫 Campus Info</h4>
          <div className="sidebar__info-grid">
            {CAMPUS_INFO.map((item) => (
              <div key={item.label} className="sidebar__info-item">
                <span className="sidebar__info-icon">{item.icon}</span>
                <div>
                  <div className="sidebar__info-value">{item.value}</div>
                  <div className="sidebar__info-label">{item.label}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Map Legend ────────────────────────────────── */}
        <section className="sidebar__section">
          <h4 className="sidebar__section-title">Map Legend</h4>
          <div className="sidebar__legend">
            {[
              { color: '#60a5fa', label: 'Academic Block' },
              { color: '#a78bfa', label: 'Hostel' },
              { color: '#f97316', label: 'Cafeteria' },
              { color: '#34d399', label: 'Sports' },
              { color: '#e879f9', label: 'Lab' },
              { color: '#fbbf24', label: 'Library' },
              { color: '#c9a84c', label: 'Gate' },
              { color: '#3ecf8e', label: 'Source (selected)' },
              { color: '#f05252', label: 'Destination' },
              { color: '#f6e05e', label: 'Search / Place highlight' },
              { color: '#9f7aea', label: 'Your Live Location' },
            ].map(({ color, label }) => (
              <div key={label} className="sidebar__legend-item">
                <span className="sidebar__legend-dot" style={{ background: color }} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </aside>
  );
}

