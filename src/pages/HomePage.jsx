import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { addXp } from '../services/profileService';
import { getNextLevelInfo, LEVELS } from '../data/levelData';
import { getTodaysBite } from '../services/biteService';
import PageWrapper from '../components/layout/PageWrapper';
import DailyBiteCard from '../components/home/DailyBiteCard';

/* ── 공통 카드 스타일 ──────────────────────────────────────── */
const CARD = {
  background: '#fff',
  borderRadius: 12,
  border: '0.5px solid #d4ede3',
  padding: 16,
};

/* ── 경제 수준 배지 ────────────────────────────────────────── */
const ECON_LEVEL = {
  beginner:     { label: '경제 초보', color: '#2563EB', bg: '#EFF6FF' },
  intermediate: { label: '경제 중급', color: '#7C3AED', bg: '#F5F3FF' },
  advanced:     { label: '경제 고급', color: '#C2410C', bg: '#FFF7ED' },
};

/* ── 오늘 할 것 목록 생성 ──────────────────────────────────── */
function getActions(profile, isLoggedIn) {
  const onboarded = profile?.onboarding_completed;
  const COACH   = { icon: '☀️', iconBg: '#FFF4D6', title: 'AI 코치 노밍에게 질문하기',  desc: '지금 궁금한 경제 질문 바로 물어보기', path: '/coach'       };
  const READ    = { icon: '📰', iconBg: '#E1F5EE', title: '경제 읽기',                  desc: '오늘의 경제 뉴스·트렌드 살펴보기',    path: '/reading'     };
  const DIARY   = { icon: '✏️', iconBg: '#F1EFE8', title: '경제 일기 작성',              desc: '오늘 배운 것을 짧게 기록해두기',      path: '/my-growth'   };
  const ONBOARD = { icon: '🌱', iconBg: '#E1F5EE', title: '경제 프로필 설정하기',        desc: '2분이면 완료 — 맞춤 코칭 시작',      path: '/onboarding'  };
  if (!isLoggedIn) return [COACH, READ];
  if (!onboarded)  return [ONBOARD, COACH, READ];
  return [COACH, READ, DIARY];
}

/* ══ 노밍 카드 (2번째 컬럼) ════════════════════════════════ */
function NomingCard({ bite, profile, navigate }) {
  const userName = profile?.nickname?.split(' ')[0] || '사용자';
  const questions = [
    `${bite.title}이 내 생활에 미치는 영향은?`,
    `${bite.title} 쉽게 설명해줘`,
  ];

  return (
    <div style={CARD}>
      {/* 노밍 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: '#FFC83D',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, flexShrink: 0,
        }}>
          ☀️
        </div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 500, color: '#085041' }}>노밍 · AI 경제 코치</p>
          <p style={{ fontSize: 11, color: '#888780' }}>무엇이든 물어보세요</p>
        </div>
      </div>

      {/* 말풍선 */}
      <div style={{
        background: '#F4FAF6',
        borderRadius: '0 10px 10px 10px',
        padding: '12px 14px',
        fontSize: 13,
        color: '#444441',
        lineHeight: 1.65,
        border: '0.5px solid #d4ede3',
        marginBottom: 12,
      }}>
        안녕하세요, {userName}님! 오늘은{' '}
        <strong style={{ color: '#085041' }}>{bite.title}</strong>
        이 주제예요. 궁금한 게 있으면 바로 물어보세요.
      </div>

      {/* 추천 질문 */}
      {questions.map((q, i) => (
        <button
          key={i}
          onClick={() => navigate('/coach', { state: { question: q } })}
          style={{
            width: '100%', background: '#F4FAF6',
            border: '0.5px solid #d4ede3', borderRadius: 8,
            padding: '8px 12px', fontSize: 12, color: '#085041',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: 6, cursor: 'pointer', textAlign: 'left',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#E8F7F1'}
          onMouseLeave={e => e.currentTarget.style.background = '#F4FAF6'}
        >
          <span style={{ flex: 1, marginRight: 8 }}>{q}</span>
          <span style={{ color: '#21C58E', flexShrink: 0 }}>→</span>
        </button>
      ))}

      {/* 직접 질문 */}
      <button
        onClick={() => navigate('/coach')}
        style={{
          width: '100%', background: '#F4FAF6',
          border: '0.5px solid #d4ede3', borderRadius: 8,
          padding: '8px 12px', fontSize: 12, color: '#888780',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          cursor: 'pointer',
        }}
        onMouseEnter={e => e.currentTarget.style.background = '#E8F7F1'}
        onMouseLeave={e => e.currentTarget.style.background = '#F4FAF6'}
      >
        직접 질문하기... <span style={{ color: '#21C58E' }}>→</span>
      </button>
    </div>
  );
}

/* ══ 성장 단계 카드 (우측 컬럼) ════════════════════════════ */
function GrowthCard({ profile, navigate, user, xpLoading, onAddXp }) {
  const xp  = profile?.xp ?? 0;
  const { currentLevel, nextLevel, xpNeeded, progressPercent } = getNextLevelInfo(xp);
  const currentIdx = LEVELS.findIndex(l => l.key === currentLevel.key);
  const econLevel  = profile?.economic_level;
  const econStyle  = econLevel ? ECON_LEVEL[econLevel] : null;

  return (
    <div style={CARD}>
      {/* 헤더 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontSize: 12, fontWeight: 500, color: '#888780' }}>성장 단계</span>
        <button
          onClick={() => navigate('/my-growth')}
          style={{ background: 'none', border: 'none', fontSize: 11, color: '#21C58E', cursor: 'pointer', fontWeight: 500 }}
        >
          자세히 →
        </button>
      </div>

      {/* 레벨 행 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 10,
          background: '#E1F5EE', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
        }}>
          {currentLevel.emoji}
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
            <p style={{ fontSize: 15, fontWeight: 500, color: '#085041' }}>{currentLevel.label}</p>
            {econStyle && (
              <span style={{ fontSize: 10, fontWeight: 500, background: econStyle.bg, color: econStyle.color, borderRadius: 4, padding: '1px 7px' }}>
                {econStyle.label}
              </span>
            )}
          </div>
          <p style={{ fontSize: 12, color: '#888780' }}>
            총 {xp} XP{nextLevel ? ` · 다음까지 ${xpNeeded} XP` : ' · 최고 단계'}
          </p>
        </div>
      </div>

      {/* XP 바 */}
      <div style={{ background: '#E1F5EE', borderRadius: 20, height: 6, marginBottom: 12 }}>
        <div style={{
          background: '#21C58E', borderRadius: 20, height: 6,
          width: `${progressPercent}%`, transition: 'width 0.6s ease',
        }} />
      </div>

      {/* 7단계 아이콘 행 */}
      <div style={{ display: 'flex', gap: 4 }}>
        {LEVELS.map((lv, i) => (
          <div key={lv.key} style={{
            flex: 1, height: 32, borderRadius: 8, fontSize: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: i < currentIdx ? '#E1F5EE'
                      : i === currentIdx ? '#21C58E'
                      : '#F1EFE8',
          }}>
            {lv.emoji}
          </div>
        ))}
      </div>

      {/* dev XP */}
      {user && (
        <div style={{ marginTop: 10, textAlign: 'center' }}>
          <button onClick={onAddXp} disabled={xpLoading} style={{ background: 'none', border: 'none', fontSize: 10, color: '#d4ede3', cursor: 'pointer', fontWeight: 500 }}>
            {xpLoading ? '처리 중...' : `⚡ +5 XP 테스트`}
          </button>
        </div>
      )}
    </div>
  );
}

/* ══ 오늘 할 것 카드 (우측 컬럼) ═══════════════════════════ */
function TodayCard({ actions, navigate }) {
  return (
    <div style={CARD}>
      <p style={{ fontSize: 12, fontWeight: 500, color: '#888780', marginBottom: 8 }}>오늘 해야 할 것</p>
      {actions.map((todo, i) => (
        <div
          key={todo.title}
          onClick={() => navigate(todo.path)}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 0', cursor: 'pointer',
            borderBottom: i < actions.length - 1 ? '0.5px solid #f0f7f3' : 'none',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#FAFFFE'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <div style={{
            width: 28, height: 28, borderRadius: 7, fontSize: 14, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: todo.iconBg,
          }}>
            {todo.icon}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 12, fontWeight: 500, color: '#2C2C2A' }}>{todo.title}</p>
            <p style={{ fontSize: 11, color: '#888780', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{todo.desc}</p>
          </div>
          <span style={{ color: '#C0DD97', fontSize: 14, flexShrink: 0 }}>→</span>
        </div>
      ))}
    </div>
  );
}

/* ══ 비로그인 성장 안내 카드 ═══════════════════════════════ */
function GuestGrowthCard({ navigate }) {
  return (
    <div style={{ ...CARD, textAlign: 'center', padding: '20px 16px' }}>
      <p style={{ fontSize: 28, marginBottom: 8 }}>🌱</p>
      <p style={{ fontSize: 14, fontWeight: 500, color: '#085041', marginBottom: 5 }}>성장 단계를 시작해보세요</p>
      <p style={{ fontSize: 12, color: '#888780', lineHeight: 1.6, marginBottom: 14 }}>로그인하면 XP가 쌓이고<br />경제 성장 단계가 올라가요.</p>
      <button
        onClick={() => navigate('/login')}
        style={{
          width: '100%', padding: '10px', borderRadius: 8,
          background: '#21C58E', color: '#fff',
          border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500,
        }}
      >
        로그인하기 →
      </button>
    </div>
  );
}

/* ══ 메인 ════════════════════════════════════════════════════ */
export default function HomePage() {
  const navigate                          = useNavigate();
  const { user, profile, refreshProfile } = useAuth();
  const [xpLoading, setXpLoading]         = useState(false);

  const bite     = getTodaysBite();
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
          gap: 12px;
        }
        .hd-col-main {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        @media (min-width: 760px) {
          .hd-col-main {
            flex-direction: row;
            align-items: start;
          }
          .hd-col-main > * { flex: 1; }
        }
        @media (min-width: 980px) {
          .hd-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 300px;
            grid-template-rows: auto auto;
            gap: 16px;
            align-items: start;
          }
          .hd-header   { grid-column: 1 / -1; }
          .hd-bite     { grid-column: 1; grid-row: 2; }
          .hd-noming   { grid-column: 2; grid-row: 2; }
          .hd-sidebar  { grid-column: 3; grid-row: 2; }
          .hd-col-main { display: contents; }
        }
      `}</style>

      <div className="anim-fade" style={{ background: '#F4FAF6', minHeight: 'calc(100vh - 52px)', padding: '20px 0 60px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 24px' }}>

          <div className="hd-grid">

            {/* ── 헤더 ── */}
            <div className="hd-header" style={{ paddingBottom: 4 }}>
              <p style={{ fontSize: 11, color: '#888780' }}>{today}</p>
              <h1 style={{ fontSize: 20, fontWeight: 500, color: '#085041', marginTop: 2, letterSpacing: '-0.5px' }}>
                {nickname}님의 경제 성장 대시보드
              </h1>
            </div>

            {/* 중간 너비에서 bite+noming 가로 묶음, PC에서는 contents로 풀림 */}
            <div className="hd-col-main">
              {/* ── 경제 한잎 ── */}
              <div className="hd-bite">
                <DailyBiteCard bite={bite} />
              </div>

              {/* ── 노밍 카드 ── */}
              <div className="hd-noming">
                <NomingCard bite={bite} profile={profile} navigate={navigate} />
              </div>
            </div>

            {/* ── 우측 사이드 컬럼 ── */}
            <div className="hd-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
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
            </div>

          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
