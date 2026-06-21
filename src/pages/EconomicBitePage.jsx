import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  TrendingUp, BarChart2, Globe, PiggyBank, Home, BookOpen,
  FileText, Lightbulb, Link2, Brain, MessageCircle, Clock,
  Leaf, Sprout, Check, X, MapPin, Sun,
} from 'lucide-react';
import economicBites, { getBiteById } from '../data/economicBites';
import { BITE_INFOGRAPHICS } from '../data/biteInfographics';
import { getBiteQuiz } from '../data/biteQuizzes';
import PageWrapper from '../components/layout/PageWrapper';
import SaveTermButton from '../components/common/SaveTermButton';
import { useAuth } from '../context/AuthContext';
import { addXp } from '../services/profileService';
import { supabase } from '../services/supabaseClient';

const CATEGORY_STYLE = {
  '금리':     { badge: 'var(--c-yellow-100)', badgeText: 'var(--c-amber-700)', Icon: TrendingUp },
  '투자':     { badge: 'var(--c-green-100)', badgeText: 'var(--c-forest-900)', Icon: BarChart2 },
  '거시경제': { badge: '#DBEAFE', badgeText: '#1E40AF', Icon: Globe },
  '저축':     { badge: 'var(--c-green-100)', badgeText: 'var(--c-forest-900)', Icon: PiggyBank },
  '부동산':   { badge: '#FCE7F3', badgeText: '#831843', Icon: Home },
  '기초':     { badge: '#EDE9FE', badgeText: '#4C1D95', Icon: BookOpen },
};

const DIFFICULTY_STYLE = {
  easy:   { label: '쉬움', bg: 'var(--c-green-100)',  text: 'var(--c-forest-700)' },
  medium: { label: '보통', bg: 'var(--c-yellow-100)', text: 'var(--c-amber-700)'  },
  hard:   { label: '심화', bg: '#FFE4E6',             text: '#BE123C'             },
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

function SectionLabel({ Icon, label }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      fontSize: 11, fontWeight: 700, color: 'var(--c-forest-700)',
      marginBottom: 8, letterSpacing: '0.2px',
    }}>
      <Icon size={12} color="var(--c-forest-700)" />
      {label}
    </div>
  );
}

function ConceptPlaceholder({ bite }) {
  const s = CATEGORY_STYLE[bite.category] ?? { badge: 'var(--c-line)', badgeText: 'var(--c-slate)', Icon: MapPin };
  return (
    <div style={{
      background: 'var(--c-canvas)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '32px 20px', gap: 10, minHeight: 130,
    }}>
      <s.Icon size={36} color="var(--c-forest-700)" />
      <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--c-forest-700)', letterSpacing: '-0.4px', textAlign: 'center' }}>
        {bite.title}
      </div>
      <span style={{ fontSize: 11, fontWeight: 600, background: s.badge, color: s.badgeText, borderRadius: 100, padding: '3px 10px' }}>
        {bite.category}
      </span>
    </div>
  );
}

export default function EconomicBitePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const bite = getBiteById(Number(id));
  const InfographicComponent = bite ? (BITE_INFOGRAPHICS[bite.id] ?? null) : null;
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
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <Leaf size={40} color="var(--c-green-500)" />
          </div>
          <p style={{ fontSize: 15, fontWeight: 600 }}>찾을 수 없는 개념이에요.</p>
          <button onClick={() => navigate('/bites')} style={{
            marginTop: 20, padding: '10px 24px', borderRadius: 10,
            background: 'var(--c-green-500)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13,
          }}>
            경제 한잎 모음 보기
          </button>
        </div>
      </PageWrapper>
    );
  }

  const catStyle = CATEGORY_STYLE[bite.category] ?? { badge: 'var(--c-line)', badgeText: 'var(--c-slate)', Icon: MapPin };
  const diffStyle = DIFFICULTY_STYLE[bite.difficulty] ?? DIFFICULTY_STYLE.medium;
  const CatIcon = catStyle.Icon;

  function handleOption(idx) {
    if (quizRevealed) return;
    setQuizSelected(idx);
    setQuizRevealed(true);
    if (idx === quizData.quiz.answer) {
      setShowXP(true);
      setTimeout(() => setShowXP(false), 1900);
      if (user?.id) {
        addXp(user.id, 10);
        supabase.from('user_quiz_results').insert({ user_id: user.id, bite_id: bite.id, is_correct: true });
      }
    }
  }

  const isCorrect = quizRevealed && quizSelected === quizData?.quiz.answer;

  return (
    <PageWrapper>
      <style>{ANIM}</style>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '16px 16px 80px' }}>

        {/* ── 헤로: Dark Forest ── */}
        <div style={{
          background: 'linear-gradient(135deg, var(--c-forest-900) 0%, var(--c-forest-700) 100%)',
          borderRadius: 16,
          padding: '20px 18px 22px',
          marginBottom: 12,
          boxShadow: '0 4px 20px rgba(6,53,43,0.22)',
        }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
            <span style={{
              fontSize: 11, fontWeight: 700,
              background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.92)',
              borderRadius: 100, padding: '3px 10px',
              border: '0.5px solid rgba(255,255,255,0.25)',
              display: 'inline-flex', alignItems: 'center', gap: 4,
            }}>
              <CatIcon size={10} /> {bite.category}
            </span>
            <span style={{
              fontSize: 11, fontWeight: 600,
              background: 'rgba(255,200,61,0.2)', color: 'var(--c-yellow-500)',
              borderRadius: 100, padding: '3px 10px',
              border: '0.5px solid rgba(255,200,61,0.4)',
            }}>
              {diffStyle.label}
            </span>
            <span style={{
              fontSize: 11, fontWeight: 600,
              background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)',
              borderRadius: 100, padding: '3px 10px',
              border: '0.5px solid rgba(255,255,255,0.18)',
              display: 'inline-flex', alignItems: 'center', gap: 4,
            }}>
              <Clock size={10} /> 약 3분
            </span>
          </div>

          <div style={{
            fontSize: 20, fontWeight: 800, color: '#fff',
            letterSpacing: '-0.5px', lineHeight: 1.35, marginBottom: 8,
          }}>
            {bite.title}
          </div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 1.7 }}>
            {bite.summary}
          </p>
        </div>

        {/* ── 핵심 인포그래픽 ── */}
        <div style={{
          background: 'var(--c-surface)', border: '0.5px solid var(--c-line)',
          borderRadius: 14, overflow: 'hidden', marginBottom: 12,
          boxShadow: 'var(--shadow-card)',
        }}>
          <div style={{ padding: '14px 18px 0' }}>
            <SectionLabel Icon={BarChart2} label="핵심 개념 한눈에 보기" />
          </div>
          {InfographicComponent
            ? <div style={{ padding: '4px 16px 16px' }}><InfographicComponent /></div>
            : <ConceptPlaceholder bite={bite} />
          }
        </div>

        {/* ── 쉽게 설명하면 ── */}
        <div style={{
          background: 'var(--c-surface)', border: '0.5px solid var(--c-line)',
          borderRadius: 14, padding: '14px 18px', marginBottom: 12,
          boxShadow: 'var(--shadow-card)',
        }}>
          <SectionLabel Icon={FileText} label="쉽게 설명하면" />
          <p style={{ fontSize: 14, color: 'var(--c-slate)', lineHeight: 1.75, letterSpacing: '-0.2px' }}>
            {bite.description}
          </p>
        </div>

        {/* ── 왜 알아야 할까요? ── */}
        <div style={{
          background: 'var(--c-surface)', border: '0.5px solid var(--c-line)',
          borderRadius: 14, padding: '14px 18px', marginBottom: 12,
          boxShadow: 'var(--shadow-card)',
        }}>
          <SectionLabel Icon={Lightbulb} label="왜 알아야 할까요?" />
          <p style={{ fontSize: 14, color: 'var(--c-slate)', lineHeight: 1.75, letterSpacing: '-0.2px' }}>
            {bite.whyImportant}
          </p>
        </div>

        {/* ── 실생활 예시 ── */}
        <div style={{
          background: 'var(--c-surface)', border: '0.5px solid var(--c-line)',
          borderRadius: 14, padding: '14px 18px', marginBottom: 12,
          boxShadow: 'var(--shadow-card)',
        }}>
          <SectionLabel Icon={MessageCircle} label="실생활 예시" />
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <MessageCircle size={16} color="var(--c-line)" style={{ flexShrink: 0, marginTop: 3 }} />
            <p style={{ fontSize: 14, color: 'var(--c-slate)', lineHeight: 1.75, letterSpacing: '-0.2px' }}>
              {bite.realExample}
            </p>
          </div>
        </div>

        {/* ── 관련 경제 용어 ── */}
        {bite.relatedTerms?.length > 0 && (
          <div style={{
            background: 'var(--c-surface)', border: '0.5px solid var(--c-line)',
            borderRadius: 14, overflow: 'hidden', marginBottom: 12,
            boxShadow: 'var(--shadow-card)',
          }}>
            <div style={{ padding: '14px 18px 6px' }}>
              <SectionLabel Icon={Link2} label="함께 알아두면 좋은 개념" />
            </div>
            {bite.relatedTerms.map((term, idx) => {
              const rel = economicBites.find(b => b.title === term);
              return (
                <div key={term} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  gap: 10, padding: '10px 18px',
                  borderTop: '0.5px solid var(--c-green-50)',
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{
                      fontSize: 12, fontWeight: 700, color: 'var(--c-forest-700)',
                      background: 'var(--c-green-100)', border: '0.5px solid var(--c-line)',
                      borderRadius: 100, padding: '2px 10px', display: 'inline-block',
                    }}>
                      {term}
                    </span>
                    {rel && (
                      <p style={{
                        fontSize: 12, color: 'var(--c-slate)', marginTop: 3, lineHeight: 1.5,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
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
            <div style={{ height: 8 }} />
          </div>
        )}

        {/* ── 노밍 한마디 — Yellow ── */}
        {quizData?.nomingMessage && (
          <div style={{
            background: 'var(--c-yellow-100)', border: '1px solid var(--c-yellow-border)',
            borderRadius: 16, padding: '16px', marginBottom: 12,
            boxShadow: '0 2px 12px rgba(139,90,0,0.08)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{
                width: 38, height: 38, borderRadius: '50%',
                background: 'rgba(255,200,61,0.2)', border: '1.5px solid var(--c-yellow-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Sun size={20} color="#F59E0B" />
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--c-amber-700)' }}>
                노밍 한마디
              </div>
            </div>
            <p style={{ fontSize: 13, color: 'var(--c-amber-700)', lineHeight: 1.75, fontWeight: 500 }}>
              {quizData.nomingMessage}
            </p>
          </div>
        )}

        {/* ── 이해도 체크 퀴즈 ── */}
        {quizData?.quiz && (
          <div style={{
            background: 'var(--c-surface)', border: '0.5px solid var(--c-line)',
            borderRadius: 16, padding: '16px 18px', marginBottom: 12,
            position: 'relative', overflow: 'hidden',
            boxShadow: 'var(--shadow-card)',
          }}>
            <SectionLabel Icon={Brain} label="잘 이해했나요?" />

            {showXP && (
              <div style={{
                position: 'absolute', top: 14, right: 16, zIndex: 5,
                fontWeight: 700, color: 'var(--c-forest-700)', fontSize: 13,
                background: 'var(--c-green-100)', border: '0.5px solid var(--c-green-500)',
                borderRadius: 100, padding: '4px 12px',
                animation: 'xpFloat 1.9s ease-out forwards',
                pointerEvents: 'none',
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                <Sprout size={13} color="var(--c-green-500)" /> +10 XP
              </div>
            )}

            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--c-ink)', lineHeight: 1.6, marginBottom: 12 }}>
              {quizData.quiz.question}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {quizData.quiz.options.map((opt, idx) => {
                let bg = 'var(--c-surface)', border = 'var(--c-line)', color = 'var(--c-slate)', QuizIcon = null;
                if (quizRevealed) {
                  if (idx === quizData.quiz.answer) {
                    bg = 'var(--c-green-100)'; border = 'var(--c-green-500)'; color = 'var(--c-forest-700)'; QuizIcon = Check;
                  } else if (idx === quizSelected) {
                    bg = '#FEF2F2'; border = '#FECACA'; color = '#B91C1C'; QuizIcon = X;
                  }
                } else if (idx === quizSelected) {
                  bg = 'var(--c-canvas)'; border = 'var(--c-green-500)'; color = 'var(--c-forest-700)';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleOption(idx)}
                    disabled={quizRevealed}
                    style={{
                      padding: '11px 14px', borderRadius: 10,
                      background: bg, border: `1.5px solid ${border}`, color,
                      fontSize: 13, fontWeight: 500, textAlign: 'left',
                      cursor: quizRevealed ? 'default' : 'pointer',
                      transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 8,
                      animation: quizRevealed && idx === quizData.quiz.answer ? 'correctPop 0.4s ease' : 'none',
                    }}
                    onMouseEnter={e => {
                      if (!quizRevealed) {
                        e.currentTarget.style.background = 'var(--c-canvas)';
                        e.currentTarget.style.borderColor = 'var(--c-green-500)';
                        e.currentTarget.style.color = 'var(--c-forest-700)';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!quizRevealed && idx !== quizSelected) {
                        e.currentTarget.style.background = 'var(--c-surface)';
                        e.currentTarget.style.borderColor = 'var(--c-line)';
                        e.currentTarget.style.color = 'var(--c-slate)';
                      }
                    }}
                  >
                    {QuizIcon && <QuizIcon size={14} color={idx === quizData.quiz.answer ? 'var(--c-green-500)' : '#B91C1C'} style={{ flexShrink: 0 }} />}
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            {quizRevealed && (
              <div style={{
                marginTop: 12, padding: '12px 14px', borderRadius: 10,
                background: isCorrect ? 'var(--c-green-100)' : '#FEF2F2',
                border: `1px solid ${isCorrect ? 'var(--c-green-500)' : '#FECACA'}`,
                fontSize: 13, fontWeight: 600, lineHeight: 1.6,
                color: isCorrect ? 'var(--c-forest-700)' : '#B91C1C',
                display: 'flex', alignItems: 'flex-start', gap: 8,
              }}>
                {isCorrect ? <Check size={15} color="var(--c-green-500)" style={{ flexShrink: 0, marginTop: 1 }} /> : <X size={15} color="#B91C1C" style={{ flexShrink: 0, marginTop: 1 }} />}
                <span>
                  {isCorrect
                    ? '정답이에요! 개념을 잘 이해했네요. 🎉'
                    : `정답은 "${quizData.quiz.options[quizData.quiz.answer]}"예요. 위 내용을 다시 읽어보면 더 잘 기억될 거예요.`}
                </span>
              </div>
            )}
          </div>
        )}

        {/* ── 이전 / 다음 ── */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          {bite.id > 1 && (
            <button
              onClick={() => navigate(`/bite/${bite.id - 1}`)}
              style={{
                flex: 1, padding: '11px 12px', borderRadius: 10,
                border: '1px solid var(--c-line)', background: 'var(--c-surface)',
                color: 'var(--c-forest-700)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                transition: 'border-color 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--c-green-500)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--c-line)'}
            >
              ← 이전 한잎
            </button>
          )}
          <button
            onClick={() => navigate(`/bite/${bite.id < 60 ? bite.id + 1 : 1}`)}
            style={{
              flex: 1, padding: '11px 12px', borderRadius: 10,
              border: '1px solid var(--c-line)', background: 'var(--c-surface)',
              color: 'var(--c-forest-700)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              transition: 'border-color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--c-green-500)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--c-line)'}
          >
            다음 한잎 →
          </button>
        </div>

        {/* ── 완료 CTA ── */}
        <div style={{
          background: 'var(--c-surface)', border: '0.5px solid var(--c-line)',
          borderRadius: 16, padding: '22px 18px', textAlign: 'center',
          boxShadow: 'var(--shadow-card)',
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            background: 'var(--c-green-100)', border: '1.5px solid var(--c-green-300)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 12px',
          }}>
            <Leaf size={26} color="var(--c-green-500)" />
          </div>
          <p style={{ fontSize: 16, fontWeight: 800, color: 'var(--c-forest-700)', marginBottom: 6, letterSpacing: '-0.4px' }}>
            오늘의 한잎 완료! 🌱
          </p>
          <p style={{ fontSize: 13, color: 'var(--c-muted)', marginBottom: 18, lineHeight: 1.6 }}>
            {bite.title}를 배웠어요. 매일 한 잎씩 쌓아가요.
          </p>
          <button
            onClick={() => navigate('/home')}
            style={{
              width: '100%', padding: '13px', borderRadius: 12,
              background: 'var(--grad-action)', color: '#fff', border: 'none', cursor: 'pointer',
              fontSize: 14, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.3px',
              boxShadow: '0 3px 12px rgba(31,190,134,0.35)',
            }}
          >
            홈으로 돌아가기
          </button>
          <button
            onClick={() => navigate('/bites')}
            style={{
              width: '100%', padding: '11px', borderRadius: 12,
              border: '1px solid var(--c-line)', background: 'var(--c-canvas)',
              color: 'var(--c-forest-700)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}
          >
            경제 한잎 모두 보기
          </button>
        </div>

      </div>
    </PageWrapper>
  );
}
