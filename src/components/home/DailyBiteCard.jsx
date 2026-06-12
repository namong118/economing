import { useNavigate } from 'react-router-dom';
import { BITE_INFOGRAPHICS } from '../../data/biteInfographics';

const DIFF_LABEL = { easy: '입문', medium: '기본', hard: '심화' };

const CATEGORY_EMOJI = {
  '금리': '📊', '투자': '📈', '거시경제': '🌏',
  '저축': '🏦', '부동산': '🏠', '기초': '💡',
};

export default function DailyBiteCard({ bite, hideButton }) {
  const navigate = useNavigate();
  const InfographicComponent = BITE_INFOGRAPHICS[bite.id] ?? null;
  const emoji = CATEGORY_EMOJI[bite.category] ?? '📊';

  return (
    <div style={{
      background: '#fff', borderRadius: 12, border: '0.5px solid #d4ede3',
      padding: 16, height: '100%', display: 'flex', flexDirection: 'column',
      boxSizing: 'border-box',
    }}>

      {/* 카드 헤더 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontSize: 11, fontWeight: 500, color: '#0F6E56', display: 'flex', alignItems: 'center', gap: 5 }}>
          🍃 오늘의 경제 한잎
        </span>
        <div style={{ display: 'flex', gap: 5 }}>
          <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: '#21C58E', color: '#fff' }}>
            {bite.category}
          </span>
          <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: '#E1F5EE', color: '#085041', border: '0.5px solid #9FE1CB' }}>
            {DIFF_LABEL[bite.difficulty] ?? bite.difficulty}
          </span>
        </div>
      </div>

      {/* 제목 영역 */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 26, fontWeight: 700, color: '#085041', lineHeight: 1.2, marginBottom: 3 }}>
          {bite.title}
        </div>
        <div style={{ fontSize: 13, color: '#0F6E56', lineHeight: 1.5 }}>
          {bite.summary}
        </div>
      </div>

      {/* 픽토그램 영역 */}
      <div style={{
        background: '#F4FAF6', borderRadius: 10, border: '0.5px solid #d4ede3',
        padding: 16, marginBottom: 14,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flex: 1,
      }}>
        {InfographicComponent ? (
          <InfographicComponent />
        ) : (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 8, color: '#0F6E56', fontSize: 13, opacity: 0.5,
          }}>
            <span style={{ fontSize: 28 }}>{emoji}</span>
            <span>{bite.title}</span>
          </div>
        )}
      </div>

      {/* 설명 */}
      <p style={{ fontSize: 13, color: '#5F5E5A', lineHeight: 1.6, marginBottom: 14 }}>
        {bite.description}
      </p>

      {/* CTA */}
      {!hideButton && (
        <button
          onClick={() => navigate(`/bite/${bite.id}`)}
          style={{
            width: '100%', background: '#21C58E', color: '#fff',
            border: 'none', borderRadius: 8, padding: 11,
            fontSize: 13, fontWeight: 500, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#1AAD7D'}
          onMouseLeave={e => e.currentTarget.style.background = '#21C58E'}
        >
          🍃 오늘의 한잎 배우기 →
        </button>
      )}
    </div>
  );
}
