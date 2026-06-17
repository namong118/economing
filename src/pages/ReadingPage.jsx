import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookMarked } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import { useAuth } from '../context/AuthContext';
import { fetchAndSummarizeNews } from '../services/readingService';
import { saveKeywordsFromNews } from '../services/dictionaryService';

const CATEGORIES = ['경제', '금리', '환율', '주식', '부동산', '미국경제', '글로벌경제'];

const newsCache = {};

/* ── 요약 중 스켈레톤 ─────────────────────────────────────── */
function SummarySkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
      {[100, 85, 70].map((w, i) => (
        <div key={i} style={{
          height: '14px', borderRadius: '6px',
          background: 'linear-gradient(90deg, #f0f7f3 25%, #e1f5ee 50%, #f0f7f3 75%)',
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
    height: h, width: w, borderRadius: '6px', marginBottom: mb,
    background: 'linear-gradient(90deg, #E1F5EE 25%, #F4FAF6 50%, #E1F5EE 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
  })
  return (
    <div style={{
      background: '#fff', borderRadius: '12px',
      border: '0.5px solid #d4ede3', overflow: 'hidden', marginBottom: '12px',
    }}>
      <div style={{ padding: '20px 22px 18px' }}>
        <div style={bar('80px', '11px', '12px')} />
        <div style={bar('92%', '17px', '8px')} />
        <div style={bar('68%', '17px', '18px')} />
        <div style={bar('100%', '13px', '8px')} />
        <div style={bar('88%', '13px', '8px')} />
        <div style={bar('74%', '13px', '0')} />
      </div>
      <div style={{ padding: '12px 22px 20px', display: 'flex', gap: '8px' }}>
        <div style={{ ...bar('100%', '38px', '0'), flex: 1 }} />
        <div style={{ ...bar('100%', '38px', '0'), flex: 1 }} />
      </div>
    </div>
  )
}

/* ── 뉴스 카드 ────────────────────────────────────────────── */
function NewsCard({ article, isSaved, onSaveKeywords }) {
  const BASE_URL    = import.meta.env.BASE_URL;
  const summarizing = article._summarizing;

  return (
    <div style={{
      background: '#fff', borderRadius: '12px',
      border: '0.5px solid #d4ede3', overflow: 'hidden', marginBottom: '12px',
    }}>
      {/* 날짜 + 제목 */}
      <div style={{ padding: '20px 22px 14px' }}>
        <div style={{ fontSize: '11px', color: '#888780', marginBottom: '6px' }}>
          {new Date(article.pubDate).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
        <h2 style={{
          fontSize: '17px', fontWeight: '800', color: '#085041',
          lineHeight: '1.4', letterSpacing: '-0.4px', marginBottom: '10px',
        }}>
          {article.title}
        </h2>

        {/* 요약: 로딩 중이면 스켈레톤, 아니면 텍스트 */}
        {summarizing ? (
          <SummarySkeleton />
        ) : (
          <p style={{ fontSize: '13px', color: '#5F5E5A', lineHeight: '1.75', marginBottom: 0 }}>
            {article.summary || article.description}
          </p>
        )}
      </div>

      {/* 핵심 포인트 */}
      {!summarizing && article.keyPoints?.length > 0 && (
        <div style={{ margin: '0 22px 14px', background: '#F4FAF6', borderRadius: '10px', border: '0.5px solid #d4ede3', padding: '14px 16px' }}>
          <p style={{ fontSize: '11px', fontWeight: '700', color: '#166534', marginBottom: '10px', letterSpacing: '0.2px' }}>
            📌 핵심 포인트
          </p>
          {article.keyPoints.map((pt, j) => (
            <div key={j} style={{ display: 'flex', gap: '8px', marginBottom: j < article.keyPoints.length - 1 ? '8px' : '0' }}>
              <div style={{
                width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0,
                background: '#21C58E', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '10px', color: '#fff', fontWeight: '800', marginTop: '1px',
              }}>
                {j + 1}
              </div>
              <p style={{ fontSize: '13px', color: '#2C2C2A', lineHeight: '1.6', margin: 0 }}>{pt}</p>
            </div>
          ))}
        </div>
      )}

      {/* 노밍 한마디 */}
      {!summarizing && article.nomingComment && (
        <div style={{ margin: '0 22px 14px', background: '#FFF4D6', borderRadius: '10px', border: '0.5px solid #FAC775', padding: '12px 16px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
          <img
            src={`${BASE_URL}coach.png`}
            alt="노밍"
            style={{ width: '28px', height: '28px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0, marginTop: '2px' }}
          />
          <div>
            <p style={{ fontSize: '11px', fontWeight: '700', color: '#B45309', marginBottom: '4px' }}>☀️ 노밍 한마디</p>
            <p style={{ fontSize: '13px', color: '#78350F', lineHeight: '1.65' }}>{article.nomingComment}</p>
          </div>
        </div>
      )}

      {/* 경제 키워드 태그 */}
      {!summarizing && article.keywords?.length > 0 && (
        <div style={{ padding: '0 22px 14px' }}>
          <p style={{ fontSize: '11px', color: '#888780', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <BookMarked size={11} color="#888780" /> 이 뉴스의 경제 용어
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {article.keywords.map((kw, j) => (
              <span
                key={j}
                title={kw.explanation}
                style={{
                  fontSize: '11px', padding: '4px 12px', borderRadius: '100px',
                  background: '#E1F5EE', color: '#085041', border: '0.5px solid #9FE1CB',
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
      <div style={{ display: 'flex', gap: '8px', padding: '0 22px 20px' }}>
        <a
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flex: 1, padding: '10px 12px', borderRadius: '10px',
            fontSize: '12px', fontWeight: '600',
            background: '#F4FAF6', border: '0.5px solid #d4ede3',
            color: '#085041', textAlign: 'center', textDecoration: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          원문 보기 →
        </a>
        {!summarizing && article.keywords?.length > 0 && (
          <button
            onClick={onSaveKeywords}
            disabled={isSaved}
            style={{
              flex: 1, padding: '10px 12px', borderRadius: '10px',
              fontSize: '12px', fontWeight: '700',
              background: isSaved ? '#F4FAF6' : '#21C58E',
              border: isSaved ? '0.5px solid #d4ede3' : 'none',
              color: isSaved ? '#888780' : '#fff',
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

  return (
    <PageWrapper>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <div style={{ background: '#F4FAF6', minHeight: 'calc(100vh - 64px)', paddingBottom: '64px' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto', padding: '20px 20px 0' }}>

          {/* 카테고리 필터 */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => { setCategory(cat); setSavedMap({}); }}
                style={{
                  padding: '5px 16px', borderRadius: '100px',
                  fontSize: '12px', fontWeight: category === cat ? '700' : '500',
                  border: '0.5px solid',
                  background:  category === cat ? '#21C58E' : '#fff',
                  color:       category === cat ? '#fff' : '#085041',
                  borderColor: category === cat ? '#21C58E' : '#d4ede3',
                  cursor: 'pointer', transition: 'all 0.15s',
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
                  background: '#21C58E', color: '#fff', border: 'none',
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
            />
          ))}

          {/* 하단 노밍 CTA */}
          {!loading && !error && articles.length > 0 && (
            <div style={{
              marginTop: '16px',
              background: '#FFF4D6', border: '0.5px solid #FAC775',
              borderRadius: '12px', padding: '20px 22px', textAlign: 'center',
            }}>
              <p style={{ fontSize: '14px', fontWeight: '700', color: '#B45309', marginBottom: '6px' }}>
                ☀️ 더 궁금한 게 생겼나요?
              </p>
              <p style={{ fontSize: '13px', color: '#78350F', lineHeight: '1.7', marginBottom: '14px' }}>
                노밍에게 바로 질문해봐요.
              </p>
              <button
                onClick={() => navigate('/coach')}
                style={{
                  padding: '10px 22px', borderRadius: '100px',
                  background: '#21C58E', color: '#fff', border: 'none',
                  fontSize: '13px', fontWeight: '700', cursor: 'pointer',
                  boxShadow: '0 3px 10px rgba(33,197,142,0.3)',
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
