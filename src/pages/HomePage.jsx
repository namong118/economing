/* 홈 대시보드 — AI 경제 코치 중심 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { roadmap, levelStartStep } from '../data/roadmapData';
import { levelInfo } from '../data/diagnosisQuestions';
import PageWrapper from '../components/layout/PageWrapper';
import Card from '../components/common/Card';

const RECOMMENDED_QUESTIONS = [
  '월급 받으면 가장 먼저 해야 할 것은?',
  '청약통장은 꼭 필요한가요?',
  '적금과 ETF 중 무엇부터 시작해야 할까요?',
  '경제 뉴스는 어떻게 읽어야 할까요?',
];

const QUICK_LINKS = [
  { emoji: '📈', title: '학습 로드맵', desc: '5단계 경제 성장 경로', path: '/roadmap', color: '#10B981', bg: '#ECFDF5', border: '#A7F3D0' },
  { emoji: '✏️', title: '경제 일기',   desc: '오늘 배운 내용 기록',   path: '/diary',   color: '#F59E0B', bg: '#FFFBEB', border: '#FCD34D' },
  { emoji: '📚', title: '경제 사전',   desc: '나만의 용어 저장소',   path: '/dictionary', color: '#EC4899', bg: '#FDF2F8', border: '#F9A8D4' },
  { emoji: '🔍', title: '용어 검색',   desc: '어려운 용어 쉽게 이해', path: '/terms',  color: '#6366F1', bg: '#EEF2FF', border: '#C7D2FE' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [localLevel] = useLocalStorage('economing_level', null);
  const [coachInput, setCoachInput] = useState('');

  const level    = profile?.level || localLevel;
  const nickname = profile?.nickname || null;

  // 사용자 시작 스텝 결정 (진단한 경우만)
  const startStep   = level ? levelStartStep[level] ?? 1 : null;
  const currentStep = startStep ? roadmap[startStep - 1] : null;
  const info        = level ? levelInfo[level] : null;

  const handleCoachSend = (q) => {
    const question = (q || coachInput).trim();
    if (!question) return;
    navigate('/coach', { state: { initialQuestion: question } });
  };

  return (
    <PageWrapper>
      <div className="anim-fade">

        {/* ════════════════════════════════════════
            HERO
        ════════════════════════════════════════ */}
        <section style={{
          background: 'linear-gradient(135deg, #064E3B 0%, #065F46 45%, #047857 100%)',
          padding: '56px 0 52px', position: 'relative', overflow: 'hidden',
        }}>
          {/* 배경 장식 */}
          {[
            { top: '-60px', right: '180px', size: '280px', op: 0.06 },
            { top: '30px',  right: '-40px', size: '180px', op: 0.08 },
          ].map((s, i) => (
            <div key={i} style={{
              position: 'absolute', top: s.top, right: s.right,
              width: s.size, height: s.size, borderRadius: '50%',
              background: `rgba(255,255,255,${s.op})`, pointerEvents: 'none',
            }} />
          ))}

          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '100px', padding: '5px 14px', fontSize: '13px', fontWeight: '600', color: '#A7F3D0', marginBottom: '20px' }}>
              <span>🌱</span> AI 경제 성장 코치
            </div>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: '900', color: '#fff', lineHeight: '1.2', letterSpacing: '-2px', marginBottom: '16px' }}>
              경제 공부,{' '}
              <span style={{ background: 'linear-gradient(90deg, #6EE7B7, #A7F3D0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                어디서부터 시작
              </span>
              해야 할지{' '}
              {nickname ? (
                <><br /><span style={{ color: '#A7F3D0' }}>{nickname}</span>님을 위해 알려드릴게요</>
              ) : (
                <>모르겠다면?</>
              )}
            </h1>
            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.7', letterSpacing: '-0.3px' }}>
              ETF가 뭔지보다 <strong style={{ color: '#fff' }}>어디서 시작할지</strong>를 먼저 알려드려요.
            </p>
          </div>
        </section>

        {/* ════════════════════════════════════════
            AI 코치 입력 카드 (핵심)
        ════════════════════════════════════════ */}
        <section style={{ padding: '32px 0 0' }}>
          <div className="container">
            <div style={{
              background: '#fff', borderRadius: '20px',
              border: '1.5px solid #E2E8F0',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              padding: '28px 32px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <img
                  src={`${import.meta.env.BASE_URL}coach.png`}
                  alt="AI 코치"
                  style={{
                    width: '40px', height: '40px', borderRadius: '12px',
                    objectFit: 'cover', boxShadow: '0 4px 10px rgba(16,185,129,0.3)',
                  }}
                />
                <div>
                  <p style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px' }}>
                    AI 경제 코치에게 물어보세요
                  </p>
                  <p style={{ fontSize: '13px', color: '#94A3B8' }}>경제·재테크·투자·세금·부동산 무엇이든</p>
                </div>
              </div>

              {/* 입력창 */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                <input
                  value={coachInput}
                  onChange={e => setCoachInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCoachSend()}
                  placeholder="예) 월급 받으면 뭘 먼저 해야 하나요?"
                  style={{
                    flex: 1, padding: '13px 18px', borderRadius: '12px',
                    border: '1.5px solid #E2E8F0', fontSize: '14px',
                    color: '#0F172A', background: '#F8FAFC', fontFamily: 'inherit',
                    transition: 'border-color 0.15s',
                  }}
                  onFocus={e => e.target.style.borderColor = '#10B981'}
                  onBlur={e => e.target.style.borderColor = '#E2E8F0'}
                />
                <button
                  onClick={() => handleCoachSend()}
                  style={{
                    padding: '13px 22px', borderRadius: '12px',
                    background: 'linear-gradient(135deg, #10B981, #059669)',
                    color: '#fff', border: 'none', fontSize: '14px', fontWeight: '700',
                    cursor: 'pointer', boxShadow: '0 4px 12px rgba(16,185,129,0.35)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  질문하기 →
                </button>
              </div>

              {/* 추천 질문 */}
              <div>
                <p style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '600', marginBottom: '10px' }}>추천 질문</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {RECOMMENDED_QUESTIONS.map(q => (
                    <button
                      key={q}
                      onClick={() => handleCoachSend(q)}
                      style={{
                        padding: '7px 14px', borderRadius: '100px',
                        background: '#F8FAFC', border: '1.5px solid #E2E8F0',
                        fontSize: '13px', color: '#374151', cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#10B981'; e.currentTarget.style.color = '#059669'; e.currentTarget.style.background = '#ECFDF5'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.color = '#374151'; e.currentTarget.style.background = '#F8FAFC'; }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            빠른 이동
        ════════════════════════════════════════ */}
        <section style={{ padding: '28px 0 0' }}>
          <div className="container">
            <div className="quick-actions-grid">
              {QUICK_LINKS.map(item => (
                <button
                  key={item.title}
                  onClick={() => navigate(item.path)}
                  className="card-hover"
                  style={{
                    background: item.bg, border: `1.5px solid ${item.border}`,
                    borderRadius: '16px', padding: '22px 18px',
                    textAlign: 'left', cursor: 'pointer',
                    boxShadow: 'var(--shadow-xs)', transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: '#fff', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '22px',
                    marginBottom: '14px', boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                  }}>
                    {item.emoji}
                  </div>
                  <p style={{ fontSize: '15px', fontWeight: '700', color: '#0F172A', letterSpacing: '-0.4px', marginBottom: '3px' }}>
                    {item.title}
                  </p>
                  <p style={{ fontSize: '12px', color: '#64748B' }}>{item.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            메인 그리드: 로드맵 | 현재 스텝
        ════════════════════════════════════════ */}
        <section style={{ padding: '32px 0 0' }}>
          <div className="container">
            <div className="dashboard-grid">

              {/* ── 왼쪽: 5단계 로드맵 미리보기 ── */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <p style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    경제 성장 로드맵
                  </p>
                  <button
                    onClick={() => navigate('/roadmap')}
                    style={{ fontSize: '13px', color: '#10B981', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    전체 보기 →
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {roadmap.map((step, idx) => {
                    const isCurrent = startStep && step.step === startStep;
                    const isDone    = startStep && step.step < startStep;
                    return (
                      <Card
                        key={step.step}
                        hoverable
                        onClick={() => navigate('/roadmap')}
                        style={{
                          border: isCurrent ? `2px solid ${step.color}55` : '1.5px solid #F1F5F9',
                          background: isCurrent ? `${step.color}08` : '#fff',
                          cursor: 'pointer', padding: '16px 20px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <div style={{
                            width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0,
                            background: isDone ? '#ECFDF5' : isCurrent ? `${step.color}18` : '#F8FAFC',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
                          }}>
                            {isDone ? '✅' : step.emoji}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                              <span style={{ fontSize: '11px', fontWeight: '700', color: isCurrent ? step.color : '#94A3B8', letterSpacing: '0.3px' }}>
                                STEP {step.step}
                              </span>
                              {isCurrent && (
                                <span style={{ background: step.color, color: '#fff', fontSize: '10px', fontWeight: '700', padding: '1px 8px', borderRadius: '100px' }}>
                                  시작 추천
                                </span>
                              )}
                            </div>
                            <p style={{ fontSize: '14px', fontWeight: '700', color: isDone ? '#94A3B8' : '#0F172A', letterSpacing: '-0.4px' }}>
                              {step.title}
                            </p>
                          </div>
                          <span style={{ fontSize: '18px', color: '#CBD5E1' }}>›</span>
                        </div>
                      </Card>
                    );
                  })}
                </div>

                {/* 진단 안 한 경우 CTA */}
                {!level && (
                  <button
                    onClick={() => navigate('/diagnosis')}
                    style={{
                      width: '100%', marginTop: '14px', padding: '13px',
                      borderRadius: '14px',
                      background: 'linear-gradient(135deg, #10B981, #059669)',
                      color: '#fff', border: 'none', fontSize: '14px', fontWeight: '700',
                      cursor: 'pointer', boxShadow: '0 4px 14px rgba(16,185,129,0.3)',
                    }}
                  >
                    🎯 내 수준 진단하고 맞춤 시작점 찾기
                  </button>
                )}
              </div>

              {/* ── 오른쪽: 현재 단계 상세 + 경제 코치 바로가기 ── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                {/* 현재 학습 단계 */}
                {currentStep ? (
                  <div>
                    <p style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>
                      지금 시작하면 좋은 단계
                    </p>
                    <Card style={{
                      background: `linear-gradient(135deg, ${currentStep.color}12, #fff)`,
                      border: `1.5px solid ${currentStep.color}33`, padding: '22px',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                        <div style={{
                          width: '52px', height: '52px', borderRadius: '16px', flexShrink: 0,
                          background: `linear-gradient(135deg, ${currentStep.color}, ${currentStep.color}88)`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '26px', boxShadow: `0 6px 18px ${currentStep.color}30`,
                        }}>
                          {currentStep.emoji}
                        </div>
                        <div>
                          <p style={{ fontSize: '11px', fontWeight: '700', color: currentStep.color, letterSpacing: '0.3px', marginBottom: '3px' }}>
                            STEP {currentStep.step}
                          </p>
                          <p style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px' }}>
                            {currentStep.title}
                          </p>
                        </div>
                      </div>
                      <p style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.6', marginBottom: '14px' }}>
                        {currentStep.description}
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                        {currentStep.topics.map(t => (
                          <span key={t} style={{
                            background: '#fff', border: '1px solid #E2E8F0',
                            borderRadius: '8px', padding: '4px 10px',
                            fontSize: '12px', color: '#374151', fontWeight: '500',
                          }}>
                            {t}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() => navigate('/coach')}
                        style={{
                          width: '100%', padding: '10px', borderRadius: '12px',
                          background: currentStep.color, color: '#fff',
                          border: 'none', fontSize: '13px', fontWeight: '700',
                          cursor: 'pointer',
                        }}
                      >
                        🤖 이 단계 AI 코치에게 물어보기 →
                      </button>
                    </Card>
                  </div>
                ) : (
                  /* 진단 전 안내 */
                  <Card style={{ background: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)', border: '1.5px solid #A7F3D0', padding: '24px', textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎯</div>
                    <p style={{ fontSize: '16px', fontWeight: '700', color: '#0F172A', marginBottom: '8px' }}>
                      어디서 시작할지 모르겠다면?
                    </p>
                    <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px', lineHeight: '1.6' }}>
                      5문항 진단으로 나에게 맞는 시작점을 찾아드려요.
                    </p>
                    <button
                      onClick={() => navigate('/diagnosis')}
                      style={{
                        padding: '11px 24px', borderRadius: '12px',
                        background: 'linear-gradient(135deg, #10B981, #059669)',
                        color: '#fff', border: 'none', fontSize: '14px',
                        fontWeight: '700', cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
                      }}
                    >
                      내 수준 진단하기 →
                    </button>
                  </Card>
                )}

                {/* AI 코치 바로가기 */}
                <Card
                  hoverable
                  onClick={() => navigate('/coach')}
                  style={{
                    background: 'linear-gradient(135deg, #064E3B, #065F46)',
                    border: 'none', cursor: 'pointer', padding: '22px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <img
                      src={`${import.meta.env.BASE_URL}coach.png`}
                      alt="AI 코치"
                      style={{
                        width: '48px', height: '48px', borderRadius: '14px',
                        objectFit: 'cover', flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '15px', fontWeight: '700', color: '#fff', letterSpacing: '-0.4px', marginBottom: '4px' }}>
                        AI 경제 코치와 대화하기
                      </p>
                      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)' }}>
                        궁금한 것 무엇이든 물어보세요
                      </p>
                    </div>
                    <span style={{ fontSize: '20px', color: 'rgba(255,255,255,0.5)' }}>›</span>
                  </div>
                </Card>

                {/* 경제 일기 바로가기 */}
                <Card
                  hoverable
                  onClick={() => navigate('/diary')}
                  style={{ cursor: 'pointer', padding: '20px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '12px',
                      background: '#FFFBEB', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: '22px', flexShrink: 0,
                    }}>
                      ✏️
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A', letterSpacing: '-0.4px', marginBottom: '3px' }}>
                        경제 일기 쓰기
                      </p>
                      <p style={{ fontSize: '12px', color: '#64748B' }}>오늘 배운 내용을 기록하세요</p>
                    </div>
                    <span style={{ fontSize: '18px', color: '#CBD5E1' }}>›</span>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

      </div>
    </PageWrapper>
  );
}
