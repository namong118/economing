import { useNavigate } from 'react-router-dom';
import { getBiteInfographic } from '../../data/biteInfographics';

/* 카드 공통 스타일 */
const card = {
  background: '#fff',
  borderRadius: 12,
  border: '0.5px solid #d4ede3',
  padding: 16,
};

const CATEGORY_COLOR = {
  '금리':     { bg: '#E1F5EE', text: '#085041' },
  '투자':     { bg: '#E1F5EE', text: '#085041' },
  '거시경제': { bg: '#EFF6FF', text: '#1E40AF' },
  '저축':     { bg: '#E1F5EE', text: '#085041' },
  '부동산':   { bg: '#FDF2F8', text: '#831843' },
  '기초':     { bg: '#F5F3FF', text: '#4C1D95' },
};

const DIFF_COLOR = {
  easy:   { bg: '#FFF4D6', text: '#92400E' },
  medium: { bg: '#FFF4D6', text: '#92400E' },
  hard:   { bg: '#FEF2F2', text: '#B91C1C' },
};

function Badge({ bg, text, children }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 500,
      background: bg, color: text,
      borderRadius: 5, padding: '2px 8px',
    }}>
      {children}
    </span>
  );
}

export default function DailyBiteCard({ bite, hideButton }) {
  const navigate    = useNavigate();
  const infographic = getBiteInfographic(bite.title);
  const InfographicComponent = infographic?.graphic ?? null;

  const catColor  = CATEGORY_COLOR[bite.category] ?? { bg: '#E1F5EE', text: '#085041' };
  const diffColor = DIFF_COLOR[bite.difficulty]   ?? { bg: '#F1EFE8', text: '#888780' };

  return (
    <div style={card}>

      {/* 카드 헤더 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: '#085041' }}>🍃 오늘의 경제 한잎</span>
        <div style={{ display: 'flex', gap: 5 }}>
          <Badge bg={catColor.bg} text={catColor.text}>{bite.category}</Badge>
          <Badge bg={diffColor.bg} text={diffColor.text}>{bite.difficulty === 'easy' ? '입문' : bite.difficulty === 'medium' ? '기본' : '심화'}</Badge>
        </div>
      </div>

      {/* 픽토그램 영역 */}
      <div style={{
        background: '#F4FAF6',
        borderRadius: 10,
        border: '0.5px solid #d4ede3',
        padding: '16px 12px 12px',
        marginBottom: 12,
      }}>
        <p style={{ fontSize: 15, fontWeight: 500, color: '#085041', textAlign: 'center', marginBottom: 12 }}>
          {bite.title}
        </p>
        {InfographicComponent ? (
          <InfographicComponent />
        ) : (
          <div style={{
            height: 100,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#0F6E56', fontSize: 13, fontWeight: 500,
          }}>
            {bite.title}
          </div>
        )}
      </div>

      {/* 본문 설명 */}
      <p style={{ fontSize: 13, color: '#5F5E5A', lineHeight: 1.65, marginBottom: 14 }}>
        {bite.summary}
      </p>

      {/* CTA */}
      {!hideButton && (
        <button
          onClick={() => navigate(`/bite/${bite.id}`)}
          style={{
            width: '100%',
            background: '#21C58E',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: 10,
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
            letterSpacing: '-0.2px',
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
