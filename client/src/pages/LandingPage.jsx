import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import geuImage from '../assets/geu.jpg';
import './LandingPage.css';

const ROTATING_WORDS = ['Explore', 'Navigate', 'Discover'];

export default function LandingPage() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const [wordIdx, setWordIdx] = useState(0);
  const [wordVisible, setWordVisible] = useState(true);
  const [scrollY, setScrollY] = useState(0);

  // Parallax scroll handler
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Rotating words animation
  useEffect(() => {
    const interval = setInterval(() => {
      setWordVisible(false);
      setTimeout(() => {
        setWordIdx((i) => (i + 1) % ROTATING_WORDS.length);
        setWordVisible(true);
      }, 400);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Intersection Observer for scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing">
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="hero" ref={heroRef}>
        <div
          className="hero__bg"
          style={{
            backgroundImage: `url(${geuImage})`,
            transform: `translateY(${scrollY * 0.35}px) scale(1.12)`,
          }}
        />
        <div className="hero__overlay" />

        <div className="hero__content">
          <div className="hero__badge">Graphic Era University</div>

          <h1 className="hero__title">
            First<span className="hero__title--accent">Glance</span>
          </h1>

          <p className="hero__subtitle">
            Campus Navigation System
          </p>

          <p className="hero__tagline">
            <span
              className={`hero__word ${wordVisible ? 'hero__word--in' : 'hero__word--out'}`}
            >
              {ROTATING_WORDS[wordIdx]}
            </span>
            {' '}your campus like never before
          </p>

          <button
            className="hero__cta"
            onClick={() => navigate('/map')}
          >
            <span>Get Started</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>

          <div className="hero__scroll-hint">
            <div className="hero__scroll-line" />
            <span>Scroll to explore</span>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ──────────────────────────────────── */}
      <section className="stats-strip reveal">
        <div className="stats-strip__item">
          <span className="stats-strip__number">30+</span>
          <span className="stats-strip__label">Buildings Mapped</span>
        </div>
        <div className="stats-strip__divider" />
        <div className="stats-strip__item">
          <span className="stats-strip__number">48</span>
          <span className="stats-strip__label">Navigation Nodes</span>
        </div>
        <div className="stats-strip__divider" />
        <div className="stats-strip__item">
          <span className="stats-strip__number">Real‑time</span>
          <span className="stats-strip__label">Live Location</span>
        </div>
        <div className="stats-strip__divider" />
        <div className="stats-strip__item">
          <span className="stats-strip__number">Dijkstra</span>
          <span className="stats-strip__label">Shortest Path Engine</span>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────── */}
      <section className="features">
        <div className="features__grid">

          <div className="feature-card reveal">
            <div className="feature-card__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            <h3>Instant Search</h3>
            <p>Find any building, lab, canteen, or hostel in milliseconds. Supports partial names and room numbers like CR101.</p>
          </div>

          <div className="feature-card reveal" style={{ transitionDelay: '0.1s' }}>
            <div className="feature-card__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                <circle cx="12" cy="9" r="2.5"/>
              </svg>
            </div>
            <h3>Multi‑Location Support</h3>
            <p>Select an origin and destination — the system draws the optimal walking route instantly across the entire campus.</p>
          </div>

          <div className="feature-card reveal" style={{ transitionDelay: '0.2s' }}>
            <div className="feature-card__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
              </svg>
            </div>
            <h3>Live GPS Tracking</h3>
            <p>Your real‑time position is shown as a pulsing marker — stay oriented as you walk through campus.</p>
          </div>

          <div className="feature-card reveal" style={{ transitionDelay: '0.3s' }}>
            <div className="feature-card__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
            </div>
            <h3>Smart Path Engine</h3>
            <p>Dijkstra's algorithm computes the shortest route client-side in under 1ms across 70+ nodes and 80+ edges.</p>
          </div>

          <div className="feature-card reveal" style={{ transitionDelay: '0.4s' }}>
            <div className="feature-card__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <h3>Walking Time ETA</h3>
            <p>Every route shows estimated walking time at 1.11 m/s — so you're never late to a class again.</p>
          </div>

          <div className="feature-card reveal" style={{ transitionDelay: '0.5s' }}>
            <div className="feature-card__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
              </svg>
            </div>
            <h3>Fully Responsive</h3>
            <p>Designed mobile-first. Navigate campus from your phone without any pinching or zooming frustration.</p>
          </div>

        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────── */}
      <section className="how-it-works">
        <div className="section-header reveal">
          <span className="section-header__label">How it works</span>
          <h2>Three taps to your destination</h2>
        </div>

        <div className="steps reveal">
          <div className="step">
            <div className="step__number">01</div>
            <h4>Open the Map</h4>
            <p>Click "Get Started" to launch the interactive campus map centered on GEU.</p>
          </div>
          <div className="step__arrow">→</div>
          <div className="step">
            <div className="step__number">02</div>
            <h4>Pick Two Points</h4>
            <p>Tap any building for your origin (green), then tap another for your destination (red).</p>
          </div>
          <div className="step__arrow">→</div>
          <div className="step">
            <div className="step__number">03</div>
            <h4>Follow the Path</h4>
            <p>The shortest route is drawn immediately with distance and walking time shown.</p>
          </div>
        </div>
      </section>

      {/* ── CTA FOOTER ───────────────────────────────────── */}
      <section className="landing-footer reveal">
        <div className="landing-footer__content">
          <h2>Ready to explore campus?</h2>
          <p>Join hundreds of students navigating GEU smarter every day.</p>
          <button className="hero__cta" onClick={() => navigate('/map')}>
            <span>Launch Navigator</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <div className="landing-footer__bg" style={{ backgroundImage: `url(${geuImage})` }} />
        <div className="landing-footer__overlay" />
      </section>

      <footer className="bottom-bar">
        <span>FirstGlance © 2025 — Graphic Era University Campus Navigation</span>
      </footer>
    </div>
  );
}
