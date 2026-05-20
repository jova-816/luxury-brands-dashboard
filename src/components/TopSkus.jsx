import React from 'react';

export default function TopSkus({ skus, accent }) {
  if (!skus || skus.length === 0) return null;
  const max = Math.max(...skus.map((s) => s.units));

  return (
    <div className="list">
      {skus.map((s, i) => (
        <div key={s.name}>
          <div className="list-row">
            <div className="list-row__rank">{String(i + 1).padStart(2, '0')}</div>
            <div className="list-row__name" title={s.name}>{s.name}</div>
            <div className="list-row__value">{s.units.toLocaleString('en-US')}</div>
          </div>
          <div className="list-row__bar">
            <div
              className="list-row__bar-fill"
              style={{ width: `${(s.units / max) * 100}%`, background: accent }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
