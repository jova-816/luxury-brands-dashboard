// Wraps mock data behind an async API so the UI can be swapped to real
// fetch() calls without changes elsewhere.

import { getAllBrandData, getPortfolioData, getBrandData } from './mockData.js';
import { BRANDS } from './brands.js';

const simulateLatency = (ms = 180) =>
  new Promise((resolve) => setTimeout(resolve, ms + Math.random() * 120));

class DataService {
  constructor() {
    this._cache = null;
  }

  async listBrands() {
    await simulateLatency(60);
    return Object.values(BRANDS);
  }

  async getBrandMetrics(brandId) {
    await simulateLatency();
    if (brandId === 'portfolio') {
      const all = getAllBrandData();
      return getPortfolioData(all);
    }
    return getBrandData(brandId);
  }

  async getPortfolioMetrics() {
    await simulateLatency(220);
    if (!this._cache) this._cache = getAllBrandData();
    return getPortfolioData(this._cache);
  }

  // Bulk preload so brand switching feels instant after first paint.
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
