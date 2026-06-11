import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import economicBites, { getBiteById } from '../data/economicBites';
import { getBiteInfographic } from '../data/biteInfographics';
import { getBiteQuiz } from '../data/biteQuizzes';
import PageWrapper from '../components/layout/PageWrapper';
import SaveTermButton from '../components/common/SaveTermButton';

const CATEGORY_STYLE = {
  '금리':     { badge: '#FEF3C7', badgeText: '#92400E', icon: '💹' },
  '투자':     { badge: '#D1FAE5', badgeText: '#065F46', icon: '📊' },
  '거시경제': { badge: '#DBEAFE', badgeText: '#1E40AF', icon: '🌐' },
  '저축':     { badge: '#D1FAE5', badgeText: '#14532D', icon: '🏦' },
  '부동산':   { badge: '#FCE7F3', badgeText: '#831843', icon: '🏠' },
  '기초':     { badge: '#EDE9FE', badgeText: '#4C1D95', icon: '📚' },
};

const DIFFICULTY_STYLE = {
  easy:   { label: '쉬움', bg: '#DCFCE7', text: '#15803D' },
  medium: { label: '보통', bg: '#FEF9C3', text: '#A16207' },
  hard:   { label: '심화', bg: '#FFE4E6', text: '#BE123C' },
};

const ANIM = `
@keyframes xpFloat {
  0%   { opacity:1; transform:translateY(0) scale(1); }
  30%  { opacity:1; transform:translateY(-12px) scale(1.15); }
  100% { opacity:0; transform:translateY(-56px) scale(0.85); }
}
@keyframes correctPop {
  0%   { transform:scale(1); }
  35%  { transform:scale(1.04); }
  100% { transform:scale(1); }
}
`;

function NumBadge({ n, color = '#21C58E' }) {
  return (
    <div style={{
      width: 26, height: 26, borderRadius: '50%',
      background: color, color: '#fff', flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 12, fontWeight: 800,
    }}>
      {n}
    </div>
  );
}

function SectionHead({ n, emoji, title, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
      <NumBadge n={n} color={color} />
      <span style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.4px' }}>
        {emoji} {title}
      </span>
    </div>
  );
}

function ContentCard({ borderColor = '#21C58E', bg = '#fff', children, style = {} }) {
  return (
    <div style={{
      background: bg,
      border: '1.5px solid #E5F5EC',
      borderLeft: `4px solid ${borderColor}`,
      borderRadius: 14,
      padding: '16px 18px',
      fontSize: 14.5,
      color: '#1E293B',
      lineHeight: 1.75,
      letterSpacing: '-0.2px',
      ...style,
    }}>
      {children}
    </div>
  );
}

function ConceptPlaceholder({ bite }) {
  const s = CATEGORY_STYLE[bite.category] ?? { badge: '#E2E8F0', badgeText: '#374151', icon: '📌' };
  return (
    <div style={{
      background: `linear-gradient(145deg,${s.badge}88,${s.badge}44)`,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '38px 20px', gap: 10, minHeight: 150,
    }}>
      <div style={{ fontSize: 44 }}>{s.icon}</div>
      <div style={{ fontSize: 22, fontWeight: 900, color: '#0F172A', letterSpacing: '-0.8px', textAlign: 'center' }}>
        {bite.title}
      </div>
      <span style={{ fontSize: 11, fontWeight: 700, background: s.badge, color: s.badgeText, borderRadius: 100, padding: '4px 12px' }}>
        {bite.category} 개념
      </span>
    </div>
  );
}

export default function EconomicBitePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const bite = getBiteById(Number(id));
  const infographic = bite ? getBiteInfographic(bite.title) : null;
  const quizData = bite ? getBiteQuiz(bite.id) : null;

  const [quizSelected, setQuizSelected] = useState(null);
  const [quizRevealed, setQuizRevealed] = useState(false);
  const [showXP, setShowXP] = useState(false);

  useEffect(() => {
    setQuizSelected(null);
    setQuizRevealed(false);
    setShowXP(false);
  }, [id]);

  if (!bite) {
    return (
      <PageWrapper>
        <div style={{ padding: '60px 20px', textAlign: 'center', color: '#6B7280' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🍃</div>
          <p style={{ fontSize: 16, fontWeight: 600 }}>찾을 수 없는 개념이에요.</p>
          <button onClick={() => navigate('/bites')} style={{
            marginTop: 20, padding: '10px 24px', borderRadius: 10,
            background: '#21C58E', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700,
          }}>
            경제 한잎 모음 보기
          </button>
        </div>
      </PageWrapper>
    );
  }

  const catStyle = CATEGORY_STYLE[bite.category] ?? { badge: '#E2E8F0', badgeText: '#374151', icon: '📌' };
  const diffStyle = DIFFICULTY_STYLE[bite.difficulty] ?? DIFFICULTY_STYLE.medium;

  function handleOption(idx) {
    if (quizRevealed) return;
    setQuizSelected(idx);
    setQuizRevealed(true);
    if (idx === quizData.quiz.answer) {
      setShowXP(true);
      setTimeout(() => setShowXP(false), 1900);
    }
  }

  const isCorrect = quizRevealed && quizSelected === quizData?.quiz.answer;

  return (
    <PageWrapper>
      <style>{ANIM}</style>

      {/* 상단 스티키 바 */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 20,
        background: '#F4FAF6', borderBottom: '1px solid #E5F5EC',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 20px',
      }}>
        <button onClick={() => navigate(-1)} style={{
          display: 'flex', alignItems: 'center', gap: 4,
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 14, fontWeight: 700, color: '#374151',
          padding: '6px 10px', borderRadius: 8,
        }}
        onMouseEnter={e => e.currentTarget.style.background = '#E5F5EC'}
        onMouseLeave={e => e.currentTarget.style.background = 'none'}
        >
          ← 뒤로
        </button>
        <span style={{ fontSize: 13, fontWeight: 800, color: '#21C58E', letterSpacing: '-0.2px' }}>
          🍃 경제 한잎
        </span>
        <button onClick={() => navigate('/bites')} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 12, fontWeight: 700, color: '#6B7280',
          padding: '6px 8px', borderRadius: 8,
        }}
        onMouseEnter={e => e.currentTarget.style.color = '#21C58E'}
        onMouseLeave={e => e.currentTarget.style.color = '#6B7280'}
        >
          모음 보기
        </button>
      </div>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 16px 48px' }}>

        {/* ── 헤로 카드: 카테고리 + 제목 + 요약 ── */}
        <div style={{
          background: 'linear-gradient(145deg,#F2FFF6,#DCFCE7)',
          border: '2px solid #CDEFD7',
          borderRadius: 20,
          padding: '20px 20px 22px',
          margin: '16px 0',
        }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
            <span style={{ fontSize: 11, fontWeight: 800, background: catStyle.badge, color: catStyle.badgeText, borderRadius: 100, padding: '4px 10px' }}>
              {catStyle.icon} {bite.category}
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, background: diffStyle.bg, color: diffStyle.text, borderRadius: 100, padding: '4px 10px' }}>
              {diffStyle.label}
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, background: '#F0FDF4', color: '#15803D', borderRadius: 100, padding: '4px 10px' }}>
              ⏱ 약 3분
            </span>
          </div>
          <h1 style={{
            fontSize: 28, fontWeight: 900, color: '#0F172A',
            letterSpacing: '-1px', lineHeight: 1.2, marginBottom: 10,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#21C58E', display: 'inline-block', flexShrink: 0 }} />
            {bite.title}
          </h1>
          <p style={{ fontSize: 15, color: '#065F46', fontWeight: 600, lineHeight: 1.65, letterSpacing: '-0.3px' }}>
            {bite.summary}
          </p>
        </div>

        {/* ── 1. 핵심 인포그래픽 ── */}
        <div style={{ marginBottom: 16 }}>
          <SectionHead n="1" emoji="📊" title="핵심 개념 한눈에 보기" color="#21C58E" />
          <div style={{
            background: '#fff', border: '2px solid #E5F5EC',
            borderRadius: 18, overflow: 'hidden',
            boxShadow: '0 2px 16px rgba(33,197,142,0.08)',
          }}>
            {infographic
              ? <div style={{ maxWidth: 400, margin: '0 auto', width: '100%' }}><infographic.graphic /></div>
              : <ConceptPlaceholder bite={bite} />
            }
          </div>
        </div>

        {/* ── 2. 쉽게 설명하면 ── */}
        <div style={{ marginBottom: 16 }}>
          <SectionHead n="2" emoji="📝" title="쉽게 설명하면" color="#21C58E" />
          <ContentCard borderColor="#21C58E">{bite.description}</ContentCard>
        </div>

        {/* ── 3. 왜 알아야 할까요? ── */}
        <div style={{ marginBottom: 16 }}>
          <SectionHead n="3" emoji="💡" title="왜 알아야 할까요?" color="#F59E0B" />
          <ContentCard borderColor="#F59E0B">{bite.whyImportant}</ContentCard>
        </div>

        {/* ── 4. 실생활 예시 ── */}
        <div style={{ marginBottom: 16 }}>
          <SectionHead n="4" emoji="🏠" title="실생활 예시" color="#6366F1" />
          <div style={{
            background: 'linear-gradient(145deg,#EEF2FF,#F5F3FF)',
            border: '1.5px solid #C7D2FE',
            borderRadius: 14,
            padding: '18px 18px',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <span style={{ fontSize: 22, flexShrink: 0, marginTop: 2 }}>💬</span>
              <p style={{ fontSize: 14.5, color: '#1E293B', lineHeight: 1.75, letterSpacing: '-0.2px', fontWeight: 500 }}>
                {bite.realExample}
              </p>
            </div>
          </div>
        </div>

        {/* ── 5. 관련 경제 용어 ── */}
        {bite.relatedTerms?.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <SectionHead n="5" emoji="🔗" title="함께 알아두면 좋은 개념" color="#0EA5E9" />
            <div style={{
              background: '#fff', border: '1.5px solid #E5F5EC',
              borderLeft: '4px solid #0EA5E9', borderRadius: 14,
              overflow: 'hidden',
            }}>
              {bite.relatedTerms.map((term, idx) => {
                const rel = economicBites.find(b => b.title === term);
                return (
                  <div key={term} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    gap: 10, padding: '11px 16px',
                    borderBottom: idx < bite.relatedTerms.length - 1 ? '1px solid #F0FDF4' : 'none',
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{
                        fontSize: 13, fontWeight: 700, color: '#0369A1',
                        background: '#F0F9FF', border: '1.5px solid #BAE6FD',
                        borderRadius: 100, padding: '3px 10px', display: 'inline-block',
                      }}>
                        # {term}
                      </span>
                      {rel && (
                        <p style={{ fontSize: 12, color: '#64748B', marginTop: 3, lineHeight: 1.5,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {rel.summary}
                        </p>
                      )}
                    </div>
                    <SaveTermButton
                      term={term}
                      meaning={rel?.summary || ''}
                      sourceType="economic_bite"
                      sourceId={String(bite.id)}
                      size="sm"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── 노밍의 한마디 ── */}
        {quizData?.nomingMessage && (
          <div style={{
            background: 'linear-gradient(145deg,#FFFBEA,#FFF7D6)',
            border: '2px solid #FDE68A',
            borderRadius: 18,
            padding: '18px 18px',
            marginBottom: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div style={{
                width: 42, height: 42, borderRadius: '50%',
                background: 'linear-gradient(135deg,#FFC83D,#F59E0B)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, flexShrink: 0,
                boxShadow: '0 2px 8px rgba(245,158,11,0.3)',
              }}>
                ☀️
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#92400E', letterSpacing: '-0.1px', marginBottom: 5 }}>
                  노밍의 한마디
                </div>
                <p style={{ fontSize: 14, color: '#78350F', lineHeight: 1.7, letterSpacing: '-0.2px', fontWeight: 500 }}>
                  {quizData.nomingMessage}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── 6. 이해도 체크 퀴즈 ── */}
        {quizData?.quiz && (
          <div style={{ marginBottom: 20 }}>
            <SectionHead n="6" emoji="🧠" title="잘 이해했나요?" color="#7C3AED" />
            <div style={{
              background: '#fff',
              border: '2px solid #E9D5FF',
              borderRadius: 18,
              padding: '20px 18px',
              position: 'relative', overflow: 'hidden',
            }}>
              {/* XP 팝업 */}
              {showXP && (
                <div style={{
                  position: 'absolute', top: 16, right: 20, zIndex: 5,
                  fontSize: 17, fontWeight: 900, color: '#16A34A',
                  background: '#DCFCE7', border: '2px solid #86EFAC',
                  borderRadius: 100, padding: '5px 12px',
                  boxShadow: '0 4px 12px rgba(22,163,74,0.25)',
                  animation: 'xpFloat 1.9s ease-out forwards',
                  pointerEvents: 'none',
                }}>
                  🌱 +5 XP
                </div>
              )}

              <p style={{ fontSize: 15, fontWeight: 700, color: '#1E293B', lineHeight: 1.6, letterSpacing: '-0.3px', marginBottom: 16 }}>
                Q. {quizData.quiz.question}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {quizData.quiz.options.map((opt, idx) => {
                  let bg = '#F8FAFC', border = '#E2E8F0', color = '#374151', icon = null;
                  if (quizRevealed) {
                    if (idx === quizData.quiz.answer) {
                      bg = '#DCFCE7'; border = '#86EFAC'; color = '#15803D'; icon = '✅';
                    } else if (idx === quizSelected) {
                      bg = '#FEE2E2'; border = '#FCA5A5'; color = '#B91C1C'; icon = '❌';
                    }
                  } else if (idx === quizSelected) {
                    bg = '#EDE9FE'; border = '#C4B5FD'; color = '#5B21B6';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleOption(idx)}
                      disabled={quizRevealed}
                      style={{
                        padding: '13px 16px', borderRadius: 12,
                        background: bg, border: `2px solid ${border}`, color,
                        fontSize: 14, fontWeight: 600, textAlign: 'left',
                        cursor: quizRevealed ? 'default' : 'pointer',
                        transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 10,
                        letterSpacing: '-0.2px',
                        animation: quizRevealed && idx === quizData.quiz.answer ? 'correctPop 0.4s ease' : 'none',
                      }}
                      onMouseEnter={e => {
                        if (!quizRevealed) {
                          e.currentTarget.style.background = '#EDE9FE';
                          e.currentTarget.style.borderColor = '#C4B5FD';
                          e.currentTarget.style.color = '#5B21B6';
                        }
                      }}
                      onMouseLeave={e => {
                        if (!quizRevealed && idx !== quizSelected) {
                          e.currentTarget.style.background = '#F8FAFC';
                          e.currentTarget.style.borderColor = '#E2E8F0';
                          e.currentTarget.style.color = '#374151';
                        }
                      }}
                    >
                      {icon && <span style={{ fontSize: 16, flexShrink: 0 }}>{icon}</span>}
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {quizRevealed && (
                <div style={{
                  marginTop: 16, padding: '12px 14px', borderRadius: 10,
                  background: isCorrect ? '#F0FDF4' : '#FFF7ED',
                  border: `1.5px solid ${isCorrect ? '#86EFAC' : '#FED7AA'}`,
                  fontSize: 13.5, fontWeight: 600, lineHeight: 1.6,
                  color: isCorrect ? '#15803D' : '#9A3412',
                }}>
                  {isCorrect
                    ? '🎉 정답이에요! 개념을 잘 이해했네요.'
                    : `💡 정답은 "${quizData.quiz.options[quizData.quiz.answer]}"예요. 위 내용을 다시 읽어보면 더 잘 기억될 거예요.`}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── 이전 / 다음 ── */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          {bite.id > 1 && (
            <button
              onClick={() => navigate(`/bite/${bite.id - 1}`)}
              style={{
                flex: 1, padding: 12, borderRadius: 12,
                border: '1.5px solid #CDEFD7', background: '#F2FFF6',
                color: '#065F46', fontSize: 13, fontWeight: 700, cursor: 'pointer',
              }}
            >
              ← 이전 한잎
            </button>
          )}
          <button
            onClick={() => navigate(`/bite/${bite.id < 60 ? bite.id + 1 : 1}`)}
            style={{
              flex: 1, padding: 12, borderRadius: 12,
              border: '1.5px solid #CDEFD7', background: '#F2FFF6',
              color: '#065F46', fontSize: 13, fontWeight: 700, cursor: 'pointer',
            }}
          >
            다음 한잎 →
          </button>
        </div>

        {/* ── 완료 CTA ── */}
        <div style={{
          background: 'linear-gradient(145deg,#F0FDF4,#DCFCE7)',
          border: '2px solid #86EFAC',
          borderRadius: 20, padding: '24px 20px', textAlign: 'center',
        }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🍃</div>
          <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0F172A', letterSpacing: '-0.5px', marginBottom: 6 }}>
            오늘의 한잎 완료!
          </h3>
          <p style={{ fontSize: 13, color: '#16A34A', fontWeight: 600, marginBottom: 18, letterSpacing: '-0.2px' }}>
            {bite.title}를 배웠어요. 매일 한 잎씩 쌓아가요.
          </p>
          <button
            onClick={() => navigate('/home')}
            style={{
              width: '100%', padding: 14, borderRadius: 14,
              background: 'linear-gradient(135deg,#21C58E,#16A374)',
              color: '#fff', border: 'none', cursor: 'pointer',
              fontSize: 15, fontWeight: 800, letterSpacing: '-0.3px',
              boxShadow: '0 4px 16px rgba(33,197,142,0.35)',
              marginBottom: 10, transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 22px rgba(33,197,142,0.45)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(33,197,142,0.35)'; }}
          >
            홈으로 돌아가기
          </button>
          <button
            onClick={() => navigate('/bites')}
            style={{
              width: '100%', padding: 12, borderRadius: 12,
              border: '1.5px solid #86EFAC', background: 'transparent',
              color: '#16A34A', fontSize: 13, fontWeight: 700, cursor: 'pointer',
            }}
          >
            경제 한잎 모두 보기
          </button>
        </div>

      </div>
    </PageWrapper>
  );
}
