import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { baseChartOptions, currencyTick } from './chartSetup.js';
import { BRANDS } from '../data/brands.js';

export default function BrandStackedChart({ perBrandSeries }) {
  const data = useMemo(() => {
    const months = perBrandSeries.fhi_heat.timeSeries.map((t) => t.month);
    const brandIds = Object.keys(perBrandSeries);

    return {
      labels: months,
      datasets: brandIds.map((bid) => ({
        label: BRANDS[bid].name,
        data: perBrandSeries[bid].timeSeries.map((t) => t.revenue),
        backgroundColor: BRANDS[bid].accent + 'CC',
        borderColor: BRANDS[bid].accent,
        borderWidth: 1,
        fill: true,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 4
      }))
    };
  }, [perBrandSeries]);

  const options = useMemo(() => {
    const o = baseChartOptions('#1a1a1a');
    o.scales.y.stacked = true;
    o.scales.y.ticks.callback = currencyTick;
    o.plugins.legend = {
      display: true,
      position: 'bottom',
      labels: {
        boxWidth: 8,
        boxHeight: 8,
        padding: 14,
        usePointStyle: true,
        pointStyle: 'circle',
        font: { size: 11 }
      }
    };
    o.plugins.tooltip.callbacks = {
      label: (ctx) => ` ${ctx.dataset.label}: $${ctx.parsed.y.toLocaleString('en-US')}`
    };
    return o;
  }, []);

  return <Line data={data} options={options} />;
}
