import { useNavigate } from 'react-router-dom';
import { getTodaysBite } from '../../services/biteService';
import { getBiteInfographic } from '../../data/biteInfographics';

const CATEGORY_STYLE = {
  '금리':     { badge: '#FDE68A', text: '#92400E', emoji: '💹', bg: '#FFFCEB' },
  '투자':     { badge: '#A7F3D0', text: '#065F46', emoji: '📊', bg: '#F0FDF4' },
  '거시경제': { badge: '#BFDBFE', text: '#1E40AF', emoji: '🌐', bg: '#EFF6FF' },
  '저축':     { badge: '#A7F3D0', text: '#14532D', emoji: '🏦', bg: '#F0FDF4' },
  '부동산':   { badge: '#FBCFE8', text: '#831843', emoji: '🏠', bg: '#FDF2F8' },
  '기초':     { badge: '#DDD6FE', text: '#4C1D95', emoji: '📚', bg: '#F5F3FF' },
};

const DIFFICULTY_LABEL = { easy: '쉬움', medium: '보통', hard: '심화' };

function ConceptPlaceholder({ bite }) {
  const style = CATEGORY_STYLE[bite.category] ?? { badge: '#E2E8F0', text: '#374151', emoji: '📌', bg: '#F8FAFC' };
  return (
    <div style={{
      background: style.bg,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '22px 16px', gap: '8px',
    }}>
      <div style={{ fontSize: '36px', lineHeight: 1 }}>{style.emoji}</div>
      <div style={{
        fontSize: '19px', fontWeight: '900', color: '#0F172A',
        letterSpacing: '-0.6px', textAlign: 'center',
      }}>
        {bite.title}
      </div>
      <span style={{
        fontSize: '11px', fontWeight: '700',
        background: style.badge, color: style.text,
        borderRadius: '100px', padding: '3px 10px',
      }}>
        {bite.category} 개념
      </span>
    </div>
  );
}

export default function DailyBiteCard() {
  const navigate = useNavigate();
  const bite = getTodaysBite();
  const infographic = getBiteInfographic(bite.title);
  const catStyle = CATEGORY_STYLE[bite.category] ?? { badge: '#E2E8F0', text: '#374151' };

  return (
    <div style={{
      background: '#F2FFF6',
      border: '2px solid #CDEFD7',
      borderRadius: '22px',
      marginBottom: '20px',
      overflow: 'hidden',
      boxShadow: '0 4px 24px rgba(33,197,142,0.1)',
    }}>

      {/* ── 헤더 ── */}
      <div style={{ padding: '15px 18px 13px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '3px' }}>
          <span style={{ fontSize: '14px' }}>🍃</span>
          <span style={{ fontSize: '13px', fontWeight: '900', color: '#065F46', letterSpacing: '-0.2px' }}>
            오늘의 경제 한잎
          </span>
        </div>
        <p style={{ fontSize: '12px', color: '#16A34A', fontWeight: '500', letterSpacing: '-0.1px' }}>
          매일 한 잎씩 경제 지식을 쌓아보세요.
        </p>
      </div>

      {/* ── 구분선 ── */}
      <div style={{ height: '1px', background: '#CDEFD7', margin: '0 18px' }}/>

      {/* ── 인포그래픽 ── */}
      <div style={{ padding: '12px 12px 10px' }}>
        <div style={{
          borderRadius: '14px', overflow: 'hidden',
          border: '1.5px solid rgba(33,197,142,0.15)',
          background: '#fff',
        }}>
          {infographic ? (
            <div style={{ maxWidth: '340px', margin: '0 auto', width: '100%' }}>
              <infographic.graphic />
            </div>
          ) : (
            <ConceptPlaceholder bite={bite} />
          )}
        </div>
      </div>

      {/* ── 구분선 ── */}
      <div style={{ height: '1px', background: '#CDEFD7', margin: '0 18px' }}/>

      {/* ── 개념 정보 ── */}
      <div style={{ padding: '14px 18px 16px' }}>
        {/* 개념명 + 뱃지 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '7px' }}>
          <h3 style={{
            fontSize: '21px', fontWeight: '900', color: '#0F172A', letterSpacing: '-0.7px',
            display: 'flex', alignItems: 'center', gap: '7px',
          }}>
            <span style={{
              width: '7px', height: '7px', borderRadius: '50%',
              background: '#21C58E', display: 'inline-block', flexShrink: 0,
            }}/>
            {bite.title}
          </h3>
          <span style={{
            fontSize: '10px', fontWeight: '700',
            background: catStyle.badge, color: catStyle.text,
            borderRadius: '100px', padding: '2px 8px',
          }}>
            {bite.category}
          </span>
          <span style={{ fontSize: '10px', fontWeight: '600', color: '#6B7280', opacity: 0.8 }}>
            {DIFFICULTY_LABEL[bite.difficulty]}
          </span>
        </div>

        {/* 요약 */}
        <p style={{
          fontSize: '13px', color: '#374151', lineHeight: '1.65',
          letterSpacing: '-0.15px', marginBottom: '14px', fontWeight: '500',
        }}>
          {bite.summary}
        </p>

        {/* CTA */}
        <button
          onClick={() => navigate(`/bite/${bite.id}`)}
          style={{
            width: '100%', padding: '12px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #21C58E, #16A374)',
            color: '#fff', border: 'none', cursor: 'pointer',
            fontSize: '14px', fontWeight: '800', letterSpacing: '-0.3px',
            boxShadow: '0 4px 14px rgba(33,197,142,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(33,197,142,0.45)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.boxShadow = '0 4px 14px rgba(33,197,142,0.3)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          🍃 자세히 배우기
        </button>
      </div>

    </div>
  );
}
