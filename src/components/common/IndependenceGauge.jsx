import { LEVELS } from '../../data/independenceLevels';

/* 자립 단계 5단계 중 현재 위치를 숫자 없이 눈금으로 보여준다. */
export default function IndependenceGauge({ levelKey, color }) {
  const idx = Math.max(0, LEVELS.findIndex(l => l.level === levelKey));

  return (
    <div style={{ position: 'relative', padding: '5px 0 0' }}>
      <div style={{ position: 'absolute', top: 9, left: 0, right: 0, height: 3, background: 'var(--c-line-soft)', borderRadius: 99 }} />
      <div style={{
        position: 'absolute', top: 9, left: 0, height: 3,
        width: `${(idx / (LEVELS.length - 1)) * 100}%`,
        background: color, borderRadius: 99, transition: 'width 0.4s ease',
      }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
        {LEVELS.map((l, i) => (
          <div key={l.level} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: i === idx ? 16 : 10, height: i === idx ? 16 : 10, borderRadius: '50%',
              background: i <= idx ? color : 'var(--c-line)',
              boxShadow: i === idx ? `0 0 0 3px ${color}33` : 'none',
              transition: 'all 0.3s',
            }} />
            <span style={{
              fontSize: i === idx ? 11 : 10, fontWeight: i === idx ? 800 : 500,
              color: i === idx ? color : 'var(--c-muted)', whiteSpace: 'nowrap',
            }}>
              {l.shortLabel}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
