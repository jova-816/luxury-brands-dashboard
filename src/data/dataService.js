// dataService.js
// Abstraction layer between the UI and the data sources.
// Today: returns mock data synchronously wrapped in Promises.
// Tomorrow: swap each method for a fetch() to the Express backend,
// which would in turn call SAP B1 Service Layer / Agradora_DW / Amazon SP-API.
//
// The UI never changes — only this file does.

import { getAllBrandData, getPortfolioData, getBrandData } from './mockData.js';
import { BRANDS } from './brands.js';

// Simulate network latency so the UI loading states get exercised.
const simulateLatency = (ms = 180) =>
  new Promise((resolve) => setTimeout(resolve, ms + Math.random() * 120));

class DataService {
  constructor() {
    this._cache = null;
  }

  // GET /api/brands
  async listBrands() {
    await simulateLatency(60);
    return Object.values(BRANDS);
  }

  // GET /api/brands/:id/metrics
  async getBrandMetrics(brandId) {
    await simulateLatency();
    if (brandId === 'portfolio') {
      const all = getAllBrandData();
      return getPortfolioData(all);
    }
    return getBrandData(brandId);
  }

  // GET /api/portfolio/metrics
  async getPortfolioMetrics() {
    await simulateLatency(220);
    if (!this._cache) this._cache = getAllBrandData();
    return getPortfolioData(this._cache);
  }

  // Bulk fetch — used on initial dashboard mount so brand switching is instant.
  // In production this would be a single denormalized endpoint backed by a
  // materialized view in Agradora_DW that refreshes every 15 minutes.
  async preloadAll() {
    await simulateLatency(300);
    const allBrands = getAllBrandData();
    this._cache = allBrands;
    return {
      brands: allBrands,
      portfolio: getPortfolioData(allBrands)
    };
  }
}

export const dataService = new DataService();
