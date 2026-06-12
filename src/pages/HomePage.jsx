import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { addXp } from '../services/profileService';
import { getNextLevelInfo, LEVELS } from '../data/levelData';
import { getTodaysBite } from '../services/biteService';
import { getBiteInfographic } from '../data/biteInfographics';
import PageWrapper from '../components/layout/PageWrapper';

/* ── 상수 & 헬퍼 ──────────────────────────────────────────── */
const CATEGORY_STYLE = {
  '금리':     { badge: '#FDE68A', text: '#92400E', emoji: '💹', bg: '#FFFCEB' },
  '투자':     { badge: '#A7F3D0', text: '#065F46', emoji: '📊', bg: '#F0FDF4' },
  '거시경제': { badge: '#BFDBFE', text: '#1E40AF', emoji: '🌐', bg: '#EFF6FF' },
  '저축':     { badge: '#A7F3D0', text: '#14532D', emoji: '🏦', bg: '#F0FDF4' },
  '부동산':   { badge: '#FBCFE8', text: '#831843', emoji: '🏠', bg: '#FDF2F8' },
  '기초':     { badge: '#DDD6FE', text: '#4C1D95', emoji: '📚', bg: '#F5F3FF' },
};
const DIFF_LABEL = { easy: '입문', medium: '기본', hard: '심화' };
const DIFF_COLOR = {
  easy:   { bg: '#F0FDF4', text: '#15803D' },
  medium: { bg: '#FFFBEA', text: '#92400E' },
  hard:   { bg: '#FEF2F2', text: '#B91C1C' },
};
const ECON_LEVEL = {
  beginner:     { label: '경제 초보', color: '#2563EB', bg: '#EFF6FF' },
  intermediate: { label: '경제 중급', color: '#7C3AED', bg: '#F5F3FF' },
  advanced:     { label: '경제 고급', color: '#C2410C', bg: '#FFF7ED' },
};

function getGreeting() {
  const h = new Date().getHours();
  if (h >= 6  && h < 12) return { text: '좋은 아침이에요', emoji: '🌅' };
  if (h >= 12 && h < 18) return { text: '안녕하세요',     emoji: '☀️' };
  if (h >= 18 && h < 22) return { text: '오늘도 수고하셨어요', emoji: '🌆' };
  return                         { text: '늦은 시간까지 공부하시네요', emoji: '🌙' };
}

function getNomingMessage(profile) {
  if (!profile?.onboarding_completed) {
    return '무엇부터 시작해야 할지 모르겠다면, 경제 프로필을 먼저 설정해봐요. 딱 2분이면 돼요.';
  }
  const msgs = {
    seed:   '첫걸음이 가장 중요해요. 오늘 작은 것 하나씩 시작해봐요.',
    sprout: '잘 하고 있어요! 꾸준히 이어가면 금방 성장할 거예요.',
    leaf:   '경제 공부에 흥미가 생기기 시작했죠? 이제 더 재밌어질 거예요.',
    flower: '좋은 흐름이에요. 오늘도 한 가지씩 배워봐요.',
    fruit:  '실력이 쌓이고 있어요. 꾸준함이 최고의 전략이에요.',
    tree:   '여기까지 온 것만으로도 대단해요. 계속 나아가봐요!',
    forest: '이미 훌륭한 경제 감각을 갖추셨어요. 다음 목표를 세워봐요!',
  };
  return msgs[profile?.level] ?? '오늘도 함께 성장해봐요.';
}

function getActions(profile, isLoggedIn) {
  const onboarded = profile?.onboarding_completed;
  const COACH   = { id: 'coach',   icon: '☀️', title: 'AI 코치 노밍에게 질문하기', desc: '지금 궁금한 경제 질문 바로 물어보기',  path: '/coach' };
  const READ    = { id: 'read',    icon: '📰', title: '경제 읽기',               desc: '오늘의 경제 뉴스·트렌드 살펴보기',      path: '/reading' };
  const DIARY   = { id: 'diary',   icon: '✏️', title: '경제 일기 작성',           desc: '오늘 배운 것을 짧게 기록해두기',        path: '/diary' };
  const ONBOARD = { id: 'onboard', icon: '🌱', title: '경제 프로필 설정하기',     desc: '2분이면 완료 — 맞춤 코칭 시작',        path: '/onboarding' };
  if (!isLoggedIn) return [COACH, READ];
  if (!onboarded)  return [ONBOARD, COACH, READ];
  return [COACH, READ, DIARY];
}

/* ══ 왼쪽: 오늘의 경제 한잎 패널 ════════════════════════════ */
function EconomicBitePanel({ navigate }) {
  const [hov, setHov] = useState(false);
  const bite         = getTodaysBite();
  const infographic  = getBiteInfographic(bite.title);
  const catStyle     = CATEGORY_STYLE[bite.category] ?? { badge: '#E2E8F0', text: '#374151', emoji: '📌', bg: '#F8FAFC' };
  const diffStyle    = DIFF_COLOR[bite.difficulty]   ?? { bg: '#F8FAFC', text: '#64748B' };

  return (
    <div style={{
      background: '#fff', border: '1.5px solid #E2E8F0',
      borderRadius: '20px', overflow: 'hidden',
      boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* 헤더 */}
      <div style={{ padding: '18px 22px 14px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '16px' }}>🍃</span>
          <span style={{ fontSize: '13px', fontWeight: '800', color: '#065F46', letterSpacing: '-0.2px' }}>
            오늘의 경제 한잎
          </span>
        </div>
        <div style={{ display: 'flex', gap: '5px' }}>
          <span style={{ fontSize: '10px', fontWeight: '700', background: catStyle.badge, color: catStyle.text, borderRadius: '100px', padding: '3px 10px' }}>
            {bite.category}
          </span>
          <span style={{ fontSize: '10px', fontWeight: '700', background: diffStyle.bg, color: diffStyle.text, borderRadius: '100px', padding: '3px 10px' }}>
            {DIFF_LABEL[bite.difficulty]}
          </span>
        </div>
      </div>

      {/* 개념명 */}
      <div style={{ padding: '16px 22px 12px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#0F172A', letterSpacing: '-0.8px', lineHeight: 1.2 }}>
          {bite.title}
        </h2>
      </div>

      {/* 인포그래픽 */}
      <div style={{ background: '#FAFFFE', borderTop: '1px solid #F1F5F9', borderBottom: '1px solid #F1F5F9', padding: '14px 16px' }}>
        <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(33,197,142,0.12)', background: '#fff' }}>
          {infographic ? (
            <div style={{ maxWidth: '520px', margin: '0 auto', width: '100%' }}>
              <infographic.graphic />
            </div>
          ) : (
            <div style={{ padding: '36px 24px', textAlign: 'center', background: catStyle.bg }}>
              <div style={{ fontSize: '52px', marginBottom: '12px' }}>{catStyle.emoji}</div>
              <div style={{ fontSize: '22px', fontWeight: '900', color: '#0F172A', letterSpacing: '-0.6px' }}>{bite.title}</div>
            </div>
          )}
        </div>
      </div>

      {/* 요약 + CTA */}
      <div style={{ padding: '18px 22px 22px', flex: 1 }}>
        <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.75', fontWeight: '500', letterSpacing: '-0.2px', marginBottom: '18px' }}>
          {bite.summary}
        </p>
        <button
          onClick={() => navigate(`/bite/${bite.id}`)}
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
          style={{
            width: '100%', padding: '14px',
            borderRadius: '12px',
            background: hov ? 'linear-gradient(135deg, #1AAD7D, #148F68)' : 'linear-gradient(135deg, #21C58E, #16A374)',
            color: '#fff', border: 'none', cursor: 'pointer',
            fontSize: '15px', fontWeight: '800', letterSpacing: '-0.4px',
            boxShadow: hov ? '0 6px 20px rgba(33,197,142,0.45)' : '0 4px 14px rgba(33,197,142,0.28)',
            transform: hov ? 'translateY(-1px)' : 'none',
            transition: 'all 0.15s',
          }}
        >
          🍃 오늘의 한잎 배우기 →
        </button>
      </div>
    </div>
  );
}

/* ══ 오른쪽: 성장 현황 카드 ════════════════════════════════ */
function GrowthCard({ profile, navigate, user, xpLoading, onAddXp }) {
  const xp = profile?.xp ?? 0;
  const { currentLevel, nextLevel, xpNeeded, progressPercent } = getNextLevelInfo(xp);
  const econLevel  = profile?.economic_level;
  const econStyle  = econLevel ? ECON_LEVEL[econLevel] : null;
  const currentIdx = LEVELS.findIndex(l => l.key === currentLevel.key);

  return (
    <div style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
      {/* 헤더 */}
      <div style={{ padding: '14px 18px 12px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '12px', fontWeight: '800', color: '#64748B', letterSpacing: '0.3px' }}>📈 성장 단계</span>
        <button onClick={() => navigate('/my-growth')} style={{ background: 'none', border: 'none', fontSize: '11px', color: '#94A3B8', fontWeight: '600', cursor: 'pointer', padding: '2px 0' }}>
          자세히 보기 →
        </button>
      </div>

      <div style={{ padding: '16px 18px' }}>
        {/* 레벨 아이콘 + 이름 + 배지 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '16px', flexShrink: 0,
            background: 'linear-gradient(135deg, #F0FDF4, #DCFCE7)',
            border: '2px solid #A7F3D0',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px',
          }}>
            {currentLevel.emoji}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '4px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '20px', fontWeight: '900', color: '#0F172A', letterSpacing: '-0.6px' }}>
                {currentLevel.label}
              </span>
              {econStyle && (
                <span style={{ fontSize: '10px', fontWeight: '700', background: econStyle.bg, color: econStyle.color, borderRadius: '100px', padding: '2px 9px' }}>
                  {econStyle.label}
                </span>
              )}
            </div>
            <span style={{ fontSize: '13px', color: '#64748B', fontWeight: '600' }}>총 {xp} XP</span>
          </div>
        </div>

        {/* XP 바 */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '600' }}>
              {nextLevel ? `${nextLevel.emoji} ${nextLevel.label}까지` : '✨ 최고 단계 달성!'}
            </span>
            {nextLevel && <span style={{ fontSize: '11px', color: '#21C58E', fontWeight: '700' }}>{xpNeeded} XP 남음</span>}
          </div>
          <div style={{ height: '7px', background: '#F1F5F9', borderRadius: '100px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: '100px',
              background: 'linear-gradient(90deg, #21C58E, #FFC83D)',
              width: `${progressPercent}%`, transition: 'width 0.6s ease',
            }} />
          </div>
        </div>

        {/* 7단계 트랙 */}
        <div style={{ display: 'flex', gap: '3px' }}>
          {LEVELS.map((lv, idx) => {
            const isCurrent = idx === currentIdx;
            const isDone    = idx < currentIdx;
            return (
              <div key={lv.key} style={{
                flex: 1, textAlign: 'center', padding: '5px 2px', borderRadius: '9px',
                background: isCurrent ? 'linear-gradient(135deg, #21C58E, #1AAD7D)' : isDone ? '#E8FFF3' : '#F8FAFC',
                border: isCurrent ? '1.5px solid #21C58E' : isDone ? '1px solid #A7F3D0' : '1px solid #F1F5F9',
              }}>
                <div style={{ fontSize: '13px', lineHeight: 1 }}>{lv.emoji}</div>
                <div style={{ fontSize: '8px', fontWeight: '700', color: isCurrent ? '#fff' : isDone ? '#15803D' : '#CBD5E1', marginTop: '3px', letterSpacing: '-0.1px' }}>
                  {lv.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* dev XP */}
      {user && (
        <div style={{ borderTop: '1px solid #F8FAFC', padding: '8px 18px', textAlign: 'center' }}>
          <button onClick={onAddXp} disabled={xpLoading} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', color: '#CBD5E1', fontWeight: '600' }}>
            {xpLoading ? '처리 중...' : `⚡ +5 XP 테스트 (${xp} XP)`}
          </button>
        </div>
      )}
    </div>
  );
}

/* ══ 오른쪽: 오늘 해야 할 것 카드 ══════════════════════════ */
function TodayActionRow({ action, isLast, navigate }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={() => navigate(action.path)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
        padding: '10px 10px', borderRadius: '12px',
        background: hov ? '#F4FAF6' : 'transparent',
        border: 'none', cursor: 'pointer', textAlign: 'left',
        borderBottom: !isLast ? '1px solid #F8FAFC' : 'none',
        transition: 'background 0.12s',
      }}
    >
      <div style={{
        width: '32px', height: '32px', borderRadius: '10px', flexShrink: 0,
        background: '#F4FAF6', border: '1px solid #DCF5EB',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px',
      }}>
        {action.icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: '13px', fontWeight: '700', color: '#0F172A', letterSpacing: '-0.3px', marginBottom: '1px' }}>{action.title}</p>
        <p style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{action.desc}</p>
      </div>
      <span style={{ fontSize: '14px', color: hov ? '#21C58E' : '#CBD5E1', flexShrink: 0, transition: 'color 0.12s' }}>→</span>
    </button>
  );
}

function TodayCard({ actions, navigate }) {
  return (
    <div style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
      <div style={{ padding: '14px 18px 12px', borderBottom: '1px solid #F1F5F9' }}>
        <span style={{ fontSize: '12px', fontWeight: '800', color: '#64748B', letterSpacing: '0.3px' }}>✅ 오늘 해야 할 것</span>
      </div>
      <div style={{ padding: '8px 10px' }}>
        {actions.map((a, i) => (
          <TodayActionRow key={a.id} action={a} isLast={i === actions.length - 1} navigate={navigate} />
        ))}
      </div>
    </div>
  );
}

/* ══ 오른쪽: 노밍 추천 카드 ════════════════════════════════ */
function NomingBanner({ profile, navigate, BASE_URL }) {
  const [hov, setHov]   = useState(false);
  const greeting        = getGreeting();
  const nickname        = profile?.nickname?.split(' ')[0] || '사용자';
  const message         = getNomingMessage(profile);

  return (
    <div style={{
      background: 'linear-gradient(145deg, #FFFBEA, #FFF7D6)',
      border: '1.5px solid #FFE08A', borderRadius: '20px', overflow: 'hidden',
      boxShadow: '0 2px 12px rgba(255,200,61,0.12)',
    }}>
      <div style={{ padding: '14px 18px 12px', borderBottom: '1px solid rgba(255,224,138,0.4)', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <img src={`${BASE_URL}coach.png`} alt="노밍" style={{ width: '38px', height: '38px', borderRadius: '11px', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '9px', height: '9px', borderRadius: '50%', background: '#21C58E', border: '2px solid #FFFBEA' }} />
        </div>
        <div>
          <p style={{ fontSize: '10px', fontWeight: '700', color: '#B45309', letterSpacing: '0.3px' }}>{greeting.emoji} 노밍 · AI 경제 코치</p>
          <p style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.4px' }}>{greeting.text}, {nickname}님</p>
        </div>
      </div>
      <div style={{ padding: '14px 18px 16px' }}>
        <p style={{ fontSize: '13px', color: '#78350F', lineHeight: '1.7', fontWeight: '500', letterSpacing: '-0.2px', marginBottom: '13px' }}>
          {message}
        </p>
        <button
          onClick={() => navigate('/coach')}
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
          style={{
            width: '100%', padding: '10px', borderRadius: '10px',
            background: hov ? '#FFBA00' : '#FFC83D',
            color: '#78350F', border: 'none', cursor: 'pointer',
            fontSize: '13px', fontWeight: '800', letterSpacing: '-0.3px',
            boxShadow: hov ? '0 4px 14px rgba(255,200,61,0.5)' : '0 3px 10px rgba(255,200,61,0.3)',
            transition: 'all 0.15s',
          }}
        >
          ☀️ 노밍에게 질문하기
        </button>
      </div>
    </div>
  );
}

/* ══ 비로그인 성장 안내 카드 ════════════════════════════════ */
function GuestGrowthCard({ navigate }) {
  return (
    <div style={{ background: '#fff', border: '1.5px solid #DCF5EB', borderRadius: '20px', padding: '22px 20px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', textAlign: 'center' }}>
      <p style={{ fontSize: '36px', marginBottom: '10px' }}>🌱</p>
      <p style={{ fontSize: '16px', fontWeight: '900', color: '#0F172A', letterSpacing: '-0.5px', marginBottom: '6px' }}>성장 단계를 시작해보세요</p>
      <p style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.65', marginBottom: '16px' }}>로그인하면 XP가 쌓이고<br />경제 성장 단계가 올라가요.</p>
      <button
        onClick={() => navigate('/login')}
        style={{
          width: '100%', padding: '12px', borderRadius: '12px',
          background: 'linear-gradient(135deg, #21C58E, #16A374)',
          color: '#fff', border: 'none', cursor: 'pointer',
          fontSize: '14px', fontWeight: '800', letterSpacing: '-0.3px',
          boxShadow: '0 3px 12px rgba(33,197,142,0.3)',
        }}
      >
        로그인하기 →
      </button>
    </div>
  );
}

/* ══ 메인 ════════════════════════════════════════════════════ */
export default function HomePage() {
  const navigate                    = useNavigate();
  const { user, profile, refreshProfile } = useAuth();
  const [xpLoading, setXpLoading]   = useState(false);
  const BASE_URL                    = import.meta.env.BASE_URL;

  const nickname = profile?.nickname?.split(' ')[0] || (user ? '사용자' : '방문자');
  const actions  = getActions(profile, !!user);

  const today = new Date().toLocaleDateString('ko-KR', {
    month: 'long', day: 'numeric', weekday: 'long',
  });

  const handleAddXp = async () => {
    if (!user || xpLoading) return;
    setXpLoading(true);
    await addXp(user.id, 5);
    await refreshProfile();
    setXpLoading(false);
  };

  return (
    <PageWrapper>
      <style>{`
        .hd-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        @media (min-width: 860px) {
          .hd-grid {
            display: grid;
            grid-template-columns: 1fr 340px;
            gap: 22px;
            align-items: start;
          }
        }
        @media (min-width: 1080px) {
          .hd-grid {
            grid-template-columns: 1fr 380px;
          }
        }
      `}</style>

      <div className="anim-fade" style={{ background: '#F4FAF6', minHeight: 'calc(100vh - 64px)', padding: '28px 0 64px' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '0 24px' }}>

          {/* ── 대시보드 헤더 ── */}
          <div style={{
            display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
            gap: '12px', flexWrap: 'wrap', marginBottom: '22px',
          }}>
            <div>
              <p style={{ fontSize: '12px', fontWeight: '600', color: '#94A3B8', letterSpacing: '0.3px', marginBottom: '5px' }}>
                {today}
              </p>
              <h1 style={{ fontSize: '26px', fontWeight: '900', color: '#0F172A', letterSpacing: '-0.9px', lineHeight: 1.2 }}>
                {nickname}님의 경제 성장 대시보드
              </h1>
            </div>
            {!user && (
              <button
                onClick={() => navigate('/login')}
                style={{
                  padding: '10px 20px', borderRadius: '12px', flexShrink: 0,
                  background: 'linear-gradient(135deg, #21C58E, #1AAD7D)',
                  color: '#fff', border: 'none', fontSize: '13px', fontWeight: '700',
                  cursor: 'pointer', boxShadow: '0 3px 10px rgba(33,197,142,0.3)',
                }}
              >
                로그인하고 시작 →
              </button>
            )}
          </div>

          {/* ── 2열 대시보드 ── */}
          <div className="hd-grid">

            {/* 왼쪽: 경제 한잎 */}
            <EconomicBitePanel navigate={navigate} />

            {/* 오른쪽: 성장 현황 + 오늘 할 것 + 노밍 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {user && profile ? (
                <GrowthCard
                  profile={profile}
                  navigate={navigate}
                  user={user}
                  xpLoading={xpLoading}
                  onAddXp={handleAddXp}
                />
              ) : (
                !user && <GuestGrowthCard navigate={navigate} />
              )}

              <TodayCard actions={actions} navigate={navigate} />

              <NomingBanner profile={profile} navigate={navigate} BASE_URL={BASE_URL} />
            </div>

          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
