/* 진행률 표시 바 컴포넌트 */

export default function ProgressBar({ current, total, color = 'var(--c-green-500)', height = 6, showLabel = false }) {
  const percent = Math.round((current / total) * 100);

  return (
    <div>
      {showLabel && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '12px', color: 'var(--icon-inactive)' }}>{current}/{total}</span>
          <span style={{ fontSize: '12px', color, fontWeight: '600' }}>{percent}%</span>
        </div>
      )}
      <div
        style={{
          width: '100%',
          height: `${height}px`,
          background: '#F3F4F6',
          borderRadius: '100px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${percent}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${color}, ${color}99)`,
            borderRadius: '100px',
            transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </div>
    </div>
  );
}
