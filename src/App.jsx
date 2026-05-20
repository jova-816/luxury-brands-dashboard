import React, { useEffect, useMemo, useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import KpiCard from './components/KpiCard.jsx';
import RevenueTrendChart from './components/RevenueTrendChart.jsx';
import BrandStackedChart from './components/BrandStackedChart.jsx';
import BrandContributionChart from './components/BrandContributionChart.jsx';
import UnitsBarChart from './components/UnitsBarChart.jsx';
import ChannelMix from './components/ChannelMix.jsx';
import TopSkus from './components/TopSkus.jsx';

import { BRANDS, PORTFOLIO } from './data/brands.js';
import { dataService } from './data/dataService.js';

function formatLastSynced(d) {
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  });
}

export default function App() {
  const [active, setActive] = useState('portfolio');
  const [bundle, setBundle] = useState(null);
  const [lastSynced, setLastSynced] = useState('—');

  // Bulk-load everything on mount so brand switching is instant.
  useEffect(() => {
    let mounted = true;
    dataService.preloadAll().then((res) => {
      if (!mounted) return;
      setBundle(res);
      setLastSynced(formatLastSynced(new Date()));
    });
    return () => { mounted = false; };
  }, []);

  // Set CSS custom properties on root when brand changes — drives all theming.
  useEffect(() => {
    const meta = active === 'portfolio'
      ? { accent: PORTFOLIO.accent, accentSoft: '#ecebe6' }
      : { accent: BRANDS[active].accent, accentSoft: BRANDS[active].accentSoft };
    document.documentElement.style.setProperty('--accent', meta.accent);
    document.documentElement.style.setProperty('--accent-soft', meta.accentSoft);
  }, [active]);

  const view = useMemo(() => {
    if (!bundle) return null;
    return active === 'portfolio' ? bundle.portfolio : bundle.brands[active];
  }, [active, bundle]);

  if (!bundle || !view) {
    return <div className="loading">Loading portfolio data</div>;
  }

  const isPortfolio = active === 'portfolio';
  const meta = isPortfolio ? PORTFOLIO : BRANDS[active];
  const ts = view.timeSeries;
  const current = ts[ts.length - 1];
  const prior = ts[ts.length - 2];

  const revDelta = (current.revenue - prior.revenue) / prior.revenue;
  const unitsDelta = (current.units - prior.units) / prior.units;
  const aov = current.revenue / current.units;
  const priorAov = prior.revenue / prior.units;
  const aovDelta = (aov - priorAov) / priorAov;
  const gmDelta = current.grossMargin && prior.grossMargin
    ? (current.grossMargin - prior.grossMargin) / prior.grossMargin
    : null;

  return (
    <div className="app">
      <Sidebar
        activeBrand={active}
        onSelect={setActive}
        lastSynced={lastSynced}
      />

      <main className="main">
        <header className="main__header">
          <div>
            <div className="main__title-eyebrow">
              <span className="accent-dot" />
              {isPortfolio ? 'Multi-Entity · Consolidated' : meta.category}
            </div>
            {!isPortfolio && meta.logo && (
              <div className="main__brand-logo-wrap">
                <img src={meta.logo} alt={meta.name} className="main__brand-logo" />
              </div>
            )}
            <h1 className="main__title">
              {isPortfolio ? (
                <>The <em>Portfolio</em></>
              ) : (
                <>{meta.name.split(' ')[0]} <em>{meta.name.split(' ').slice(1).join(' ') || ''}</em></>
              )}
            </h1>
            <p className="main__subtitle">
              {isPortfolio
                ? 'Real-time consolidated view across all five brands. Data aggregated from SAP B1, Agradora_DW, and channel-specific APIs.'
                : meta.description}
            </p>
          </div>

          <div className="main__meta">
            <div>FY26 · trailing 12 months</div>
            <div><strong>{current.month}</strong> · current period</div>
            {!isPortfolio && (
              <div>{meta.channels?.length} active channels</div>
            )}
          </div>
        </header>

        {/* KPI cards — re-mount on brand change to retrigger stagger animation */}
        <div className="kpi-grid fade-enter" key={`kpi-${active}`}>
          <KpiCard
            label="Revenue"
            value={current.revenue}
            format="currency"
            prefix="$"
            delta={revDelta}
          />
          <KpiCard
            label="Units Sold"
            value={current.units}
            format="integer"
            delta={unitsDelta}
          />
          <KpiCard
            label="Avg Order Value"
            value={aov.toFixed(2)}
            prefix="$"
            delta={aovDelta}
          />
          <KpiCard
            label="Gross Margin"
            value={current.grossMargin}
            format="percent"
            suffix="%"
            delta={gmDelta}
          />
        </div>

        {/* Charts — re-mount on brand change for crisp transitions */}
        <div className="chart-grid" key={`charts-1-${active}`}>
          <div className="chart-card">
            <div className="chart-card__header">
              <div>
                <div className="chart-card__title">Revenue · Trailing 12 Months</div>
                <div className="chart-card__subtitle">
                  Monthly recognized revenue · source: SAP B1 fct_invoice
                </div>
              </div>
              <div className="chart-card__tag">USD</div>
            </div>
            <div className="chart-card__body">
              <RevenueTrendChart timeSeries={ts} accent={meta.accent} />
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-card__header">
              <div>
                <div className="chart-card__title">
                  {isPortfolio ? 'Brand Contribution' : 'Channel Mix'}
                </div>
                <div className="chart-card__subtitle">
                  {isPortfolio
                    ? `Share of revenue · ${current.month}`
                    : 'Revenue share by sales channel'}
                </div>
              </div>
              <div className="chart-card__tag">% SHARE</div>
            </div>
            <div className="chart-card__body">
              {isPortfolio
                ? <BrandContributionChart contribution={view.brandContribution} />
                : <ChannelMix channelMix={view.channelMix} accent={meta.accent} />
              }
            </div>
          </div>
        </div>

        <div className="chart-grid chart-grid--equal" key={`charts-2-${active}`}>
          <div className="chart-card">
            <div className="chart-card__header">
              <div>
                <div className="chart-card__title">
                  {isPortfolio ? 'Revenue by Brand · Stacked' : 'Units Sold · Monthly'}
                </div>
                <div className="chart-card__subtitle">
                  {isPortfolio
                    ? 'Stacked contribution over time'
                    : 'Volume trend · source: SAP B1 inv_lines'}
                </div>
              </div>
              <div className="chart-card__tag">{isPortfolio ? 'USD' : 'COUNT'}</div>
            </div>
            <div className="chart-card__body chart-card__body--tall">
              {isPortfolio
                ? <BrandStackedChart perBrandSeries={view.perBrandSeries} />
                : <UnitsBarChart timeSeries={ts} accent={meta.accent} />
              }
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-card__header">
              <div>
                <div className="chart-card__title">
                  {isPortfolio ? 'Top SKUs · All Brands' : 'Top SKUs · Trailing 12mo'}
                </div>
                <div className="chart-card__subtitle">
                  {isPortfolio
                    ? 'Aggregated unit leaders across portfolio'
                    : 'Best sellers by unit volume'}
                </div>
              </div>
              <div className="chart-card__tag">UNITS</div>
            </div>
            <div className="chart-card__body chart-card__body--tall" style={{ overflowY: 'auto' }}>
              <TopSkus
                skus={
                  isPortfolio
                    ? Object.values(view.perBrandSeries)
                        .flatMap((b) =>
                          b.topSkus.map((s) => ({ ...s, brand: b.brandId }))
                        )
                        .sort((a, b) => b.units - a.units)
                        .slice(0, 8)
                    : view.topSkus
                }
                accent={meta.accent}
              />
            </div>
          </div>
        </div>

        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 22,
          fontWeight: 500,
          marginTop: 40,
          marginBottom: 18,
          letterSpacing: '-0.015em'
        }}>
          Inventory <em style={{ color: meta.accent, fontWeight: 400 }}>Health</em>
        </h2>

        <div className="inv-row fade-enter" key={`inv-${active}`}>
          <div className="inv-pill">
            <div className="inv-pill__label">Total SKUs</div>
            <div className="inv-pill__value">{view.inventory.skuCount.toLocaleString('en-US')}</div>
            <div className="inv-pill__hint">active in catalog</div>
          </div>
          <div className="inv-pill inv-pill--positive">
            <div className="inv-pill__label">In Stock</div>
            <div className="inv-pill__value">{view.inventory.inStock.toLocaleString('en-US')}</div>
            <div className="inv-pill__hint">
              {((view.inventory.inStock / view.inventory.skuCount) * 100).toFixed(0)}% of SKUs
            </div>
          </div>
          <div className="inv-pill inv-pill--warning">
            <div className="inv-pill__label">Low Stock</div>
            <div className="inv-pill__value">{view.inventory.lowStock.toLocaleString('en-US')}</div>
            <div className="inv-pill__hint">reorder threshold tripped</div>
          </div>
          <div className="inv-pill inv-pill--danger">
            <div className="inv-pill__label">Out of Stock</div>
            <div className="inv-pill__value">{view.inventory.outOfStock.toLocaleString('en-US')}</div>
            <div className="inv-pill__hint">requires action</div>
          </div>
        </div>

        <div className="inv-row" key={`inv2-${active}`}>
          <div className="inv-pill" style={{ gridColumn: 'span 2' }}>
            <div className="inv-pill__label">Inventory Value</div>
            <div className="inv-pill__value">
              ${(view.inventory.inventoryValue / 1_000_000).toFixed(2)}M
            </div>
            <div className="inv-pill__hint">
              at landed cost · source: SAP B1 OINM
            </div>
          </div>
          <div className="inv-pill" style={{ gridColumn: 'span 2' }}>
            <div className="inv-pill__label">Days on Hand</div>
            <div className="inv-pill__value">{view.inventory.daysOnHand}</div>
            <div className="inv-pill__hint">
              avg sell-through window · target 60d
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
