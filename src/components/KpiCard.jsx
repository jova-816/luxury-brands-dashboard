import React from 'react';

function formatValue(value, format) {
  if (value == null) return '—';
  switch (format) {
    case 'currency':
      if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
      if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
      return value.toLocaleString('en-US');
    case 'integer':
      if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
      if (value >= 10_000) return `${(value / 1_000).toFixed(1)}K`;
      return value.toLocaleString('en-US');
    case 'percent':
      return (value * 100).toFixed(1);
    default:
      return value;
  }
}

export default function KpiCard({ label, value, format, prefix, suffix, delta, deltaLabel = 'vs prior mo' }) {
  const deltaClass =
    delta == null ? 'kpi-card__delta--flat'
    : delta > 0  ? 'kpi-card__delta--up'
    : delta < 0  ? 'kpi-card__delta--down'
    : 'kpi-card__delta--flat';

  const deltaIcon = delta == null ? '—' : delta > 0 ? '↑' : delta < 0 ? '↓' : '→';
  const deltaText = delta == null ? '—' : `${Math.abs(delta * 100).toFixed(1)}%`;

  return (
    <div className="kpi-card">
      <div className="kpi-card__bar" />
      <div className="kpi-card__label">{label}</div>
      <div className="kpi-card__value">
        {prefix && <span className="kpi-card__value-prefix">{prefix}</span>}
        {formatValue(value, format)}
        {suffix && <span className="kpi-card__value-suffix">{suffix}</span>}
      </div>
      <div className={`kpi-card__delta ${deltaClass}`}>
        <span className="kpi-card__delta-icon">{deltaIcon}</span>
        <span>{deltaText}</span>
        <span className="kpi-card__delta-label">{deltaLabel}</span>
      </div>
    </div>
  );
}
