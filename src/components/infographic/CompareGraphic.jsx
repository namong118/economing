import InfographicIcon from './InfographicIcon';

export default function CompareGraphic({ data }) {
  const { left, right, note } = data;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        {[left, right].map((side, i) => (
          <div key={i} style={{
            borderRadius: '12px', overflow: 'hidden',
            border: `1.5px solid ${side.color}33`,
          }}>
            {/* Column header */}
            <div style={{
              background: side.color + '15',
              padding: '10px 12px',
              display: 'flex', alignItems: 'center', gap: '7px',
              borderBottom: `1px solid ${side.color}22`,
            }}>
              <InfographicIcon name={side.icon} size={17} color={side.color} />
              <p style={{ fontSize: '13px', fontWeight: '800', color: side.color, letterSpacing: '-0.3px' }}>
                {side.label}
              </p>
            </div>
            {/* Points list */}
            <div style={{
              padding: '10px 12px',
              display: 'flex', flexDirection: 'column', gap: '7px',
              background: '#FAFAFA',
            }}>
              {side.points.map((pt, j) => (
                <div key={j} style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                  <span style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: side.color, flexShrink: 0, marginTop: '5px',
                  }} />
                  <p style={{ fontSize: '12px', color: 'var(--c-slate)', lineHeight: '1.5', fontWeight: '500' }}>
                    {pt}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {note && (
        <div style={{
          padding: '10px 14px', borderRadius: '10px',
          background: 'var(--c-yellow-100)', border: '1px solid var(--c-yellow-border)',
        }}>
          <p style={{ fontSize: '12px', color: 'var(--c-amber-700)', fontWeight: '600', lineHeight: '1.6' }}>
            {note}
          </p>
        </div>
      )}
    </div>
  );
}
