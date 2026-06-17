import { useNavigate } from 'react-router-dom';
import { BITE_INFOGRAPHICS } from '../../data/biteInfographics';

const DIFF_LABEL = { easy: '입문', medium: '기본', hard: '심화' };

function highlightNumbers(text) {
  const parts = text.split(/(\d[\d,]*(?:\.\d+)?(?:만원|천만원|억원|조원|억달러|만달러|천달러|만|억|조|원|달러|%p|%)?)/g);
  return parts.map((part, i) =>
    /^\d/.test(part)
      ? <span key={i} style={{ color: '#633806', fontWeight: 600 }}>{part}</span>
      : part
  );
}

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
      background: '#fff', borderRadius: 12, border: '0.5px solid #B8EBC8',
      padding: 16, height: '100%', display: 'flex', flexDirection: 'column',
      boxSizing: 'border-box',
    }}>

      {/* 카드 헤더 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ fontSize: 11, fontWeight: 500, color: '#3A9A5C', display: 'flex', alignItems: 'center', gap: 5 }}>
          🍃 오늘의 경제 한잎
        </span>
        <div style={{ display: 'flex', gap: 5 }}>
          <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: '#52C97A', color: '#fff' }}>
            {bite.category}
          </span>
          <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: '#E3F9EC', color: '#2A7A4B', border: '0.5px solid #B8EBC8' }}>
            {DIFF_LABEL[bite.difficulty] ?? bite.difficulty}
          </span>
        </div>
      </div>

      {/* 제목 영역 */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 26, fontWeight: 700, color: '#2A7A4B', lineHeight: 1.2, marginBottom: 4 }}>
          {bite.title}
        </div>
        <div style={{ fontSize: 13, color: '#3A9A5C', lineHeight: 1.5 }}>
          {bite.summary}
        </div>
      </div>

      {/* 픽토그램 영역 */}
      <div style={{
        background: '#F2FBF5', borderRadius: 10, border: '0.5px solid #B8EBC8',
        padding: '20px 16px', marginBottom: 16,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: 'auto', flexShrink: 0,
      }}>
        {InfographicComponent ? (
          <InfographicComponent />
        ) : (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 8, color: '#3A9A5C', fontSize: 13, opacity: 0.5,
          }}>
            <span style={{ fontSize: 28 }}>{emoji}</span>
            <span>{bite.title}</span>
          </div>
        )}
      </div>

      {/* 설명 */}
      <p style={{ fontSize: 13, color: '#5F5E5A', lineHeight: 1.6, marginBottom: bite.realLifeExample ? 14 : 0 }}>
        {bite.description}
      </p>

      {/* 실생활 예시 */}
      {bite.realLifeExample && (
        <div style={{
          background: '#FFFBEE', borderRadius: 10, border: '0.5px solid #FAC775',
          padding: '14px 16px', marginBottom: 0, flexShrink: 0,
        }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#854F0B', marginBottom: 8 }}>
            💡 실생활 예시
          </div>
          <div style={{ fontSize: 13, color: '#2C2C2A', lineHeight: 1.7 }}>
            {highlightNumbers(bite.realLifeExample)}
          </div>
        </div>
      )}

      {/* CTA */}
      {!hideButton && (
        <button
          onClick={() => navigate(`/bite/${bite.id}`)}
          style={{
            width: '100%', background: '#52C97A', color: '#fff',
            border: 'none', borderRadius: 8, padding: 11,
            fontSize: 13, fontWeight: 500, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            marginTop: 'auto', flexShrink: 0,
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#1AAD7D'}
          onMouseLeave={e => e.currentTarget.style.background = '#52C97A'}
        >
          🍃 오늘의 한잎 배우기 →
        </button>
      )}
    </div>
  );
}
