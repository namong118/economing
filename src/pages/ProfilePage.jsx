import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LEVELS, getNextLevelInfo } from '../data/levelData';
import PageWrapper from '../components/layout/PageWrapper';

/* ── 정적 매핑 ────────────────────────────────────────────── */
const ECONOMIC_LEVEL = {
  beginner:     { label: '초급자', emoji: '🌱', color: '#3B82F6', bg: '#EFF6FF', border: '#BFDBFE',
                  desc: '경제 공부를 이제 막 시작하시는 분' },
  intermediate: { label: '중급자', emoji: '📚', color: '#8B5CF6', bg: '#F5F3FF', border: '#DDD6FE',
                  desc: '기본 개념은 알고 더 깊이 배우고 싶은 분' },
  advanced:     { label: '고급자', emoji: '🔍', color: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A',
                  desc: '꾸준히 공부 중이며 심화 내용에 관심 있는 분' },
};
const INVESTMENT_EXP = {
  none:  { label: '투자 경험 없음',      emoji: '🤔' },
  etf:   { label: 'ETF 투자 경험 있음',  emoji: '📈' },
  stock: { label: '주식 투자 경험 있음', emoji: '💹' },
};
const OCCUPATION = {
  student:    { label: '학생',     emoji: '🎓' },
  employee:   { label: '직장인',   emoji: '💼' },
  freelancer: { label: '프리랜서', emoji: '💻' },
  business:   { label: '사업자',   emoji: '🏢' },
};
const PROVIDER_LABEL = {
  google: 'Google', kakao: '카카오', email: '이메일',
};

function generateAnalysis(profile) {
  const level     = profile?.economic_level;
  const exp       = profile?.investment_experience;
  const interests = profile?.interests ?? [];
  const has       = (k) => interests.includes(k);

  if (!level) return "온보딩을 완료하면 노밍의 맞춤 분석을 받을 수 있어요!";

  if (level === 'beginner') {
    if (has('투자') && has('저축'))
      return "저축과 투자 둘 다 관심이 있으시네요. 투자 전에 비상금을 먼저 마련하는 게 핵심이에요. 순서대로 함께 나아가봐요!";
    if (has('투자') || has('ETF 기초'))
      return "투자에 관심이 있으시군요. 먼저 비상금 3개월치를 파킹통장에 모아두고, 그다음 ETF 기초부터 시작해봐요.";
    if (has('저축'))
      return "저축부터 시작하는 건 최고의 선택이에요! 파킹통장과 적금 차이를 먼저 알아보면 바로 실천할 수 있어요.";
    if (has('소비 관리'))
      return "소비 관리에 관심이 있으시네요. 가계부 앱으로 한 달 지출을 파악하는 것부터 시작해봐요.";
    if (has('세금'))
      return "세금 공부, 정말 좋은 출발이에요! 연말정산 기초와 체크카드 공제율부터 알아두면 바로 도움이 돼요.";
    return "경제 공부, 이제 막 시작하셨군요. 지금 내 돈의 흐름을 파악하는 것부터 시작해보세요. 노밍이 순서대로 안내해드릴게요.";
  }
  if (level === 'intermediate') {
    if (exp === 'etf')   return "ETF 경험이 있으시네요! 적립식 투자를 꾸준히 이어가면서 IRP·연금저축 절세 전략도 함께 챙겨보세요.";
    if (exp === 'stock') return "주식 투자 경험도 있으시네요. 개별 종목 리스크를 줄이기 위해 ETF 비중을 늘려가는 전략을 고려해봐요.";
    if (has('부동산'))   return "중급자 단계에서 부동산에 관심이 있으시군요. 청약통장 관리와 부동산 기초 개념을 먼저 정리해봐요.";
    if (has('세금'))     return "세금을 챙기려는 마인드가 훌륭해요. IRP와 연금저축 조합으로 매년 세금을 절약해봐요.";
    return "어느 정도 기초가 잡혀 있으시네요! ETF 심화나 절세 전략 등 한 단계 깊은 내용에 도전해봐요.";
  }
  if (level === 'advanced') {
    if (has('세금'))     return "경험이 풍부하시네요! IRP·연금저축 절세 극대화와 금융소득 종합과세 대비를 점검해보면 좋을 것 같아요.";
    if (has('부동산'))   return "다양한 자산에 관심이 많으시네요. 포트폴리오 리밸런싱과 부동산 비중 조절 전략을 함께 살펴봐요.";
    if (exp === 'stock') return "꾸준히 공부해오신 게 느껴져요. 포트폴리오 다각화와 배당 전략을 함께 점검해봐요.";
    return "꾸준히 성장해오셨군요! 포트폴리오 리밸런싱과 절세 고도화에 집중해보면 더 큰 성과를 낼 수 있어요.";
  }
  return "노밍이 분석 중이에요. 온보딩을 완료하면 맞춤 코칭을 받을 수 있어요!";
}

/* ── 섹션 래퍼 ──────────────────────────────────────────── */
function Card({ children, style = {} }) {
  return (
    <div style={{
      background: '#fff', borderRadius: '18px',
      border: '1.5px solid #E8F5EF',
      padding: '20px', marginBottom: '12px',
      ...style,
    }}>
      {children}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <p style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', letterSpacing: '0.8px', marginBottom: '14px' }}>
      {children}
    </p>
  );
}

/* ── 개발자 정보 아코디언 ─────────────────────────────────── */
function DevInfo({ user, profile, provider }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginBottom: '12px' }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'none', border: '1.5px solid #E2E8F0',
          borderRadius: open ? '12px 12px 0 0' : '12px',
          padding: '12px 16px', cursor: 'pointer',
        }}
      >
        <span style={{ fontSize: '13px', fontWeight: '600', color: '#94A3B8' }}>🛠 개발자 정보 보기</span>
        <span style={{ fontSize: '12px', color: '#CBD5E1', fontWeight: '600' }}>{open ? '닫기 ↑' : '펼치기 ↓'}</span>
      </button>
      {open && (
        <div style={{ border: '1.5px solid #E2E8F0', borderTop: 'none', borderRadius: '0 0 12px 12px', overflow: 'hidden' }}>
          {[
            { k: 'user.id',    v: user?.id },
            { k: 'email',      v: user?.email || '(소셜 로그인)' },
            { k: 'provider',   v: provider },
            { k: 'level',      v: profile?.level },
            { k: 'xp',         v: String(profile?.xp ?? 0) },
            { k: 'created_at', v: profile?.created_at?.slice(0, 10) },
          ].map(({ k, v }) => (
            <div key={k} style={{ display: 'flex', gap: '12px', padding: '10px 16px', borderBottom: '1px solid #F1F5F9' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', fontFamily: 'monospace', minWidth: '100px', flexShrink: 0 }}>{k}</span>
              <span style={{ fontSize: '12px', color: '#374151', fontFamily: 'monospace', wordBreak: 'break-all' }}>{v}</span>
            </div>
          ))}
          <details style={{ padding: '10px 16px' }}>
            <summary style={{ fontSize: '11px', color: '#94A3B8', cursor: 'pointer', fontWeight: '700', fontFamily: 'monospace' }}>user_metadata</summary>
            <pre style={{ margin: '8px 0 0', fontSize: '11px', color: '#374151', lineHeight: '1.6', overflowX: 'auto' }}>
              {JSON.stringify(user?.user_metadata, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}

/* ── 메인 ─────────────────────────────────────────────────── */
export default function ProfilePage() {
  const navigate   = useNavigate();
  const { user, profile, signOut } = useAuth();
  const BASE_URL   = import.meta.env.BASE_URL;

  if (!user) {
    return (
      <PageWrapper>
        <div style={{ padding: '80px 24px', textAlign: 'center' }}>
          <p style={{ color: '#64748B', marginBottom: '16px' }}>로그인이 필요해요.</p>
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '12px 28px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #52C97A, #1AAD7D)',
              color: '#fff', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '14px',
            }}
          >
            로그인하기
          </button>
        </div>
      </PageWrapper>
    );
  }

  const provider   = user?.app_metadata?.provider || user?.identities?.[0]?.provider || 'unknown';
  const xp         = profile?.xp ?? 0;
  const levelInfo  = getNextLevelInfo(xp);
  const { currentLevel, nextLevel, xpNeeded, progressPercent } = levelInfo;
  const stageIndex = LEVELS.findIndex(l => l.key === currentLevel.key);
  const econInfo   = ECONOMIC_LEVEL[profile?.economic_level] ?? null;
  const invInfo    = INVESTMENT_EXP[profile?.investment_experience] ?? null;
  const occInfo    = OCCUPATION[profile?.occupation] ?? null;
  const interests  = profile?.interests ?? [];
  const isOnboarded = profile?.onboarding_completed === true;

  const handleSignOut = async () => { await signOut(); navigate('/home'); };

  return (
    <PageWrapper>
      <div style={{ background: '#F2FBF5', minHeight: 'calc(100vh - 64px)', padding: '32px 0 64px' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto', padding: '0 20px' }}>

          {/* ── 페이지 제목 ─────────────────────────────── */}
          <h1 style={{ fontSize: '26px', fontWeight: '900', color: '#0F172A', letterSpacing: '-0.8px', marginBottom: '20px' }}>
            경제 프로필
          </h1>

          {/* ══ 섹션 1: 프로필 헤더 ══════════════════════ */}
          <div style={{
            background: 'linear-gradient(145deg, #fff, #F9FEFB)',
            border: '1.5px solid #DCF5EB',
            borderRadius: '22px', padding: '24px',
            display: 'flex', alignItems: 'center', gap: '18px',
            marginBottom: '12px',
          }}>
            {/* 아바타 */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="프로필"
                  style={{ width: '68px', height: '68px', borderRadius: '50%', objectFit: 'cover',
                    border: '3px solid #fff', boxShadow: '0 4px 14px rgba(33,197,142,0.2)' }}
                />
              ) : (
                <div style={{
                  width: '68px', height: '68px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #52C97A, #1AAD7D)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '28px', color: '#fff', fontWeight: '700',
                  border: '3px solid #fff', boxShadow: '0 4px 14px rgba(33,197,142,0.2)',
                }}>
                  {(profile?.nickname || user.email || '?')[0].toUpperCase()}
                </div>
              )}
              <div style={{
                position: 'absolute', bottom: '-2px', right: '-2px',
                background: '#52C97A', borderRadius: '100px',
                fontSize: '11px', padding: '2px 6px',
                border: '2px solid #fff', color: '#fff', fontWeight: '700', lineHeight: '1.4',
              }}>
                {currentLevel.emoji}
              </div>
            </div>
            {/* 텍스트 */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 style={{ fontSize: '21px', fontWeight: '900', color: '#0F172A', letterSpacing: '-0.6px', marginBottom: '4px' }}>
                {profile?.nickname || user.email || '사용자'}
              </h2>
              <p style={{ fontSize: '14px', color: '#64748B', fontWeight: '500', marginBottom: '10px' }}>
                {currentLevel.emoji} {currentLevel.label} 단계 · {xp} XP
              </p>
              {/* 미니 진행률 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ flex: 1, height: '6px', background: '#E2E8F0', borderRadius: '100px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: '100px',
                    background: 'linear-gradient(90deg, #52C97A, #1AAD7D)',
                    width: `${progressPercent}%`, transition: 'width 0.6s ease',
                  }} />
                </div>
                {nextLevel && (
                  <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '600', whiteSpace: 'nowrap' }}>
                    {nextLevel.emoji} {xpNeeded} XP
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ══ 섹션 2: 성장 현황 ═════════════════════════ */}
          <Card>
            <SectionLabel>성장 현황</SectionLabel>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <span style={{ fontSize: '36px' }}>{currentLevel.emoji}</span>
              <div>
                <p style={{ fontSize: '19px', fontWeight: '900', color: '#0F172A', letterSpacing: '-0.5px' }}>
                  {currentLevel.label} 단계
                </p>
                <p style={{ fontSize: '13px', color: '#64748B', fontWeight: '500' }}>
                  {xp} XP 획득
                  {nextLevel ? ` · ${nextLevel.label}까지 ${xpNeeded} XP 남음` : ' · 🏆 최고 단계 달성!'}
                </p>
              </div>
            </div>
            {/* 진행률 바 */}
            <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '100px', overflow: 'hidden', marginBottom: '14px' }}>
              <div style={{
                height: '100%', borderRadius: '100px',
                background: 'linear-gradient(90deg, #52C97A, #1AAD7D)',
                width: `${progressPercent}%`, transition: 'width 0.6s ease',
              }} />
            </div>
            {/* 7단계 시각화 */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {LEVELS.map((l, i) => {
                const isCurrent = l.key === currentLevel.key;
                const isPast    = i < stageIndex;
                return (
                  <div key={l.key} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <div
                      title={l.label}
                      style={{
                        width: isCurrent ? '30px' : '22px',
                        height: isCurrent ? '30px' : '22px',
                        borderRadius: '50%', flexShrink: 0,
                        background: isCurrent ? '#52C97A' : isPast ? '#DCF5EB' : '#F2FBF5',
                        border: isCurrent ? '2px solid #fff' : isPast ? '1.5px solid #A7F3D0' : '1.5px solid #E2E8F0',
                        boxShadow: isCurrent ? '0 0 0 3px rgba(33,197,142,0.2)' : 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: isCurrent ? '15px' : '11px', cursor: 'default',
                      }}
                    >
                      {l.emoji}
                    </div>
                    {i < LEVELS.length - 1 && (
                      <div style={{
                        flex: 1, height: '2px', margin: '0 2px',
                        background: isPast ? '#52C97A' : '#E2E8F0', borderRadius: '2px',
                      }} />
                    )}
                  </div>
                );
              })}
            </div>
            {/* 단계 이름 힌트 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
              <span style={{ fontSize: '10px', color: '#CBD5E1', fontWeight: '600' }}>{LEVELS[0].label}</span>
              <span style={{ fontSize: '10px', color: '#CBD5E1', fontWeight: '600' }}>{LEVELS[LEVELS.length - 1].label}</span>
            </div>
          </Card>

          {/* ══ 섹션 3: 경제 프로필 ══════════════════════ */}
          {isOnboarded ? (
            <Card>
              <SectionLabel>경제 프로필</SectionLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

                {/* 경제 수준 */}
                {econInfo && (
                  <div style={{
                    background: econInfo.bg, border: `1.5px solid ${econInfo.border}`,
                    borderRadius: '14px', padding: '14px 16px',
                    display: 'flex', alignItems: 'center', gap: '12px',
                  }}>
                    <span style={{ fontSize: '26px' }}>{econInfo.emoji}</span>
                    <div>
                      <p style={{ fontSize: '12px', fontWeight: '700', color: '#94A3B8', marginBottom: '2px', letterSpacing: '0.4px' }}>경제 수준</p>
                      <p style={{ fontSize: '15px', fontWeight: '800', color: econInfo.color }}>{econInfo.label}</p>
                      <p style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>{econInfo.desc}</p>
                    </div>
                  </div>
                )}

                {/* 투자 경험 + 현재 상황 */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div style={{
                    background: '#F8FAFC', border: '1.5px solid #E2E8F0',
                    borderRadius: '12px', padding: '12px 14px',
                    display: 'flex', alignItems: 'center', gap: '10px',
                  }}>
                    <span style={{ fontSize: '22px' }}>{invInfo?.emoji ?? '❓'}</span>
                    <div>
                      <p style={{ fontSize: '10px', fontWeight: '700', color: '#94A3B8', marginBottom: '2px', letterSpacing: '0.4px' }}>투자 경험</p>
                      <p style={{ fontSize: '13px', fontWeight: '700', color: '#0F172A' }}>{invInfo?.label ?? '미설정'}</p>
                    </div>
                  </div>
                  <div style={{
                    background: '#F8FAFC', border: '1.5px solid #E2E8F0',
                    borderRadius: '12px', padding: '12px 14px',
                    display: 'flex', alignItems: 'center', gap: '10px',
                  }}>
                    <span style={{ fontSize: '22px' }}>{occInfo?.emoji ?? '❓'}</span>
                    <div>
                      <p style={{ fontSize: '10px', fontWeight: '700', color: '#94A3B8', marginBottom: '2px', letterSpacing: '0.4px' }}>현재 상황</p>
                      <p style={{ fontSize: '13px', fontWeight: '700', color: '#0F172A' }}>{occInfo?.label ?? '미설정'}</p>
                    </div>
                  </div>
                </div>

                {/* 관심 분야 */}
                <div style={{ paddingTop: '2px' }}>
                  <p style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', letterSpacing: '0.6px', marginBottom: '10px' }}>
                    관심 분야
                  </p>
                  {interests.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
                      {interests.map(tag => (
                        <span key={tag} style={{
                          fontSize: '13px', fontWeight: '700', color: '#52C97A',
                          background: '#F2FBF5', border: '1.5px solid #DCF5EB',
                          borderRadius: '100px', padding: '5px 13px',
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize: '13px', color: '#94A3B8' }}>관심 분야가 설정되지 않았어요.</p>
                  )}
                </div>

                {/* 프로필 수정 버튼 */}
                <button
                  onClick={() => navigate('/onboarding')}
                  style={{
                    marginTop: '4px', padding: '10px', borderRadius: '12px', width: '100%',
                    background: 'none', color: '#64748B', border: '1.5px solid #E2E8F0',
                    fontSize: '13px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#52C97A'; e.currentTarget.style.color = '#52C97A'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.color = '#64748B'; }}
                >
                  ✏️ 경제 프로필 다시 설정
                </button>
              </div>
            </Card>
          ) : (
            /* ══ 섹션 5: 온보딩 미완료 ══════════════════ */
            <div style={{
              background: '#fff', borderRadius: '18px', border: '1.5px dashed #A7F3D0',
              padding: '32px 24px', textAlign: 'center', marginBottom: '12px',
            }}>
              <img
                src={`${BASE_URL}noming.png`}
                alt="노밍"
                style={{ width: '52px', height: '52px', objectFit: 'contain', margin: '0 auto 12px', display: 'block' }}
              />
              <p style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', marginBottom: '6px', letterSpacing: '-0.4px' }}>
                경제 성장 진단을 완료해보세요
              </p>
              <p style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.7', marginBottom: '20px' }}>
                온보딩을 완료하면 노밍이<br />나에게 딱 맞는 코칭을 시작해요.
              </p>
              <button
                onClick={() => navigate('/diagnosis')}
                style={{
                  padding: '12px 28px', borderRadius: '12px',
                  background: 'linear-gradient(135deg, #52C97A, #1AAD7D)',
                  color: '#fff', border: 'none', fontSize: '14px', fontWeight: '800',
                  cursor: 'pointer', boxShadow: '0 4px 14px rgba(33,197,142,0.3)',
                }}
              >
                진단 시작하기 →
              </button>
            </div>
          )}

          {/* ══ 섹션 4: 노밍 분석 ════════════════════════ */}
          {isOnboarded && (
            <div style={{
              background: 'linear-gradient(145deg, #FFFBEA, #FFF4CC)',
              border: '1.5px solid #FFE08A',
              borderRadius: '18px', padding: '18px 20px',
              display: 'flex', gap: '14px', alignItems: 'flex-start',
              marginBottom: '12px',
            }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <img
                  src={`${BASE_URL}noming.png`}
                  alt="노밍"
                  style={{ width: '44px', height: '44px', objectFit: 'contain' }}
                />
                <div style={{
                  position: 'absolute', bottom: '-2px', right: '-2px',
                  width: '12px', height: '12px', borderRadius: '50%',
                  background: '#52C97A', border: '2px solid #FFFBEA',
                }} />
              </div>
              <div>
                <p style={{ fontSize: '11px', fontWeight: '700', color: '#B45309', marginBottom: '5px', letterSpacing: '0.3px' }}>
                  노밍의 한 줄 분석
                </p>
                <p style={{ fontSize: '14px', color: '#78350F', lineHeight: '1.7', fontWeight: '500', letterSpacing: '-0.3px' }}>
                  {generateAnalysis(profile)}
                </p>
                <button
                  onClick={() => navigate('/coach')}
                  style={{
                    marginTop: '12px', padding: '8px 16px', borderRadius: '100px',
                    background: '#52C97A', color: '#fff', border: 'none',
                    fontSize: '12px', fontWeight: '700', cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(33,197,142,0.35)',
                  }}
                >
                  노밍에게 더 물어보기 →
                </button>
              </div>
            </div>
          )}

          {/* ══ 섹션 6: 개발자 정보 ══════════════════════ */}
          <DevInfo user={user} profile={profile} provider={provider} />

          {/* ── 로그아웃 ──────────────────────────────── */}
          <button
            onClick={handleSignOut}
            style={{
              width: '100%', padding: '13px', borderRadius: '14px',
              background: '#FEF2F2', color: '#DC2626',
              border: '1.5px solid #FECACA', fontSize: '14px',
              fontWeight: '700', cursor: 'pointer',
            }}
          >
            로그아웃
          </button>

        </div>
      </div>
    </PageWrapper>
  );
}
