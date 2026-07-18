/* 코스피/코스닥/환율 실시간 티커 — 탭하면 경제사전에서 해석법으로 이동 */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMarketIndices } from '../../services/indicesService';

const ITEMS = [
  { key: 'kospi',  label: '코스피',    path: '/indicator/61' },
  { key: 'kosdaq', label: '코스닥',    path: '/indicator/81' },
  { key: 'usdkrw', label: '환율(USD)', path: '/indicator/62' },
];

function formatValue(value) {
  return value.toLocaleString('ko-KR', { maximumFractionDigits: 2 });
}

/* 한국 주식 시장 관례 — 상승 빨강 ▲ / 하락 파랑 ▼ (미국식과 반대) */
function IndexCard({ label, value, change, changePercent, onClick }) {
  const isUp   = typeof change === 'number' && change > 0;
  const isDown = typeof change === 'number' && change < 0;
  const color  = isUp ? '#DC2626' : isDown ? '#2563EB' : 'var(--c-slate)';
  const arrow  = isUp ? '▲' : isDown ? '▼' : '';

  return (
    <button
      onClick={onClick}
      style={{
        flex: '1 1 0', minWidth: '108px',
        display: 'flex', flexDirection: 'column', gap: '4px',
        background: 'var(--c-surface)', border: '0.5px solid var(--c-line)',
        borderRadius: '12px', padding: '12px 14px',
        cursor: 'pointer', textAlign: 'left',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--c-muted)', letterSpacing: '0.2px' }}>
        {label}
      </span>
      <span style={{ fontSize: '16px', fontWeight: '800', color: 'var(--c-ink)', letterSpacing: '-0.3px' }}>
        {formatValue(value)}
      </span>
      {typeof change === 'number' && typeof changePercent === 'number' && (
        <span style={{ fontSize: '12px', fontWeight: '700', color }}>
          {arrow} {Math.abs(change).toFixed(2)} ({Math.abs(changePercent).toFixed(2)}%)
        </span>
      )}
    </button>
  );
}

function TickerSkeleton() {
  const shimmer = {
    background: 'linear-gradient(90deg, var(--c-green-100) 25%, var(--c-canvas) 50%, var(--c-green-100) 75%)',
    backgroundSize: '200% 100%',
    animation: 'indices-shimmer 1.5s infinite',
  };
  return (
    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
      <style>{`@keyframes indices-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          flex: '1 1 0', minWidth: '108px', height: '66px', borderRadius: '12px',
          border: '0.5px solid var(--c-line)', ...shimmer,
        }} />
      ))}
    </div>
  );
}

export default function IndicesTicker() {
  const navigate = useNavigate();
  const [indices, setIndices] = useState(null);
  const [loading, setLoading] = useState(true);
  const [failed,  setFailed]  = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { data, error } = await getMarketIndices();
      if (cancelled) return;
      if (error || !data) {
        setFailed(true);
        setLoading(false);
        return;
      }
      setIndices(data);
      setLoading(false);
    })();

    return () => { cancelled = true; };
  }, []);

  if (failed) return null;
  if (loading) return <TickerSkeleton />;

  const cards = ITEMS
    .map(item => ({ ...item, data: indices?.[item.key] }))
    .filter(item => item.data && typeof item.data.value === 'number');

  if (cards.length === 0) return null;

  return (
    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', overflowX: 'auto' }}>
      {cards.map(({ key, label, path, data }) => (
        <IndexCard
          key={key}
          label={label}
          value={data.value}
          change={data.change}
          changePercent={data.changePercent}
          onClick={() => navigate(path)}
        />
      ))}
    </div>
  );
}
