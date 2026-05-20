// brands.js
// Single source of truth for portfolio brand metadata.
// In production, this would be hydrated from SAP B1's BusinessPartner master data
// or the Agradora_DW dim_brand table at boot.

// Vite + import.meta.glob gathers any logo files dropped into /assets/logos/
// at build time. Missing logos fall back to a name-only nav row.
const logoModules = import.meta.glob('../assets/logos/*.{png,svg,jpg,webp}', {
  eager: true,
  query: '?url',
  import: 'default'
});

const logo = (name) => {
  const match = Object.entries(logoModules).find(([path]) =>
    path.toLowerCase().includes(`/${name}.`)
  );
  return match ? match[1] : null;
};

export const BRANDS = {
  fhi_heat: {
    id: 'fhi_heat',
    name: 'FHI Heat',
    tagline: 'Professional Hair Tools',
    category: 'Hair Care Tools',
    accent: '#E63946',
    accentSoft: '#FFE4E6',
    foundedYear: 2003,
    channels: ['DTC', 'Amazon', 'Sephora', 'Wholesale'],
    description: 'Professional-grade flat irons, dryers, and styling tools.',
    logo: logo('fhi-heat')
  },
  prai: {
    id: 'prai',
    name: 'PRAI Beauty',
    tagline: 'Anti-Aging Skincare',
    category: 'Skincare',
    accent: '#D4A373',
    accentSoft: '#FAEDCD',
    foundedYear: 1999,
    channels: ['DTC', 'QVC', 'Amazon', 'Wholesale'],
    description: 'Targeted neck & décolletage anti-aging treatments.',
    logo: logo('prai')
  },
  youngblood: {
    id: 'youngblood',
    name: 'YB Skin / Youngblood',
    tagline: 'Mineral Cosmetics',
    category: 'Color Cosmetics',
    accent: '#6B4226',
    accentSoft: '#EDE0D4',
    foundedYear: 1996,
    channels: ['DTC', 'Pro Salons', 'Amazon', 'Wholesale'],
    description: 'Professional mineral cosmetics for sensitive skin.',
    logo: logo('youngblood')
  },
  unbrush: {
    id: 'unbrush',
    name: 'UNbrush',
    tagline: 'Detangling Hairbrushes',
    category: 'Hair Accessories',
    accent: '#9D4EDD',
    accentSoft: '#F3E8FF',
    foundedYear: 2018,
    channels: ['DTC', 'TikTok Shop', 'Amazon', 'Retail'],
    description: 'Patented detangling brushes designed for all hair types.',
    logo: logo('unbrush')
  },
  nipnu: {
    id: 'nipnu',
    name: 'NipNu',
    tagline: 'Intimate Wellness',
    category: 'Personal Care',
    accent: '#F4A6B8',
    accentSoft: '#FCE4EC',
    foundedYear: 2022,
    channels: ['DTC', 'TikTok Shop', 'Amazon'],
    description: 'Body-positive intimate care essentials.',
    logo: logo('nipnu')
  }
};

export const BRAND_IDS = Object.keys(BRANDS);
export const PORTFOLIO = { id: 'portfolio', name: 'Portfolio View', accent: '#1A1A1A' };
