import InfographicIcon from './InfographicIcon';

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
            background: 'var(--c-surface)', border: '1.5px solid var(--c-line)',
          }}>
            <InfographicIcon name={item.icon} size={22} color="var(--c-forest-700)" />
            <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--c-slate)', textAlign: 'center' }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Converge label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <div style={{ height: '1px', width: '24px', background: '#CBD5E1' }} />
        <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--c-muted)' }}>합치면</span>
        <div style={{ height: '1px', width: '24px', background: '#CBD5E1' }} />
      </div>
      <span style={{ fontSize: '18px', color: 'var(--c-green-100)', marginTop: '-8px' }}>↓</span>

      {/* Result card */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '14px',
        padding: '14px 20px', borderRadius: '14px', width: '100%',
        background: 'linear-gradient(135deg, var(--c-green-50), #DCFCE7)',
        border: '2px solid var(--c-green-100)',
      }}>
        <InfographicIcon name={result.icon} size={28} color="var(--c-forest-700)" />
        <div>
          <p style={{ fontSize: '15px', fontWeight: '900', color: 'var(--c-forest-900)', letterSpacing: '-0.4px' }}>
            {result.label}
          </p>
          {result.note && (
            <p style={{ fontSize: '12px', color: 'var(--c-forest-700)', marginTop: '2px', fontWeight: '500' }}>
              {result.note}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
