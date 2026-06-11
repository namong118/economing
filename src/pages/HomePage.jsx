import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { addXp } from '../services/profileService';
import { getNextLevelInfo } from '../data/levelData';
import PageWrapper from '../components/layout/PageWrapper';
import DailyBiteCard from '../components/home/DailyBiteCard';

/* ── 시간대별 인사말 ──────────────────────────────────────── */
function getGreeting() {
  const h = new Date().getHours();
  if (h >= 6  && h < 12) return { text: '좋은 아침이에요!', emoji: '🌅' };
  if (h >= 12 && h < 18) return { text: '안녕하세요!',     emoji: '☀️' };
  if (h >= 18 && h < 22) return { text: '오늘도 수고하셨어요!', emoji: '🌆' };
  return { text: '늦은 시간까지 공부하시네요!', emoji: '🌙' };
}

/* ── 노밍 코치 멘트 (사용자 상태 기반) ────────────────────── */
function getNomingMessage(profile) {
  if (!profile?.onboarding_completed) {
    return '무엇부터 시작해야 할지 모르겠다면, 먼저 경제 프로필을 설정해봐요. 딱 2분이면 돼요.';
  }
  const name = profile?.nickname?.split(' ')[0] ?? '';
  const levelMsgs = {
    seed:    '첫걸음이 가장 중요해요. 오늘 작은 것 하나씩 시작해봐요.',
    sprout:  '잘 하고 있어요! 꾸준히 이어가면 금방 성장할 거예요.',
    leaf:    '경제 공부에 흥미가 생기기 시작했죠? 이제 더 재밌어질 거예요.',
    flower:  '좋은 흐름이에요. 오늘도 한 가지씩 배워봐요.',
    fruit:   '실력이 쌓이고 있어요. 꾸준함이 최고의 전략이에요.',
    tree:    '여기까지 온 것만으로도 대단해요. 계속 나아가봐요!',
    forest:  '이미 훌륭한 경제 감각을 갖추셨어요. 다음 목표를 세워봐요!',
  };
  return levelMsgs[profile?.level] ?? '오늘도 함께 성장해봐요.';
}

/* ── 추천 행동 목록 (사용자 상태 기반) ────────────────────── */
function getActions(profile, isLoggedIn) {
  const onboarded = profile?.onboarding_completed;

  const COACH = {
    id:    'coach',
    icon:  '☀️',
    color: { text: '#92400E', bg: 'linear-gradient(145deg,#FFFBEA,#FFF4CC)', border: '#FFE08A', btn: '#FFC83D', btnText: '#78350F', btnShadow: 'rgba(255,200,61,0.4)' },
    title: 'AI 코치에게 물어보기',
    desc:  '지금 궁금한 경제 질문을 노밍에게 바로 물어보세요.',
    cta:   'AI 코치 시작',
    path:  '/coach',
  };
  const READ = {
    id:    'read',
    icon:  '📖',
    color: { text: '#166534', bg: 'linear-gradient(145deg,#F0FDF4,#DCFCE7)', border: '#A7F3D0', btn: '#21C58E', btnText: '#fff', btnShadow: 'rgba(33,197,142,0.35)' },
    title: '오늘의 경제 읽기',
    desc:  '3분 만에 경제 개념 하나를 쉽게 배워봐요.',
    cta:   '읽기 시작',
    path:  '/read',
  };
  const DIARY = {
    id:    'diary',
    icon:  '✏️',
    color: { text: '#1E40AF', bg: 'linear-gradient(145deg,#EFF6FF,#DBEAFE)', border: '#BFDBFE', btn: '#3B82F6', btnText: '#fff', btnShadow: 'rgba(59,130,246,0.3)' },
    title: '경제 일기 작성하기',
    desc:  '오늘 배운 내용을 짧게 기록해두면 오래 기억돼요.',
    cta:   '기록하기',
    path:  '/diary',
    requireLogin: true,
  };
  const ONBOARDING = {
    id:    'onboarding',
    icon:  '🌱',
    color: { text: '#166534', bg: 'linear-gradient(145deg,#F0FDF4,#DCFCE7)', border: '#A7F3D0', btn: '#21C58E', btnText: '#fff', btnShadow: 'rgba(33,197,142,0.35)' },
    title: '경제 프로필 설정하기',
    desc:  '2분이면 완료돼요. 노밍이 딱 맞는 코칭 방향을 잡아드려요.',
    cta:   '지금 설정하기',
    path:  '/onboarding',
  };

  if (!isLoggedIn) return [COACH, READ];
  if (!onboarded)  return [ONBOARDING, COACH, READ];
  return [COACH, READ, DIARY];
}

/* ── 개별 액션 카드 ───────────────────────────────────────── */
function ActionCard({ action, index, navigate, profile }) {
  const c  = action.color;
  const [hov, setHov] = useState(false);

  return (
    <div
      style={{
        background: c.bg,
        border: `1.5px solid ${c.border}`,
        borderRadius: '20px', padding: '22px 24px',
        display: 'flex', alignItems: 'center', gap: '16px',
        transition: 'transform 0.15s, box-shadow 0.15s',
        transform: hov ? 'translateY(-2px)' : 'none',
        boxShadow: hov ? `0 8px 24px ${c.btnShadow}` : 'none',
        cursor: 'default',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* 순서 번호 + 아이콘 */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '14px',
          background: 'rgba(255,255,255,0.7)',
          border: `1.5px solid ${c.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '20px',
        }}>
          {action.icon}
        </div>
        <span style={{ fontSize: '10px', fontWeight: '800', color: c.text, opacity: 0.6 }}>
          {index + 1}순위
        </span>
      </div>

      {/* 텍스트 */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#0F172A', letterSpacing: '-0.5px', marginBottom: '4px' }}>
          {action.title}
        </h3>
        <p style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.5', fontWeight: '500' }}>
          {action.desc}
        </p>
      </div>

      {/* CTA 버튼 */}
      <button
        onClick={() => navigate(action.path)}
        style={{
          flexShrink: 0,
          padding: '10px 18px', borderRadius: '12px',
          background: c.btn, color: c.btnText,
          border: 'none', fontSize: '13px', fontWeight: '800',
          cursor: 'pointer', whiteSpace: 'nowrap',
          boxShadow: `0 4px 12px ${c.btnShadow}`,
          transition: 'all 0.15s', letterSpacing: '-0.3px',
        }}
      >
        {action.cta} →
      </button>
    </div>
  );
}

/* ── XP 진행 스트립 (컴팩트) ──────────────────────────────── */
function GrowthStrip({ profile, navigate }) {
  const xp        = profile?.xp ?? 0;
  const levelInfo = getNextLevelInfo(xp);
  const { currentLevel, nextLevel, xpNeeded, progressPercent } = levelInfo;

  return (
    <button
      onClick={() => navigate('/profile')}
      style={{
        width: '100%', background: '#fff',
        border: '1.5px solid #DCF5EB', borderRadius: '16px',
        padding: '16px 20px', cursor: 'pointer', textAlign: 'left',
        transition: 'all 0.15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = '#A7F3D0'; e.currentTarget.style.background = '#FAFFFE'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#DCF5EB'; e.currentTarget.style.background = '#fff'; }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '24px' }}>{currentLevel.emoji}</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.4px' }}>
              {currentLevel.label} 단계 · {xp} XP
            </span>
            <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '600' }}>
              내 경제 프로필 →
            </span>
          </div>
          <div style={{ height: '6px', background: '#F1F5F9', borderRadius: '100px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: '100px',
              background: 'linear-gradient(90deg, #21C58E, #1AAD7D)',
              width: `${progressPercent}%`, transition: 'width 0.6s ease',
            }} />
          </div>
          {nextLevel && (
            <p style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px', fontWeight: '600' }}>
              {nextLevel.emoji} {nextLevel.label}까지 {xpNeeded} XP 남음
            </p>
          )}
        </div>
      </div>
    </button>
  );
}

/* ── 메인 ─────────────────────────────────────────────────── */
export default function HomePage() {
  const navigate           = useNavigate();
  const { user, profile, refreshProfile } = useAuth();
  const [xpLoading, setXpLoading] = useState(false);
  const BASE_URL           = import.meta.env.BASE_URL;

  const greeting  = getGreeting();
  const nickname  = profile?.nickname?.split(' ')[0] || (user ? '사용자' : '방문자');
  const message   = getNomingMessage(profile);
  const actions   = getActions(profile, !!user);

  const handleAddXp = async () => {
    if (!user || xpLoading) return;
    setXpLoading(true);
    await addXp(user.id, 5);
    await refreshProfile();
    setXpLoading(false);
  };

  return (
    <PageWrapper>
      <div
        className="anim-fade"
        style={{ background: '#F4FAF6', minHeight: 'calc(100vh - 64px)', padding: '32px 0 64px' }}
      >
        <div style={{ maxWidth: '680px', margin: '0 auto', padding: '0 20px' }}>

          {/* ══ 오늘의 경제 한잎 ══════════════════════════ */}
          <DailyBiteCard />

          {/* ══ 노밍 그리팅 ══════════════════════════════ */}
          <div style={{
            background: 'linear-gradient(145deg, #FFFBEA, #FFF4CC)',
            border: '1.5px solid #FFE08A',
            borderRadius: '22px', padding: '24px',
            display: 'flex', gap: '16px', alignItems: 'flex-start',
            marginBottom: '24px',
          }}>
            {/* 노밍 아바타 */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <img
                src={`${BASE_URL}coach.png`}
                alt="노밍"
                style={{ width: '56px', height: '56px', borderRadius: '16px', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute', bottom: '-2px', right: '-2px',
                width: '14px', height: '14px', borderRadius: '50%',
                background: '#21C58E', border: '2.5px solid #FFFBEA',
              }} />
            </div>

            {/* 멘트 */}
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '12px', fontWeight: '700', color: '#B45309', marginBottom: '6px', letterSpacing: '0.3px' }}>
                {greeting.emoji} 노밍 · AI 경제 코치
              </p>
              <p style={{ fontSize: '17px', fontWeight: '900', color: '#0F172A', letterSpacing: '-0.6px', lineHeight: '1.4', marginBottom: '8px' }}>
                {greeting.text} {nickname}님.
              </p>
              <p style={{ fontSize: '14px', color: '#78350F', lineHeight: '1.7', fontWeight: '500', letterSpacing: '-0.2px' }}>
                {message}
              </p>
            </div>
          </div>

          {/* ══ 추천 행동 카드 ══════════════════════════ */}
          <div style={{ marginBottom: '24px' }}>
            <p style={{
              fontSize: '13px', fontWeight: '800', color: '#64748B',
              letterSpacing: '0.3px', marginBottom: '12px',
            }}>
              오늘 노밍이 추천해요
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {actions.map((action, i) => (
                <ActionCard
                  key={action.id}
                  action={action}
                  index={i}
                  navigate={navigate}
                  profile={profile}
                />
              ))}
            </div>
          </div>

          {/* ══ 성장 현황 스트립 (로그인 시) ════════════ */}
          {user && profile && (
            <GrowthStrip profile={profile} navigate={navigate} />
          )}

          {/* ══ 비로그인 CTA ════════════════════════════ */}
          {!user && (
            <div style={{
              background: '#fff', border: '1.5px solid #DCF5EB',
              borderRadius: '16px', padding: '20px 22px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
            }}>
              <div>
                <p style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.4px', marginBottom: '3px' }}>
                  XP를 모아 성장해보세요
                </p>
                <p style={{ fontSize: '12px', color: '#64748B' }}>
                  로그인하면 읽기 완료마다 +5 XP 지급
                </p>
              </div>
              <button
                onClick={() => navigate('/login')}
                style={{
                  flexShrink: 0, padding: '10px 18px', borderRadius: '12px',
                  background: 'linear-gradient(135deg, #21C58E, #1AAD7D)',
                  color: '#fff', border: 'none', fontSize: '13px', fontWeight: '700',
                  cursor: 'pointer', whiteSpace: 'nowrap',
                  boxShadow: '0 3px 10px rgba(33,197,142,0.3)',
                }}
              >
                로그인
              </button>
            </div>
          )}

          {/* ══ 개발 테스트 (XP) ════════════════════════ */}
          {user && (
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <button
                onClick={handleAddXp}
                disabled={xpLoading}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '11px', color: '#CBD5E1', fontWeight: '600',
                  padding: '4px 8px',
                }}
              >
                {xpLoading ? '처리 중...' : `⚡ +5 XP 테스트 (현재 ${profile?.xp ?? 0} XP)`}
              </button>
            </div>
          )}

        </div>
      </div>
    </PageWrapper>
  );
}
