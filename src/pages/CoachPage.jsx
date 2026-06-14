import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import { useAuth } from '../context/AuthContext';
import { getCoachResponse } from '../services/coachService';
import { createConversation } from '../services/conversationService';
import { getInfographic } from '../data/infographicData';
import InfographicCard from '../components/infographic/InfographicCard';
import SaveTermButton from '../components/common/SaveTermButton';

/* ── 추천 질문 ────────────────────────────────────────────── */
const SUGGESTED_QUESTIONS = [
  '월급을 받으면 가장 먼저 해야 할 것은 무엇인가요?',
  '주식 공부는 어디서부터 시작하면 좋을까요?',
  'ETF는 언제 공부하면 좋을까요?',
  '적금과 투자의 차이는 무엇인가요?',
  '경제 공부 순서를 알려주세요.',
];

const INPUT_CHIPS = ['월급 관리', '저축', '투자 입문', '경제 공부', 'ETF'];

/* ── 노밍 응답 카드 ─────────────────────────────────────── */
function NomingCard({ structured }) {
  const { advice, knowFirst, nextStep, terms } = structured;
  return (
    <div style={{
      background: '#fff',
      border: '0.5px solid #d4ede3',
      borderRadius: '4px 20px 20px 20px',
      overflow: 'hidden',
    }}>
      {/* 💡 한 줄 조언 */}
      <div style={{
        background: '#F4FAF6',
        borderBottom: '0.5px solid #d4ede3',
        padding: '14px 18px',
        display: 'flex', gap: '10px',
      }}>
        <span style={{ fontSize: '17px', flexShrink: 0, marginTop: '1px' }}>💡</span>
        <div>
          <p style={{ fontSize: '11px', fontWeight: '700', color: '#B45309', marginBottom: '4px', letterSpacing: '0.5px' }}>
            노밍의 한 줄 조언
          </p>
          <p style={{ fontSize: '14px', fontWeight: '600', color: '#78350F', lineHeight: '1.65' }}>
            {advice}
          </p>
        </div>
      </div>

      {/* 📚 먼저 알아두면 좋은 것 */}
      <div style={{ padding: '14px 18px', borderBottom: '1px solid #F1F5F9' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
          <span style={{ fontSize: '15px' }}>📚</span>
          <p style={{ fontSize: '11px', fontWeight: '700', color: '#888780', letterSpacing: '0.5px' }}>
            먼저 알아두면 좋은 것
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
          {knowFirst.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <div style={{
                width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0,
                background: '#F4FAF6', border: '0.5px solid #d4ede3',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '10px', fontWeight: '800', color: '#21C58E', marginTop: '1px',
              }}>
                {i + 1}
              </div>
              <p style={{ fontSize: '13px', color: '#5F5E5A', lineHeight: '1.6', fontWeight: '500' }}>
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ➡️ 다음에 공부하면 좋은 것 */}
      <div style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <ArrowRight size={14} color="#888780" />
        <p style={{ fontSize: '11px', fontWeight: '700', color: '#888780', letterSpacing: '0.5px' }}>
          다음에 공부하면 좋은 것
        </p>
        <span style={{
          fontSize: '12px', fontWeight: '700', color: '#21C58E',
          background: '#F4FAF6', border: '0.5px solid #d4ede3',
          borderRadius: '100px', padding: '3px 12px',
          marginLeft: 'auto', whiteSpace: 'nowrap',
        }}>
          {nextStep}
        </span>
      </div>

      {/* 💾 핵심 용어 저장 */}
      {terms && terms.length > 0 && (
        <div style={{
          padding: '12px 18px 14px',
          borderTop: '1px solid #F1F5F9',
          background: '#F4FAF6',
        }}>
          <p style={{ fontSize: '11px', fontWeight: '700', color: '#888780', letterSpacing: '0.4px', marginBottom: '8px' }}>
            💾 이 대화의 핵심 용어
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            {terms.map(t => (
              <div key={t.term} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                gap: '10px', background: '#fff', border: '0.5px solid #d4ede3',
                borderRadius: '10px', padding: '8px 12px',
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#085041' }}>{t.term}</span>
                  <p style={{ fontSize: '11px', color: '#888780', marginTop: '2px', lineHeight: '1.5',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {t.meaning}
                  </p>
                </div>
                <SaveTermButton
                  term={t.term}
                  meaning={t.meaning}
                  sourceType="coach"
                  size="sm"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── 노밍 인사 카드 (상단 고정) ────────────────────────────── */
function NomingGreeting({ BASE_URL }) {
  return (
    <div className="anim-fade" style={{
      background: '#FFF4D6',
      border: '0.5px solid #FAC775',
      borderRadius: '12px', padding: '24px',
      display: 'flex', gap: '16px', alignItems: 'flex-start',
    }}>
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <img
          src={`${BASE_URL}coach.png`}
          alt="노밍"
          style={{ width: '56px', height: '56px', borderRadius: '16px', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute', bottom: '-2px', right: '-2px',
          width: '14px', height: '14px', borderRadius: '50%',
          background: '#21C58E', border: '2.5px solid #FFF4D6',
        }} />
      </div>
      <div>
        <p style={{ fontSize: '14px', fontWeight: '800', color: '#92400E', marginBottom: '6px' }}>
          ☀️ 노밍이에요!
        </p>
        <p style={{ fontSize: '15px', color: '#78350F', lineHeight: '1.7', letterSpacing: '-0.3px' }}>
          안녕하세요. 무엇부터 시작해야 할지<br />
          모르겠다면 제가 함께 정리해드릴게요.
        </p>
      </div>
    </div>
  );
}

/* ── 로딩 ─────────────────────────────────────────────────── */
function LoadingBubble({ BASE_URL }) {
  return (
    <div className="anim-fade" style={{
      display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '20px',
    }}>
      <img
        src={`${BASE_URL}coach.png`}
        alt="노밍"
        style={{ width: '32px', height: '32px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0, marginTop: '2px' }}
      />
      <div style={{
        background: '#fff', border: '0.5px solid #d4ede3',
        borderRadius: '4px 16px 16px 16px',
        padding: '12px 18px',
      }}>
        <p style={{ fontSize: '12px', color: '#21C58E', fontWeight: '600', marginBottom: '7px' }}>
          ☀️ 노밍이 답변을 준비하고 있어요...
        </p>
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: '7px', height: '7px', borderRadius: '50%',
              background: '#21C58E', opacity: 0.7,
              animation: `nomingBounce 1.3s ease-in-out ${i * 0.22}s infinite`,
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── 메인 ─────────────────────────────────────────────────── */
export default function CoachPage() {
  const location    = useLocation();
  const [messages,  setMessages]  = useState([]);
  const [input,     setInput]     = useState('');
  const [loading,   setLoading]   = useState(false);
  const bottomRef   = useRef(null);
  const textareaRef = useRef(null);
  const initSent    = useRef(false);

  const { user } = useAuth();
  const isEmpty  = messages.length === 0;
  const BASE_URL = import.meta.env.BASE_URL;

  /* 다른 페이지에서 질문 전달 시 자동 전송 */
  useEffect(() => {
    const q = location.state?.initialQuestion;
    if (q && !initSent.current) { initSent.current = true; send(q); }
  }, []); // eslint-disable-line

  useEffect(() => {
    if (messages.length > 0 || loading) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const send = async (question) => {
    const q = (question ?? input).trim();
    if (!q || loading) return;

    setMessages(prev => [...prev, { role: 'user', text: q }]);
    setInput('');
    setLoading(true);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    const { answer, structured } = await getCoachResponse(q);
    const infographic = getInfographic(q);
    setMessages(prev => [...prev, { role: 'noming', structured, infographic }]);
    setLoading(false);

    // 로그인 사용자의 대화를 DB에 저장 (fire-and-forget)
    if (user?.id) {
      createConversation({ userId: user.id, question: q, answer });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const handleInput = (e) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 140) + 'px';
  };

  const handleChip = (chip) => {
    setInput(chip);
    textareaRef.current?.focus();
  };

  return (
    <PageWrapper>
      <div style={{
        display: 'flex', flexDirection: 'column',
        height: 'calc(100vh - 64px)',
        background: '#F4FAF6',
      }}>


        {/* ── 노밍 인사 카드 + 추천 질문 (빈 상태, 스크롤 밖 고정) ── */}
        {isEmpty && (
          <div style={{ flexShrink: 0, padding: '20px 0 0' }}>
            <div className="container" style={{ maxWidth: '720px' }}>
              <NomingGreeting BASE_URL={BASE_URL} />

              {/* 추천 질문 - 노밍 카드 바로 아래 */}
              <div style={{ marginTop: '16px' }}>
                <p style={{
                  fontSize: '11px', fontWeight: '700', color: '#888780',
                  letterSpacing: '0.8px', textTransform: 'uppercase',
                  marginBottom: '8px',
                }}>
                  이런 고민이 있다면 물어보세요
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {SUGGESTED_QUESTIONS.map(q => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '12px 16px', borderRadius: '8px',
                        background: '#fff', border: '0.5px solid #d4ede3',
                        cursor: 'pointer', textAlign: 'left',
                        fontSize: '13px', color: '#5F5E5A', fontWeight: '500',
                        lineHeight: '1.4', transition: 'all 0.15s',
                        fontFamily: 'inherit',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = '#21C58E';
                        e.currentTarget.style.background  = '#F4FAF6';
                        e.currentTarget.style.color       = '#085041';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = '#d4ede3';
                        e.currentTarget.style.background  = '#fff';
                        e.currentTarget.style.color       = '#5F5E5A';
                      }}
                    >
                      <span style={{ flex: 1, paddingRight: '10px' }}>{q}</span>
                      <span style={{ fontSize: '15px', color: '#CBD5E1', flexShrink: 0 }}>›</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── 메시지 영역 ─────────────────────────────────── */}
        <div style={{ flex: isEmpty ? 0 : 1, overflowY: 'auto', padding: isEmpty ? '0' : '24px 0' }}>
          <div className="container" style={{ maxWidth: '720px' }}>

            {!isEmpty && (
              <>
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className="anim-fade"
                    style={{
                      display: 'flex',
                      flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                      alignItems: 'flex-start', gap: '10px',
                      marginBottom: '20px',
                    }}
                  >
                    {/* 노밍 아바타 */}
                    {msg.role === 'noming' && (
                      <img
                        src={`${BASE_URL}coach.png`}
                        alt="노밍"
                        style={{
                          width: '32px', height: '32px', borderRadius: '10px',
                          objectFit: 'cover', flexShrink: 0, marginTop: '2px',
                        }}
                      />
                    )}

                    {msg.role === 'user' ? (
                      /* 사용자 말풍선 */
                      <div style={{
                        maxWidth: '72%', padding: '12px 18px',
                        borderRadius: '18px 4px 18px 18px',
                        background: 'linear-gradient(135deg, #21C58E, #1AAD7D)',
                        color: '#fff', fontSize: '14px', lineHeight: '1.7',
                        fontWeight: '500',
                        boxShadow: '0 4px 14px rgba(33,197,142,0.3)',
                      }}>
                        {msg.text}
                      </div>
                    ) : (
                      /* 노밍 응답 + 인포그래픽 */
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '76%' }}>
                        <NomingCard structured={msg.structured} />
                        {msg.infographic && <InfographicCard data={msg.infographic} />}
                      </div>
                    )}
                  </div>
                ))}

                {loading && <LoadingBubble BASE_URL={BASE_URL} />}
              </>
            )}

            <div ref={bottomRef} />
          </div>
        </div>

        {/* ── 입력 영역 ───────────────────────────────────── */}
        <div style={{
          flexShrink: 0,
          background: 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(12px)',
          borderTop: '0.5px solid #d4ede3',
          padding: '10px 0 14px',
        }}>
          <div className="container" style={{ maxWidth: '720px' }}>

            {/* 새 대화 버튼 (대화 중일 때만 표시) */}
            {!isEmpty && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
                <button
                  onClick={() => setMessages([])}
                  style={{
                    padding: '5px 12px', borderRadius: '8px',
                    background: '#F4FAF6', border: '0.5px solid #d4ede3',
                    fontSize: '12px', color: '#888780', cursor: 'pointer',
                    fontWeight: '600',
                  }}
                >
                  새 대화
                </button>
              </div>
            )}

            {/* 빠른 주제 칩 */}
            <div style={{
              display: 'flex', gap: '7px', overflowX: 'auto',
              paddingBottom: '10px', scrollbarWidth: 'none',
            }}>
              {INPUT_CHIPS.map(chip => (
                <button
                  key={chip}
                  onClick={() => handleChip(chip)}
                  style={{
                    flexShrink: 0, padding: '5px 13px', borderRadius: '100px',
                    background: '#F4FAF6',
                    border: `0.5px solid ${input === chip ? '#21C58E' : '#d4ede3'}`,
                    fontSize: '12px', fontWeight: '600',
                    color: input === chip ? '#085041' : '#888780',
                    cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap',
                  }}
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* 텍스트 입력 */}
            <div style={{
              display: 'flex', gap: '10px', alignItems: 'flex-end',
              background: '#fff', border: '0.5px solid #d4ede3',
              borderRadius: '12px', padding: '10px 10px 10px 16px',
              transition: 'border-color 0.15s',
            }}
            onFocus={e => {
              e.currentTarget.style.borderColor = '#21C58E';
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor = '#d4ede3';
            }}
            >
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder="경제 고민을 입력해보세요 (Enter 전송)"
                rows={1}
                disabled={loading}
                style={{
                  flex: 1, border: 'none', outline: 'none', resize: 'none',
                  fontSize: '14px', color: '#085041', background: 'transparent',
                  lineHeight: '1.6', fontFamily: 'inherit', maxHeight: '140px',
                  overflowY: 'auto',
                }}
              />
              <button
                onClick={() => send()}
                disabled={!input.trim() || loading}
                style={{
                  width: '38px', height: '38px', borderRadius: '12px', flexShrink: 0,
                  background: !input.trim() || loading
                    ? '#E2E8F0'
                    : 'linear-gradient(135deg, #21C58E, #1AAD7D)',
                  border: 'none',
                  cursor: !input.trim() || loading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '17px', color: '#fff',
                  boxShadow: !input.trim() || loading
                    ? 'none'
                    : '0 4px 12px rgba(33,197,142,0.35)',
                  transition: 'all 0.15s',
                }}
              >
                ↑
              </button>
            </div>

          </div>
        </div>

      </div>

      <style>{`
        @keyframes nomingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.7; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </PageWrapper>
  );
}
