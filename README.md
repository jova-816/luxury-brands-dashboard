# Luxury Brands — Executive Dashboard

A prototype I built in response to the AI \& Automation Intern role at Luxury Brands LLC. It's a single-page React dashboard that aggregates revenue, units, margin, inventory, and top-SKU data across all five portfolio brands (FHI Heat, PRAI, Youngblood, UNbrush, NipNu), with a sidebar that lets you switch between a consolidated portfolio view and any individual brand.

**Live demo:** *https://luxury-brands-dashboard.vercel.app/*

> Built with Claude as a pair-programming partner. I directed the architecture, made the design and brand decisions, debugged the deploys, and decided what stayed in and what got cut. The data is synthetic — I obviously don't have access to Luxury Brands' real numbers — but the integration layer is structured so the mock can be swapped for real SAP B1 / warehouse / channel API calls without touching the UI.

\---

## Stack

The exact stack from the JD:

* **React 18** + **Vite** — the UI
* **Chart.js** (via `react-chartjs-2`) — line, bar, and doughnut charts
* **Node.js** + **Express** — the API gateway (`server/index.js`)
* Plain CSS with custom properties for theming (no Tailwind, no UI kit)

\---

## What it does

Open the page and you land on the consolidated portfolio view: four KPI cards across the top (revenue, units sold, AOV, gross margin) with month-over-month deltas, a 12-month revenue line, a doughnut showing each brand's contribution to revenue, a stacked area chart, and a top-SKU leaderboard aggregated across the portfolio. Scroll down for inventory health.

Click any brand in the sidebar and the whole dashboard re-themes to that brand's accent color, the doughnut swaps out for that brand's channel mix, the SKU list filters to that brand's products, and the KPI numbers update. No page reload — everything's in memory after the initial load.

\---

## Architecture

```
React components  ──>  dataService.js  ──>  Express API  ──>  SAP B1
                                                          ──>  Agradora\_DW
                                                          ──>  Channel APIs
```

The point of the `dataService.js` layer is that it's the only file that knows where data comes from. Today its methods return mock data wrapped in promises. In production, each method would become a `fetch('/api/...')` call against the Express backend, which would in turn hit SAP B1's Service Layer for invoiced revenue, Agradora\_DW for warehoused/aggregated metrics, and the relevant channel APIs (Amazon SP-API, TikTok Shop, Shopify) for marketplace data.

Nothing in the React components knows about any of that. They get clean numbers and render. That separation is what would make it cheap to actually use this with real data.

\---

## Running it

```bash
npm install
npm run dev        # http://localhost:5173
npm run server     # http://localhost:3001 (optional, demonstrates the API gateway)
```

The dashboard runs standalone — the Express server is included to show the integration architecture but isn't required for the demo.

\---

## File layout

```
src/
├── App.jsx                    State + theming + layout
├── components/
│   ├── Sidebar.jsx            Brand selector
│   ├── KpiCard.jsx            Big number + MoM delta
│   ├── RevenueTrendChart.jsx  Filled-area line
│   ├── BrandStackedChart.jsx  Stacked area (portfolio view only)
│   ├── BrandContributionChart.jsx  Doughnut (portfolio view only)
│   ├── UnitsBarChart.jsx
│   ├── ChannelMix.jsx
│   ├── TopSkus.jsx
│   └── chartSetup.js          Chart.js registration + shared options
├── data/
│   ├── brands.js              Brand metadata + logo loader
│   ├── mockData.js            Seeded data generator
│   └── dataService.js         The integration layer
├── assets/logos/              Brand logos (auto-detected at build time)
└── styles/global.css
server/
└── index.js                   Express API gateway
```

\---

## Notes on the data

Twelve months of revenue, units, margin, inventory, and top-SKU data are produced by a deterministic seeded PRNG so the demo numbers stay stable across reloads. The per-brand profiles are tuned to tell a realistic portfolio story — FHI Heat as the mature flagship, UNbrush as the TikTok-driven breakout, NipNu as the new growth bet — so the consolidated view actually shows the kind of brand-mix variance an executive dashboard needs to surface. Seasonality (Nov/Dec gifting, Feb dip, Mother's Day) is baked in.

Plug real numbers into `dataService.js` and the same charts tell whatever the actual story is.

\---

## What I'd add next

* WebSocket push so the KPIs update without a manual refresh
* Drill-down: clicking a chart point opens a SKU/channel breakdown
* Date range picker (7d / 30d / 90d / YTD / custom)
* An `/api/anomalies` endpoint that flags MoM movements outside ±2σ
* SSO + role-based access (brand managers see their brand, execs see everything)

