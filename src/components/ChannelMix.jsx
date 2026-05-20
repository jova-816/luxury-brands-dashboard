import React from 'react';

export default function ChannelMix({ channelMix, accent }) {
  if (!channelMix) return null;
  const entries = Object.entries(channelMix).sort((a, b) => b[1] - a[1]);
  const max = Math.max(...entries.map(([, v]) => v));

  return (
    <div className="channel-list">
      {entries.map(([name, pct]) => (
        <div className="channel-row" key={name}>
          <div className="channel-row__name">{name}</div>
          <div className="channel-row__pct">{(pct * 100).toFixed(1)}%</div>
          <div className="channel-row__bar">
            <div
              className="channel-row__bar-fill"
              style={{ width: `${(pct / max) * 100}%`, background: accent }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
