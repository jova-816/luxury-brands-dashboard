import React, { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { BRANDS } from '../data/brands.js';

export default function BrandContributionChart({ contribution }) {
  const total = contribution.reduce((s, b) => s + b.revenue, 0);

  const data = useMemo(() => ({
    labels: contribution.map((b) => BRANDS[b.brandId].name),
    datasets: [
      {
        data: contribution.map((b) => b.revenue),
        backgroundColor: contribution.map((b) => BRANDS[b.brandId].accent),
        borderColor: '#fff',
        borderWidth: 2,
        hoverOffset: 8
      }
    ]
  }), [contribution]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
      legend: {
        display: true,
        position: 'right',
        align: 'center',
        labels: {
          boxWidth: 8,
          boxHeight: 8,
          padding: 12,
          usePointStyle: true,
          pointStyle: 'circle',
          font: { size: 11, family: "'Geist', sans-serif" },
          color: '#404040',
          generateLabels: (chart) => {
            const ds = chart.data.datasets[0];
            return chart.data.labels.map((label, i) => {
              const value = ds.data[i];
              const pct = ((value / total) * 100).toFixed(1);
              return {
                text: `${label}  ${pct}%`,
                fillStyle: ds.backgroundColor[i],
                strokeStyle: ds.backgroundColor[i],
                lineWidth: 0,
                index: i
              };
            });
          }
        }
      },
      tooltip: {
        backgroundColor: '#1a1a1a',
        padding: 12,
        cornerRadius: 4,
        bodyFont: { family: "'JetBrains Mono', monospace", size: 11 },
        callbacks: {
          label: (ctx) => ` $${ctx.parsed.toLocaleString('en-US')} · ${((ctx.parsed / total) * 100).toFixed(1)}%`
        }
      }
    }
  };

  return <Doughnut data={data} options={options} />;
}
