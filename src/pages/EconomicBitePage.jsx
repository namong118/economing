import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  TrendingUp, BarChart2, Globe, PiggyBank, Home, BookOpen,
  FileText, Lightbulb, Link2, Brain, MessageCircle, Clock,
  Leaf, Sprout, Check, X, MapPin,
} from 'lucide-react';
import economicBites, { getBiteById } from '../data/economicBites';
import { BITE_INFOGRAPHICS } from '../data/biteInfographics';
import { getBiteQuiz } from '../data/biteQuizzes';
import PageWrapper from '../components/layout/PageWrapper';
import SaveTermButton from '../components/common/SaveTermButton';
import { useAuth } from '../context/AuthContext';
import { addXp } from '../services/profileService';

const CATEGORY_STYLE = {
  '금리':     { badge: '#FEF3C7', badgeText: '#92400E', Icon: TrendingUp },
  '투자':     { badge: '#D1FAE5', badgeText: '#065F46', Icon: BarChart2 },
  '거시경제': { badge: '#DBEAFE', badgeText: '#1E40AF', Icon: Globe },
  '저축':     { badge: '#D1FAE5', badgeText: '#14532D', Icon: PiggyBank },
  '부동산':   { badge: '#FCE7F3', badgeText: '#831843', Icon: Home },
  '기초':     { badge: '#EDE9FE', badgeText: '#4C1D95', Icon: BookOpen },
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

function SectionLabel({ Icon, label }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      fontSize: 11, fontWeight: 700, color: '#3A9A5C',
      marginBottom: 8, letterSpacing: '0.2px',
    }}>
      <Icon size={12} color="#3A9A5C" />
      {label}
    </div>
  );
}

function ConceptPlaceholder({ bite }) {
  const s = CATEGORY_STYLE[bite.category] ?? { badge: '#E2E8F0', badgeText: '#374151', Icon: MapPin };
  return (
    <div style={{
      background: '#F2FBF5',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '32px 20px', gap: 10, minHeight: 130,
    }}>
      <s.Icon size={36} color="#3A9A5C" />
      <div style={{ fontSize: 16, fontWeight: 700, color: '#2A7A4B', letterSpacing: '-0.4px', textAlign: 'center' }}>
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
            <Leaf size={40} color="#52C97A" />
          </div>
          <p style={{ fontSize: 15, fontWeight: 600 }}>찾을 수 없는 개념이에요.</p>
          <button onClick={() => navigate('/bites')} style={{
            marginTop: 20, padding: '10px 24px', borderRadius: 10,
            background: '#52C97A', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13,
          }}>
            경제 한잎 모음 보기
          </button>
        </div>
      </PageWrapper>
    );
  }

  const catStyle = CATEGORY_STYLE[bite.category] ?? { badge: '#E2E8F0', badgeText: '#374151', Icon: MapPin };
  const diffStyle = DIFFICULTY_STYLE[bite.difficulty] ?? DIFFICULTY_STYLE.medium;
  const CatIcon = catStyle.Icon;

  function handleOption(idx) {
    if (quizRevealed) return;
    setQuizSelected(idx);
    setQuizRevealed(true);
    if (idx === quizData.quiz.answer) {
      setShowXP(true);
      setTimeout(() => setShowXP(false), 1900);
      if (user?.id) addXp(user.id, 10);
    }
  }

  const isCorrect = quizRevealed && quizSelected === quizData?.quiz.answer;

  return (
    <PageWrapper>
      <style>{ANIM}</style>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '16px 16px 80px' }}>

        {/* ── 헤로: 카테고리 + 제목 + 요약 ── */}
        <div style={{
          background: '#E3F9EC',
          border: '0.5px solid #52C97A',
          borderRadius: 14,
          padding: '18px 18px 20px',
          marginBottom: 12,
        }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
            <span style={{
              fontSize: 11, fontWeight: 700, background: catStyle.badge, color: catStyle.badgeText,
              borderRadius: 100, padding: '3px 10px',
              display: 'inline-flex', alignItems: 'center', gap: 4,
            }}>
              <CatIcon size={10} /> {bite.category}
            </span>
            <span style={{
              fontSize: 11, fontWeight: 600,
              background: diffStyle.bg, color: diffStyle.text,
              borderRadius: 100, padding: '3px 10px',
            }}>
              {diffStyle.label}
            </span>
            <span style={{
              fontSize: 11, fontWeight: 600, background: '#F2FBF5', color: '#3A9A5C',
              borderRadius: 100, padding: '3px 10px',
              display: 'inline-flex', alignItems: 'center', gap: 4,
            }}>
              <Clock size={10} /> 약 3분
            </span>
          </div>

          <div style={{
            fontSize: 18, fontWeight: 700, color: '#2A7A4B',
            letterSpacing: '-0.4px', lineHeight: 1.4, marginBottom: 6,
          }}>
            {bite.title}
          </div>
          <p style={{ fontSize: 13, color: '#3A9A5C', fontWeight: 400, lineHeight: 1.65 }}>
            {bite.summary}
          </p>
        </div>

        {/* ── 핵심 인포그래픽 ── */}
        <div style={{
          background: '#fff', border: '0.5px solid #B8EBC8',
          borderRadius: 14, overflow: 'hidden', marginBottom: 12,
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
          background: '#fff', border: '0.5px solid #B8EBC8',
          borderRadius: 14, padding: '14px 18px', marginBottom: 12,
        }}>
          <SectionLabel Icon={FileText} label="쉽게 설명하면" />
          <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.75, letterSpacing: '-0.2px' }}>
            {bite.description}
          </p>
        </div>

        {/* ── 왜 알아야 할까요? ── */}
        <div style={{
          background: '#fff', border: '0.5px solid #B8EBC8',
          borderRadius: 14, padding: '14px 18px', marginBottom: 12,
        }}>
          <SectionLabel Icon={Lightbulb} label="왜 알아야 할까요?" />
          <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.75, letterSpacing: '-0.2px' }}>
            {bite.whyImportant}
          </p>
        </div>

        {/* ── 실생활 예시 ── */}
        <div style={{
          background: '#fff', border: '0.5px solid #B8EBC8',
          borderRadius: 14, padding: '14px 18px', marginBottom: 12,
        }}>
          <SectionLabel Icon={MessageCircle} label="실생활 예시" />
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <MessageCircle size={16} color="#B8EBC8" style={{ flexShrink: 0, marginTop: 3 }} />
            <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.75, letterSpacing: '-0.2px' }}>
              {bite.realExample}
            </p>
          </div>
        </div>

        {/* ── 관련 경제 용어 ── */}
        {bite.relatedTerms?.length > 0 && (
          <div style={{
            background: '#fff', border: '0.5px solid #B8EBC8',
            borderRadius: 14, overflow: 'hidden', marginBottom: 12,
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
                  borderTop: '0.5px solid #E8FAF3',
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{
                      fontSize: 12, fontWeight: 700, color: '#2A7A4B',
                      background: '#E3F9EC', border: '0.5px solid #B8EBC8',
                      borderRadius: 100, padding: '2px 10px', display: 'inline-block',
                    }}>
                      {term}
                    </span>
                    {rel && (
                      <p style={{
                        fontSize: 12, color: '#64748B', marginTop: 3, lineHeight: 1.5,
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

        {/* ── 노밍 한마디 ── */}
        {quizData?.nomingMessage && (
          <div style={{
            background: '#FFFBEE', border: '0.5px solid #FAC775',
            borderRadius: 14, padding: '14px 16px', marginBottom: 12,
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <img
                src={`${import.meta.env.BASE_URL}noming.png`}
                alt="노밍"
                style={{ width: 32, height: 32, objectFit: 'contain', flexShrink: 0 }}
              />
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#B45309', marginBottom: 4 }}>
                  노밍 한마디
                </div>
                <p style={{ fontSize: 13, color: '#78350F', lineHeight: 1.7 }}>
                  {quizData.nomingMessage}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── 이해도 체크 퀴즈 ── */}
        {quizData?.quiz && (
          <div style={{
            background: '#fff', border: '0.5px solid #B8EBC8',
            borderRadius: 14, padding: '14px 18px', marginBottom: 12,
            position: 'relative', overflow: 'hidden',
          }}>
            <SectionLabel Icon={Brain} label="잘 이해했나요?" />

            {showXP && (
              <div style={{
                position: 'absolute', top: 14, right: 16, zIndex: 5,
                fontWeight: 700, color: '#16A34A', fontSize: 13,
                background: '#DCFCE7', border: '0.5px solid #86EFAC',
                borderRadius: 100, padding: '4px 10px',
                animation: 'xpFloat 1.9s ease-out forwards',
                pointerEvents: 'none',
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                <Sprout size={13} color="#16A34A" /> +5 XP
              </div>
            )}

            <p style={{ fontSize: 14, fontWeight: 600, color: '#1E293B', lineHeight: 1.6, marginBottom: 12 }}>
              {quizData.quiz.question}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {quizData.quiz.options.map((opt, idx) => {
                let bg = '#F8FAFC', border = '#E2E8F0', color = '#374151', QuizIcon = null;
                if (quizRevealed) {
                  if (idx === quizData.quiz.answer) {
                    bg = '#F0FDF4'; border = '#B8EBC8'; color = '#15803D'; QuizIcon = Check;
                  } else if (idx === quizSelected) {
                    bg = '#FEF2F2'; border = '#FECACA'; color = '#B91C1C'; QuizIcon = X;
                  }
                } else if (idx === quizSelected) {
                  bg = '#F2FBF5'; border = '#52C97A'; color = '#2A7A4B';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleOption(idx)}
                    disabled={quizRevealed}
                    style={{
                      padding: '11px 14px', borderRadius: 10,
                      background: bg, border: `1px solid ${border}`, color,
                      fontSize: 13, fontWeight: 500, textAlign: 'left',
                      cursor: quizRevealed ? 'default' : 'pointer',
                      transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 8,
                      animation: quizRevealed && idx === quizData.quiz.answer ? 'correctPop 0.4s ease' : 'none',
                    }}
                    onMouseEnter={e => {
                      if (!quizRevealed) {
                        e.currentTarget.style.background = '#F2FBF5';
                        e.currentTarget.style.borderColor = '#52C97A';
                        e.currentTarget.style.color = '#2A7A4B';
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
                    {QuizIcon && <QuizIcon size={14} style={{ flexShrink: 0 }} />}
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            {quizRevealed && (
              <div style={{
                marginTop: 12, padding: '10px 14px', borderRadius: 8,
                background: isCorrect ? '#F0FDF4' : '#FFF7ED',
                border: `0.5px solid ${isCorrect ? '#B8EBC8' : '#FED7AA'}`,
                fontSize: 13, fontWeight: 500, lineHeight: 1.6,
                color: isCorrect ? '#15803D' : '#9A3412',
              }}>
                {isCorrect
                  ? '정답이에요! 개념을 잘 이해했네요.'
                  : `정답은 "${quizData.quiz.options[quizData.quiz.answer]}"예요. 위 내용을 다시 읽어보면 더 잘 기억될 거예요.`}
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
                flex: 1, padding: '10px 12px', borderRadius: 10,
                border: '0.5px solid #B8EBC8', background: '#F2FBF5',
                color: '#2A7A4B', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}
            >
              ← 이전 한잎
            </button>
          )}
          <button
            onClick={() => navigate(`/bite/${bite.id < 60 ? bite.id + 1 : 1}`)}
            style={{
              flex: 1, padding: '10px 12px', borderRadius: 10,
              border: '0.5px solid #B8EBC8', background: '#F2FBF5',
              color: '#2A7A4B', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}
          >
            다음 한잎 →
          </button>
        </div>

        {/* ── 완료 CTA ── */}
        <div style={{
          background: '#fff', border: '0.5px solid #B8EBC8',
          borderRadius: 14, padding: '20px 18px', textAlign: 'center',
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
            <Leaf size={28} color="#52C97A" />
          </div>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#2A7A4B', marginBottom: 4 }}>
            오늘의 한잎 완료!
          </p>
          <p style={{ fontSize: 12, color: '#888780', marginBottom: 16 }}>
            {bite.title}를 배웠어요. 매일 한 잎씩 쌓아가요.
          </p>
          <button
            onClick={() => navigate('/home')}
            style={{
              width: '100%', padding: 12, borderRadius: 10,
              background: '#52C97A', color: '#fff', border: 'none', cursor: 'pointer',
              fontSize: 14, fontWeight: 700, marginBottom: 8,
            }}
          >
            홈으로 돌아가기
          </button>
          <button
            onClick={() => navigate('/bites')}
            style={{
              width: '100%', padding: 10, borderRadius: 10,
              border: '0.5px solid #B8EBC8', background: '#F2FBF5',
              color: '#3A9A5C', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}
          >
            경제 한잎 모두 보기
          </button>
        </div>

      </div>
    </PageWrapper>
  );
}
