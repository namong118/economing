import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';
import { useAuth } from '../context/AuthContext';
import { getCoachResponse } from '../services/coachService';
import { createConversation } from '../services/conversationService';

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
  const { advice, knowFirst, nextStep } = structured;
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #E8F5EF',
      borderRadius: '4px 20px 20px 20px',
      overflow: 'hidden',
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      maxWidth: '76%',
    }}>
      {/* 💡 한 줄 조언 */}
      <div style={{
        background: 'linear-gradient(135deg, #FFFBEA, #FFF4CC)',
        borderBottom: '1px solid #FFE08A',
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
          <p style={{ fontSize: '11px', fontWeight: '700', color: '#64748B', letterSpacing: '0.5px' }}>
            먼저 알아두면 좋은 것
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
          {knowFirst.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <div style={{
                width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0,
                background: '#F4FAF6', border: '1.5px solid #A7F3D0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '10px', fontWeight: '800', color: '#21C58E', marginTop: '1px',
              }}>
                {i + 1}
              </div>
              <p style={{ fontSize: '13px', color: '#334155', lineHeight: '1.6', fontWeight: '500' }}>
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ➡️ 다음에 공부하면 좋은 것 */}
      <div style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '14px' }}>➡️</span>
        <p style={{ fontSize: '11px', fontWeight: '700', color: '#64748B', letterSpacing: '0.5px' }}>
          다음에 공부하면 좋은 것
        </p>
        <span style={{
          fontSize: '12px', fontWeight: '700', color: '#21C58E',
          background: '#F4FAF6', border: '1.5px solid #DCF5EB',
          borderRadius: '100px', padding: '3px 12px',
          marginLeft: 'auto', whiteSpace: 'nowrap',
        }}>
          {nextStep}
        </span>
      </div>
    </div>
  );
}

/* ── 빈 상태 ─────────────────────────────────────────────── */
function EmptyState({ onSelect, BASE_URL }) {
  return (
    <div className="anim-fade" style={{ padding: '8px 0 24px' }}>
      {/* 노밍 인사 카드 */}
      <div style={{
        background: 'linear-gradient(145deg, #FFFBEA, #FFF4CC)',
        border: '1.5px solid #FFE08A',
        borderRadius: '24px', padding: '24px',
        marginBottom: '28px',
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
            background: '#21C58E', border: '2.5px solid #FFFBEA',
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

      {/* 추천 질문 */}
      <p style={{
        fontSize: '12px', fontWeight: '700', color: '#94A3B8',
        letterSpacing: '0.8px', textTransform: 'uppercase',
        marginBottom: '12px',
      }}>
        이런 고민이 있다면 물어보세요
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {SUGGESTED_QUESTIONS.map(q => (
          <button
            key={q}
            onClick={() => onSelect(q)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '15px 18px', borderRadius: '14px',
              background: '#fff', border: '1.5px solid #E2E8F0',
              cursor: 'pointer', textAlign: 'left',
              fontSize: '14px', color: '#1E293B', fontWeight: '500',
              lineHeight: '1.5', transition: 'all 0.15s',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#21C58E';
              e.currentTarget.style.background  = '#F4FAF6';
              e.currentTarget.style.color       = '#0A5C43';
              e.currentTarget.style.transform   = 'translateX(3px)';
              e.currentTarget.style.boxShadow   = '0 4px 12px rgba(33,197,142,0.12)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#E2E8F0';
              e.currentTarget.style.background  = '#fff';
              e.currentTarget.style.color       = '#1E293B';
              e.currentTarget.style.transform   = 'translateX(0)';
              e.currentTarget.style.boxShadow   = '0 1px 4px rgba(0,0,0,0.04)';
            }}
          >
            <span style={{ flex: 1, paddingRight: '12px' }}>{q}</span>
            <span style={{ fontSize: '16px', color: '#CBD5E1', flexShrink: 0 }}>›</span>
          </button>
        ))}
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
        background: '#fff', border: '1px solid #E8F5EF',
        borderRadius: '4px 16px 16px 16px',
        padding: '12px 18px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
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
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (question) => {
    const q = (question ?? input).trim();
    if (!q || loading) return;

    setMessages(prev => [...prev, { role: 'user', text: q }]);
    setInput('');
    setLoading(true);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    const { answer, structured } = await getCoachResponse(q);
    setMessages(prev => [...prev, { role: 'noming', structured }]);
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

        {/* ── 헤더 ────────────────────────────────────────── */}
        <div style={{
          background: '#fff',
          borderBottom: '1px solid #E8F5EF',
          padding: '14px 0',
          flexShrink: 0,
        }}>
          <div className="container" style={{ maxWidth: '720px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <img
                  src={`${BASE_URL}coach.png`}
                  alt="노밍"
                  style={{ width: '46px', height: '46px', borderRadius: '13px', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute', bottom: '-2px', right: '-2px',
                  width: '13px', height: '13px', borderRadius: '50%',
                  background: '#21C58E', border: '2px solid #fff',
                }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                  <span style={{ fontSize: '16px', fontWeight: '900', color: '#0F172A', letterSpacing: '-0.4px' }}>
                    ☀️ 노밍
                  </span>
                  <span style={{
                    fontSize: '11px', fontWeight: '700', color: '#21C58E',
                    background: '#F4FAF6', border: '1px solid #DCF5EB',
                    borderRadius: '100px', padding: '2px 8px',
                  }}>
                    AI 경제 성장 코치
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#64748B', letterSpacing: '-0.2px' }}>
                  무엇부터 시작해야 할지 모르겠다면 물어보세요.
                </p>
              </div>
              {!isEmpty && (
                <button
                  onClick={() => setMessages([])}
                  style={{
                    flexShrink: 0, padding: '6px 12px', borderRadius: '8px',
                    background: '#F8FAFC', border: '1px solid #E2E8F0',
                    fontSize: '12px', color: '#64748B', cursor: 'pointer',
                    fontWeight: '600', transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#F1F5F9'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#F8FAFC'; }}
                >
                  새 대화
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── 메시지 영역 ─────────────────────────────────── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 0' }}>
          <div className="container" style={{ maxWidth: '720px' }}>

            {isEmpty ? (
              <EmptyState onSelect={send} BASE_URL={BASE_URL} />
            ) : (
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
                      /* 노밍 응답 카드 */
                      <NomingCard structured={msg.structured} />
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
          borderTop: '1px solid #E8F5EF',
          padding: '10px 0 14px',
        }}>
          <div className="container" style={{ maxWidth: '720px' }}>

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
                    background: input === chip ? '#F4FAF6' : '#F8FAFC',
                    border: `1.5px solid ${input === chip ? '#21C58E' : '#E2E8F0'}`,
                    fontSize: '12px', fontWeight: '600',
                    color: input === chip ? '#0A5C43' : '#64748B',
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
              background: '#fff', border: '1.5px solid #DCF5EB',
              borderRadius: '16px', padding: '10px 10px 10px 16px',
              boxShadow: '0 2px 12px rgba(33,197,142,0.08)',
              transition: 'border-color 0.15s, box-shadow 0.15s',
            }}
            onFocus={e => {
              e.currentTarget.style.borderColor = '#21C58E';
              e.currentTarget.style.boxShadow  = '0 2px 16px rgba(33,197,142,0.15)';
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor = '#DCF5EB';
              e.currentTarget.style.boxShadow  = '0 2px 12px rgba(33,197,142,0.08)';
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
                  fontSize: '14px', color: '#0F172A', background: 'transparent',
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
