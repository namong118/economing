import FlowGraphic from './FlowGraphic';
import CollectionGraphic from './CollectionGraphic';
import CompareGraphic from './CompareGraphic';

export default function InfographicCard({ data }) {
  if (!data) return null;

  const { type, title } = data;

  return (
    <div style={{
      background: '#fff',
      border: '1px solid var(--c-line-soft)',
      borderRadius: '4px 20px 20px 20px',
      overflow: 'hidden',
      boxShadow: '0 2px 10px rgba(33,197,142,0.07)',
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--c-green-50), #DCFCE7)',
        borderBottom: '1px solid var(--c-green-100)',
        padding: '10px 16px',
        display: 'flex', alignItems: 'center', gap: '8px',
      }}>
        <span style={{ fontSize: '15px', flexShrink: 0 }}>📊</span>
        <div>
          <p style={{ fontSize: '10px', fontWeight: '700', color: 'var(--c-forest-900)', letterSpacing: '0.5px', marginBottom: '1px' }}>
            노밍 한눈에 이해하기
          </p>
          <p style={{ fontSize: '12px', fontWeight: '600', color: 'var(--c-forest-700)' }}>
            {title}
          </p>
        </div>
      </div>

      {/* Graphic content */}
      <div style={{ padding: '14px 16px' }}>
        {type === 'flow'       && <FlowGraphic       data={data} />}
        {type === 'collection' && <CollectionGraphic data={data} />}
        {type === 'compare'    && <CompareGraphic    data={data} />}
      </div>
    </div>
  );
}
