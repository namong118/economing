import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PageWrapper from '../components/layout/PageWrapper';

const LEVEL_INFO = {
  beginner: {
    label: '경제 입문 단계',
    emoji: '🌱',
    desc: '월급 관리, 소비 습관, 저축의 기초부터 시작해요.',
    color: '#10B981',
    bg: '#ECFDF5',
    border: '#A7F3D0',
  },
  elementary: {
    label: '경제 기초 단계',
    emoji: '📊',
    desc: '예적금, ETF, 기초 투자 개념을 익혀봐요.',
    color: '#3B82F6',
    bg: '#EFF6FF',
    border: '#BFDBFE',
  },
  intermediate: {
    label: '경제 중급 단계',
    emoji: '💡',
    desc: '세금, 부동산, 포트폴리오 전략을 배워봐요.',
    color: '#8B5CF6',
    bg: '#F5F3FF',
    border: '#DDD6FE',
  },
};

const QUICK_MENU = [
  { emoji: null, isCoach: true, label: 'AI 경제 코치', path: '/coach',      color: '#10B981', bg: '#ECFDF5', border: '#A7F3D0' },
  { emoji: '📈',               label: '학습 로드맵',   path: '/roadmap',    color: '#3B82F6', bg: '#EFF6FF', border: '#BFDBFE' },
  { emoji: '✏️',               label: '경제 일기',     path: '/diary',      color: '#F59E0B', bg: '#FFFBEB', border: '#FCD34D' },
  { emoji: '📚',               label: '경제 사전',     path: '/dictionary', color: '#EC4899', bg: '#FDF2F8', border: '#F9A8D4' },
];

export default function HomePage() {
  const navigate  = useNavigate();
  const { user, profile } = useAuth();

  const nickname = profile?.nickname || (user ? '사용자' : null);
  const level    = profile?.level || 'beginner';
  const levelData = LEVEL_INFO[level] ?? LEVEL_INFO.beginner;

  return (
    <PageWrapper>
      <div className="anim-fade" style={{ maxWidth: '860px', margin: '0 auto', padding: '32px 24px 64px' }}>

        {/* ── 1. 인사 영역 ─────────────────────────────── */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: '#ECFDF5', border: '1px solid #A7F3D0',
            borderRadius: '100px', padding: '4px 14px',
            fontSize: '12px', fontWeight: '700', color: '#059669',
            marginBottom: '14px',
          }}>
            🌿 오늘도 성장 중
          </div>
          <h1 style={{
            fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: '900',
            color: '#0F172A', letterSpacing: '-1.2px', lineHeight: '1.3',
            marginBottom: '8px',
          }}>
            {nickname
              ? <>{nickname}님,<br />오늘도 경제 감각을 키워볼까요?</>
              : <>오늘도 경제 감각을<br />키워볼까요?</>
            }
          </h1>
          <p style={{ fontSize: '15px', color: '#64748B', lineHeight: '1.6' }}>
            작은 습관이 쌓여 경제적 자유가 됩니다.
          </p>
        </div>

        {/* ── 메인 2-컬럼 그리드 ───────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }} className="home-grid">

          {/* ── 2. 현재 성장 단계 카드 ─────────────────── */}
          <div style={{
            background: levelData.bg,
            border: `1.5px solid ${levelData.border}`,
            borderRadius: '20px', padding: '24px',
            display: 'flex', flexDirection: 'column', gap: '12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{
                fontSize: '11px', fontWeight: '700', color: levelData.color,
                letterSpacing: '0.8px', textTransform: 'uppercase',
              }}>
                나의 성장 단계
              </span>
              <span style={{ fontSize: '24px' }}>{levelData.emoji}</span>
            </div>
            <div>
              <p style={{ fontSize: '20px', fontWeight: '900', color: '#0F172A', letterSpacing: '-0.6px', marginBottom: '6px' }}>
                {levelData.label}
              </p>
              <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6' }}>
                {levelData.desc}
              </p>
            </div>
            <button
              onClick={() => navigate('/diagnosis')}
              style={{
                marginTop: 'auto', padding: '10px 16px', borderRadius: '12px',
                background: levelData.color, color: '#fff',
                border: 'none', fontSize: '13px', fontWeight: '700',
                cursor: 'pointer', textAlign: 'center',
                boxShadow: `0 4px 12px ${levelData.color}30`,
              }}
            >
              수준 다시 진단하기 →
            </button>
          </div>

          {/* ── 3. 오늘의 추천 액션 — AI 코치 ──────────── */}
          <div style={{
            background: 'linear-gradient(135deg, #064E3B 0%, #065F46 100%)',
            borderRadius: '20px', padding: '24px',
            display: 'flex', flexDirection: 'column', gap: '12px',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* 배경 장식 */}
            <div style={{
              position: 'absolute', top: '-30px', right: '-30px',
              width: '120px', height: '120px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.05)', pointerEvents: 'none',
            }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <span style={{
                fontSize: '11px', fontWeight: '700', color: '#6EE7B7',
                letterSpacing: '0.8px', textTransform: 'uppercase',
              }}>
                오늘의 추천 액션
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '10px 0' }}>
                <img
                  src={`${import.meta.env.BASE_URL}coach.png`}
                  alt="AI 코치"
                  style={{ width: '36px', height: '36px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }}
                />
                <p style={{ fontSize: '16px', fontWeight: '800', color: '#fff', letterSpacing: '-0.5px', lineHeight: '1.4' }}>
                  AI 경제 코치에게<br />지금 무엇부터 물어볼까요?
                </p>
              </div>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '16px', lineHeight: '1.6' }}>
                지금 단계에서 뭘 공부하면 좋을지 물어보세요.
              </p>
              <button
                onClick={() => navigate('/coach')}
                style={{
                  width: '100%', padding: '11px', borderRadius: '12px',
                  background: '#10B981', color: '#fff',
                  border: 'none', fontSize: '14px', fontWeight: '700',
                  cursor: 'pointer', letterSpacing: '-0.3px',
                }}
              >
                AI 코치 시작하기 →
              </button>
            </div>
          </div>

          {/* ── 4. 학습 로드맵 카드 ─────────────────────── */}
          <div style={{
            background: '#fff', border: '1.5px solid #E2E8F0',
            borderRadius: '20px', padding: '24px',
            display: 'flex', flexDirection: 'column', gap: '12px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                학습 로드맵
              </span>
              <span style={{ fontSize: '22px' }}>🗺️</span>
            </div>
            <p style={{ fontSize: '17px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px', lineHeight: '1.4' }}>
              나에게 맞는<br />경제 학습 순서를<br />만들어볼까요?
            </p>
            <p style={{ fontSize: '12px', color: '#64748B', lineHeight: '1.6' }}>
              5단계 성장 로드맵으로 체계적으로 배워요.
            </p>
            <button
              onClick={() => navigate('/roadmap')}
              style={{
                marginTop: 'auto', padding: '10px 16px', borderRadius: '12px',
                background: '#F8FAFC', color: '#374151',
                border: '1.5px solid #E2E8F0', fontSize: '13px', fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#3B82F6'; e.currentTarget.style.color = '#1D4ED8'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.color = '#374151'; }}
            >
              로드맵 보기 →
            </button>
          </div>

          {/* ── 5. 경제 일기 카드 ────────────────────────── */}
          <div style={{
            background: '#FFFBEB', border: '1.5px solid #FCD34D',
            borderRadius: '20px', padding: '24px',
            display: 'flex', flexDirection: 'column', gap: '12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#D97706', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                경제 일기
              </span>
              <span style={{ fontSize: '22px' }}>✏️</span>
            </div>
            <p style={{ fontSize: '17px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px', lineHeight: '1.4' }}>
              오늘의 소비나<br />경제 생각을<br />짧게 기록해보세요.
            </p>
            <p style={{ fontSize: '12px', color: '#92400E', lineHeight: '1.6' }}>
              매일 기록하면 경제 감각이 달라져요.
            </p>
            <button
              onClick={() => navigate('/diary')}
              style={{
                marginTop: 'auto', padding: '10px 16px', borderRadius: '12px',
                background: '#F59E0B', color: '#fff',
                border: 'none', fontSize: '13px', fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(245,158,11,0.3)',
              }}
            >
              경제 일기 쓰기 →
            </button>
          </div>
        </div>

        {/* ── 6. 하단 빠른 메뉴 ────────────────────────── */}
        <div>
          <p style={{ fontSize: '12px', fontWeight: '700', color: '#94A3B8', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>
            빠른 메뉴
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            {QUICK_MENU.map(item => (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  gap: '8px', padding: '16px 8px', borderRadius: '16px',
                  background: item.bg, border: `1.5px solid ${item.border}`,
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 6px 16px ${item.color}20`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                {item.isCoach ? (
                  <img
                    src={`${import.meta.env.BASE_URL}coach.png`}
                    alt="AI 코치"
                    style={{ width: '32px', height: '32px', borderRadius: '8px', objectFit: 'cover' }}
                  />
                ) : (
                  <span style={{ fontSize: '28px', lineHeight: 1 }}>{item.emoji}</span>
                )}
                <span style={{ fontSize: '12px', fontWeight: '700', color: item.color, letterSpacing: '-0.2px', textAlign: 'center', lineHeight: '1.3' }}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </PageWrapper>
  );
}
