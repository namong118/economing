import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookMarked, Sun } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import { useAuth } from '../context/AuthContext';
import { fetchAndSummarizeNews, markAsRead } from '../services/readingService';
import { saveKeywordsFromNews } from '../services/dictionaryService';

const CATEGORIES = ['경제', '금리', '환율', '주식', '부동산', '미국경제', '글로벌경제'];

const newsCache = {};

/* ── 요약 중 스켈레톤 ─────────────────────────────────────── */
function SummarySkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
      {[100, 85, 70].map((w, i) => (
        <div key={i} style={{
          height: '13px', borderRadius: '6px',
          background: 'linear-gradient(90deg, var(--c-green-50) 25%, var(--c-canvas) 50%, var(--c-green-50) 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.4s infinite',
          width: `${w}%`,
        }} />
      ))}
    </div>
  );
}

/* ── 전체 카드 스켈레톤 (초기 로딩용) ─────────────────────── */
function NewsCardSkeleton() {
  const bar = (w, h = '13px', mb = '7px') => ({
    height: h, width: w, borderRadius: '7px', marginBottom: mb,
    background: 'linear-gradient(90deg, var(--c-green-100) 25%, var(--c-canvas) 50%, var(--c-green-100) 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
  });
  return (
    <div style={{
      background: 'var(--c-surface)', borderRadius: '14px',
      border: '0.5px solid var(--c-line)', overflow: 'hidden', marginBottom: '12px',
      boxShadow: 'var(--shadow-card)',
    }}>
      <div style={{ padding: '20px 22px 16px' }}>
        <div style={bar('70px', '10px', '12px')} />
        <div style={bar('88%', '18px', '6px')} />
        <div style={bar('64%', '18px', '16px')} />
        <div style={bar('100%', '13px', '7px')} />
        <div style={bar('90%',  '13px', '7px')} />
        <div style={bar('76%',  '13px', '0')} />
      </div>
      <div style={{ padding: '10px 22px 20px', display: 'flex', gap: '8px' }}>
        <div style={{ ...bar('100%', '38px', '0'), flex: 1, borderRadius: '10px' }} />
        <div style={{ ...bar('100%', '38px', '0'), flex: 1, borderRadius: '10px' }} />
      </div>
    </div>
  );
}

/* ── 뉴스 카드 ────────────────────────────────────────────── */
function NewsCard({ article, isSaved, onSaveKeywords, isRead, onMarkRead }) {
  const BASE_URL    = import.meta.env.BASE_URL;
  const summarizing = article._summarizing;

  return (
    <div style={{
      background: 'var(--c-surface)', borderRadius: '14px',
      border: '0.5px solid var(--c-line)', overflow: 'hidden', marginBottom: '12px',
      boxShadow: 'var(--shadow-card)',
    }}>
      {/* 날짜 + 제목 */}
      <div style={{ padding: '20px 22px 14px' }}>
        <div style={{ fontSize: '11px', color: 'var(--c-muted)', marginBottom: '6px' }}>
          {article.pubDate && !isNaN(new Date(article.pubDate))
            ? new Date(article.pubDate).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
            : ''}
        </div>
        <h2 style={{
          fontSize: '17px', fontWeight: '800', color: 'var(--c-ink)',
          lineHeight: '1.4', letterSpacing: '-0.4px', marginBottom: '10px',
        }}>
          {article.title}
        </h2>

        {/* 요약: 로딩 중이면 스켈레톤, 아니면 텍스트 */}
        {summarizing ? (
          <SummarySkeleton />
        ) : (
          <p style={{ fontSize: '13px', color: 'var(--c-slate)', lineHeight: '1.75', marginBottom: 0 }}>
            {article.summary || article.description}
          </p>
        )}
      </div>

      {/* 핵심 포인트 */}
      {!summarizing && article.keyPoints?.length > 0 && (
        <div style={{ margin: '0 22px 14px', background: 'var(--c-canvas)', borderRadius: '10px', border: '0.5px solid var(--c-line)', padding: '14px 16px' }}>
          <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--c-forest-700)', marginBottom: '10px', letterSpacing: '0.2px' }}>
            📌 핵심 포인트
          </p>
          {article.keyPoints.map((pt, j) => (
            <div key={j} style={{ display: 'flex', gap: '8px', marginBottom: j < article.keyPoints.length - 1 ? '8px' : '0' }}>
              <div style={{
                width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
                background: 'var(--c-green-100)', border: '1px solid var(--c-green-500)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '10px', color: 'var(--c-forest-700)', fontWeight: '800', marginTop: '1px',
              }}>
                {j + 1}
              </div>
              <p style={{ fontSize: '13px', color: 'var(--c-ink)', lineHeight: '1.6', margin: 0 }}>{pt}</p>
            </div>
          ))}
        </div>
      )}

      {/* 노밍 한마디 */}
      {!summarizing && article.nomingComment && (
        <div style={{ margin: '0 22px 14px', background: 'var(--c-yellow-100)', borderRadius: '10px', border: '1px solid var(--c-yellow-border)', padding: '12px 16px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
            background: 'rgba(255,200,61,0.25)', border: '1.5px solid var(--c-yellow-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
          }}>
            <Sun size={18} color="#F59E0B" />
          </div>
          <div>
            <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--c-amber-700)', marginBottom: '4px' }}>노밍 한마디</p>
            <p style={{ fontSize: '13px', color: 'var(--c-amber-700)', lineHeight: '1.65' }}>{article.nomingComment.replace(/^노밍[이의]?\s*한마디\s*[-—–]\s*/u, '')}</p>
          </div>
        </div>
      )}

      {/* 경제 키워드 태그 */}
      {!summarizing && article.keywords?.length > 0 && (
        <div style={{ padding: '0 22px 14px' }}>
          <p style={{ fontSize: '11px', color: 'var(--c-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <BookMarked size={11} color="var(--c-muted)" /> 이 뉴스의 경제 용어
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {article.keywords.map((kw, j) => (
              <span
                key={j}
                title={kw.explanation}
                style={{
                  fontSize: '11px', padding: '4px 12px', borderRadius: '100px',
                  background: 'var(--c-green-100)', color: 'var(--c-forest-700)', border: '0.5px solid var(--c-line)',
                  fontWeight: '600',
                }}
              >
                {kw.term}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 하단 버튼 */}
      <div style={{ display: 'flex', gap: '8px', padding: '0 22px 20px', flexWrap: 'wrap' }}>
        <a
          href={article.originallink || article.link}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flex: 1, padding: '10px 12px', borderRadius: '10px',
            fontSize: '12px', fontWeight: '600',
            background: 'var(--c-canvas)', border: '0.5px solid var(--c-line)',
            color: 'var(--c-forest-700)', textAlign: 'center', textDecoration: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          원문 보기 →
        </a>
        {!summarizing && (
          <button
            onClick={onMarkRead}
            disabled={isRead}
            style={{
              flex: 1, padding: '10px 12px', borderRadius: '10px',
              fontSize: '12px', fontWeight: '700',
              background: isRead ? 'var(--c-canvas)' : 'var(--grad-action)',
              border: isRead ? '0.5px solid var(--c-line)' : 'none',
              color: isRead ? 'var(--c-muted)' : '#fff',
              cursor: isRead ? 'default' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
              boxShadow: isRead ? 'none' : '0 2px 8px rgba(31,190,134,0.3)',
            }}
          >
            {isRead ? '✓ +5 XP 적립됨' : '읽기 완료 +5 XP'}
          </button>
        )}
        {!summarizing && article.keywords?.length > 0 && (
          <button
            onClick={onSaveKeywords}
            disabled={isSaved}
            style={{
              flex: 1, padding: '10px 12px', borderRadius: '10px',
              fontSize: '12px', fontWeight: '700',
              background: isSaved ? 'var(--c-canvas)' : 'var(--c-green-100)',
              border: isSaved ? '0.5px solid var(--c-line)' : '0.5px solid var(--c-line)',
              color: isSaved ? 'var(--c-muted)' : 'var(--c-forest-700)',
              cursor: isSaved ? 'default' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
            }}
          >
            {isSaved ? '✓ 저장됨' : '경제사전에 저장'}
          </button>
        )}
      </div>
    </div>
  );
}

/* ── 메인 페이지 ──────────────────────────────────────────── */
export default function ReadingPage() {
  const navigate             = useNavigate();
  const { user }             = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [category, setCategory] = useState('경제');
  const [savedMap, setSavedMap] = useState({});
  const [readMap,  setReadMap]  = useState({});
  const [error,    setError]    = useState(null);
  const abortRef = useRef(false);

  const loadNews = useCallback(async (query) => {
    setLoading(true);
    setArticles([]);
    setError(null);
    abortRef.current = false;

    // 1. 메모리 캐시 확인 (즉시)
    if (newsCache[query]) {
      setArticles(newsCache[query]);
      setLoading(false);
      return;
    }

    try {
      // 2. Supabase 캐시 확인 → 없으면 API 호출 + 병렬 요약
      const results = await fetchAndSummarizeNews(query);
      if (abortRef.current) return;
      newsCache[query] = results;
      setArticles(results);
      setLoading(false);
    } catch (err) {
      console.error(err);
      if (!abortRef.current) {
        setLoading(false);
        setError('뉴스를 가져오는 데 실패했어요. 잠시 후 다시 시도해주세요.');
      }
    }
  }, []);

  useEffect(() => {
    loadNews(category);
    return () => { abortRef.current = true; };
  }, [category, loadNews]);

  async function handleSaveKeywords(article, idx) {
    if (!user) { navigate('/login'); return; }
    await saveKeywordsFromNews(article.keywords, user.id, article.title);
    setSavedMap(prev => ({ ...prev, [idx]: true }));
  }

  async function handleMarkRead(idx) {
    if (!user) { navigate('/login'); return; }
    if (readMap[idx]) return;
    setReadMap(prev => ({ ...prev, [idx]: true }));
    await markAsRead(user.id);
  }

  return (
    <PageWrapper>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <div style={{ background: 'var(--c-canvas)', minHeight: 'calc(100vh - 64px)', paddingBottom: '64px' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto', padding: '20px 20px 0' }}>

          {/* 카테고리 필터 */}
          <div style={{
            display: 'flex', gap: '7px', marginBottom: '20px',
            overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: '2px',
          }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => { setCategory(cat); setSavedMap({}); }}
                style={{
                  flexShrink: 0,
                  padding: '7px 16px', borderRadius: '100px',
                  fontSize: '13px', fontWeight: category === cat ? '700' : '500',
                  border: '1.5px solid',
                  background:  category === cat ? 'var(--c-green-500)' : 'var(--c-surface)',
                  color:       category === cat ? '#fff' : 'var(--c-slate)',
                  borderColor: category === cat ? 'var(--c-green-500)' : 'var(--c-line)',
                  cursor: 'pointer', transition: 'all 0.15s',
                  whiteSpace: 'nowrap',
                  boxShadow: category === cat ? '0 2px 8px rgba(31,190,134,0.28)' : 'none',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 초기 로딩 스켈레톤 */}
          {loading && (
            <>
              <NewsCardSkeleton />
              <NewsCardSkeleton />
              <NewsCardSkeleton />
            </>
          )}

          {/* 에러 */}
          {error && (
            <div style={{
              background: '#FEF2F2', border: '0.5px solid #FECACA',
              borderRadius: '12px', padding: '20px 24px', textAlign: 'center',
            }}>
              <p style={{ fontSize: '13px', color: '#DC2626', marginBottom: '12px' }}>{error}</p>
              <button
                onClick={() => { delete newsCache[category]; loadNews(category); }}
                style={{
                  padding: '8px 20px', borderRadius: '8px',
                  background: 'var(--c-green-500)', color: '#fff', border: 'none',
                  fontSize: '12px', fontWeight: '700', cursor: 'pointer',
                }}
              >
                다시 시도
              </button>
            </div>
          )}

          {/* 뉴스 카드 목록 */}
          {articles.map((article, i) => (
            <NewsCard
              key={i}
              article={article}
              isSaved={!!savedMap[i]}
              onSaveKeywords={() => handleSaveKeywords(article, i)}
              isRead={!!readMap[i]}
              onMarkRead={() => handleMarkRead(i)}
            />
          ))}

          {/* 하단 노밍 CTA */}
          {!loading && !error && articles.length > 0 && (
            <div style={{
              marginTop: '16px',
              background: 'var(--c-yellow-100)', border: '1px solid var(--c-yellow-border)',
              borderRadius: '14px', padding: '20px 22px', textAlign: 'center',
            }}>
              {/* 노밍 원형 아바타 */}
              <div style={{
                width: '48px', height: '48px', borderRadius: '50%', margin: '0 auto 12px',
                background: 'rgba(255,200,61,0.25)', border: '1.5px solid var(--c-yellow-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
              }}>
                <Sun size={30} color="#F59E0B" />
              </div>
              <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--c-amber-700)', marginBottom: '6px' }}>
                더 궁금한 게 생겼나요?
              </p>
              <p style={{ fontSize: '13px', color: 'var(--c-amber-700)', lineHeight: '1.7', marginBottom: '16px' }}>
                노밍에게 바로 질문해봐요.
              </p>
              <button
                onClick={() => navigate('/coach')}
                style={{
                  padding: '11px 24px', borderRadius: '100px',
                  background: 'var(--grad-action)', color: '#fff', border: 'none',
                  fontSize: '13px', fontWeight: '700', cursor: 'pointer',
                  boxShadow: '0 3px 10px rgba(31,190,134,0.35)',
                }}
              >
                노밍에게 질문하기 →
              </button>
            </div>
          )}

        </div>
      </div>
    </PageWrapper>
  );
}
