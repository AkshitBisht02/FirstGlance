import React from 'react';
import { formatWalkingTime } from '../utils/dijkstra';
import './MetricsBox.css';

export default function MetricsBox({ distance, steps, origin, destination }) {
  if (!distance) return null;

  const walkTime = formatWalkingTime(distance);

  return (
    <div className="metrics-box">
      <div className="metrics-box__route">
        <span className="metrics-box__point metrics-box__point--origin">
          {origin}
        </span>
        <span className="metrics-box__arrow">
          <svg viewBox="0 0 24 4" fill="none">
            <path d="M0 2 H22 M20 0 L24 2 L20 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="metrics-box__point metrics-box__point--dest">
          {destination}
        </span>
      </div>

      <div className="metrics-box__stats">
        <div className="metrics-box__stat">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 12h18M3 6h18M3 18h18"/>
          </svg>
          <span className="metrics-box__stat-value">{distance}m</span>
          <span className="metrics-box__stat-label">Distance</span>
        </div>

        <div className="metrics-box__divider" />

        <div className="metrics-box__stat">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          <span className="metrics-box__stat-value">{walkTime}</span>
          <span className="metrics-box__stat-label">Walk Time</span>
        </div>

        <div className="metrics-box__divider" />

        <div className="metrics-box__stat">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="5" r="2"/><path d="M12 7v6l3 3M12 7c-3 2-4 5-3 8"/>
          </svg>
          <span className="metrics-box__stat-value">{Math.max(0, steps - 2)}</span>
          <span className="metrics-box__stat-label">Waypoints</span>
        </div>
      </div>
    </div>
  );
}
