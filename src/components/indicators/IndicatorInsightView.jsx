/* 지표 "정독형" 화면 — 경제한잎(EconomicBitePage)의 헤로→인포그래픽→쉬운설명→왜중요→
   사례→영향 순서와 완전히 다르게 짠다. "이 지표가 뭔지"가 아니라 "오늘 이 숫자를
   어떻게 읽는지"가 목적이라 SectionLabel/InfoSection 같은 한잎 컴포넌트는 쓰지 않는다. */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, ExternalLink, Sun } from 'lucide-react';
import RangeGauge from './RangeGauge';
import { getBandForValue } from '../../data/indicatorInsights';
import { getEconomicStats } from '../../services/economicStatsService';
import { getMarketIndices } from '../../services/indicesService';
import { fetchAndSummarizeNews } from '../../services/readingService';
import { deriveYoYSeries } from '../../utils/liveIndicatorValue';

/* dataKey는 economic-stats(ECOS/KOSIS: 기준금리·CPI·GDP 등) 전용 키다.
   코스피/코스닥/환율은 별도 함수(indices, Yahoo Finance·환율 API)에서 오므로
   insight.liveIndexKey가 있으면 그쪽 응답의 history를 시계열로 쓴다. */
function useLiveSeries(dataKey, { transform, deriveYoY, liveIndexKey } = {}) {
  const [state, setState] = useState({ loading: true, series: null });
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = liveIndexKey ? await getMarketIndices() : await getEconomicStats();
      if (cancelled) return;
      let series = liveIndexKey ? data?.[liveIndexKey]?.history : data?.[dataKey];
      if (error || !Array.isArray(series) || series.length === 0) {
        setState({ loading: false, series: null });
        return;
      }
      if (deriveYoY) series = deriveYoYSeries(series);
      if (transform) series = series.map(p => ({ date: p.date, value: transform(p.value) }));
      setState({ loading: false, series });
    })();
    return () => { cancelled = true; };
  }, [dataKey, liveIndexKey]); // eslint-disable-line
  return state;
}

function useMatchingNews(query, phrases) {
  const [article, setArticle] = useState(undefined); // undefined = 로딩, null = 못 찾음
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const articles = await fetchAndSummarizeNews(query);
        if (cancelled) return;
        const found = articles.find(a =>
          phrases.some(p => `${a.title ?? ''}${a.description ?? ''}`.includes(p.phrase))
        );
        setArticle(found ?? null);
      } catch {
        if (!cancelled) setArticle(null);
      }
    })();
    return () => { cancelled = true; };
  }, [query]); // eslint-disable-line
  return article;
}

/* 실시간 값(today) 로딩 중 2·3번 섹션이 나타날 자리를 미리 잡아두는 스켈레톤 —
   안 그러면 로딩이 끝나는 순간 카드가 튀어나오며 아래 콘텐츠가 밀린다 */
function SkeletonCard({ lines, gauge }) {
  const bar = (width, height) => (
    <div style={{
      width, height, borderRadius: 6,
      background: 'linear-gradient(90deg, var(--c-line-soft) 25%, var(--c-canvas) 50%, var(--c-line-soft) 75%)',
      backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite',
    }} />
  );
  return (
    <div style={{
      background: 'var(--c-surface)', border: '0.5px solid var(--c-line)',
      borderRadius: 14, padding: '20px 18px 16px', marginBottom: 14,
      boxShadow: 'var(--shadow-card)', display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      {lines.map((h, i) => <div key={i}>{bar(i === 0 ? '40%' : '100%', h)}</div>)}
      {gauge && bar('100%', 48)}
    </div>
  );
}

export default function IndicatorInsightView({ indicator, insight }) {
  const navigate = useNavigate();
  const { series, loading } = useLiveSeries(indicator.dataKey, {
    transform: insight.transform,
    deriveYoY: insight.deriveYoY,
    liveIndexKey: insight.liveIndexKey,
  });
  const matchedArticle = useMatchingNews(insight.newsQuery, insight.newsPhrases);
  const [showMore, setShowMore] = useState(false);

  const unit = insight.unit ?? '%';
  const deltaUnit = unit === '%' ? '%p' : unit;
  const periodLabel = insight.periodLabel ?? '월';
  const directionTitle = insight.directionTitle ?? '오르면? 내리면?';

  const currentAnchor = insight.anchors.find(a => a.when === '현재');
  const latest = series?.[series.length - 1] ?? null;
  const prev   = series?.[series.length - 2] ?? null;
  const today  = latest?.value ?? currentAnchor?.value ?? null;
  const delta  = latest && prev ? Math.round((latest.value - prev.value) * 100) / 100 : null;
  // 실업률처럼 구간을 일부러 두지 않은 지표(insight.noBands)는 band가 없다 —
  // "이 숫자를 그대로 판단하면 안 된다"는 게 요점이라, 임의로 구간을 만들어 채우지 않는다.
  const band = !insight.noBands && today != null ? getBandForValue(insight.bands, today) : null;
  const drawdownPct = insight.drawdownAnchor && today != null
    ? Math.round(((today - insight.drawdownAnchor.value) / insight.drawdownAnchor.value) * 1000) / 10
    : null;

  return (
    <div>
      {/* 1. 오늘의 숫자 */}
      <div style={{
        background: 'linear-gradient(135deg, var(--c-forest-900) 0%, var(--c-forest-700) 100%)',
        borderRadius: 16, padding: '26px 20px', marginBottom: 14, textAlign: 'center',
        boxShadow: '0 4px 20px rgba(6,53,43,0.22)',
      }}>
        {/* 제목 + oneLiner를 한 줄로 이어붙이면 "코스닥 지수 읽기 · 코스닥 지수가..."처럼
            같은 지표 이름이 두 번 나온다 — 제목은 작고 옅게, oneLiner는 그 아래
            또렷하게 둬서 반복 없이 둘 다 살린다 */}
        <div style={{ marginBottom: 12 }}>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: 600, marginBottom: 3 }}>
            {indicator.title}
          </p>
          <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.9)', fontWeight: 700 }}>
            {insight.oneLiner}
          </p>
        </div>
        {loading ? (
          <div style={{ height: 58 }} />
        ) : today != null ? (
          <>
            <div style={{ fontSize: 46, fontWeight: 900, color: '#fff', letterSpacing: '-1.5px', lineHeight: 1 }}>
              {today}<span style={{ fontSize: 22 }}>{unit}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
              {delta != null && delta !== 0 && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 3,
                  fontSize: 12, fontWeight: 700, color: '#fff',
                  background: 'rgba(255,255,255,0.16)', borderRadius: 100, padding: '4px 12px',
                }}>
                  {delta > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  전{periodLabel} 대비 {delta > 0 ? '+' : ''}{delta}{deltaUnit}
                </span>
              )}
              {delta === 0 && (
                <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', background: 'rgba(255,255,255,0.16)', borderRadius: 100, padding: '4px 12px' }}>
                  전{periodLabel}과 동일
                </span>
              )}
              {band && (
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--c-forest-900)', background: '#fff', borderRadius: 100, padding: '4px 12px' }}>
                  {band.label}
                </span>
              )}
              {drawdownPct != null && drawdownPct < 0 && (
                <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', background: 'rgba(0,0,0,0.22)', borderRadius: 100, padding: '4px 12px' }}>
                  고점 대비 {drawdownPct}%
                </span>
              )}
            </div>
          </>
        ) : (
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>지금은 값을 불러올 수 없어요</div>
        )}
      </div>

      {/* 2. 지금은 이런 상태 — noBandNote가 있으면(예: 실업률) 구간 판단 대신
          "이 숫자를 그대로 믿으면 안 되는 이유"를 보여준다.
          band는 실시간 값(today) 로딩이 끝나야 계산되므로, 로딩 중에도 이 섹션이
          결국 나타날 지표(noBands가 아닌 경우)는 자리를 미리 확보해둔다 — 안 그러면
          로딩이 끝나는 순간 이 카드가 갑자기 튀어나오며 아래 내용이 밀린다 */}
      {loading && !insight.noBandNote && !insight.noBands ? (
        <SkeletonCard lines={[16, 20, 34]} />
      ) : (band || insight.noBandNote) && (
        <div style={{
          background: 'var(--c-surface)', borderLeft: '4px solid var(--c-green-500)',
          borderRadius: '4px 14px 14px 4px', padding: '18px 20px', marginBottom: 14,
          boxShadow: 'var(--shadow-card)',
        }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--c-muted)', letterSpacing: '0.4px', marginBottom: 8 }}>
            지금은 이런 상태
          </p>
          <p style={{ fontSize: 17, fontWeight: 800, color: 'var(--c-forest-700)', lineHeight: 1.5, marginBottom: 10 }}>
            {band ? band.meaning : insight.noBandNote.headline}
          </p>
          <p style={{ fontSize: 11, color: 'var(--c-muted)', lineHeight: 1.6 }}>
            {band ? insight.bandSource : insight.noBandNote.detail}
          </p>
        </div>
      )}

      {/* 3. 범위 안에서 여기쯤 — range가 없는 지표(예: 역전 여부 자체가 핵심인 장단기
          금리 역전)는 눈금이 의미가 없어서 건너뛴다. 이때는 위 hero의 구간 배지가
          "상태 표시"를 대신한다. 실업률처럼 구간 자체가 없는 지표는 눈금 대신
          "그때와 비교하면" — anchor 하나와 오늘 값을 나란히 보여주는 단순 비교로 대체한다.
          range가 있는 지표는 today 로딩이 끝나야 렌더링되므로, 같은 이유로 로딩 중
          스켈레톤을 먼저 보여준다 */}
      {loading && insight.range ? (
        <SkeletonCard lines={[16]} gauge />
      ) : today != null && insight.range && (
        <div style={{
          background: 'var(--c-surface)', border: '0.5px solid var(--c-line)',
          borderRadius: 14, padding: '20px 18px 16px', marginBottom: 14,
          boxShadow: 'var(--shadow-card)',
        }}>
          <p style={{ fontSize: 15, fontWeight: 800, color: 'var(--c-ink)', marginBottom: 16 }}>
            범위 안에서 여기쯤
          </p>
          <RangeGauge range={insight.range} anchors={insight.anchors} today={today} unit={unit} />
        </div>
      )}

      {today != null && insight.noBands && insight.anchors?.length > 0 && (
        <div style={{
          background: 'var(--c-surface)', border: '0.5px solid var(--c-line)',
          borderRadius: 14, padding: '18px 20px', marginBottom: 14,
          boxShadow: 'var(--shadow-card)',
        }}>
          <p style={{ fontSize: 15, fontWeight: 800, color: 'var(--c-ink)', marginBottom: 16 }}>
            그때와 비교하면
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <p style={{ fontSize: 11, color: 'var(--c-muted)', marginBottom: 4 }}>{insight.anchors[0].when}</p>
              <p style={{ fontSize: 24, fontWeight: 900, color: 'var(--c-ink)' }}>{insight.anchors[0].value}{unit}</p>
              <p style={{ fontSize: 10.5, color: 'var(--c-muted)', marginTop: 4, lineHeight: 1.4 }}>{insight.anchors[0].note}</p>
            </div>
            <div style={{ color: 'var(--c-muted)', fontSize: 16 }}>→</div>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <p style={{ fontSize: 11, color: 'var(--c-forest-700)', fontWeight: 700, marginBottom: 4 }}>오늘</p>
              <p style={{ fontSize: 24, fontWeight: 900, color: 'var(--c-forest-700)' }}>{today}{unit}</p>
            </div>
          </div>
        </div>
      )}

      {/* 4. 오르면 / 내리면 (지표에 따라 "역전되면? 정상화되면?" 등으로 대체될 수 있음) */}
      <div style={{ marginBottom: 14 }}>
        <p style={{ fontSize: 15, fontWeight: 800, color: 'var(--c-ink)', marginBottom: 10 }}>{directionTitle}</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1, background: '#FEF2F2', border: '0.5px solid #FECACA', borderRadius: 12, padding: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 800, color: '#B91C1C', marginBottom: 8 }}>
              <TrendingUp size={14} /> {insight.direction.up.headline}
            </div>
            {insight.direction.up.effects.map((e, i) => (
              <p key={i} style={{ fontSize: 12, color: '#7F1D1D', lineHeight: 1.6, marginBottom: 4 }}>· {e}</p>
            ))}
          </div>
          <div style={{ flex: 1, background: '#EFF6FF', border: '0.5px solid #BFDBFE', borderRadius: 12, padding: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 800, color: '#1D4ED8', marginBottom: 8 }}>
              <TrendingDown size={14} /> {insight.direction.down.headline}
            </div>
            {insight.direction.down.effects.map((e, i) => (
              <p key={i} style={{ fontSize: 12, color: '#1E3A8A', lineHeight: 1.6, marginBottom: 4 }}>· {e}</p>
            ))}
          </div>
        </div>
      </div>

      {/* 5. 나에게는 */}
      <div style={{ marginBottom: 14 }}>
        <p style={{ fontSize: 15, fontWeight: 800, color: 'var(--c-ink)', marginBottom: 10 }}>나에게는</p>
        {insight.myLife.map((m, i) => (
          <div key={i} style={{
            display: 'flex', gap: 10, background: 'var(--c-surface)', border: '0.5px solid var(--c-line)',
            borderRadius: 12, padding: '12px 14px', marginBottom: 8,
          }}>
            <div style={{ flexShrink: 0, width: 6, height: 6, borderRadius: '50%', background: 'var(--c-green-500)', marginTop: 6 }} />
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--c-forest-700)', marginBottom: 3 }}>{m.when}</p>
              <p style={{ fontSize: 12.5, color: 'var(--c-slate)', lineHeight: 1.6 }}>{m.then}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 노밍과 연결 — "노밍 한마디"(경제한잎에 이미 있는 요소)는 넣지 않는다. 채팅 연결만 */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '12px 14px', marginBottom: 14,
        background: 'var(--noming-bg)', borderRadius: 10, border: '0.5px solid var(--noming-border)',
      }}>
        <Sun size={20} color="#F59E0B" style={{ flexShrink: 0 }} />
        <span style={{ flex: 1, fontSize: 12, color: 'var(--c-amber-700)', lineHeight: 1.4 }}>
          내 상황에서는 어떤 의미인지 노밍에게 물어보세요
        </span>
        <button
          onClick={() => navigate('/coach', {
            state: {
              question: `${indicator.title} 오늘 값(${today}${unit}, ${band?.label ?? insight.noBandNote?.headline ?? ''})이 제 상황에서 어떤 의미인지 알려주세요.`,
              context: `지표 읽기 · ${indicator.title} · 오늘 ${today}${unit} · 구간: ${band?.label ?? insight.noBandNote?.headline ?? ''}`,
            }
          })}
          style={{
            flexShrink: 0, padding: '8px 14px', borderRadius: 8,
            background: 'var(--c-yellow-500)', border: 'none',
            color: 'var(--c-amber-700)', fontSize: 12, fontWeight: 700, cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          노밍에게 물어보기 →
        </button>
      </div>

      {/* 6. 뉴스에서는 이렇게 나와요 — 숫자 해석은 다른 데서도 볼 수 있지만
          "뉴스에 이 표현이 나오면 이런 뜻"은 여기서만 주는 정보라, 다른 섹션보다
          비중을 크게 준다 (순서는 그대로 마지막에 둔다) */}
      <div style={{
        background: 'linear-gradient(180deg, var(--c-green-50) 0%, var(--c-surface) 55%)',
        border: '1px solid var(--c-green-100)',
        borderRadius: 16, padding: '20px 20px 18px', marginBottom: 14,
        boxShadow: 'var(--shadow-card)',
      }}>
        <p style={{ fontSize: 17, fontWeight: 900, color: 'var(--c-forest-700)', marginBottom: 3 }}>
          뉴스에서는 이렇게 나와요
        </p>
        <p style={{ fontSize: 12, color: 'var(--c-muted)', marginBottom: 14 }}>
          이 표현이 뉴스에 나오면, 이렇게 읽으면 돼요
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: matchedArticle ? 14 : 0 }}>
          {insight.newsPhrases.map((n, i) => (
            <div key={i} style={{
              background: 'var(--c-surface)', border: '0.5px solid var(--c-green-100)',
              borderRadius: 12, padding: '12px 14px',
            }}>
              <span style={{
                display: 'inline-block', fontSize: 12.5, fontWeight: 800, color: 'var(--c-forest-700)',
                background: 'var(--c-green-50)', border: '0.5px solid var(--c-green-100)',
                borderRadius: 100, padding: '3px 11px', marginBottom: 6,
              }}>
                {n.phrase}
              </span>
              <p style={{ fontSize: 12.5, color: 'var(--c-slate)', lineHeight: 1.6 }}>{n.meaning}</p>
            </div>
          ))}
        </div>
        {matchedArticle && (
          <a
            href={matchedArticle.originallink || matchedArticle.link}
            target="_blank" rel="noreferrer"
            style={{
              display: 'block', textDecoration: 'none',
              background: 'var(--c-canvas)', border: '0.5px solid var(--c-line)',
              borderRadius: 10, padding: '12px 14px',
            }}
          >
            <p style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--c-ink)', marginBottom: 4, lineHeight: 1.5 }}>
              {matchedArticle.title}
            </p>
            <span style={{ fontSize: 11, color: 'var(--c-green-500)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
              오늘 이 표현이 나온 기사 보기 <ExternalLink size={11} />
            </span>
          </a>
        )}
      </div>

      {/* 더 알아보기 — 기존 텍스트 중 새 필드로 못 옮긴 내용을 접어서 보존 */}
      {insight.moreContext?.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <button
            onClick={() => setShowMore(v => !v)}
            style={{
              width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 12, fontWeight: 700, color: 'var(--c-muted)', padding: '8px 2px',
            }}
          >
            {showMore ? '더 알아보기 접기 ↑' : '더 알아보기 ↓'}
          </button>
          {showMore && (
            <div style={{ background: 'var(--c-canvas)', borderRadius: 12, padding: '14px 16px' }}>
              {insight.moreContext.map((t, i) => (
                <p key={i} style={{
                  fontSize: 12.5, color: 'var(--c-slate)', lineHeight: 1.7,
                  marginBottom: i < insight.moreContext.length - 1 ? 10 : 0,
                }}>
                  {t}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
