import { useNavigate } from 'react-router-dom';
import { getBiteInfographic } from '../../data/biteInfographics';

const CATEGORY_COLOR = {
  '금리':     { bg: '#E1F5EE', text: '#085041', border: '#9FE1CB' },
  '투자':     { bg: '#E1F5EE', text: '#085041', border: '#9FE1CB' },
  '거시경제': { bg: '#EFF6FF', text: '#1E40AF', border: '#BFDBFE' },
  '저축':     { bg: '#E1F5EE', text: '#085041', border: '#9FE1CB' },
  '부동산':   { bg: '#FDF2F8', text: '#831843', border: '#F9A8D4' },
  '기초':     { bg: '#F5F3FF', text: '#4C1D95', border: '#DDD6FE' },
};

const DIFF_COLOR = {
  easy:   { bg: '#FFF4D6', text: '#854F0B', border: '#FAC775' },
  medium: { bg: '#FFF4D6', text: '#854F0B', border: '#FAC775' },
  hard:   { bg: '#FEF2F2', text: '#B91C1C', border: '#FECACA' },
};

const DIFF_LABEL = { easy: '입문', medium: '기본', hard: '심화' };

const CATEGORY_EMOJI = {
  '금리': '📊', '투자': '📈', '거시경제': '🌏',
  '저축': '🏦', '부동산': '🏠', '기초': '💡',
};

export default function DailyBiteCard({ bite, hideButton }) {
  const navigate = useNavigate();
  const infographic = getBiteInfographic(bite.title);
  const InfographicComponent = infographic?.graphic ?? null;

  const catColor  = CATEGORY_COLOR[bite.category] ?? { bg: '#E1F5EE', text: '#085041', border: '#9FE1CB' };
  const diffColor = DIFF_COLOR[bite.difficulty]   ?? { bg: '#F1EFE8', text: '#888780', border: '#e0f0e8' };
  const emoji     = CATEGORY_EMOJI[bite.category] ?? '📊';

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
          <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: catColor.bg, color: catColor.text, border: `0.5px solid ${catColor.border}` }}>
            {bite.category}
          </span>
          <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: diffColor.bg, color: diffColor.text, border: `0.5px solid ${diffColor.border}` }}>
            {DIFF_LABEL[bite.difficulty] ?? bite.difficulty}
          </span>
        </div>
      </div>

      {/* 히어로 블록 */}
      <div style={{
        background: '#085041', borderRadius: 10, padding: '22px 20px',
        marginBottom: 14, display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 12, background: '#21C58E',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 24, flexShrink: 0,
        }}>
          {emoji}
        </div>
        <div>
          <div style={{ color: '#fff', fontSize: 20, fontWeight: 500 }}>{bite.title}</div>
          <div style={{ color: '#9FE1CB', fontSize: 12, marginTop: 4 }}>{bite.category}</div>
        </div>
      </div>

      {/* 픽토그램 영역 */}
      <div style={{
        background: '#F4FAF6', borderRadius: 10, border: '0.5px solid #d4ede3',
        padding: '12px', marginBottom: 14,
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
