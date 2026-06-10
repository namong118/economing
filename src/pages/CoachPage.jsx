/* AI 경제 코치 페이지 */
import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';
import { askCoach } from '../services/aiService';
import { roadmap } from '../data/roadmapData';

const SUGGESTED = [
  '경제 공부, 어디서부터 시작해야 할까요?',
  '월급 받으면 가장 먼저 해야 할 것은?',
  '사회초년생인데 청약통장부터 만들어야 하나요?',
  '적금과 ETF 중 무엇부터 시작해야 할까요?',
  '연말정산을 더 많이 돌려받는 방법이 있나요?',
  '투자를 꼭 해야 할까요?',
];

// 마크다운 굵은글씨 (**text**) → bold 처리
function renderAnswer(text) {
  return text.split('\n').map((line, i) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return (
      <span key={i}>
        {parts.map((part, j) =>
          part.startsWith('**') && part.endsWith('**')
            ? <strong key={j}>{part.slice(2, -2)}</strong>
            : part
        )}
        {i < text.split('\n').length - 1 && <br />}
      </span>
    );
  });
}

export default function CoachPage() {
  const location = useLocation();
  const [messages,   setMessages]   = useState([]);
  const [input,      setInput]      = useState('');
  const [loading,    setLoading]    = useState(false);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);
  const initSent  = useRef(false);

  // 다른 페이지에서 초기 질문을 가져온 경우 자동 전송
  useEffect(() => {
    const q = location.state?.initialQuestion;
    if (q && !initSent.current) {
      initSent.current = true;
      send(q);
    }
  }, []); // eslint-disable-line

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (question) => {
    const q = question.trim();
    if (!q || loading) return;

    setMessages(prev => [...prev, { role: 'user', text: q }]);
    setInput('');
    setLoading(true);

    const { answer } = await askCoach(q);
    setMessages(prev => [...prev, { role: 'coach', text: answer }]);
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    send(input);
  };

  const isEmpty = messages.length === 0;

  return (
    <PageWrapper>
      <div className="anim-fade" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' }}>

        {/* ── 헤더 ── */}
        <div style={{ borderBottom: '1px solid #F1F5F9', background: '#fff', padding: '20px 0 18px', flexShrink: 0 }}>
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <img
                src={`${import.meta.env.BASE_URL}coach.png`}
                alt="AI 코치"
                style={{
                  width: '44px', height: '44px', borderRadius: '14px',
                  objectFit: 'cover', boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
                }}
              />
              <div>
                <h1 style={{ fontSize: '20px', fontWeight: '900', color: '#0F172A', letterSpacing: '-0.8px', lineHeight: 1 }}>
                  AI 경제 코치
                </h1>
                <p style={{ fontSize: '13px', color: '#64748B', marginTop: '3px' }}>
                  경제 공부, 어디서부터 시작해야 할지 물어보세요
                </p>
              </div>
              <div style={{
                marginLeft: 'auto', background: '#FEF3C7', border: '1px solid #FCD34D',
                borderRadius: '100px', padding: '4px 12px',
                fontSize: '12px', fontWeight: '600', color: '#92400E',
              }}>
                🔧 OpenAI 연결 예정
              </div>
            </div>
          </div>
        </div>

        {/* ── 메시지 영역 ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 0' }}>
          <div className="container" style={{ maxWidth: '780px' }}>

            {/* 빈 화면: 환영 + 추천 질문 */}
            {isEmpty && (
              <div style={{ textAlign: 'center', padding: '40px 0 32px' }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>💬</div>
                <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.8px', marginBottom: '10px' }}>
                  무엇이든 물어보세요
                </h2>
                <p style={{ fontSize: '15px', color: '#64748B', lineHeight: '1.7', marginBottom: '36px' }}>
                  ETF가 뭔지보다 <strong>어디서부터 시작해야 할지</strong>를 먼저 알려드릴게요.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', textAlign: 'left' }}>
                  {SUGGESTED.map((q) => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      style={{
                        padding: '14px 18px', borderRadius: '14px',
                        background: '#F8FAFC', border: '1.5px solid #E2E8F0',
                        fontSize: '14px', fontWeight: '500', color: '#374151',
                        cursor: 'pointer', textAlign: 'left', lineHeight: '1.5',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#10B981'; e.currentTarget.style.color = '#065F46'; e.currentTarget.style.background = '#ECFDF5'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.color = '#374151'; e.currentTarget.style.background = '#F8FAFC'; }}
                    >
                      {q}
                    </button>
                  ))}
                </div>

                {/* 로드맵 미리보기 */}
                <div style={{ marginTop: '40px', textAlign: 'left' }}>
                  <p style={{ fontSize: '12px', fontWeight: '700', color: '#94A3B8', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '14px' }}>
                    경제 성장 5단계 로드맵
                  </p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {roadmap.map((step) => (
                      <div key={step.step} style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        background: '#fff', border: '1.5px solid #E2E8F0',
                        borderRadius: '100px', padding: '6px 14px',
                        fontSize: '13px', fontWeight: '600', color: '#374151',
                      }}>
                        <span>{step.emoji}</span>
                        <span>STEP {step.step}</span>
                        <span style={{ color: '#94A3B8', fontWeight: '400' }}>{step.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 대화 메시지들 */}
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                  gap: '12px',
                  marginBottom: '20px',
                  alignItems: 'flex-start',
                }}
              >
                {/* 아바타 */}
                {msg.role === 'coach' && (
                  <img
                    src={`${import.meta.env.BASE_URL}coach.png`}
                    alt="AI 코치"
                    style={{
                      width: '36px', height: '36px', borderRadius: '12px',
                      objectFit: 'cover', flexShrink: 0,
                    }}
                  />
                )}

                {/* 말풍선 */}
                <div style={{
                  maxWidth: '75%',
                  padding: msg.role === 'coach' ? '16px 20px' : '12px 18px',
                  borderRadius: msg.role === 'user' ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
                  background: msg.role === 'user'
                    ? 'linear-gradient(135deg, #10B981, #059669)'
                    : '#fff',
                  color: msg.role === 'user' ? '#fff' : '#0F172A',
                  fontSize: '14px', lineHeight: '1.75',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                  border: msg.role === 'coach' ? '1px solid #F1F5F9' : 'none',
                }}>
                  {msg.role === 'coach'
                    ? renderAnswer(msg.text)
                    : msg.text
                  }
                </div>
              </div>
            ))}

            {/* 로딩 */}
            {loading && (
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '20px' }}>
                <img
                  src={`${import.meta.env.BASE_URL}coach.png`}
                  alt="AI 코치"
                  style={{
                    width: '36px', height: '36px', borderRadius: '12px',
                    objectFit: 'cover', flexShrink: 0,
                  }}
                />
                <div style={{
                  padding: '16px 20px', borderRadius: '4px 18px 18px 18px',
                  background: '#fff', border: '1px solid #F1F5F9',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                }}>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    {[0, 1, 2].map(i => (
                      <div key={i} style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        background: '#10B981',
                        animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                      }} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>

        {/* ── 입력창 ── */}
        <div style={{
          flexShrink: 0, borderTop: '1px solid #F1F5F9',
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(12px)', padding: '16px 0',
        }}>
          <div className="container" style={{ maxWidth: '780px' }}>
            {/* 추천 질문 (대화 중) */}
            {!isEmpty && !loading && (
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px' }} className="no-scrollbar">
                {SUGGESTED.slice(0, 4).map(q => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    style={{
                      flexShrink: 0, padding: '6px 14px', borderRadius: '100px',
                      background: '#F8FAFC', border: '1.5px solid #E2E8F0',
                      fontSize: '13px', color: '#374151', cursor: 'pointer',
                      transition: 'all 0.15s', whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#10B981'; e.currentTarget.style.color = '#059669'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.color = '#374151'; }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); }
                }}
                placeholder="경제에 대해 뭐든 물어보세요. (Enter로 전송, Shift+Enter 줄바꿈)"
                rows={1}
                disabled={loading}
                style={{
                  flex: 1, padding: '14px 18px', borderRadius: '14px',
                  border: '1.5px solid #E2E8F0', fontSize: '14px',
                  color: '#0F172A', background: '#F8FAFC', resize: 'none',
                  lineHeight: '1.5', maxHeight: '120px', overflowY: 'auto',
                  fontFamily: 'inherit', transition: 'border-color 0.15s',
                }}
                onFocus={e => e.target.style.borderColor = '#10B981'}
                onBlur={e => e.target.style.borderColor = '#E2E8F0'}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                style={{
                  width: '48px', height: '48px', borderRadius: '14px', flexShrink: 0,
                  background: !input.trim() || loading
                    ? '#E2E8F0'
                    : 'linear-gradient(135deg, #10B981, #059669)',
                  border: 'none', cursor: !input.trim() || loading ? 'not-allowed' : 'pointer',
                  fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: !input.trim() || loading ? 'none' : '0 4px 12px rgba(16,185,129,0.35)',
                  transition: 'all 0.15s',
                }}
              >
                ↑
              </button>
            </form>
          </div>
        </div>

      </div>
    </PageWrapper>
  );
}
