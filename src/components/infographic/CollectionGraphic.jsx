export default function CollectionGraphic({ data }) {
  const { items, result } = data;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
      {/* Item chips */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {items.map((item, i) => (
          <div key={i} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
            padding: '10px 12px', borderRadius: '12px', minWidth: '60px',
            background: '#F8FAFC', border: '1.5px solid #E2E8F0',
          }}>
            <span style={{ fontSize: '22px' }}>{item.icon}</span>
            <span style={{ fontSize: '11px', fontWeight: '600', color: '#374151', textAlign: 'center' }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Converge label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <div style={{ height: '1px', width: '24px', background: '#CBD5E1' }} />
        <span style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8' }}>합치면</span>
        <div style={{ height: '1px', width: '24px', background: '#CBD5E1' }} />
      </div>
      <span style={{ fontSize: '18px', color: '#A7F3D0', marginTop: '-8px' }}>↓</span>

      {/* Result card */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '14px',
        padding: '14px 20px', borderRadius: '14px', width: '100%',
        background: 'linear-gradient(135deg, #F0FDF9, #DCFCE7)',
        border: '2px solid #A7F3D0',
      }}>
        <span style={{ fontSize: '30px', flexShrink: 0 }}>{result.icon}</span>
        <div>
          <p style={{ fontSize: '15px', fontWeight: '900', color: '#065F46', letterSpacing: '-0.4px' }}>
            {result.label}
          </p>
          {result.note && (
            <p style={{ fontSize: '12px', color: '#047857', marginTop: '2px', fontWeight: '500' }}>
              {result.note}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
