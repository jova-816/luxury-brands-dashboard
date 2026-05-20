import React from 'react';
import { BRANDS, PORTFOLIO } from '../data/brands.js';

export default function Sidebar({ activeBrand, onSelect, lastSynced }) {
  const isActive = (id) => activeBrand === id;

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__brand-mark">
          Luxury <em>Brands</em>
        </div>
        <div className="sidebar__brand-sub">Executive Dashboard</div>
      </div>

      <div>
        <div className="sidebar__section-label">Portfolio</div>
        <nav className="brand-nav">
          <button
            className={`brand-nav__item ${isActive('portfolio') ? 'brand-nav__item--active' : ''}`}
            onClick={() => onSelect('portfolio')}
            style={{ '--swatch-color': PORTFOLIO.accent }}
          >
            <span className="brand-nav__swatch" />
            <span className="brand-nav__name">Consolidated View</span>
            <span className="brand-nav__meta">5</span>
          </button>
        </nav>
      </div>

      <div>
        <div className="sidebar__section-label">Brands</div>
        <nav className="brand-nav">
          {Object.values(BRANDS).map((b) => (
            <button
              key={b.id}
              className={`brand-nav__item ${isActive(b.id) ? 'brand-nav__item--active' : ''}`}
              onClick={() => onSelect(b.id)}
              style={{ '--swatch-color': b.accent }}
              title={b.name}
            >
              <span className="brand-nav__swatch" />
              {b.logo ? (
                <span className="brand-nav__logo-wrap">
                  <img
                    src={b.logo}
                    alt={b.name}
                    className="brand-nav__logo"
                  />
                </span>
              ) : (
                <span className="brand-nav__name">{b.name}</span>
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="sidebar__footer">
        <div className="sidebar__status">
          <span className="status-dot" />
          <span>Live · all sources OK</span>
        </div>
        <div>SAP B1 · v10.0</div>
        <div>Agradora_DW · synced</div>
        <div>Last refresh: {lastSynced}</div>
      </div>
    </aside>
  );
}
