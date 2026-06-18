import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowRight, History, MessageCircle, X } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import { useAuth } from '../context/AuthContext';
import { getCoachResponse } from '../services/coachService';
import { useUserLevel } from '../hooks/useUserLevel';
import { createConversation, getConversationList, getRecentConversations } from '../services/conversationService';
import { callSolar } from '../services/solarService';
import { getInfographic } from '../data/infographicData';
import InfographicCard from '../components/infographic/InfographicCard';
import SaveTermButton from '../components/common/SaveTermButton';
import { CoachSidebar } from '../components/coach/CoachSidebar';

/* ── 맞춤 추천 질문 ───────────────────────────────────────── */
function getPersonalizedQuestions(profile) {
  const level     = profile?.economic_level;
  const exp       = profile?.investment_experience;
  const occ       = profile?.occupation;
  const interests = profile?.interests ?? [];
  const has       = (k) => interests.includes(k);

  // 온보딩 미완료 시 기본 질문
  if (!level) return [
    '경제 공부는 어디서부터 시작해야 하나요?',
    '비상금은 얼마나 모아야 하나요?',
    '적금과 예금의 차이는 무엇인가요?',
    '파킹통장이 뭔가요?',
    '재테크를 처음 시작하려면 뭐부터 해야 하나요?',
  ];

  const questions = [];

  // 경제 수준별
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

  // 투자 경험별
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

  // 직업별
  if (occ === 'student') {
    questions.push('학생도 투자를 시작할 수 있나요?');
  } else if (occ === 'employee') {
    questions.push('직장인 연말정산 절세 방법을 알려주세요.');
  } else if (occ === 'freelancer') {
    questions.push('프리랜서는 어떻게 세금 신고를 하나요?');
  } else if (occ === 'business') {
    questions.push('사업자 절세 방법이 있나요?');
  }

  // 관심 분야별
  if (has('부동산'))    questions.push('부동산 공부는 어디서부터 시작해야 하나요?');
  if (has('세금'))      questions.push('절세를 위해 꼭 알아야 할 것이 있나요?');
  if (has('저축'))      questions.push('월급의 몇 퍼센트를 저축하는 게 좋을까요?');
  if (has('투자'))      questions.push('기준금리가 오르면 투자에 어떤 영향이 있나요?');
  if (has('ETF 기초'))  questions.push('ETF는 언제 공부하면 좋을까요?');
  if (has('환율'))      questions.push('환율이 오르면 나한테 좋은 건가요 나쁜 건가요?');

  // 중복 제거 후 5개 반환
  const unique = [...new Set(questions)];
  return unique.slice(0, 5);
}

const INPUT_CHIPS = ['월급 관리', '저축', '투자 입문', '경제 공부', 'ETF'];

/* ── 노밍 응답 카드 ─────────────────────────────────────── */
function NomingCard({ structured, onSend }) {
  const { advice, knowFirst, nextStep, terms } = structured;
  return (
    <div style={{
      background: '#fff',
      border: '0.5px solid #B8EBC8',
      borderRadius: '4px 20px 20px 20px',
      overflow: 'hidden',
    }}>
      {/* 💡 한 줄 조언 */}
      <div style={{
        background: '#F2FBF5',
        borderBottom: '0.5px solid #B8EBC8',
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
                background: '#F2FBF5', border: '0.5px solid #B8EBC8',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '10px', fontWeight: '800', color: '#52C97A', marginTop: '1px',
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

      {/* ✅ 오늘 5분 안에 해볼 것 */}
      <div style={{ padding: '12px 18px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', minWidth: 0 }}>
        <ArrowRight size={14} color="#888780" style={{ flexShrink: 0 }} />
        <p style={{ fontSize: '11px', fontWeight: '700', color: '#888780', letterSpacing: '0.5px', flexShrink: 0, whiteSpace: 'nowrap' }}>
          오늘 5분 안에 해볼 것
        </p>
        <button
          onClick={() => onSend?.(nextStep)}
          style={{
            fontSize: '12px', fontWeight: '700', color: '#52C97A',
            background: '#F2FBF5', border: '0.5px solid #B8EBC8',
            borderRadius: '100px', padding: '3px 12px',
            marginLeft: 'auto', whiteSpace: 'normal', wordBreak: 'keep-all',
            cursor: onSend ? 'pointer' : 'default',
            fontFamily: 'inherit', textAlign: 'left',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => { if (onSend) e.currentTarget.style.background = '#E3F9EC' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#F2FBF5' }}
        >
          {nextStep}
        </button>
      </div>

      {/* ⚠️ 경고 (있을 때만) */}
      {structured.warning && (
        <div style={{
          margin: '0 18px 14px',
          background: '#FAECE7',
          border: '0.5px solid #F0997B',
          borderRadius: '8px',
          padding: '10px 14px',
          fontSize: '12px',
          color: '#712B13',
          display: 'flex',
          gap: '8px',
          alignItems: 'flex-start',
        }}>
          <span style={{ flexShrink: 0 }}>⚠️</span>
          <span>{structured.warning}</span>
        </div>
      )}

      {/* 💾 핵심 용어 저장 */}
      {terms && terms.length > 0 && (
        <div style={{
          padding: '12px 18px 14px',
          borderTop: '1px solid #F1F5F9',
          background: '#F2FBF5',
        }}>
          <p style={{ fontSize: '11px', fontWeight: '700', color: '#888780', letterSpacing: '0.4px', marginBottom: '8px' }}>
            💾 이 대화의 핵심 용어
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            {terms.map(t => (
              <div key={t.term} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                gap: '10px', background: '#fff', border: '0.5px solid #B8EBC8',
                borderRadius: '10px', padding: '8px 12px',
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#2A7A4B' }}>{t.term}</span>
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
      background: '#FFFBEE',
      border: '0.5px solid #FAC775',
      borderRadius: '12px', padding: '24px',
      display: 'flex', gap: '16px', alignItems: 'flex-start',
    }}>
      <div style={{ width: 60, height: 60, borderRadius: 14, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <img src={`${BASE_URL}noming.png`} alt="노밍" style={{ width: 44, height: 44, objectFit: 'contain' }} />
      </div>
      <div>
        <p style={{ fontSize: '14px', fontWeight: '800', color: '#92400E', marginBottom: '6px' }}>
          노밍이에요!
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
      <div style={{ width: 40, height: 40, borderRadius: 10, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
        <img src={`${BASE_URL}noming.png`} alt="노밍" style={{ width: 28, height: 28, objectFit: 'contain' }} />
      </div>
      <div style={{
        background: '#fff', border: '0.5px solid #B8EBC8',
        borderRadius: '4px 16px 16px 16px',
        padding: '12px 18px',
      }}>
        <p style={{ fontSize: '12px', color: '#52C97A', fontWeight: '600', marginBottom: '7px' }}>
          노밍이 답변을 준비하고 있어요...
        </p>
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: '7px', height: '7px', borderRadius: '50%',
              background: '#52C97A', opacity: 0.7,
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

  /* 질문 한 번만 결정 — 캐시 있으면 즉시 반환, 없으면 fetch 후 캐시 저장 */
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

  /* 다른 페이지에서 질문 전달 시 자동 전송 */
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

    // 현재 메시지를 Solar 형식 history로 변환 (현재 질문 제외, plain text 메시지는 그대로)
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

    // 로그인 사용자의 대화를 DB에 저장 후 사이드바 갱신
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
    // groupConvs는 getConversationList의 내림차순 배열 → reverse()로 오래된 것부터 표시
    const ordered = groupConvs ? [...groupConvs].reverse() : [conv];
    setMessages(
      ordered.flatMap(c => [
        { role: 'user', text: c.question },
        { role: 'noming', isPlainText: true, text: c.answer },
      ])
    );
  };

  /* 드로어 열릴 때 + 사이드바 갱신 시 대화 목록 fetch */
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
      <div style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        height: 'calc(100dvh - 64px)',
        overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex',
          width: '100%',
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '0 24px',
          boxSizing: 'border-box',
        }}>

        {/* ── 사이드 패널 (데스크탑만) ─────────────────────── */}
        <div style={{ display: 'none', flexShrink: 0 }} className="coach-sidebar-wrap">
          <CoachSidebar
            user={user}
            onNewChat={handleNewChat}
            onSelectConversation={handleSelectConversation}
            activeId={activeConvId}
            refreshKey={sidebarRefreshKey}
          />
        </div>

        {/* ── 대화 영역 ────────────────────────────────────── */}
        <div style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: '#F2FBF5',
        }}>

          {/* 모바일 대화 기록 버튼 */}
          <div className="mobile-history-bar">
            <button
              className="mobile-history-btn"
              onClick={() => setDrawerOpen(true)}
            >
              <History size={16} />
              기록
            </button>
          </div>

          {/* 노밍 인사 카드 + 추천 질문 (빈 상태) */}
          {isEmpty && (
            <div style={{ flexShrink: 0, padding: '20px 0 0' }}>
              <div className="container" style={{ maxWidth: '720px' }}>
                <NomingGreeting BASE_URL={BASE_URL} />

                <div style={{ marginTop: '16px' }}>
                  <p style={{
                    fontSize: '11px', fontWeight: '700', color: '#888780',
                    letterSpacing: '0.8px', textTransform: 'uppercase',
                    marginBottom: '8px',
                  }}>
                    이런 고민이 있다면 물어보세요
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {suggestedQuestions === null ? (
                      [0, 1, 2, 3, 4].map(i => (
                        <div key={i} style={{
                          height: 44, borderRadius: 8,
                          background: 'linear-gradient(90deg, #E3F9EC 25%, #F2FBF5 50%, #E3F9EC 75%)',
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
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '12px 16px', borderRadius: '8px',
                            background: '#fff', border: '0.5px solid #B8EBC8',
                            cursor: 'pointer', textAlign: 'left',
                            fontSize: '13px', color: '#5F5E5A', fontWeight: '500',
                            lineHeight: '1.4', transition: 'all 0.15s',
                            fontFamily: 'inherit',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.borderColor = '#52C97A';
                            e.currentTarget.style.background  = '#F2FBF5';
                            e.currentTarget.style.color       = '#2A7A4B';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.borderColor = '#B8EBC8';
                            e.currentTarget.style.background  = '#fff';
                            e.currentTarget.style.color       = '#5F5E5A';
                          }}
                        >
                          <span style={{ flex: 1, paddingRight: '10px' }}>{q}</span>
                          <span style={{ fontSize: '15px', color: '#CBD5E1', flexShrink: 0 }}>›</span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 메시지 영역 */}
          <div style={{ flex: isEmpty ? 0 : 1, overflowY: 'auto', padding: isEmpty ? '0' : '24px 0' }}>
            <div className="container" style={{ maxWidth: '720px' }}>

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
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                          <img src={`${BASE_URL}noming.png`} alt="노밍" style={{ width: 28, height: 28, objectFit: 'contain' }} />
                        </div>
                      )}

                      {msg.role === 'user' ? (
                        <div style={{
                          maxWidth: '72%', padding: '12px 18px',
                          borderRadius: '18px 4px 18px 18px',
                          background: 'linear-gradient(135deg, #52C97A, #1AAD7D)',
                          color: '#fff', fontSize: '14px', lineHeight: '1.7',
                          fontWeight: '500',
                          boxShadow: '0 4px 14px rgba(33,197,142,0.3)',
                        }}>
                          {msg.text}
                        </div>
                      ) : msg.isPlainText ? (
                        <div style={{
                          background: '#fff', border: '0.5px solid #B8EBC8',
                          borderRadius: '4px 16px 16px 16px',
                          padding: '14px 18px', fontSize: '13px', color: '#5F5E5A',
                          lineHeight: '1.7', whiteSpace: 'pre-wrap',
                          flex: 1, minWidth: 0,
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
          </div>

          {/* 입력 영역 */}
          <div style={{ flexShrink: 0, padding: '10px 0 14px', paddingBottom: 'max(14px, env(safe-area-inset-bottom))' }}>
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
                      background: '#F2FBF5',
                      border: `0.5px solid ${input === chip ? '#52C97A' : '#B8EBC8'}`,
                      fontSize: '12px', fontWeight: '600',
                      color: input === chip ? '#2A7A4B' : '#888780',
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
                background: '#fff', border: '0.5px solid #B8EBC8',
                borderRadius: '12px', padding: '10px 10px 10px 16px',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = '#52C97A'; }}
              onBlur={e  => { e.currentTarget.style.borderColor = '#B8EBC8'; }}
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
                    fontSize: '14px', color: '#2A7A4B', background: 'transparent',
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
                      : 'linear-gradient(135deg, #52C97A, #1AAD7D)',
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
        </div>
      </div>

      {/* 모바일 대화 기록 드로어 */}
      {drawerOpen && (
        <>
          {/* 오버레이 */}
          <div
            onClick={() => setDrawerOpen(false)}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.4)',
              zIndex: 199,
            }}
          />

          {/* 드로어 패널 */}
          <div style={{
            position: 'fixed', bottom: 0, left: 0, right: 0,
            background: '#fff',
            borderRadius: '16px 16px 0 0',
            borderTop: '0.5px solid #B8EBC8',
            padding: '12px 16px 32px',
            maxHeight: '60vh',
            overflowY: 'auto',
            zIndex: 200,
            animation: 'drawerSlideUp 0.25s ease-out',
          }}>
            {/* 핸들 바 */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
              <div style={{
                width: '40px', height: '4px', borderRadius: '100px',
                background: '#E2E8F0',
              }} />
            </div>

            {/* 헤더 */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: '16px',
            }}>
              <p style={{ fontSize: '15px', fontWeight: '700', color: '#0F172A' }}>
                대화 기록
              </p>
              <button
                onClick={() => setDrawerOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: '#F1F5F9', border: 'none', cursor: 'pointer',
                  color: '#64748B',
                }}
              >
                <X size={14} />
              </button>
            </div>

            {/* 새 대화 버튼 */}
            <button
              onClick={() => { handleNewChat(); setDrawerOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                width: '100%', padding: '10px 14px', borderRadius: '10px',
                background: '#F2FBF5', border: '0.5px solid #B8EBC8',
                fontSize: '13px', fontWeight: '600', color: '#2A7A4B',
                cursor: 'pointer', marginBottom: '16px',
                fontFamily: 'inherit',
              }}
            >
              <MessageCircle size={14} />
              새 대화 시작
            </button>

            {/* 대화 목록 */}
            {drawerLoading ? (
              <p style={{ fontSize: '13px', color: '#94A3B8', textAlign: 'center', padding: '20px 0' }}>
                불러오는 중...
              </p>
            ) : Object.keys(drawerGroups).length === 0 ? (
              <p style={{ fontSize: '13px', color: '#94A3B8', textAlign: 'center', padding: '20px 0' }}>
                저장된 대화가 없어요.
              </p>
            ) : (
              Object.entries(drawerGroups).map(([dateLabel, convs]) => (
                <div key={dateLabel} style={{ marginBottom: '16px' }}>
                  <p style={{
                    fontSize: '11px', fontWeight: '700', color: '#B0B0A8',
                    letterSpacing: '0.5px', marginBottom: '6px',
                  }}>
                    {dateLabel}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {convs.map(conv => (
                      <button
                        key={conv.id}
                        onClick={() => {
                          handleSelectConversation(conv, convs);
                          setDrawerOpen(false);
                        }}
                        style={{
                          display: 'block', width: '100%', textAlign: 'left',
                          padding: '9px 12px', borderRadius: '8px',
                          background: activeConvId === conv.id ? '#E3F9EC' : 'transparent',
                          border: 'none', cursor: 'pointer',
                          fontSize: '13px', fontWeight: '500',
                          color: activeConvId === conv.id ? '#2A7A4B' : '#5F5E5A',
                          fontFamily: 'inherit',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          transition: 'background 0.1s',
                        }}
                        onMouseEnter={e => {
                          if (activeConvId !== conv.id) e.currentTarget.style.background = '#F2FBF5';
                        }}
                        onMouseLeave={e => {
                          if (activeConvId !== conv.id) e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        {conv.question}
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes nomingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.7; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes drawerSlideUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        .mobile-history-bar { display: none; }
        .mobile-history-btn {
          display: flex; align-items: center; gap: 5px;
          background: #fff; border: 0.5px solid #B8EBC8;
          border-radius: 8px; padding: 6px 10px;
          font-size: 12px; color: #2A7A4B; font-weight: 600;
          cursor: pointer; font-family: inherit;
        }
        @media (max-width: 768px) {
          .mobile-history-bar {
            display: flex; justify-content: flex-end;
            padding: 8px 16px 4px;
          }
        }
        @media (min-width: 768px) {
          .coach-sidebar-wrap { display: flex !important; }
        }
      `}</style>
    </PageWrapper>
  );
}
