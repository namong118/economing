import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowRight, ChevronRight, History, MessageCircle, Plus, X } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import { useAuth } from '../context/AuthContext';
import { getCoachResponse } from '../services/coachService';
import { useUserLevel } from '../hooks/useUserLevel';
import { createConversation, getConversationList, getRecentConversations } from '../services/conversationService';
import { callSolar } from '../services/solarService';
import { getInfographic } from '../data/infographicData';
import InfographicCard from '../components/infographic/InfographicCard';
import SaveTermButton from '../components/common/SaveTermButton';

/* ── 맞춤 추천 질문 ───────────────────────────────────────── */
function getPersonalizedQuestions(profile) {
  const level     = profile?.economic_level;
  const exp       = profile?.investment_experience;
  const occ       = profile?.occupation;
  const interests = profile?.interests ?? [];
  const has       = (k) => interests.includes(k);

  if (!level) return [
    '경제 공부는 어디서부터 시작해야 하나요?',
    '비상금은 얼마나 모아야 하나요?',
    '적금과 예금의 차이는 무엇인가요?',
    '파킹통장이 뭔가요?',
    '재테크를 처음 시작하려면 뭐부터 해야 하나요?',
  ];

  const questions = [];

  if (level === 'beginner') {
    questions.push('비상금은 얼마나 모아두면 되나요?');
    questions.push('파킹통장과 적금 중 뭐가 더 나을까요?');
    questions.push('경제 공부 순서를 알려주세요.');
    questions.push('소비 습관을 바꾸려면 어떻게 해야 하나요?');
  } else if (level === 'intermediate') {
    questions.push('ETF 적립식 투자, 어떻게 시작하면 좋을까요?');
    questions.push('IRP와 연금저축, 뭐가 다른가요?');
    questions.push('포트폴리오를 어떻게 구성하면 좋을까요?');
  } else if (level === 'advanced') {
    questions.push('금융소득 종합과세, 어떻게 대비해야 하나요?');
    questions.push('포트폴리오 리밸런싱은 얼마나 자주 해야 하나요?');
    questions.push('배당 투자 전략을 알려주세요.');
  }

  if (exp === 'none') {
    questions.push('주식과 ETF 중 초보자에게 뭐가 더 나을까요?');
    questions.push('투자를 처음 시작할 때 가장 중요한 것은 무엇인가요?');
  } else if (exp === 'etf') {
    questions.push('ETF 종류가 너무 많은데 어떻게 고르나요?');
    questions.push('국내 ETF와 해외 ETF, 어떤 차이가 있나요?');
  } else if (exp === 'stock') {
    questions.push('주식 투자할 때 ETF도 함께 가져가야 할까요?');
    questions.push('종목 분석은 어떻게 하나요?');
  }

  if (occ === 'student')    questions.push('학생도 투자를 시작할 수 있나요?');
  else if (occ === 'employee')   questions.push('직장인 연말정산 절세 방법을 알려주세요.');
  else if (occ === 'freelancer') questions.push('프리랜서는 어떻게 세금 신고를 하나요?');
  else if (occ === 'business')   questions.push('사업자 절세 방법이 있나요?');

  if (has('부동산'))    questions.push('부동산 공부는 어디서부터 시작해야 하나요?');
  if (has('세금'))      questions.push('절세를 위해 꼭 알아야 할 것이 있나요?');
  if (has('저축'))      questions.push('월급의 몇 퍼센트를 저축하는 게 좋을까요?');
  if (has('투자'))      questions.push('기준금리가 오르면 투자에 어떤 영향이 있나요?');
  if (has('ETF 기초'))  questions.push('ETF는 언제 공부하면 좋을까요?');
  if (has('환율'))      questions.push('환율이 오르면 나한테 좋은 건가요 나쁜 건가요?');

  const unique = [...new Set(questions)];
  return unique.slice(0, 5);
}

const INPUT_CHIPS = ['월급 관리', '저축', '투자 입문', '경제 공부', 'ETF'];

/* ── 노밍 응답 카드 (3-Tier) ────────────────────────────── */
function NomingCard({ structured, onSend }) {
  const { advice, knowFirst, nextStep, terms, warning } = structured;
  return (
    <div style={{
      background: 'var(--c-surface)',
      border: '0.5px solid var(--c-line)',
      borderRadius: '4px 20px 20px 20px',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-card)',
    }}>
      {/* ─── Tier 1: 💡 한 줄 조언 — Yellow ─── */}
      <div style={{
        background: 'var(--c-yellow-100)',
        borderBottom: '0.5px solid var(--c-yellow-border)',
        padding: '14px 18px',
        display: 'flex', gap: '10px',
      }}>
        <span style={{ fontSize: '17px', flexShrink: 0, marginTop: '2px' }}>💡</span>
        <div>
          <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--c-amber-700)', marginBottom: '4px', letterSpacing: '0.5px' }}>
            노밍의 한 줄 조언
          </p>
          <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--c-amber-700)', lineHeight: '1.65' }}>
            {advice}
          </p>
        </div>
      </div>

      {/* ─── Tier 2: 📚 먼저 알아두면 — White ─── */}
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--c-line-soft)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
          <span style={{ fontSize: '15px' }}>📚</span>
          <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--c-muted)', letterSpacing: '0.5px' }}>
            먼저 알아두면 좋은 것
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
          {knowFirst.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <div style={{
                width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0,
                background: 'var(--c-green-100)', border: '0.5px solid var(--c-green-300)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '10px', fontWeight: '800', color: 'var(--c-forest-700)', marginTop: '1px',
              }}>
                {i + 1}
              </div>
              <p style={{ fontSize: '13px', color: 'var(--c-slate)', lineHeight: '1.6', fontWeight: '500' }}>
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Tier 3: ✅ 오늘 해볼 것 — Green ─── */}
      <div style={{
        padding: '11px 18px',
        background: 'var(--c-green-50)',
        display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', minWidth: 0,
      }}>
        <ArrowRight size={13} color="var(--c-green-500)" style={{ flexShrink: 0 }} />
        <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--c-forest-700)', letterSpacing: '0.5px', flexShrink: 0, whiteSpace: 'nowrap' }}>
          오늘 5분 안에 해볼 것
        </p>
        <button
          onClick={() => onSend?.(nextStep)}
          style={{
            fontSize: '12px', fontWeight: '700', color: 'var(--c-forest-700)',
            background: 'var(--c-green-100)', border: '0.5px solid var(--c-green-300)',
            borderRadius: '100px', padding: '4px 13px',
            marginLeft: 'auto', whiteSpace: 'normal', wordBreak: 'keep-all',
            cursor: onSend ? 'pointer' : 'default',
            fontFamily: 'inherit', textAlign: 'left',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => { if (onSend) e.currentTarget.style.background = 'var(--c-green-300)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--c-green-100)'; }}
        >
          {nextStep}
        </button>
      </div>

      {/* ─── ⚠️ 경고 (있을 때만) ─── */}
      {warning && (
        <div style={{
          margin: '0 18px 14px',
          background: 'var(--c-warn-bg)',
          border: '0.5px solid #F0997B',
          borderRadius: '8px',
          padding: '10px 14px',
          fontSize: '12px',
          color: 'var(--c-warn)',
          display: 'flex', gap: '8px', alignItems: 'flex-start',
        }}>
          <span style={{ flexShrink: 0 }}>⚠️</span>
          <span>{warning}</span>
        </div>
      )}

      {/* ─── 💾 핵심 용어 ─── */}
      {terms && terms.length > 0 && (
        <div style={{
          padding: '12px 18px 14px',
          borderTop: '1px solid var(--c-line-soft)',
          background: 'var(--c-canvas)',
        }}>
          <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--c-muted)', letterSpacing: '0.4px', marginBottom: '8px' }}>
            💾 이 대화의 핵심 용어
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            {terms.map(t => (
              <div key={t.term} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                gap: '10px', background: 'var(--c-surface)', border: '0.5px solid var(--c-line)',
                borderRadius: '10px', padding: '8px 12px',
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--c-forest-700)' }}>{t.term}</span>
                  <p style={{ fontSize: '11px', color: 'var(--c-muted)', marginTop: '2px', lineHeight: '1.5',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {t.meaning}
                  </p>
                </div>
                <SaveTermButton term={t.term} meaning={t.meaning} sourceType="coach" size="sm" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── 노밍 인사 카드 ─────────────────────────────────────── */
function NomingGreeting({ BASE_URL, onHistory }) {
  return (
    <div className="anim-fade" style={{
      background: 'var(--c-yellow-100)',
      border: '1px solid var(--c-yellow-border)',
      borderRadius: 16, padding: '16px 18px',
      boxShadow: '0 2px 12px rgba(139,90,0,0.08)',
    }}>
      {/* 상단: 아바타 + 텍스트 + 기록 버튼 */}
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <div style={{
          width: 48, height: 48, borderRadius: '50%',
          background: 'rgba(255,200,61,0.2)', border: '1.5px solid var(--c-yellow-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <img src={`${BASE_URL}noming.png`} alt="노밍" style={{ width: 34, height: 34, objectFit: 'contain' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--c-amber-700)', marginBottom: 3, letterSpacing: '-0.3px' }}>
            노밍이에요!
          </p>
          <p style={{ fontSize: 12.5, color: 'var(--c-amber-700)', lineHeight: 1.6, letterSpacing: '-0.2px', opacity: 0.85 }}>
            무엇부터 시작해야 할지 모르겠다면 제가 함께 정리해드릴게요.
          </p>
        </div>
        <button
          onClick={onHistory}
          style={{
            display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0,
            background: 'rgba(255,255,255,0.6)', border: '0.5px solid var(--c-yellow-border)',
            borderRadius: 8, padding: '5px 10px',
            fontSize: 11.5, color: 'var(--c-amber-700)', fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          <History size={13} />
          기록
        </button>
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
      <div style={{
        width: 40, height: 40, borderRadius: '50%',
        background: 'rgba(255,200,61,0.15)', border: '1px solid var(--c-yellow-border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px',
      }}>
        <img src={`${BASE_URL}noming.png`} alt="노밍" style={{ width: 26, height: 26, objectFit: 'contain' }} />
      </div>
      <div style={{
        background: 'var(--c-surface)', border: '0.5px solid var(--c-line)',
        borderRadius: '4px 16px 16px 16px',
        padding: '12px 18px',
        boxShadow: 'var(--shadow-card)',
      }}>
        <p style={{ fontSize: '12px', color: 'var(--c-green-500)', fontWeight: '600', marginBottom: '7px' }}>
          노밍이 답변을 준비하고 있어요...
        </p>
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: '7px', height: '7px', borderRadius: '50%',
              background: 'var(--c-green-500)', opacity: 0.7,
              animation: `nomingBounce 1.3s ease-in-out ${i * 0.22}s infinite`,
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* 탭 전환 시 재마운트돼도 질문이 유지되도록 모듈 레벨에 캐시 */
const _questionsCache = {};

/* ── 메인 ─────────────────────────────────────────────────── */
export default function CoachPage() {
  const location    = useLocation();
  const [messages,         setMessages]         = useState([]);
  const [input,            setInput]            = useState('');
  const [loading,          setLoading]          = useState(false);
  const [activeConvId,     setActiveConvId]     = useState(null);
  const [sidebarRefreshKey, setSidebarRefreshKey] = useState(0);
  const [drawerOpen,    setDrawerOpen]    = useState(false);
  const [drawerGroups,  setDrawerGroups]  = useState({});
  const [drawerLoading, setDrawerLoading] = useState(false);
  const bottomRef   = useRef(null);
  const textareaRef = useRef(null);
  const initSent    = useRef(false);

  const { user, profile } = useAuth();
  const { userLevel } = useUserLevel();
  const isEmpty  = messages.length === 0;
  const BASE_URL = import.meta.env.BASE_URL;
  const cacheKey = user?.id ?? 'guest';
  const [suggestedQuestions, setSuggestedQuestions] = useState(() => _questionsCache[cacheKey] ?? null);

  useEffect(() => {
    if (_questionsCache[cacheKey]) { setSuggestedQuestions(_questionsCache[cacheKey]); return; }
    const set = (qs) => { _questionsCache[cacheKey] = qs; setSuggestedQuestions(qs); };
    const fallback = getPersonalizedQuestions(profile);
    if (!user?.id) { set(fallback); return; }
    getRecentConversations(user.id, 5)
      .then(({ data }) => {
        if (!data?.length) { set(fallback); return; }
        const recentList = data.map(c => `- ${c.question}`).join('\n');
        callSolar({
          system: `당신은 경제 학습 코치입니다. 사용자가 최근에 한 질문들을 보고, 자연스럽게 이어지거나 더 깊이 파고들 수 있는 경제 공부 질문 5개를 추천하세요. 이미 물어본 것과 너무 비슷한 질문은 피하고, 다음 단계로 나아갈 수 있는 질문을 제안하세요.\n반드시 JSON 배열로만 응답하세요: ["질문1", "질문2", "질문3", "질문4", "질문5"]`,
          messages: [{ role: 'user', content: `최근 질문 목록:\n${recentList}` }],
        })
          .then(content => {
            try {
              const match = content.match(/\[[\s\S]*?\]/);
              const parsed = match ? JSON.parse(match[0]) : null;
              set(Array.isArray(parsed) && parsed.length >= 3 ? parsed.slice(0, 5) : fallback);
            } catch {
              set(fallback);
            }
          })
          .catch(() => set(fallback));
      })
      .catch(() => set(fallback));
  }, [cacheKey]); // eslint-disable-line

  useEffect(() => {
    const q = location.state?.question;
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

    const history = messages.map(msg =>
      msg.role === 'user'
        ? { role: 'user', content: msg.text }
        : {
            role: 'assistant',
            content: msg.isPlainText
              ? msg.text
              : [msg.structured?.advice, ...(msg.structured?.knowFirst ?? [])].filter(Boolean).join(' '),
          }
    );

    setMessages(prev => [...prev, { role: 'user', text: q }]);
    setActiveConvId(null);
    setInput('');
    setLoading(true);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    const { answer, structured } = await getCoachResponse(q, history, userLevel);
    const infographic = getInfographic(q);
    setMessages(prev => [...prev, { role: 'noming', structured, infographic }]);
    setLoading(false);

    if (user?.id) {
      createConversation({ userId: user.id, question: q, answer })
        .then(() => setSidebarRefreshKey(k => k + 1));
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setActiveConvId(null);
  };

  const handleSelectConversation = (conv, groupConvs) => {
    setActiveConvId(conv.id);
    const ordered = groupConvs ? [...groupConvs].reverse() : [conv];
    setMessages(
      ordered.flatMap(c => [
        { role: 'user', text: c.question },
        { role: 'noming', isPlainText: true, text: c.answer },
      ])
    );
  };

  useEffect(() => {
    if (!drawerOpen || !user?.id) return;
    setDrawerLoading(true);
    getConversationList(user.id)
      .then(setDrawerGroups)
      .catch(console.error)
      .finally(() => setDrawerLoading(false));
  }, [drawerOpen, user?.id]); // eslint-disable-line

  useEffect(() => {
    if (!user?.id) return;
    getConversationList(user.id).then(setDrawerGroups).catch(console.error);
  }, [sidebarRefreshKey]); // eslint-disable-line

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
      {/* 단일 모바일 컬럼 — 사이드바 분할 없음 */}
      <div className="coach-page-wrap" style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: 'var(--c-canvas)',
        position: 'relative',
      }}>

        {/* ── 노밍 인사 카드 + 추천 질문 (빈 상태) ─── */}
        {isEmpty && (
          <div style={{ flexShrink: 0, padding: '16px 16px 0', overflowY: 'auto' }}>
            <NomingGreeting BASE_URL={BASE_URL} onHistory={() => setDrawerOpen(true)} />

            <div style={{ marginTop: 16 }}>
              <p style={{
                fontSize: 11, fontWeight: 700, color: 'var(--c-muted)',
                letterSpacing: '0.8px', textTransform: 'uppercase',
                marginBottom: 10,
              }}>
                이런 고민이 있다면 물어보세요
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {suggestedQuestions === null ? (
                  [0, 1, 2, 3, 4].map(i => (
                    <div key={i} style={{
                      height: 48, borderRadius: 12,
                      background: 'linear-gradient(90deg, var(--c-green-100) 25%, var(--c-canvas) 50%, var(--c-green-100) 75%)',
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 1.4s infinite',
                    }} />
                  ))
                ) : (
                  suggestedQuestions.map(q => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
                        padding: '13px 15px', borderRadius: 12,
                        background: 'var(--c-surface)', border: '1px solid var(--c-line-soft)',
                        boxShadow: 'var(--shadow-card)',
                        cursor: 'pointer', textAlign: 'left',
                        fontSize: 13.5, color: 'var(--c-slate)', fontWeight: 600,
                        lineHeight: 1.4, transition: 'border-color 0.15s',
                        fontFamily: 'inherit',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--c-green-300)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--c-line-soft)'; }}
                    >
                      <span style={{ flex: 1 }}>{q}</span>
                      <ChevronRight size={15} color="var(--c-muted)" style={{ flexShrink: 0 }} />
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── 메시지 영역 ──────────────────────────────── */}
        <div style={{ flex: isEmpty ? 0 : 1, overflowY: 'auto', padding: isEmpty ? 0 : '24px 16px' }}>
          {messages.length > 0 && (
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
                  {msg.role === 'noming' && (
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%',
                      background: 'rgba(255,200,61,0.15)', border: '1px solid var(--c-yellow-border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px',
                    }}>
                      <img src={`${BASE_URL}noming.png`} alt="노밍" style={{ width: 26, height: 26, objectFit: 'contain' }} />
                    </div>
                  )}

                  {msg.role === 'user' ? (
                    <div style={{
                      maxWidth: '72%', padding: '12px 18px',
                      borderRadius: '18px 4px 18px 18px',
                      background: 'var(--grad-action)',
                      color: '#fff', fontSize: '14px', lineHeight: '1.7',
                      fontWeight: '500',
                      boxShadow: '0 4px 14px rgba(33,197,142,0.3)',
                    }}>
                      {msg.text}
                    </div>
                  ) : msg.isPlainText ? (
                    <div style={{
                      background: 'var(--c-surface)', border: '0.5px solid var(--c-line)',
                      borderRadius: '4px 16px 16px 16px',
                      padding: '14px 18px', fontSize: '13px', color: 'var(--c-slate)',
                      lineHeight: '1.7', whiteSpace: 'pre-wrap',
                      flex: 1, minWidth: 0,
                      boxShadow: 'var(--shadow-card)',
                    }}>
                      {msg.text}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, minWidth: 0 }}>
                      <NomingCard structured={msg.structured} onSend={send} />
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

        {/* ── 입력 영역 ────────────────────────────────── */}
        <div style={{ flexShrink: 0, padding: '10px 16px 14px', paddingBottom: 'max(14px, env(safe-area-inset-bottom))' }}>

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
                  background: 'var(--c-canvas)',
                  border: `0.5px solid ${input === chip ? 'var(--c-green-500)' : 'var(--c-line)'}`,
                  fontSize: '12px', fontWeight: '600',
                  color: input === chip ? 'var(--c-forest-700)' : 'var(--c-muted)',
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
            background: 'var(--c-surface)',
            border: '1.5px solid var(--c-line)',
            borderRadius: '14px', padding: '10px 10px 10px 16px',
            transition: 'border-color 0.15s, box-shadow 0.15s',
            boxShadow: '0 2px 8px rgba(8,53,43,0.04)',
          }}
          onFocus={e => {
            e.currentTarget.style.borderColor = 'var(--c-green-500)';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(31,190,134,0.12)';
          }}
          onBlur={e => {
            e.currentTarget.style.borderColor = 'var(--c-line)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(8,53,43,0.04)';
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
                fontSize: '14px', color: 'var(--c-ink)', background: 'transparent',
                lineHeight: '1.6', fontFamily: 'inherit', maxHeight: '140px',
                overflowY: 'auto',
              }}
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || loading}
              style={{
                width: '38px', height: '38px', borderRadius: '10px', flexShrink: 0,
                background: !input.trim() || loading ? 'var(--c-line)' : 'var(--grad-action)',
                border: 'none',
                cursor: !input.trim() || loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '17px', color: '#fff',
                boxShadow: !input.trim() || loading ? 'none' : '0 3px 10px rgba(31,190,134,0.4)',
                transition: 'all 0.15s',
              }}
            >
              ↑
            </button>
          </div>

        </div>

        {/* ── 대화 기록 드로어 (앱 컬럼 내부 좌측 슬라이드) ── */}
        {drawerOpen && (
          <>
            {/* 딤 오버레이 — 앱 컬럼 기준 */}
            <div
              onClick={() => setDrawerOpen(false)}
              style={{
                position: 'absolute', inset: 0,
                background: 'rgba(20,33,28,0.4)',
                zIndex: 199,
              }}
            />

            {/* 드로어 패널 — 좌측에서 슬라이드 */}
            <div style={{
              position: 'absolute', left: 0, top: 0, bottom: 0,
              width: 'min(86%, 320px)',
              background: 'var(--c-surface)',
              borderRight: '0.5px solid var(--c-line)',
              padding: '20px 16px 32px',
              overflowY: 'auto',
              zIndex: 200,
              animation: 'drawerSlideLeft 0.25s ease-out',
            }}>

            {/* 헤더 */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: 16,
            }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--c-ink)' }}>대화 기록</p>
              <button
                onClick={() => setDrawerOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'var(--c-line-soft)', border: 'none', cursor: 'pointer',
                  color: 'var(--c-slate)',
                }}
              >
                <X size={14} />
              </button>
            </div>

            {/* 새 대화 버튼 */}
            <button
              onClick={() => { handleNewChat(); setDrawerOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '11px 14px', borderRadius: 10,
                background: 'var(--grad-action)', border: 'none',
                fontSize: 13, fontWeight: 700, color: '#fff',
                cursor: 'pointer', marginBottom: 16,
                fontFamily: 'inherit',
                boxShadow: '0 3px 12px rgba(31,190,134,0.3)',
              }}
            >
              <Plus size={15} />
              새 대화 시작
            </button>

            {/* 대화 목록 */}
            {drawerLoading ? (
              <p style={{ fontSize: 13, color: 'var(--c-muted)', textAlign: 'center', padding: '20px 0' }}>
                불러오는 중...
              </p>
            ) : Object.keys(drawerGroups).length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--c-muted)', textAlign: 'center', padding: '20px 0' }}>
                저장된 대화가 없어요.
              </p>
            ) : (
              Object.entries(drawerGroups).map(([dateLabel, convs]) => (
                <div key={dateLabel} style={{ marginBottom: 16 }}>
                  <p style={{
                    fontSize: 11, fontWeight: 700, color: 'var(--c-muted)',
                    letterSpacing: '0.5px', marginBottom: 6,
                  }}>
                    {dateLabel}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {convs.map(conv => (
                      <button
                        key={conv.id}
                        onClick={() => {
                          handleSelectConversation(conv, convs);
                          setDrawerOpen(false);
                        }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          width: '100%', textAlign: 'left',
                          padding: '11px 12px', borderRadius: 8,
                          background: activeConvId === conv.id ? 'var(--c-green-100)' : 'transparent',
                          border: 'none', cursor: 'pointer',
                          fontSize: 14, fontWeight: 500,
                          color: activeConvId === conv.id ? 'var(--c-forest-700)' : 'var(--c-slate)',
                          fontFamily: 'inherit',
                          transition: 'background 0.1s',
                        }}
                        onMouseEnter={e => {
                          if (activeConvId !== conv.id) e.currentTarget.style.background = 'var(--c-green-50)';
                        }}
                        onMouseLeave={e => {
                          if (activeConvId !== conv.id) e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <MessageCircle size={14} color={activeConvId === conv.id ? 'var(--c-forest-700)' : 'var(--c-muted)'} style={{ flexShrink: 0 }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {conv.question}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
            </div>
          </>
        )}

      </div>

      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes nomingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.7; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes drawerSlideLeft {
          from { transform: translateX(-100%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </PageWrapper>
  );
}
