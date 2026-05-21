// Express API gateway. Currently returns mock data with the same shape
// the production endpoints would return — swap the handler bodies for
// real SAP B1 / warehouse / channel API calls when those are wired up.

import express from 'express';
import { getAllBrandData, getPortfolioData, getBrandData } from '../src/data/mockData.js';
import { BRANDS } from '../src/data/brands.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

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

app.get('/api/brands', (_req, res) => {
  res.json(Object.values(BRANDS));
});

app.get('/api/brands/:id/metrics', (req, res) => {
  const { id } = req.params;
  if (!BRANDS[id]) {
    return res.status(404).json({ error: `Unknown brand: ${id}` });
  }
  res.json(getBrandData(id));
});

app.get('/api/portfolio/metrics', (_req, res) => {
  const all = getAllBrandData();
  res.json(getPortfolioData(all));
});

// Manual cache-invalidation hook. In prod: log to audit table, alert ops.
app.post('/api/portfolio/refresh', (req, res) => {
  res.json({
    triggered_by: req.body.user || 'unknown',
    triggered_at: new Date().toISOString(),
    status: 'refresh_queued'
  });
});

app.listen(PORT, () => {
  console.log(`\n  Dashboard API listening on http://localhost:${PORT}\n`);
});
