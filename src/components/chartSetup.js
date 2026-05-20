// chartSetup.js
// Register Chart.js elements once and export a brand-aware options factory.

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Filler, Tooltip, Legend
);

// Default Chart.js typography to match dashboard
ChartJS.defaults.font.family = "'Geist', system-ui, sans-serif";
ChartJS.defaults.font.size = 11;
ChartJS.defaults.color = '#6b6b6b';

export const baseChartOptions = (accent) => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#1a1a1a',
      titleColor: '#fff',
      titleFont: { family: "'Geist', sans-serif", size: 11, weight: '500' },
      bodyColor: '#fff',
      bodyFont: { family: "'JetBrains Mono', monospace", size: 11 },
      padding: 12,
      cornerRadius: 4,
      displayColors: true,
      boxPadding: 4,
      borderColor: accent,
      borderWidth: 1
    }
  },
  scales: {
    x: {
      grid: { display: false, drawBorder: false },
      ticks: { color: '#8a8a8a', font: { size: 10 } },
      border: { color: '#e0ddd6' }
    },
    y: {
      grid: { color: '#ecebe6', drawBorder: false },
      ticks: { color: '#8a8a8a', font: { family: "'JetBrains Mono', monospace", size: 10 } },
      border: { display: false }
    }
  }
});

export const currencyTick = (v) => {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v}`;
};

export const compactTick = (v) => {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`;
  return v;
};
