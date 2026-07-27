import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Zap, MessageCircle, NotebookPen, Sun, Flame, TrendingUp, BarChart2, Globe, PiggyBank, Home, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabaseClient';
import { getTodaysBite, getRecommendedBite } from '../services/biteService';
import { addXp, updateStreak } from '../services/profileService';
import { getLevelByXp } from '../data/levelData';
import { getRecommendedQuestions, getNomingDailyMessage } from '../services/coachService';
import { fetchAndSummarizeNews } from '../services/readingService';
import { useUserLevel } from '../hooks/useUserLevel';
import { BITE_INFOGRAPHICS } from '../data/biteInfographics';
import { CURRICULUM_CHAPTERS, getChapterProgress } from '../data/curriculum';
import PageWrapper from '../components/layout/PageWrapper';

const LEVEL_LABEL = {
  elementary: '초급자', intermediate: '중급자',
  advanced: '고급자', expert: '전문가',
};

function xpInfo(xp = 0) {
  const lvl      = Math.floor(xp / 100) + 1;
  const progress = xp % 100;
  const needed   = 100 - progress;
  return { lvl, progress, needed };
}

const _questionsCache = {};

/* 연속 학습일 마일스톤 → 보너스 XP */
const STREAK_MILESTONES = { 3: 10, 7: 30, 30: 100, 100: 300 };

export default function HomePage() {
  const navigate             = useNavigate();
  const { user, profile, refreshProfile, loading: authLoading } = useAuth();
  const { userLevel }        = useUserLevel();

  const [bite, setBite]      = useState(null);

  const d    = new Date();
  const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const today = `${d.getMonth() + 1}월 ${d.getDate()}일 ${days[d.getDay()]}`;

  /* 맞춤 한잎 — auth 확정 후에만 실행 */
  useEffect(() => {
    if (authLoading) return;
    if (!user?.id) { setBite(getTodaysBite()); return; }
    getRecommendedBite(user.id, userLevel)
      .then(b => setBite(b))
      .catch(() => setBite(getTodaysBite()));
  }, [user?.id, userLevel, authLoading]); // eslint-disable-line

  /* 오늘의 한잎이 속한 챕터의 학습 진도 — "N장 · 이름 · 학습한 개수/그 챕터의 학습 가능 카드 수" */
  const [chapterLearned, setChapterLearned] = useState(null);
  const chapterInfo = bite?.chapter ? CURRICULUM_CHAPTERS.find(c => c.number === bite.chapter) : null;

  useEffect(() => {
    if (!user?.id || !chapterInfo) { setChapterLearned(null); return; }
    const builtIds = chapterInfo.items.filter(it => !it.pending).map(it => it.id);
    let cancelled = false;
    supabase
      .from('user_bite_history')
      .select('bite_id')
      .eq('user_id', user.id)
      .in('bite_id', builtIds)
      .then(({ data }) => {
        if (cancelled) return;
        setChapterLearned(new Set((data ?? []).map(r => r.bite_id)).size);
      })
      .catch(() => { if (!cancelled) setChapterLearned(null); });
    return () => { cancelled = true; };
  }, [user?.id, chapterInfo?.number]); // eslint-disable-line

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
  const qCacheKey = bite?.title ? `${bite.title}__${userLevel}` : null;
  const [recommendedQuestions, setRecommendedQuestions] = useState(
    () => (qCacheKey ? _questionsCache[qCacheKey] ?? null : null)
  );
  const [questionsLoading, setQuestionsLoading] = useState(!qCacheKey || !_questionsCache[qCacheKey]);

  useEffect(() => {
    if (!qCacheKey) return;
    if (_questionsCache[qCacheKey]) {
      setRecommendedQuestions(_questionsCache[qCacheKey]);
      setQuestionsLoading(false);
      return;
    }
    setQuestionsLoading(true);
    getRecommendedQuestions(bite.title, userLevel)
      .then(qs => {
        const result = qs?.length ? qs : fallbackQuestions;
        _questionsCache[qCacheKey] = result;
        setRecommendedQuestions(result);
      })
      .catch(() => {
        _questionsCache[qCacheKey] = fallbackQuestions;
        setRecommendedQuestions(fallbackQuestions);
      })
      .finally(() => setQuestionsLoading(false));
  }, [qCacheKey]); // eslint-disable-line

  /* 할일 완료 여부 */
  const [todoDone, setTodoDone] = useState([false, false, false, false]);

  /* 연속 학습일 마일스톤 축하 토스트 */
  const [streakMilestone, setStreakMilestone] = useState(null);

  useEffect(() => {
    if (!user?.id || !bite?.id) return;
    const todayStr = new Date().toISOString().slice(0, 10);
    Promise.allSettled([
      supabase.from('user_bite_history').select('id').eq('user_id', user.id).eq('bite_id', bite.id).gte('viewed_at', todayStr).limit(1),
      supabase.from('user_quiz_results').select('id').eq('user_id', user.id).gte('created_at', todayStr).limit(1),
      supabase.from('coach_conversations').select('id').eq('user_id', user.id).gte('created_at', todayStr).limit(1),
      supabase.from('economic_journals').select('id').eq('user_id', user.id).gte('created_at', todayStr).limit(1),
    ]).then(async results => {
      const done = results.map(r => r.status === 'fulfilled' ? (r.value?.data?.length ?? 0) > 0 : false);
      setTodoDone(done);

      if (!done.some(Boolean)) return;

      const before = profile?.streak_days ?? 0;
      const { data: updated, error } = await updateStreak(user.id);
      if (error || !updated) return;

      const after = updated.streak_days ?? before;
      const bonusXp = STREAK_MILESTONES[after];
      if (after !== before && bonusXp) {
        const { error: xpError } = await addXp(user.id, bonusXp);
        if (xpError) console.error('스트릭 보너스 XP 지급 실패:', xpError);
        setStreakMilestone({ days: after, xp: bonusXp });
        setTimeout(() => setStreakMilestone(null), 2600);
      }

      refreshProfile();
    });
  }, [user?.id, bite?.id]); // eslint-disable-line

  const todos = [
    { title: '한잎 읽기',        Icon: Leaf,          iconColor: 'var(--c-forest-700)', path: `/bite/${bite?.id}`, done: todoDone[0] },
    { title: '한잎 퀴즈 풀기',   Icon: Zap,           iconColor: 'var(--c-amber-700)', path: `/bite/${bite?.id}`, done: todoDone[1] },
    { title: '노밍과 대화하기',  Icon: MessageCircle, iconColor: 'var(--c-yellow-500)', path: '/coach',            done: todoDone[2] },
    { title: '경제일기 쓰기',    Icon: NotebookPen,   iconColor: 'var(--c-slate)', path: '/diary',            done: todoDone[3] },
  ];

  const _nomingMsgCache = HomePage._nomingMsgCache ?? (HomePage._nomingMsgCache = {});
  const nomingCacheKey  = bite?.title ? `${bite.title}__${new Date().toISOString().slice(0, 10)}` : null;

  const [nomingIntro, setNomingIntro]           = useState(null);
  const [nomingIntroLoading, setNomingIntroLoading] = useState(true);

  useEffect(() => {
    if (!nomingCacheKey) return;
    if (_nomingMsgCache[nomingCacheKey]) {
      setNomingIntro(_nomingMsgCache[nomingCacheKey]);
      setNomingIntroLoading(false);
      return;
    }
    setNomingIntroLoading(true);
    getNomingDailyMessage(bite.title, userLevel)
      .then(msg => {
        const result = msg || null;
        _nomingMsgCache[nomingCacheKey] = result;
        setNomingIntro(result);
      })
      .catch(() => setNomingIntro(null))
      .finally(() => setNomingIntroLoading(false));
  }, [nomingCacheKey]); // eslint-disable-line

  const InfographicComp = bite ? (BITE_INFOGRAPHICS[bite.id] ?? null) : null;

  const CATEGORY_ICON = {
    '금리': TrendingUp, '투자': BarChart2, '거시경제': Globe,
    '저축': PiggyBank, '부동산': Home, '기초': BookOpen,
  };

  const { lvl, progress, needed } = xpInfo(profile?.xp ?? 0);

  return (
    <PageWrapper>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes streakToast {
          0%   { opacity: 0; transform: translate(-50%, -12px); }
          10%  { opacity: 1; transform: translate(-50%, 0); }
          85%  { opacity: 1; transform: translate(-50%, 0); }
          100% { opacity: 0; transform: translate(-50%, -12px); }
        }
      `}</style>

      {streakMilestone && (
        <div style={{
          position: 'fixed', top: 16, left: '50%', zIndex: 50,
          background: 'var(--grad-action)', color: '#fff',
          padding: '12px 22px', borderRadius: 100,
          fontSize: 14, fontWeight: 800, letterSpacing: '-0.3px',
          boxShadow: '0 6px 20px rgba(31,190,134,0.4)',
          display: 'flex', alignItems: 'center', gap: 8,
          animation: 'streakToast 2.6s ease-out forwards',
          pointerEvents: 'none', whiteSpace: 'nowrap',
        }}>
          <Flame size={16} /> {streakMilestone.days}일 연속 학습! +{streakMilestone.xp} XP
        </div>
      )}

      <div className="anim-fade" style={{ maxWidth: 720, margin: '0 auto', padding: '16px 20px 32px', boxSizing: 'border-box' }}>

        {/* ── XP / 그리팅 카드 ── */}
        {user ? (
          <div style={{
            background: 'var(--grad-action)', borderRadius: 18,
            padding: '20px', marginBottom: 14, color: '#fff',
            boxShadow: '0 4px 20px rgba(8,53,43,0.18)',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* 배경 장식 원 */}
            <div style={{ position: 'absolute', right: -20, top: -20, width: 110, height: 110, background: 'rgba(255,255,255,0.12)', borderRadius: '50%', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', right: 30, bottom: -30, width: 70, height: 70, background: 'rgba(255,255,255,0.09)', borderRadius: '50%', pointerEvents: 'none' }} />

            {/* 상단: 인사 + 레벨 배지 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>{today}</div>
                <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.4px' }}>
                  {profile?.nickname ? `${profile.nickname}님, 안녕하세요!` : '안녕하세요!'}
                </div>
              </div>
              {(() => {
                const { Icon: LvIcon, label } = getLevelByXp(profile?.xp ?? 0);
                return (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.92)',
                    borderRadius: 100, padding: '5px 11px',
                    border: '0.5px solid rgba(255,255,255,0.3)',
                    fontSize: 12, fontWeight: 700, flexShrink: 0,
                  }}>
                    <LvIcon size={13} color="rgba(255,255,255,0.9)" />
                    {label}
                  </span>
                );
              })()}
            </div>

            {/* XP 진행 바 */}
            <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 99, height: 5, overflow: 'hidden' }}>
              <div style={{
                background: '#fff', borderRadius: 99, height: '100%',
                width: `${progress}%`, transition: 'width 0.7s ease',
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, opacity: 0.75 }}>
              <span>Lv.{lvl}</span>
              <span>다음 레벨까지 {needed} XP</span>
            </div>

            {/* 오늘 할일 pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 14 }}>
              {todos.map((todo, i) => (
                <div
                  key={i}
                  onClick={() => navigate(todo.path)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    padding: '4px 10px', borderRadius: 20, cursor: 'pointer',
                    background: todo.done ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.18)',
                    border: `0.5px solid ${todo.done ? 'transparent' : 'rgba(255,255,255,0.4)'}`,
                  }}
                >
                  <todo.Icon size={11} color={todo.done ? 'var(--c-green-500)' : 'rgba(255,255,255,0.9)'} />
                  <span style={{ fontSize: 11, color: todo.done ? 'var(--c-forest-700)' : 'rgba(255,255,255,0.9)', fontWeight: todo.done ? 600 : 400 }}>
                    {todo.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* 비로그인: 방문자 카드 */
          <div style={{
            background: 'var(--grad-action)', borderRadius: 16,
            padding: '14px 16px', marginBottom: 14, color: '#fff',
            boxShadow: '0 4px 20px rgba(8,53,43,0.18)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 11, opacity: 0.8, marginBottom: 2 }}>{today}</div>
                <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.3px' }}>
                  안녕하세요, 방문자님!
                </div>
              </div>
              <div
                onClick={() => navigate('/login')}
                style={{
                  background: 'rgba(255,255,255,0.2)', border: '0.5px solid rgba(255,255,255,0.45)',
                  borderRadius: 20, padding: '5px 12px', cursor: 'pointer',
                  fontSize: 11, fontWeight: 600, flexShrink: 0,
                }}
              >
                로그인 →
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {todos.map((todo, i) => (
                <div
                  key={i}
                  onClick={() => navigate(todo.path)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    padding: '4px 10px', borderRadius: 20, cursor: 'pointer',
                    background: 'rgba(255,255,255,0.18)',
                    border: '0.5px solid rgba(255,255,255,0.4)',
                  }}
                >
                  <todo.Icon size={11} color="rgba(255,255,255,0.9)" />
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.9)' }}>{todo.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 카드 1: 오늘의 한잎 — Dark Forest Hero ── */}
        <div style={{ background: 'var(--c-surface)', borderRadius: 16, border: '0.5px solid var(--c-line)', overflow: 'hidden', marginBottom: 12, boxShadow: 'var(--shadow-card)' }}>
          {!bite ? (
            /* 스켈레톤 */
            <div style={{ padding: 0 }}>
              <div style={{
                background: 'linear-gradient(135deg, var(--c-forest-900) 0%, var(--c-forest-700) 100%)',
                padding: '18px 16px 20px',
              }}>
                <div style={{ height: 12, width: 90, borderRadius: 6, background: 'rgba(255,255,255,0.15)', marginBottom: 14 }} />
                <div style={{ height: 22, width: '70%', borderRadius: 6, background: 'rgba(255,255,255,0.18)', marginBottom: 10 }} />
                <div style={{ height: 12, width: '90%', borderRadius: 6, background: 'rgba(255,255,255,0.1)', marginBottom: 6 }} />
                <div style={{ height: 12, width: '75%', borderRadius: 6, background: 'rgba(255,255,255,0.1)' }} />
              </div>
              <div style={{ padding: '14px 16px 16px' }}>
                <div style={{ height: 100, borderRadius: 10, background: 'var(--c-canvas)',
                  backgroundImage: 'linear-gradient(90deg,var(--c-canvas) 25%,var(--c-green-50) 50%,var(--c-canvas) 75%)',
                  backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite', marginBottom: 12 }} />
                <div style={{ height: 40, borderRadius: 10, background: 'var(--c-green-100)',
                  backgroundImage: 'linear-gradient(90deg,var(--c-green-100) 25%,var(--c-canvas) 50%,var(--c-green-100) 75%)',
                  backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
              </div>
            </div>
          ) : (
            <>
              {/* Hero: dark forest 헤더 */}
              <div style={{
                background: 'linear-gradient(135deg, var(--c-forest-900) 0%, var(--c-forest-700) 100%)',
                padding: '18px 16px 16px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.3px' }}>오늘의 경제 한잎</span>
                  <span style={{ fontSize: 10, padding: '2px 9px', borderRadius: 20, background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)', border: '0.5px solid rgba(255,255,255,0.25)' }}>
                    {bite.category}
                  </span>
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 6, letterSpacing: '-0.5px', lineHeight: 1.3 }}>
                  {bite.title}
                </div>
                {chapterInfo && (
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.65)', marginBottom: 8 }}>
                    {chapterInfo.number}장 · {chapterInfo.name} · {chapterLearned ?? 0}/{getChapterProgress(chapterInfo.number).completed}
                  </div>
                )}
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 1.65 }}>
                  {bite.description}
                </div>
              </div>

              {/* 인포그래픽 + 버튼 */}
              <div style={{ padding: '14px 16px 16px' }}>
                <div style={{ background: 'var(--c-canvas)', borderRadius: 10, padding: '16px 12px', marginBottom: 12 }}>
                  {InfographicComp ? (
                    <InfographicComp />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                      {(() => {
                        const CatIcon = CATEGORY_ICON[bite.category] ?? BookOpen;
                        return <CatIcon size={36} color="var(--c-forest-700)" />;
                      })()}
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--c-forest-700)' }}>{bite.title}</div>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => navigate(`/bite/${bite.id}`)}
                  style={{ width: '100%', background: 'var(--grad-action)', color: '#fff', border: 'none', borderRadius: 10, padding: '11px', fontSize: 14, fontWeight: 600, cursor: 'pointer', letterSpacing: '-0.3px' }}
                >
                  오늘의 한잎 배우기 →
                </button>
              </div>
            </>
          )}
        </div>

        {/* ── 카드 2: 오늘의 추천 뉴스 ── */}
        <div style={{ background: 'var(--c-surface)', borderRadius: 16, border: '0.5px solid var(--c-line)', padding: 16, marginBottom: 12, boxShadow: 'var(--shadow-card)' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--c-forest-700)', marginBottom: 10, letterSpacing: '0.2px' }}>오늘의 추천 뉴스</div>

          {newsLoading ? (
            <div style={{ height: 60, background: 'var(--c-green-100)', borderRadius: 8, opacity: 0.5,
              backgroundImage: 'linear-gradient(90deg,var(--c-green-100) 25%,var(--c-canvas) 50%,var(--c-green-100) 75%)',
              backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
          ) : todayNews ? (
            <>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 11, color: 'var(--c-muted)', flexShrink: 0 }}>
                  {new Date(todayNews.pubDate).toLocaleDateString('ko-KR')}
                </span>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--c-ink)', lineHeight: 1.5 }}>
                  {todayNews.title}
                </span>
              </div>
              {todayNews.nomingComment && (
                <div style={{
                  background: 'var(--c-yellow-100)', borderRadius: 8, border: '0.5px solid var(--c-yellow-border)',
                  padding: '8px 12px', fontSize: 12, color: 'var(--c-amber-700)',
                  marginBottom: 10, display: 'flex', gap: 6, alignItems: 'flex-start',
                }}>
                  <Sun size={16} color="#F59E0B" style={{ flexShrink: 0 }} />
                  {todayNews.nomingComment.replace(/^노밍[이의]?\s*한마디\s*[-—–]\s*/u, '')}
                </div>
              )}
              <div style={{ display: 'flex', gap: 8 }}>
                <a href={todayNews.link} target="_blank" rel="noopener noreferrer"
                  style={{ flex: 1, padding: '9px 12px', borderRadius: 9, background: 'var(--c-canvas)', border: '0.5px solid var(--c-line)', color: 'var(--c-forest-700)', fontSize: 12, textAlign: 'center', textDecoration: 'none', fontWeight: 500 }}>
                  원문 보기 →
                </a>
                <button onClick={() => navigate('/read')}
                  style={{ flex: 1, padding: '9px 12px', borderRadius: 9, background: 'var(--c-green-500)', border: 'none', color: '#fff', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
                  더 많은 뉴스
                </button>
              </div>
            </>
          ) : (
            <div style={{ fontSize: 12, color: 'var(--c-muted)', textAlign: 'center', padding: 12 }}>뉴스를 불러올 수 없어요</div>
          )}
        </div>

        {/* ── 카드 3: 노밍 한마디 — Yellow 테마 ── */}
        <div style={{
          background: 'var(--c-yellow-100)', borderRadius: 16,
          border: '1px solid var(--c-yellow-border)', padding: 16,
          boxShadow: '0 2px 12px rgba(139,90,0,0.08)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{
              width: 42, height: 42, borderRadius: '50%',
              background: 'rgba(255,200,61,0.25)', border: '1.5px solid var(--c-yellow-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Sun size={24} color="#F59E0B" />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--c-amber-700)' }}>노밍 한마디</div>
              <div style={{ fontSize: 11, color: '#A57800', opacity: 0.8 }}>오늘의 경제 코칭</div>
            </div>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.6)', borderRadius: 12,
            padding: '12px 14px', fontSize: 13, color: 'var(--c-amber-700)',
            lineHeight: 1.75, border: '0.5px solid var(--c-yellow-border)', marginBottom: 12,
            fontWeight: 500, minHeight: 60,
          }}>
            {nomingIntroLoading ? (
              <div style={{
                height: 13, borderRadius: 6, marginBottom: 8,
                background: 'linear-gradient(90deg,rgba(255,200,61,0.25) 25%,rgba(255,246,220,0.7) 50%,rgba(255,200,61,0.25) 75%)',
                backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite',
              }}>
                <div style={{ height: 13, width: '60%', borderRadius: 6, marginTop: 6,
                  background: 'linear-gradient(90deg,rgba(255,200,61,0.25) 25%,rgba(255,246,220,0.7) 50%,rgba(255,200,61,0.25) 75%)',
                  backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite',
                }} />
              </div>
            ) : nomingIntro ? nomingIntro : (
              <>오늘의 주제는 <strong style={{ color: 'var(--c-amber-700)' }}>{bite?.title}</strong>이에요. 궁금한 게 있으면 바로 물어보세요!</>
            )}
          </div>

          {questionsLoading ? (
            [0, 1].map(i => (
              <div key={i} style={{
                width: '100%', height: 36, borderRadius: 8, marginBottom: 6,
                background: 'linear-gradient(90deg,rgba(255,200,61,0.2) 25%,rgba(255,246,220,0.6) 50%,rgba(255,200,61,0.2) 75%)',
                backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite',
              }} />
            ))
          ) : (
            (recommendedQuestions ?? fallbackQuestions).map((q, i) => (
              <button
                key={i}
                onClick={() => navigate('/coach', { state: { question: q } })}
                style={{
                  width: '100%', background: 'rgba(255,255,255,0.55)', border: '0.5px solid var(--c-yellow-border)',
                  borderRadius: 9, padding: '9px 12px', fontSize: 12, color: 'var(--c-amber-700)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  marginBottom: 6, cursor: 'pointer', textAlign: 'left', fontWeight: 500,
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.85)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.55)'}
              >
                <span style={{ flex: 1, marginRight: 8 }}>{q}</span>
                <span style={{ color: 'var(--c-yellow-500)', flexShrink: 0 }}>→</span>
              </button>
            ))
          )}

          <button
            onClick={() => navigate('/coach')}
            style={{
              width: '100%', background: 'var(--c-yellow-500)', border: 'none',
              borderRadius: 10, padding: '11px 12px', fontSize: 13, fontWeight: 700,
              color: '#fff', cursor: 'pointer', letterSpacing: '-0.3px',
              display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6,
              marginTop: 14,
            }}
          >
            노밍에게 직접 질문하기
          </button>
        </div>

        {/* ── 카드 4: 오늘의 행동 제안 ── */}
        {user && profile?.today_action && (
          <div style={{
            background: '#FFFBEE', borderRadius: 16,
            border: '1px solid #FAC775', padding: 16, marginTop: 12,
            boxShadow: '0 2px 12px rgba(139,90,0,0.06)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <img src={`${import.meta.env.BASE_URL}noming.png`} style={{ width: 24, height: 24, objectFit: 'contain', borderRadius: 4 }} alt="" />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#854F0B', letterSpacing: '0.3px' }}>노밍의 오늘 행동 제안</span>
            </div>
            <div style={{ fontSize: 13, color: '#633806', lineHeight: 1.75 }}>
              {profile.today_action}
            </div>
            <button
              onClick={() => navigate('/my-growth', { state: { tab: 'independence' } })}
              style={{ marginTop: 10, background: 'none', border: '0.5px solid #FAC775', borderRadius: 8, padding: '6px 12px', fontSize: 11, color: '#854F0B', cursor: 'pointer', fontWeight: 600 }}
            >
              자립 로드맵 보기 →
            </button>
          </div>
        )}

      </div>
    </PageWrapper>
  );
}
