// mockData.js
//
// ⚠️  All figures in this file are SYNTHETIC.
//     I have no access to Luxury Brands LLC's real financials.
//     A seeded PRNG (Mulberry32) generates 12 months of revenue, units,
//     margin, inventory, and SKU data so the demo is stable across reloads.
//     Brand profiles are tuned to look realistic (FHI mature, UNbrush breakout,
//     NipNu new) but the numbers themselves are invented.
//
// Generates 12 months of realistic financial + operational data per brand.
// Shape mirrors what we'd receive from:
//   - SAP B1 Service Layer  (revenue, units, AR)
//   - Agradora_DW.fct_daily_sales  (channel mix, COGS, margin)
//   - Channel APIs (Amazon SP-API, TikTok Shop, Shopify) for traffic & conversion
//
// Deterministic seeded RNG so the demo is stable across reloads.

import { BRANDS } from './brands.js';

// Mulberry32 — small deterministic PRNG. Same seed -> same numbers every render.
function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const MONTHS = [
  'Jun 25', 'Jul 25', 'Aug 25', 'Sep 25', 'Oct 25', 'Nov 25',
  'Dec 25', 'Jan 26', 'Feb 26', 'Mar 26', 'Apr 26', 'May 26'
];

// Per-brand baseline revenue, growth rate, and channel mix.
// These are tuned so the consolidated view shows the kind of variance
// a real mid-market portfolio would: one mature brand declining slightly,
// one breakout (UNbrush) growing fast, a couple stable, and one new.
const PROFILES = {
  fhi_heat:   { base: 2_850_000, growth: 0.018, volatility: 0.08, seed: 11, units: 18500, aov: 154 },
  prai:       { base: 1_420_000, growth: 0.004, volatility: 0.06, seed: 22, units: 24800, aov: 57  },
  youngblood: { base: 1_180_000, growth: -0.012, volatility: 0.05, seed: 33, units: 31200, aov: 38 },
  unbrush:    { base: 2_120_000, growth: 0.062, volatility: 0.14, seed: 44, units: 95400, aov: 22 },
  nipnu:      { base: 285_000,   growth: 0.085, volatility: 0.22, seed: 55, units: 12800, aov: 22 }
};

const CHANNEL_MIX = {
  fhi_heat:   { DTC: 0.34, Amazon: 0.28, Wholesale: 0.31, Sephora: 0.07 },
  prai:       { DTC: 0.41, QVC: 0.28, Amazon: 0.19, Wholesale: 0.12 },
  youngblood: { DTC: 0.22, 'Pro Salons': 0.44, Amazon: 0.18, Wholesale: 0.16 },
  unbrush:    { DTC: 0.29, 'TikTok Shop': 0.31, Amazon: 0.27, Retail: 0.13 },
  nipnu:      { DTC: 0.58, 'TikTok Shop': 0.32, Amazon: 0.10 }
};

function generateTimeSeries(brandId) {
  const profile = PROFILES[brandId];
  const rand = mulberry32(profile.seed);
  const series = [];
  let running = profile.base * 0.85; // start a bit below "current" to show growth

  for (let i = 0; i < 12; i++) {
    const noise = (rand() - 0.5) * 2 * profile.volatility;
    const growth = 1 + profile.growth + noise;
    running *= growth;

    // Seasonality: Nov/Dec lift for hair/beauty gifting; Feb/Mar dip post-holiday
    const month = i;
    let seasonal = 1;
    if (month === 5 || month === 6) seasonal = 1.18;   // Nov/Dec
    if (month === 8) seasonal = 0.88;                   // Feb
    if (month === 11) seasonal = 1.05;                  // May (Mother's Day)

    const revenue = Math.round(running * seasonal);
    const units = Math.round(revenue / profile.aov);
    const margin = 0.42 + (rand() - 0.5) * 0.06;

    series.push({
      month: MONTHS[i],
      monthIndex: i,
      revenue,
      units,
      grossMargin: Number(margin.toFixed(3)),
      grossProfit: Math.round(revenue * margin)
    });
  }
  return series;
}

function generateInventory(brandId) {
  const rand = mulberry32(PROFILES[brandId].seed + 99);
  const skuCount = { fhi_heat: 84, prai: 22, youngblood: 156, unbrush: 38, nipnu: 11 }[brandId];
  return {
    skuCount,
    inStock: Math.round(skuCount * (0.78 + rand() * 0.12)),
    lowStock: Math.round(skuCount * (0.08 + rand() * 0.06)),
    outOfStock: Math.round(skuCount * (0.04 + rand() * 0.06)),
    inventoryValue: Math.round(PROFILES[brandId].base * (2.1 + rand() * 0.8)),
    daysOnHand: Math.round(45 + rand() * 35)
  };
}

function generateTopSkus(brandId) {
  const skuNames = {
    fhi_heat: [
      ['Platform Signature Pro Styler 1.5"', 24500],
      ['AeroMax Style Dryer',                 18900],
      ['SwiftStyler Retractable Speed Styler',14200],
      ['Platinum Tourmaline Pro 1"',          11800],
      ['Runway Volume Crimping Iron',          8400]
    ],
    prai: [
      ['Ageless Throat & Décolletage Crème', 32100],
      ['24K Gold Wrinkle Repair Crème',      19400],
      ['Throat Sculpt Lift & Tighten',       12800],
      ['Frangipani Monoi Body Butter',       11200],
      ['Ageless Eye Lift Crème',              9600]
    ],
    youngblood: [
      ['Mineral Radiance Crème Powder',  18200],
      ['Hydrating Liquid Foundation',    14900],
      ['Pressed Mineral Blush',          11400],
      ['Outrageous Lash Mascara',         9100],
      ['Mineral Primer',                  7800]
    ],
    unbrush: [
      ['Original UNbrush — Pink',        42100],
      ['Hello Kitty Collection 3-Pack',  31800],
      ['UNbrush Plus — Lavender',        28400],
      ['Mini UNbrush Set (3pc)',         21200],
      ['UNbrush Wet — Mint',             17600]
    ],
    nipnu: [
      ['Daily Comfort Balm',     8200],
      ['Soothe & Smooth Roller', 4100],
      ['Travel Trio',            2800],
      ['Refresh Spray',          1900],
      ['Starter Set',            1100]
    ]
  };
  return skuNames[brandId].map(([name, units]) => ({ name, units }));
}

// ---------- Public API (what the dashboard consumes) ----------

export function getBrandData(brandId) {
  return {
    brandId,
    timeSeries: generateTimeSeries(brandId),
    inventory: generateInventory(brandId),
    channelMix: CHANNEL_MIX[brandId],
    topSkus: generateTopSkus(brandId)
  };
}

export function getAllBrandData() {
  const out = {};
  for (const id of Object.keys(BRANDS)) out[id] = getBrandData(id);
  return out;
}

// Portfolio aggregation — this is the part that mirrors the JD's
// "unified, multi-entity executive dashboard that aggregates data from SAP B1,
// data warehouses, and retail/channel-specific APIs."
export function getPortfolioData(allData) {
  const months = MONTHS.map((m, i) => {
    let revenue = 0, units = 0, grossProfit = 0;
    for (const bid of Object.keys(allData)) {
      revenue += allData[bid].timeSeries[i].revenue;
      units += allData[bid].timeSeries[i].units;
      grossProfit += allData[bid].timeSeries[i].grossProfit;
    }
    return {
      month: m,
      monthIndex: i,
      revenue,
      units,
      grossProfit,
      grossMargin: grossProfit / revenue
    };
  });

  const inventory = Object.values(allData).reduce(
    (acc, b) => ({
      skuCount: acc.skuCount + b.inventory.skuCount,
      inStock: acc.inStock + b.inventory.inStock,
      lowStock: acc.lowStock + b.inventory.lowStock,
      outOfStock: acc.outOfStock + b.inventory.outOfStock,
      inventoryValue: acc.inventoryValue + b.inventory.inventoryValue,
      daysOnHand: Math.round(
        (acc.daysOnHand + b.inventory.daysOnHand * b.inventory.skuCount) /
          (acc.skuCount + b.inventory.skuCount || 1)
      )
    }),
    { skuCount: 0, inStock: 0, lowStock: 0, outOfStock: 0, inventoryValue: 0, daysOnHand: 0 }
  );

  // Brand contribution to current month's revenue (for stacked & pie views)
  const latestIdx = 11;
  const brandContribution = Object.keys(allData).map((bid) => ({
    brandId: bid,
    revenue: allData[bid].timeSeries[latestIdx].revenue,
    units: allData[bid].timeSeries[latestIdx].units
  }));

  return {
    brandId: 'portfolio',
    timeSeries: months,
    inventory,
    brandContribution,
    perBrandSeries: allData // keep for stacked chart
  };
}
