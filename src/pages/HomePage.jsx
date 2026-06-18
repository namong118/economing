import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Zap, MessageCircle, NotebookPen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { addXp } from '../services/profileService';
import { getNextLevelInfo } from '../data/levelData';
import { getTodaysBite, getRecommendedBite, recordBiteView } from '../services/biteService';
import { getRecommendedQuestions } from '../services/coachService';
import { fetchAndSummarizeNews } from '../services/readingService';
import { useUserLevel } from '../hooks/useUserLevel';
import { BITE_INFOGRAPHICS } from '../data/biteInfographics';
import PageWrapper from '../components/layout/PageWrapper';

export default function HomePage() {
  const navigate                          = useNavigate();
  const { user, profile, refreshProfile } = useAuth();
  const { userLevel }                     = useUserLevel();
  const [xpLoading, setXpLoading]         = useState(false);

  const [bite, setBite]         = useState(() => getTodaysBite());
  const xp                      = profile?.xp ?? 0;
  const { currentLevel }        = getNextLevelInfo(xp);

  const d    = new Date();
  const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const today = `${d.getMonth() + 1}월 ${d.getDate()}일 ${days[d.getDay()]}`;

  /* 맞춤 한잎 */
  useEffect(() => {
    if (!user?.id) {
      setBite(getTodaysBite());
      return;
    }
    getRecommendedBite(user.id, userLevel)
      .then(b => {
        setBite(b);
        recordBiteView(user.id, b.id);
      })
      .catch(() => setBite(getTodaysBite()));
  }, [user?.id, userLevel]); // eslint-disable-line

  /* 뉴스 */
  const [todayNews,    setTodayNews]    = useState(null);
  const [newsLoading,  setNewsLoading]  = useState(true);

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
  const [recommendedQuestions,  setRecommendedQuestions]  = useState(null);
  const [questionsLoading,      setQuestionsLoading]      = useState(true);

  useEffect(() => {
    if (!bite?.title) return;
    setQuestionsLoading(true);
    getRecommendedQuestions(bite.title, userLevel)
      .then(qs => setRecommendedQuestions(qs?.length ? qs : fallbackQuestions))
      .catch(() => setRecommendedQuestions(fallbackQuestions))
      .finally(() => setQuestionsLoading(false));
  }, [bite?.title]); // eslint-disable-line

  const handleAddXp = async () => {
    if (!user || xpLoading) return;
    setXpLoading(true);
    await addXp(user.id, 5);
    await refreshProfile();
    setXpLoading(false);
  };

  const todos = [
    { title: '오늘의 한잎 읽기',   description: '3분이면 충분해요',       Icon: Leaf,          iconBg: '#E3F9EC', iconColor: '#3A9A5C', path: `/bite/${bite?.id}` },
    { title: '한잎 퀴즈 풀기',     description: '+5 XP 획득 가능',       Icon: Zap,           iconBg: '#FFF4D6', iconColor: '#854F0B', path: `/bite/${bite?.id}` },
    { title: '노밍에게 질문하기',  description: '궁금한 것 바로 물어보기', Icon: MessageCircle, iconBg: '#FFF4D6', iconColor: '#FFC83D', path: '/coach' },
    { title: '경제일기 쓰기',      description: '오늘 배운 것 기록하기',  Icon: NotebookPen,   iconBg: '#F1EFE8', iconColor: '#5F5E5A', path: '/diary' },
  ];

  const nomingIntro = profile?.noming_intro;

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
          <div style={{
            background: '#E3F9EC', border: '0.5px solid #B8EBC8',
            borderRadius: 20, padding: '4px 12px',
            fontSize: 11, color: '#2A7A4B',
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            🍃 {currentLevel?.label} · {xp} XP
            {user && (
              <button
                onClick={handleAddXp}
                disabled={xpLoading}
                style={{ background: 'none', border: 'none', fontSize: 9, color: '#B8EBC8', cursor: 'pointer', padding: '0 0 0 4px' }}
              >
                {xpLoading ? '…' : '+5'}
              </button>
            )}
          </div>
        </div>

        {/* 카드 1: 오늘의 한잎 미리보기 */}
        <div style={{ background: '#fff', borderRadius: 12, border: '0.5px solid #B8EBC8', padding: 16, marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 500, color: '#3A9A5C' }}>🍃 오늘의 경제 한잎</span>
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

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={() => navigate(`/bite/${bite?.id}`)}
              style={{ background: '#52C97A', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}
            >
              🍃 배우기 →
            </button>
          </div>
        </div>

        {/* 카드 2: 오늘의 추천 뉴스 */}
        <div style={{ background: '#fff', borderRadius: 12, border: '0.5px solid #B8EBC8', padding: 16, marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#3A9A5C', marginBottom: 10 }}>📰 오늘의 추천 뉴스</div>

          {newsLoading ? (
            <div style={{ height: 60, background: '#E3F9EC', borderRadius: 8, opacity: 0.5 }} />
          ) : todayNews ? (
            <>
              <div style={{ fontSize: 11, color: '#888780', marginBottom: 6 }}>
                {new Date(todayNews.pubDate).toLocaleDateString('ko-KR')}
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#2A7A4B', lineHeight: 1.5, marginBottom: 8 }}>
                {todayNews.title}
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
                  {todayNews.nomingComment}
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

        {/* 카드 3: 노밍의 한마디 */}
        <div style={{ background: '#fff', borderRadius: 12, border: '0.5px solid #B8EBC8', padding: 16, marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <img
              src={`${import.meta.env.BASE_URL}noming.png`}
              alt="노밍"
              style={{ width: 36, height: 36, objectFit: 'contain' }}
            />
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#2A7A4B' }}>노밍의 한마디</div>
              <div style={{ fontSize: 11, color: '#888780' }}>오늘의 경제 코칭</div>
            </div>
          </div>

          <div style={{
            background: '#F2FBF5', borderRadius: '0 10px 10px 10px',
            padding: '12px 14px', fontSize: 13, color: '#444441',
            lineHeight: 1.7, border: '0.5px solid #B8EBC8', marginBottom: 12,
          }}>
            {nomingIntro ? nomingIntro : (
              <>오늘의 주제는 <strong style={{ color: '#2A7A4B' }}>{bite?.title}</strong>이에요. 궁금한 게 있으면 바로 물어보세요!</>
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
              width: '100%', background: '#F2FBF5', border: '0.5px solid #B8EBC8',
              borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#888780',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              cursor: 'pointer',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#E8F7F1'}
            onMouseLeave={e => e.currentTarget.style.background = '#F2FBF5'}
          >
            직접 질문하기...
            <span style={{ color: '#52C97A' }}>→</span>
          </button>
        </div>

        {/* 카드 4: 오늘 할일 */}
        <div style={{ background: '#fff', borderRadius: 12, border: '0.5px solid #B8EBC8', padding: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#3A9A5C', marginBottom: 12 }}>오늘 해야 할 것</div>
          {todos.map((todo, i) => (
            <div
              key={i}
              onClick={() => navigate(todo.path)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 0', cursor: 'pointer',
                borderBottom: i < todos.length - 1 ? '0.5px solid #f0f7f3' : 'none',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#FAFFFE'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{
                width: 28, height: 28, borderRadius: 7, background: todo.iconBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <todo.Icon size={14} color={todo.iconColor} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: '#2C2C2A' }}>{todo.title}</div>
                <div style={{ fontSize: 11, color: '#888780', marginTop: 1 }}>{todo.description}</div>
              </div>
              <span style={{ color: '#B8EBC8', fontSize: 13 }}>→</span>
            </div>
          ))}
        </div>

      </div>
    </PageWrapper>
  );
}
