import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Zap, MessageCircle, NotebookPen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabaseClient';
import { getTodaysBite, getRecommendedBite, recordBiteView } from '../services/biteService';
import { getRecommendedQuestions } from '../services/coachService';
import { fetchAndSummarizeNews } from '../services/readingService';
import { useUserLevel } from '../hooks/useUserLevel';
import { BITE_INFOGRAPHICS } from '../data/biteInfographics';
import PageWrapper from '../components/layout/PageWrapper';

export default function HomePage() {
  const navigate             = useNavigate();
  const { user, profile }    = useAuth();
  const { userLevel }        = useUserLevel();

  const [bite, setBite]      = useState(() => getTodaysBite());

  const d    = new Date();
  const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const today = `${d.getMonth() + 1}월 ${d.getDate()}일 ${days[d.getDay()]}`;

  /* 맞춤 한잎 */
  useEffect(() => {
    if (!user?.id) { setBite(getTodaysBite()); return; }
    getRecommendedBite(user.id, userLevel)
      .then(b => { setBite(b); recordBiteView(user.id, b.id); })
      .catch(() => setBite(getTodaysBite()));
  }, [user?.id, userLevel]); // eslint-disable-line

  /* 뉴스 */
  const [todayNews,   setTodayNews]   = useState(null);
  const [newsLoading, setNewsLoading] = useState(true);

  useEffect(() => {
    fetchAndSummarizeNews('경제')
      .then(results => setTodayNews(results[0] ?? null))
      .catch(() => {})
      .finally(() => setNewsLoading(false));
  }, []);

  /* 추천 질문 */
  const fallbackQuestions = [
    `${bite?.title}이 내 생활에 미치는 영향은?`,
    `${bite?.title} 쉽게 설명해줘`,
  ];
  const [recommendedQuestions, setRecommendedQuestions] = useState(null);
  const [questionsLoading,     setQuestionsLoading]     = useState(true);

  useEffect(() => {
    if (!bite?.title) return;
    setQuestionsLoading(true);
    getRecommendedQuestions(bite.title, userLevel)
      .then(qs => setRecommendedQuestions(qs?.length ? qs : fallbackQuestions))
      .catch(() => setRecommendedQuestions(fallbackQuestions))
      .finally(() => setQuestionsLoading(false));
  }, [bite?.title]); // eslint-disable-line

  /* 할일 완료 여부 */
  const [todoDone, setTodoDone] = useState([false, false, false, false]);

  useEffect(() => {
    if (!user?.id || !bite?.id) return;
    const todayStr = new Date().toISOString().slice(0, 10);
    Promise.all([
      supabase.from('user_bite_history').select('id').eq('user_id', user.id).eq('bite_id', bite.id).gte('viewed_at', todayStr).limit(1),
      supabase.from('user_quiz_results').select('id').eq('user_id', user.id).gte('created_at', todayStr).limit(1),
      supabase.from('coach_conversations').select('id').eq('user_id', user.id).gte('created_at', todayStr).limit(1),
      supabase.from('diary').select('id').eq('user_id', user.id).gte('created_at', todayStr).limit(1),
    ]).then(results => {
      setTodoDone(results.map(({ data }) => (data?.length ?? 0) > 0));
    }).catch(() => {});
  }, [user?.id, bite?.id]);

  const todos = [
    { title: '오늘의 한잎 읽기',  Icon: Leaf,          iconColor: '#3A9A5C', path: `/bite/${bite?.id}`, done: todoDone[0] },
    { title: '한잎 퀴즈 풀기',    Icon: Zap,           iconColor: '#854F0B', path: `/bite/${bite?.id}`, done: todoDone[1] },
    { title: '노밍에게 질문하기', Icon: MessageCircle, iconColor: '#FFC83D', path: '/coach',            done: todoDone[2] },
    { title: '경제일기 쓰기',     Icon: NotebookPen,   iconColor: '#5F5E5A', path: '/diary',            done: todoDone[3] },
  ];

  const nomingIntro = profile?.noming_intro
    ?.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();

  const InfographicComp = bite ? (BITE_INFOGRAPHICS[bite.id] ?? null) : null;

  const CATEGORY_ICON = {
    '금리': '💹', '투자': '📊', '거시경제': '🌐',
    '저축': '🏦', '부동산': '🏠', '기초': '📚',
  };

  return (
    <PageWrapper>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <div className="anim-fade" style={{ maxWidth: 720, margin: '0 auto', padding: '16px 20px 80px', boxSizing: 'border-box' }}>

        {/* 날짜 헤더 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <span style={{ fontSize: 13, color: '#888780' }}>{today} ☀️</span>

          {/* 할일 pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
            {todos.map((todo, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                {i > 0 && (
                  <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#B8EBC8', margin: '0 4px', flexShrink: 0 }} />
                )}
                <div
                  onClick={() => navigate(todo.path)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    padding: '4px 10px', borderRadius: 20, cursor: 'pointer',
                    background: todo.done ? '#52C97A' : '#F2FBF5',
                    border: `0.5px solid ${todo.done ? '#52C97A' : '#B8EBC8'}`,
                  }}
                >
                  <todo.Icon size={12} color={todo.done ? '#fff' : todo.iconColor} />
                  <span style={{ fontSize: 11, color: todo.done ? '#fff' : '#3A9A5C', fontWeight: todo.done ? 500 : 400 }}>
                    {todo.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 카드 1: 오늘의 한잎 미리보기 */}
        <div style={{ background: '#fff', borderRadius: 12, border: '0.5px solid #B8EBC8', padding: 16, marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 500, color: '#3A9A5C' }}>오늘의 경제 한잎</span>
            <div style={{ display: 'flex', gap: 5 }}>
              <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: '#E3F9EC', color: '#2A7A4B', border: '0.5px solid #B8EBC8' }}>
                {bite?.category}
              </span>
              <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: '#FFF4D6', color: '#854F0B', border: '0.5px solid #FAC775' }}>
                {{ easy: '쉬움', medium: '보통', hard: '심화' }[bite?.difficulty] ?? ''}
              </span>
            </div>
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#2A7A4B', marginBottom: 4 }}>
            {bite?.title}
          </div>
          <div style={{ fontSize: 13, color: '#3A9A5C', marginBottom: 14, lineHeight: 1.6 }}>
            {bite?.description}
          </div>

          {/* 핵심 개념 픽토그램 */}
          <div style={{ background: '#F2FBF5', borderRadius: 10, padding: '16px 12px', marginBottom: 12 }}>
            {InfographicComp ? (
              <InfographicComp />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ fontSize: 36 }}>{CATEGORY_ICON[bite?.category] ?? '📌'}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#2A7A4B' }}>{bite?.title}</div>
              </div>
            )}
          </div>

          <button
            onClick={() => navigate(`/bite/${bite?.id}`)}
            style={{ width: '100%', background: '#52C97A', color: '#fff', border: 'none', borderRadius: 8, padding: 10, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}
          >
            🍃 오늘의 한잎 배우기 →
          </button>
        </div>

        {/* 카드 2: 오늘의 추천 뉴스 */}
        <div style={{ background: '#fff', borderRadius: 12, border: '0.5px solid #B8EBC8', padding: 16, marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#3A9A5C', marginBottom: 10 }}>오늘의 추천 뉴스</div>

          {newsLoading ? (
            <div style={{ height: 60, background: '#E3F9EC', borderRadius: 8, opacity: 0.5 }} />
          ) : todayNews ? (
            <>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 11, color: '#888780', flexShrink: 0 }}>
                  {new Date(todayNews.pubDate).toLocaleDateString('ko-KR')}
                </span>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#2A7A4B', lineHeight: 1.5 }}>
                  {todayNews.title}
                </span>
              </div>
              {todayNews.nomingComment && (
                <div style={{
                  background: '#FFFBEE', borderRadius: 8, border: '0.5px solid #FAC775',
                  padding: '8px 12px', fontSize: 12, color: '#633806',
                  marginBottom: 10, display: 'flex', gap: 6, alignItems: 'flex-start',
                }}>
                  <img
                    src={`${import.meta.env.BASE_URL}noming.png`}
                    alt="노밍"
                    style={{ width: 18, height: 18, objectFit: 'contain', flexShrink: 0 }}
                  />
                  {todayNews.nomingComment.replace(/^노밍[이의]?\s*한마디\s*[-—–]\s*/u, '')}
                </div>
              )}
              <div style={{ display: 'flex', gap: 8 }}>
                <a
                  href={todayNews.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ flex: 1, padding: '8px 12px', borderRadius: 8, background: '#F2FBF5', border: '0.5px solid #B8EBC8', color: '#2A7A4B', fontSize: 12, textAlign: 'center', textDecoration: 'none' }}
                >
                  원문 보기 →
                </a>
                <button
                  onClick={() => navigate('/read')}
                  style={{ flex: 1, padding: '8px 12px', borderRadius: 8, background: '#52C97A', border: 'none', color: '#fff', fontSize: 12, cursor: 'pointer' }}
                >
                  더 많은 뉴스
                </button>
              </div>
            </>
          ) : (
            <div style={{ fontSize: 12, color: '#888780', textAlign: 'center', padding: 12 }}>뉴스를 불러올 수 없어요</div>
          )}
        </div>

        {/* 카드 3: 노밍 한마디 */}
        <div style={{ background: '#fff', borderRadius: 12, border: '0.5px solid #B8EBC8', padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <img
              src={`${import.meta.env.BASE_URL}noming.png`}
              alt="노밍"
              style={{ width: 36, height: 36, objectFit: 'contain' }}
            />
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#2A7A4B' }}>노밍 한마디</div>
              <div style={{ fontSize: 11, color: '#888780' }}>오늘의 경제 코칭</div>
            </div>
          </div>

          <div style={{
            background: '#FFFBEE', borderRadius: 10,
            padding: '12px 14px', fontSize: 13, color: '#633806',
            lineHeight: 1.7, border: '0.5px solid #FAC775', marginBottom: 12,
          }}>
            {nomingIntro ? nomingIntro : (
              <>오늘의 주제는 <strong style={{ color: '#92400E' }}>{bite?.title}</strong>이에요. 궁금한 게 있으면 바로 물어보세요!</>
            )}
          </div>

          {questionsLoading ? (
            [0, 1].map(i => (
              <div key={i} style={{
                width: '100%', height: 36, borderRadius: 8, marginBottom: 6,
                background: 'linear-gradient(90deg, #E3F9EC 25%, #F2FBF5 50%, #E3F9EC 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite',
              }} />
            ))
          ) : (
            (recommendedQuestions ?? fallbackQuestions).map((q, i) => (
              <button
                key={i}
                onClick={() => navigate('/coach', { state: { question: q } })}
                style={{
                  width: '100%', background: '#F2FBF5', border: '0.5px solid #B8EBC8',
                  borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#2A7A4B',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  marginBottom: 6, cursor: 'pointer', textAlign: 'left',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#E8F7F1'}
                onMouseLeave={e => e.currentTarget.style.background = '#F2FBF5'}
              >
                <span style={{ flex: 1, marginRight: 8 }}>{q}</span>
                <span style={{ color: '#52C97A', flexShrink: 0 }}>→</span>
              </button>
            ))
          )}

          <button
            onClick={() => navigate('/coach')}
            style={{
              width: '100%', background: '#fff', border: '0.5px solid #E2E8F0',
              borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#888780',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              cursor: 'pointer',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
            onMouseLeave={e => e.currentTarget.style.background = '#fff'}
          >
            직접 질문하기...
            <span style={{ color: '#B8EBC8' }}>→</span>
          </button>
        </div>

      </div>
    </PageWrapper>
  );
}
