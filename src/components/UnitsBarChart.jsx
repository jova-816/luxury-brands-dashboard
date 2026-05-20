import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { baseChartOptions, compactTick } from './chartSetup.js';

export default function UnitsBarChart({ timeSeries, accent }) {
  const data = useMemo(() => ({
    labels: timeSeries.map((t) => t.month),
    datasets: [
      {
        label: 'Units',
        data: timeSeries.map((t) => t.units),
        backgroundColor: accent + 'CC',
        hoverBackgroundColor: accent,
        borderRadius: 3,
        borderSkipped: false,
        barPercentage: 0.6,
        categoryPercentage: 0.8
      }
    ]
  }), [timeSeries, accent]);

  const options = useMemo(() => {
    const o = baseChartOptions(accent);
    o.scales.y.ticks.callback = compactTick;
    o.plugins.tooltip.callbacks = {
      label: (ctx) => ` Units: ${ctx.parsed.y.toLocaleString('en-US')}`
    };
    return o;
  }, [accent]);

  return <Bar data={data} options={options} />;
}
