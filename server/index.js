// server/index.js
// Express API gateway for the Executive Dashboard.
//
// Why this exists:
//   Per the JD, our core stack is Node.js + Express. In production, this
//   server is the integration layer that sits between the React dashboard
//   and our actual data sources:
//
//     1. SAP B1 Service Layer  -> /api/brands/:id/metrics
//     2. Agradora_DW           -> /api/portfolio/metrics  (read-only service account)
//     3. Smartsheet API        -> /api/ops/blockers
//     4. Channel APIs (Amazon SP-API, TikTok Shop, Shopify) -> /api/channels/:id
//
// The current implementation returns mock data with the same shape the
// production endpoints would return. Swapping in real data sources means
// replacing the body of each handler, nothing more.
//
// Security: all integrations rely on read-only service accounts per the
// JD's data security guardrails. No employee PII is ever returned.

import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Tiny shim so we can reuse the mock data module on the server too.
// In production this file would `import { sapB1Client } from './integrations/sapb1.js'`
// and call client.getBrandMetrics(brandId).
import { getAllBrandData, getPortfolioData, getBrandData } from '../src/data/mockData.js';
import { BRANDS } from '../src/data/brands.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// --- Light request log ---
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// --- Health check ---
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    integrations: {
      sap_b1: 'connected',
      agradora_dw: 'connected',
      amazon_sp: 'connected',
      tiktok_shop: 'connected'
    },
    last_sync: new Date().toISOString()
  });
});

// --- Brand directory ---
app.get('/api/brands', (_req, res) => {
  res.json(Object.values(BRANDS));
});

// --- Per-brand metrics ---
app.get('/api/brands/:id/metrics', (req, res) => {
  const { id } = req.params;
  if (!BRANDS[id]) {
    return res.status(404).json({ error: `Unknown brand: ${id}` });
  }
  res.json(getBrandData(id));
});

// --- Consolidated portfolio metrics ---
// In production: backed by a 15-minute materialized view in Agradora_DW
// so the dashboard never hammers SAP B1 directly.
app.get('/api/portfolio/metrics', (_req, res) => {
  const all = getAllBrandData();
  res.json(getPortfolioData(all));
});

// --- Manual override hook ---
// Per the JD's "System Reliability" pillar — automations need documented
// manual-override procedures. This stub demonstrates the pattern.
app.post('/api/portfolio/refresh', (req, res) => {
  // In prod: invalidate the DW cache, log to audit table, alert ops if rate exceeded.
  res.json({
    triggered_by: req.body.user || 'unknown',
    triggered_at: new Date().toISOString(),
    status: 'refresh_queued'
  });
});

app.listen(PORT, () => {
  console.log(`\n  Luxury Brands Dashboard API`);
  console.log(`  Listening on http://localhost:${PORT}`);
  console.log(`  GET /api/health`);
  console.log(`  GET /api/brands`);
  console.log(`  GET /api/brands/:id/metrics`);
  console.log(`  GET /api/portfolio/metrics`);
  console.log(`  POST /api/portfolio/refresh\n`);
});
