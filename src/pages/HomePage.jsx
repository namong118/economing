import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { addXp } from '../services/profileService';
import { LEVELS, getNextLevelInfo } from '../data/levelData';
import PageWrapper from '../components/layout/PageWrapper';

const MISSIONS = [
  { emoji: '📖', label: '경제 개념 하나 배우기',    path: '/dictionary', done: false },
  { emoji: '🗺️', label: '로드맵 한 단계 진행하기', path: '/roadmap',    done: true  },
  { emoji: '✏️', label: '경제 일기 작성하기',       path: '/diary',      done: false },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();
  const [xpLoading, setXpLoading] = useState(false);

  const nickname = profile?.nickname || (user ? '사용자' : '방문자');
  const xp       = profile?.xp ?? 0;
  const levelInfo = getNextLevelInfo(xp);
  const { currentLevel, nextLevel, xpProgress, xpTotal, xpNeeded, progressPercent } = levelInfo;
  const stageIndex = LEVELS.findIndex(l => l.key === currentLevel.key);

  /* 개발 테스트용 XP 버튼 */
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
        <div style={{ maxWidth: '880px', margin: '0 auto', padding: '0 24px' }}>

          {/* ══ 1. HERO ══════════════════════════════════════ */}
          <div style={{
            background: 'linear-gradient(135deg, #21C58E 0%, #1AAD7D 60%, #138F68 100%)',
            borderRadius: '24px', padding: '32px 36px',
            marginBottom: '16px', position: 'relative', overflow: 'hidden',
          }}>
            {[
              { w: 200, h: 200, top: '-60px',  right: '80px',  op: 0.08 },
              { w: 120, h: 120, top: '20px',   right: '-20px', op: 0.12 },
              { w: 80,  h: 80,  bottom: '-20px', left: '60%',  op: 0.06 },
            ].map((c, i) => (
              <div key={i} style={{
                position: 'absolute', width: c.w, height: c.h, borderRadius: '50%',
                background: `rgba(255,255,255,${c.op})`,
                top: c.top, right: c.right, bottom: c.bottom, left: c.left,
                pointerEvents: 'none',
              }} />
            ))}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.75)', marginBottom: '8px' }}>
                ✨ AI 경제 성장 코치
              </p>
              <h1 style={{
                fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: '900',
                color: '#fff', letterSpacing: '-1.2px', lineHeight: '1.25', marginBottom: '10px',
              }}>
                {nickname}님의<br />경제 성장 여정
              </h1>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.75)', marginBottom: '20px' }}>
                작은 배움이 큰 변화를 만듭니다.
              </p>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.25)',
                borderRadius: '100px', padding: '8px 18px',
              }}>
                <span style={{ fontSize: '20px' }}>{currentLevel.emoji}</span>
                <span style={{ fontSize: '15px', fontWeight: '700', color: '#fff' }}>
                  {currentLevel.label} 단계
                </span>
                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', marginLeft: '4px' }}>
                  {xp} XP
                </span>
              </div>
            </div>
          </div>

          {/* ══ 2. XP 진행도 카드 ══════════════════════════ */}
          <div style={{
            background: '#fff', borderRadius: '20px',
            border: '1.5px solid #DCF5EB',
            padding: '20px 24px', marginBottom: '16px',
          }}>
            {/* 상단: 현재 단계 & 다음 단계 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '28px' }}>{currentLevel.emoji}</span>
                <div>
                  <p style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.4px' }}>
                    {currentLevel.label} 단계
                  </p>
                  <p style={{ fontSize: '12px', color: '#64748B', marginTop: '1px' }}>
                    총 {xp} XP 획득
                  </p>
                </div>
              </div>
              {nextLevel ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '500' }}>다음 단계</span>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    background: '#F4FAF6', border: '1px solid #DCF5EB',
                    borderRadius: '100px', padding: '4px 12px',
                  }}>
                    <span style={{ fontSize: '16px' }}>{nextLevel.emoji}</span>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#21C58E' }}>
                      {nextLevel.label}
                    </span>
                  </div>
                </div>
              ) : (
                <span style={{
                  fontSize: '12px', fontWeight: '700', color: '#FFC83D',
                  background: '#FFFBEB', border: '1px solid #FFE08A',
                  borderRadius: '100px', padding: '4px 12px',
                }}>
                  ✨ 최고 단계 달성!
                </span>
              )}
            </div>

            {/* 진행률 바 */}
            <div style={{ marginBottom: '8px' }}>
              <div style={{
                height: '10px', background: '#F1F5F9', borderRadius: '100px', overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%', borderRadius: '100px',
                  background: 'linear-gradient(90deg, #21C58E, #1AAD7D)',
                  width: `${progressPercent}%`,
                  transition: 'width 0.6s ease',
                  boxShadow: '0 2px 6px rgba(33,197,142,0.4)',
                }} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: '#64748B' }}>
                {nextLevel ? `${xpProgress} / ${xpTotal} XP` : '모든 단계 완료'}
              </span>
              {nextLevel && (
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#21C58E' }}>
                  {xpNeeded} XP 더 모으면 {nextLevel.label} 단계!
                </span>
              )}
            </div>

            {/* 단계 아이콘 라인 */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginTop: '20px', paddingTop: '16px',
              borderTop: '1px solid #F1F5F9',
            }}>
              {LEVELS.map((l, i) => {
                const isCurrent = l.key === currentLevel.key;
                const isPast    = i < stageIndex;
                return (
                  <div key={l.key} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flex: '0 0 auto' }}>
                      <div style={{
                        width: isCurrent ? '44px' : '34px',
                        height: isCurrent ? '44px' : '34px',
                        borderRadius: '50%',
                        background: isCurrent ? '#21C58E' : isPast ? '#DCF5EB' : '#F4FAF6',
                        border: isCurrent ? '3px solid #fff' : isPast ? '2px solid #A7F3D0' : '2px solid #E2E8F0',
                        boxShadow: isCurrent ? '0 0 0 4px rgba(33,197,142,0.2)' : 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: isCurrent ? '20px' : '16px',
                        transition: 'all 0.3s',
                      }}>
                        {l.emoji}
                      </div>
                      <span style={{
                        fontSize: '9px', fontWeight: isCurrent ? '800' : '500',
                        color: isCurrent ? '#21C58E' : '#94A3B8',
                      }}>
                        {l.label}
                      </span>
                    </div>
                    {i < LEVELS.length - 1 && (
                      <div style={{
                        flex: 1, height: '2px', margin: '0 3px',
                        background: isPast ? '#21C58E' : '#E2E8F0',
                        marginBottom: '14px', borderRadius: '2px',
                      }} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* 개발용 XP 테스트 버튼 */}
            {user && (
              <div style={{
                marginTop: '14px', paddingTop: '14px',
                borderTop: '1px dashed #E2E8F0',
                display: 'flex', alignItems: 'center', gap: '10px',
              }}>
                <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '600' }}>개발 테스트</span>
                <button
                  onClick={handleAddXp}
                  disabled={xpLoading}
                  style={{
                    padding: '6px 14px', borderRadius: '8px',
                    background: xpLoading ? '#E2E8F0' : '#FFC83D',
                    color: xpLoading ? '#94A3B8' : '#78350F',
                    border: 'none', fontSize: '12px', fontWeight: '700',
                    cursor: xpLoading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {xpLoading ? '처리 중...' : '⚡ +5 XP 테스트'}
                </button>
                <span style={{ fontSize: '11px', color: '#CBD5E1' }}>현재 {xp} XP</span>
              </div>
            )}
          </div>

          {/* ══ 3+4. 노밍 + 미션 2컬럼 ════════════════════ */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }} className="home-grid">

            {/* 노밍 코칭 카드 */}
            <div style={{
              background: 'linear-gradient(145deg, #FFFBEA, #FFF4CC)',
              border: '1.5px solid #FFE08A',
              borderRadius: '20px', padding: '24px',
              display: 'flex', flexDirection: 'column', gap: '16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img
                  src={`${import.meta.env.BASE_URL}coach.png`}
                  alt="노밍"
                  style={{ width: '48px', height: '48px', borderRadius: '14px', objectFit: 'cover', flexShrink: 0 }}
                />
                <div>
                  <p style={{ fontSize: '13px', fontWeight: '800', color: '#92400E' }}>☀️ 노밍</p>
                  <p style={{ fontSize: '11px', color: '#B45309', marginTop: '1px' }}>AI 경제 코치</p>
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.6)', borderRadius: '14px', padding: '14px 16px' }}>
                <p style={{ fontSize: '15px', fontWeight: '700', color: '#78350F', lineHeight: '1.6', letterSpacing: '-0.4px' }}>
                  좋은 아침이에요! 🌅<br />
                  <span style={{ fontWeight: '500', color: '#92400E' }}>
                    오늘은 어떤 경제 고민이<br />있으신가요?
                  </span>
                </p>
              </div>
              <button
                onClick={() => navigate('/coach')}
                style={{
                  marginTop: 'auto', padding: '12px', borderRadius: '14px',
                  background: '#FFC83D', color: '#78350F',
                  border: 'none', fontSize: '14px', fontWeight: '800',
                  cursor: 'pointer', letterSpacing: '-0.3px',
                  boxShadow: '0 4px 14px rgba(255,200,61,0.4)',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#FFB800'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#FFC83D'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                노밍에게 물어보기 →
              </button>
            </div>

            {/* 오늘의 한 걸음 */}
            <div style={{
              background: '#fff', border: '1.5px solid #E2E8F0',
              borderRadius: '20px', padding: '24px',
              display: 'flex', flexDirection: 'column', gap: '12px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <p style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px' }}>
                  오늘의 한 걸음
                </p>
                <span style={{
                  fontSize: '11px', fontWeight: '700', color: '#21C58E',
                  background: '#F4FAF6', border: '1px solid #DCF5EB',
                  borderRadius: '100px', padding: '3px 10px',
                }}>
                  {MISSIONS.filter(m => m.done).length}/{MISSIONS.length} 완료
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {MISSIONS.map(m => (
                  <button
                    key={m.label}
                    onClick={() => navigate(m.path)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '12px 14px', borderRadius: '12px',
                      background: m.done ? '#F4FAF6' : '#FAFAFA',
                      border: `1.5px solid ${m.done ? '#DCF5EB' : '#F1F5F9'}`,
                      cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { if (!m.done) { e.currentTarget.style.borderColor = '#21C58E'; e.currentTarget.style.background = '#F4FAF6'; } }}
                    onMouseLeave={e => { if (!m.done) { e.currentTarget.style.borderColor = '#F1F5F9'; e.currentTarget.style.background = '#FAFAFA'; } }}
                  >
                    <div style={{
                      width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
                      background: m.done ? '#21C58E' : '#fff',
                      border: `2px solid ${m.done ? '#21C58E' : '#CBD5E1'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '11px', color: '#fff', fontWeight: '800',
                    }}>
                      {m.done ? '✓' : ''}
                    </div>
                    <span style={{ fontSize: '14px' }}>{m.emoji}</span>
                    <span style={{
                      fontSize: '13px', fontWeight: '600',
                      color: m.done ? '#64748B' : '#0F172A',
                      textDecoration: m.done ? 'line-through' : 'none',
                      flex: 1,
                    }}>
                      {m.label}
                    </span>
                    {!m.done && <span style={{ fontSize: '14px', color: '#CBD5E1' }}>›</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ══ 5. 지금 나의 단계 카드 ══════════════════════ */}
          <div style={{
            background: '#fff', border: '1.5px solid #DCF5EB',
            borderRadius: '20px', padding: '24px',
          }}>
            <p style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px' }}>
              지금 나의 단계
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{
                width: '72px', height: '72px', borderRadius: '20px', flexShrink: 0,
                background: 'linear-gradient(135deg, #F4FAF6, #DCF5EB)',
                border: '2px solid #A7F3D0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '36px',
              }}>
                {currentLevel.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '20px', fontWeight: '900', color: '#0F172A', letterSpacing: '-0.7px', marginBottom: '4px' }}>
                  {currentLevel.label} 단계
                </p>
                <p style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.6' }}>
                  {xp} XP 획득 · {nextLevel ? `${nextLevel.label} 단계까지 ${xpNeeded} XP` : '최고 단계 달성!'}
                </p>
              </div>
              <button
                onClick={() => navigate('/diagnosis')}
                style={{
                  flexShrink: 0, padding: '10px 18px', borderRadius: '12px',
                  background: '#F4FAF6', color: '#21C58E',
                  border: '1.5px solid #DCF5EB', fontSize: '13px', fontWeight: '700',
                  cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#21C58E'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#F4FAF6'; e.currentTarget.style.color = '#21C58E'; }}
              >
                단계 다시 진단 →
              </button>
            </div>
          </div>

        </div>
      </div>
    </PageWrapper>
  );
}
