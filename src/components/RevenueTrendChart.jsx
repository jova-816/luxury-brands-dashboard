import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { baseChartOptions, currencyTick } from './chartSetup.js';

export default function RevenueTrendChart({ timeSeries, accent }) {
  const data = useMemo(() => ({
    labels: timeSeries.map((t) => t.month),
    datasets: [
      {
        label: 'Revenue',
        data: timeSeries.map((t) => t.revenue),
        borderColor: accent,
        backgroundColor: (ctx) => {
          const { ctx: c, chartArea } = ctx.chart;
          if (!chartArea) return accent + '20';
          const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          g.addColorStop(0, accent + '40');
          g.addColorStop(1, accent + '02');
          return g;
        },
        borderWidth: 2,
        fill: true,
        tension: 0.35,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: accent,
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2
      }
    ]
  }), [timeSeries, accent]);

  const options = useMemo(() => {
    const o = baseChartOptions(accent);
    o.scales.y.ticks.callback = currencyTick;
    o.plugins.tooltip.callbacks = {
      label: (ctx) => ` Revenue: $${ctx.parsed.y.toLocaleString('en-US')}`
    };
    return o;
  }, [accent]);

  return <Line data={data} options={options} />;
}
