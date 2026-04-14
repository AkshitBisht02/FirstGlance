import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { nodes as staticNodes, getNodeType } from '../utils/mapData';
import './Navbar.css';

export default function Navbar({ onSearchResult, onSidebarToggle, sidebarOpen, nodes }) {
  const navigate = useNavigate();
  const [query, setQuery]       = useState('');
  const [results, setResults]   = useState([]);
  const [showDrop, setShowDrop] = useState(false);
  const inputRef = useRef(null);
  const dropRef  = useRef(null);

  const allNodes = nodes && Object.keys(nodes).length > 0 ? nodes : staticNodes;

  // Client-side search across names + synthetic rooms
  const doSearch = useCallback((q) => {
    if (!q.trim()) { setResults([]); setShowDrop(false); return; }
    const lower = q.toLowerCase();

    const matches = Object.entries(allNodes)
      .filter(([name]) => !name.startsWith('Road Point'))
      .filter(([name]) => name.toLowerCase().includes(lower))
      .slice(0, 8);

    setResults(matches);
    setShowDrop(matches.length > 0);
  }, [allNodes]);

  const handleInput = (e) => {
    setQuery(e.target.value);
    doSearch(e.target.value);
  };

  const handleSelect = (name) => {
    setQuery(name);
    setShowDrop(false);
    onSearchResult(name);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (results.length > 0) handleSelect(results[0][0]);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target) &&
          inputRef.current && !inputRef.current.contains(e.target)) {
        setShowDrop(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <nav className="navbar">
      {/* Left: brand + sidebar toggle */}
      <div className="navbar__left">
        <button
          className={`navbar__sidebar-btn ${sidebarOpen ? 'active' : ''}`}
          onClick={onSidebarToggle}
          title="Toggle Sidebar"
          aria-label="Toggle Sidebar"
        >
          <span /><span /><span />
        </button>

        <button className="navbar__brand" onClick={() => navigate('/')}>
          First<span>Glance</span>
        </button>
      </div>

      {/* Right: search */}
      <div className="navbar__search-wrap">
        <form className="navbar__search-form" onSubmit={handleSubmit}>
          <div className="navbar__search-input-wrap">
            <svg className="navbar__search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              className="navbar__search-input"
              placeholder="Search buildings, labs, rooms…"
              value={query}
              onChange={handleInput}
              onFocus={() => query && setShowDrop(results.length > 0)}
              autoComplete="off"
            />
            {query && (
              <button
                type="button"
                className="navbar__search-clear"
                onClick={() => { setQuery(''); setResults([]); setShowDrop(false); onSearchResult(null); }}
              >✕</button>
            )}
          </div>
          <button type="submit" className="navbar__search-btn">Search</button>
        </form>

        {showDrop && (
          <div className="navbar__dropdown" ref={dropRef}>
            {results.map(([name, data]) => (
              <button
                key={name}
                className="navbar__dropdown-item"
                onMouseDown={() => handleSelect(name)}
              >
                <span className={`navbar__dropdown-dot type-${(data.type || getNodeType(name))}`} />
                <div>
                  <div className="navbar__dropdown-name">{name}</div>
                  <div className="navbar__dropdown-type">{data.type || getNodeType(name)}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
