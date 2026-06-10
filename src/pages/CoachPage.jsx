import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';
import { askCoach } from '../services/aiService';

const SUGGESTED = [
  { icon: '📚', text: '주식을 처음 공부하려면 무엇부터 해야 하나요?' },
  { icon: '💰', text: '월급을 받으면 가장 먼저 해야 할 것은 무엇인가요?' },
  { icon: '📊', text: 'ETF는 언제 공부하면 좋을까요?' },
  { icon: '🏦', text: '적금과 투자는 무엇이 다른가요?' },
];

/* 마크다운 **bold** 렌더링 */
function renderText(text) {
  return text.split('\n').map((line, i, arr) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return (
      <span key={i}>
        {parts.map((p, j) =>
          p.startsWith('**') && p.endsWith('**')
            ? <strong key={j}>{p.slice(2, -2)}</strong>
            : p
        )}
        {i < arr.length - 1 && <br />}
      </span>
    );
  });
}

export default function CoachPage() {
  const location  = useLocation();
  const [messages, setMessages] = useState([]);
  const [input,    setInput]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const bottomRef  = useRef(null);
  const textareaRef = useRef(null);
  const initSent   = useRef(false);

  const isEmpty = messages.length === 0;

  /* 다른 페이지에서 질문 전달 시 자동 전송 */
  useEffect(() => {
    const q = location.state?.initialQuestion;
    if (q && !initSent.current) { initSent.current = true; send(q); }
  }, []); // eslint-disable-line

  /* 새 메시지 시 스크롤 */
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

    const { answer } = await askCoach(q);
    setMessages(prev => [...prev, { role: 'noming', text: answer }]);
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const handleInput = (e) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 140) + 'px';
  };

  return (
    <PageWrapper>
      <div style={{
        display: 'flex', flexDirection: 'column',
        height: 'calc(100vh - 64px)',
        background: '#F4FAF6',
      }}>

        {/* ── 상단 헤더 ──────────────────────────── */}
        <div style={{
          background: '#fff',
          borderBottom: '1px solid #E8F5EF',
          padding: '16px 0',
          flexShrink: 0,
        }}>
          <div className="container" style={{ maxWidth: '760px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <img
                  src={`${import.meta.env.BASE_URL}coach.png`}
                  alt="노밍"
                  style={{ width: '48px', height: '48px', borderRadius: '14px', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute', bottom: '-2px', right: '-2px',
                  width: '14px', height: '14px', borderRadius: '50%',
                  background: '#21C58E', border: '2px solid #fff',
                }} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                  <span style={{ fontSize: '17px', fontWeight: '900', color: '#0F172A', letterSpacing: '-0.5px' }}>
                    ☀️ 노밍
                  </span>
                  <span style={{
                    fontSize: '11px', fontWeight: '700', color: '#21C58E',
                    background: '#F4FAF6', border: '1px solid #DCF5EB',
                    borderRadius: '100px', padding: '2px 8px',
                  }}>
                    AI 경제 코치
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: '#64748B' }}>
                  무엇부터 시작해야 할지 모르겠다면 물어보세요.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── 메시지 영역 ────────────────────────── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 0' }}>
          <div className="container" style={{ maxWidth: '760px' }}>

            {/* 빈 화면 — 추천 질문 */}
            {isEmpty && (
              <div className="anim-fade">
                {/* 노밍 인사 */}
                <div style={{
                  background: 'linear-gradient(145deg, #FFFBEA, #FFF4CC)',
                  border: '1.5px solid #FFE08A',
                  borderRadius: '20px', padding: '24px 28px',
                  marginBottom: '28px',
                  display: 'flex', alignItems: 'flex-start', gap: '16px',
                }}>
                  <img
                    src={`${import.meta.env.BASE_URL}coach.png`}
                    alt="노밍"
                    style={{ width: '44px', height: '44px', borderRadius: '12px', objectFit: 'cover', flexShrink: 0 }}
                  />
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: '800', color: '#92400E', marginBottom: '8px' }}>
                      ☀️ 노밍이에요!
                    </p>
                    <p style={{ fontSize: '15px', color: '#78350F', lineHeight: '1.7', letterSpacing: '-0.3px' }}>
                      안녕하세요. 저는 AI 경제 코치 <strong>노밍</strong>이에요.<br />
                      경제 고민이 있다면 뭐든 물어보세요. 어렵지 않게 설명해드릴게요. 😊
                    </p>
                  </div>
                </div>

                {/* 추천 질문 */}
                <p style={{ fontSize: '12px', fontWeight: '700', color: '#94A3B8', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '12px' }}>
                  이런 질문은 어때요?
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {SUGGESTED.map(({ icon, text }) => (
                    <button
                      key={text}
                      onClick={() => send(text)}
                      style={{
                        display: 'flex', alignItems: 'flex-start', gap: '10px',
                        padding: '16px 18px', borderRadius: '16px',
                        background: '#fff', border: '1.5px solid #E8F5EF',
                        textAlign: 'left', cursor: 'pointer',
                        fontSize: '14px', color: '#374151', fontWeight: '500',
                        lineHeight: '1.5', transition: 'all 0.15s',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = '#21C58E';
                        e.currentTarget.style.color = '#0A5C43';
                        e.currentTarget.style.background = '#F4FAF6';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(33,197,142,0.15)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = '#E8F5EF';
                        e.currentTarget.style.color = '#374151';
                        e.currentTarget.style.background = '#fff';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)';
                      }}
                    >
                      <span style={{ fontSize: '20px', flexShrink: 0, marginTop: '1px' }}>{icon}</span>
                      <span>{text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 대화 메시지 */}
            {messages.map((msg, i) => (
              <div
                key={i}
                className="anim-fade"
                style={{
                  display: 'flex',
                  flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                  alignItems: 'flex-start', gap: '12px',
                  marginBottom: '20px',
                }}
              >
                {/* 노밍 아바타 */}
                {msg.role === 'noming' && (
                  <img
                    src={`${import.meta.env.BASE_URL}coach.png`}
                    alt="노밍"
                    style={{ width: '36px', height: '36px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0, marginTop: '2px' }}
                  />
                )}

                {/* 말풍선 */}
                <div style={{
                  maxWidth: '72%',
                  padding: msg.role === 'noming' ? '16px 20px' : '13px 18px',
                  borderRadius: msg.role === 'user'
                    ? '18px 4px 18px 18px'
                    : '4px 18px 18px 18px',
                  background: msg.role === 'user'
                    ? 'linear-gradient(135deg, #21C58E, #1AAD7D)'
                    : '#fff',
                  color: msg.role === 'user' ? '#fff' : '#1E293B',
                  fontSize: '14px', lineHeight: '1.8',
                  boxShadow: msg.role === 'user'
                    ? '0 4px 14px rgba(33,197,142,0.3)'
                    : '0 2px 8px rgba(0,0,0,0.06)',
                  border: msg.role === 'noming' ? '1px solid #E8F5EF' : 'none',
                }}>
                  {msg.role === 'noming' ? renderText(msg.text) : msg.text}
                </div>
              </div>
            ))}

            {/* 로딩 */}
            {loading && (
              <div className="anim-fade" style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '20px' }}>
                <img
                  src={`${import.meta.env.BASE_URL}coach.png`}
                  alt="노밍"
                  style={{ width: '36px', height: '36px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0, marginTop: '2px' }}
                />
                <div style={{
                  padding: '16px 20px', borderRadius: '4px 18px 18px 18px',
                  background: '#fff', border: '1px solid #E8F5EF',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}>
                  <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                    {[0, 1, 2].map(i => (
                      <div key={i} style={{
                        width: '7px', height: '7px', borderRadius: '50%',
                        background: '#21C58E', opacity: 0.7,
                        animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                      }} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>

        {/* ── 입력창 ─────────────────────────────── */}
        <div style={{
          flexShrink: 0,
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(12px)',
          borderTop: '1px solid #E8F5EF',
          padding: '12px 0 16px',
        }}>
          <div className="container" style={{ maxWidth: '760px' }}>

            {/* 대화 중 추천 질문 칩 */}
            {!isEmpty && !loading && (
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px', scrollbarWidth: 'none' }}>
                {SUGGESTED.slice(0, 3).map(({ text }) => (
                  <button
                    key={text}
                    onClick={() => send(text)}
                    style={{
                      flexShrink: 0, padding: '6px 14px', borderRadius: '100px',
                      background: '#F4FAF6', border: '1.5px solid #DCF5EB',
                      fontSize: '12px', color: '#374151', cursor: 'pointer',
                      transition: 'all 0.15s', whiteSpace: 'nowrap', fontWeight: '500',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#21C58E'; e.currentTarget.style.color = '#0A5C43'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#DCF5EB'; e.currentTarget.style.color = '#374151'; }}
                  >
                    {text.length > 22 ? text.slice(0, 22) + '...' : text}
                  </button>
                ))}
              </div>
            )}

            {/* 텍스트 입력 */}
            <div style={{
              display: 'flex', gap: '10px', alignItems: 'flex-end',
              background: '#fff', border: '1.5px solid #DCF5EB',
              borderRadius: '16px', padding: '10px 10px 10px 16px',
              boxShadow: '0 2px 12px rgba(33,197,142,0.08)',
              transition: 'border-color 0.15s',
            }}
            onFocus={e => e.currentTarget.style.borderColor = '#21C58E'}
            onBlur={e => e.currentTarget.style.borderColor = '#DCF5EB'}
            >
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder="경제 고민을 입력해보세요 (Enter 전송, Shift+Enter 줄바꿈)"
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
                  width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0,
                  background: !input.trim() || loading ? '#E2E8F0' : '#21C58E',
                  border: 'none',
                  cursor: !input.trim() || loading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '18px', color: '#fff',
                  boxShadow: !input.trim() || loading ? 'none' : '0 4px 12px rgba(33,197,142,0.35)',
                  transition: 'all 0.15s',
                }}
              >
                ↑
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* 로딩 도트 애니메이션 */}
      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
    </PageWrapper>
  );
}
