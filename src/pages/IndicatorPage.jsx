/* 지표 읽는법 — 경제한잎과 분리된 전용 학습 페이지 (티커에서만 진입) */
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LineChart, FileText, Lightbulb, MessageCircle, Heart } from 'lucide-react';
import indicatorsData, { getIndicatorById } from '../data/indicatorsData';
import { getIndicatorInsight } from '../data/indicatorInsights';
import { BITE_INFOGRAPHICS } from '../data/biteInfographics';
import indicatorExampleTrends from '../data/indicatorExampleTrends';
import StaticTrendChart from '../components/indicators/StaticTrendChart';
import IndicatorInsightView from '../components/indicators/IndicatorInsightView';
import { getMarketIndices } from '../services/indicesService';
import { getEconomicStats } from '../services/economicStatsService';
import PageWrapper from '../components/layout/PageWrapper';
import StickyBackButton from '../components/common/StickyBackButton';

const DIFFICULTY_STYLE = {
  easy:   { label: '쉬움', bg: 'var(--c-green-100)',  text: 'var(--c-forest-700)' },
  medium: { label: '보통', bg: 'var(--c-yellow-100)', text: 'var(--c-amber-700)'  },
  hard:   { label: '심화', bg: '#FFE4E6',             text: '#BE123C'             },
};

/* 실시간 데이터가 있는 3개 지표 → indicesService 응답 키 매핑 */
const LIVE_INDEX_KEY = { 61: 'kospi', 81: 'kosdaq', 62: 'usdkrw' };

/* economic-stats(ECOS/KOSIS) dataKey별 표시 방식 — indicatorsData.js의 dataKey와 매칭 */
const STATS_META = {
  baseRate:     { unit: '%',      dateFmt: 'month' },
  cpi:          { unit: '',       dateFmt: 'month' },
  unemployment: { unit: '%',      dateFmt: 'month' },
  gdpGrowth:    { unit: '%',      dateFmt: 'quarter' },
  // KOSIS 원자료 단위는 천불(千弗) — 억달러로 환산해서 표시
  tradeBalance: { unit: '억달러', dateFmt: 'month', transform: v => Math.round((v / 100000) * 100) / 100 },
  termSpread:   { unit: '%p',     dateFmt: 'day' },
};

function formatStatsLabel(dateStr, fmt) {
  if (fmt === 'day')     return `${dateStr.slice(4, 6)}/${dateStr.slice(6, 8)}`;
  if (fmt === 'quarter') return `${dateStr.slice(0, 4)} Q${Number(dateStr.slice(4, 6))}`;
  return `${dateStr.slice(0, 4)}.${dateStr.slice(4, 6)}`; // month
}

function ChartSkeleton() {
  return (
    <div style={{ height: 140, borderRadius: 10, background: 'linear-gradient(90deg, var(--c-line-soft) 25%, var(--c-canvas) 50%, var(--c-line-soft) 75%)', backgroundSize: '200% 100%', animation: 'indicator-chart-shimmer 1.4s infinite' }}>
      <style>{'@keyframes indicator-chart-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }'}</style>
    </div>
  );
}

/* 코스피/코스닥/환율 → indicesService, 기준금리 등 6개 → economicStatsService,
   나머지(PER/공포탐욕지수)는 예시 그래프. 실제 데이터 조회 실패 시 예시로 폴백 */
function TrendChartSection({ indicator }) {
  const liveKey = LIVE_INDEX_KEY[indicator.id];
  const statsMeta = indicator.hasRealData ? STATS_META[indicator.dataKey] : null;
  const example = indicatorExampleTrends[indicator.id];
  const [remoteData, setRemoteData] = useState(null); // { data, unit } | null
  const [loading, setLoading]       = useState(Boolean(liveKey || statsMeta));

  useEffect(() => {
    let cancelled = false;

    if (liveKey) {
      (async () => {
        const { data, error } = await getMarketIndices();
        if (cancelled) return;
        const history = data?.[liveKey]?.history;
        if (error || !Array.isArray(history) || history.length < 2) {
          setLoading(false);
          return;
        }
        setRemoteData({
          data: history.map(h => ({ label: h.date.slice(5).replace('-', '/'), value: h.value })),
          unit: '',
        });
        setLoading(false);
      })();
    } else if (statsMeta) {
      (async () => {
        const { data, error } = await getEconomicStats();
        if (cancelled) return;
        const series = data?.[indicator.dataKey];
        if (error || !Array.isArray(series) || series.length < 2) {
          setLoading(false);
          return;
        }
        setRemoteData({
          data: series.map(p => ({
            label: formatStatsLabel(p.date, statsMeta.dateFmt),
            value: statsMeta.transform ? statsMeta.transform(p.value) : p.value,
          })),
          unit: statsMeta.unit,
        });
        setLoading(false);
      })();
    }

    return () => { cancelled = true; };
  }, [liveKey, statsMeta, indicator.dataKey]);

  if (liveKey || statsMeta) {
    if (loading) return <ChartSkeleton />;
    if (remoteData) return <StaticTrendChart data={remoteData.data} unit={remoteData.unit} isExample={false} />;
    // 실제 데이터 조회 실패 — 예시 그래프가 있으면 폴백, 없으면 조용히 생략
    if (example) return <StaticTrendChart data={example.data} unit={example.unit} isExample />;
    return null;
  }

  if (!example) return null;
  return <StaticTrendChart data={example.data} unit={example.unit} isExample />;
}

function SectionLabel({ Icon, label }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      fontSize: 11, fontWeight: 700, color: 'var(--c-forest-700)',
      marginBottom: 8, letterSpacing: '0.2px',
    }}>
      <Icon size={12} color="var(--c-forest-700)" />
      {label}
    </div>
  );
}

function InfoSection({ Icon, label, text, highlight }) {
  return (
    <div style={{
      background: highlight ? 'var(--c-green-50)' : 'var(--c-surface)',
      border: highlight ? '0.5px solid var(--c-green-100)' : '0.5px solid var(--c-line)',
      borderRadius: 14, padding: '14px 18px', marginBottom: 12,
      boxShadow: 'var(--shadow-card)',
    }}>
      <SectionLabel Icon={Icon} label={label} />
      <p style={{ fontSize: 14, color: highlight ? 'var(--c-forest-900)' : 'var(--c-slate)', lineHeight: 1.75, letterSpacing: '-0.2px' }}>
        {text}
      </p>
    </div>
  );
}

export default function IndicatorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const indicator = getIndicatorById(id);
  const InfographicComponent = indicator ? (BITE_INFOGRAPHICS[indicator.id] ?? null) : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!indicator) {
    return (
      <PageWrapper>
        <div style={{ padding: '60px 20px', textAlign: 'center', color: '#6B7280' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <LineChart size={40} color="var(--c-green-500)" />
          </div>
          <p style={{ fontSize: 15, fontWeight: 600 }}>찾을 수 없는 지표예요.</p>
          <button onClick={() => navigate('/read')} style={{
            marginTop: 20, padding: '10px 24px', borderRadius: 10,
            background: 'var(--c-green-500)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13,
          }}>
            경제읽기로 돌아가기
          </button>
        </div>
      </PageWrapper>
    );
  }

  const diffStyle = DIFFICULTY_STYLE[indicator.difficulty] ?? DIFFICULTY_STYLE.medium;
  const otherIndicators = indicatorsData.filter(item => item.id !== indicator.id);
  const insight = getIndicatorInsight(indicator.id);

  return (
    <PageWrapper>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '16px 16px 80px' }}>

        <StickyBackButton />

        {insight ? (
          <IndicatorInsightView indicator={indicator} insight={insight} />
        ) : (
        <>
        {/* ── 헤로: Dark Forest ── */}
        <div style={{
          background: 'linear-gradient(135deg, var(--c-forest-900) 0%, var(--c-forest-700) 100%)',
          borderRadius: 16,
          padding: '20px 18px 22px',
          marginBottom: 12,
          boxShadow: '0 4px 20px rgba(6,53,43,0.22)',
        }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
            <span style={{
              fontSize: 11, fontWeight: 700,
              background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.92)',
              borderRadius: 100, padding: '3px 10px',
              border: '0.5px solid rgba(255,255,255,0.25)',
              display: 'inline-flex', alignItems: 'center', gap: 4,
            }}>
              <LineChart size={10} /> 지표 읽는법
            </span>
            <span style={{
              fontSize: 11, fontWeight: 600,
              background: diffStyle.bg, color: diffStyle.text,
              borderRadius: 100, padding: '3px 10px',
            }}>
              {diffStyle.label}
            </span>
          </div>

          <div style={{
            fontSize: 20, fontWeight: 800, color: '#fff',
            letterSpacing: '-0.5px', lineHeight: 1.35, marginBottom: 8,
          }}>
            {indicator.title}
          </div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 1.7 }}>
            {indicator.summary}
          </p>
        </div>

        {/* ── 핵심 인포그래픽 ── */}
        {InfographicComponent && (
          <div style={{
            background: 'var(--c-surface)', border: '0.5px solid var(--c-line)',
            borderRadius: 14, overflow: 'hidden', marginBottom: 12,
            boxShadow: 'var(--shadow-card)',
          }}>
            <div style={{ padding: '14px 18px 0' }}>
              <SectionLabel Icon={LineChart} label="핵심 개념 한눈에 보기" />
            </div>
            <div style={{ padding: '4px 16px 16px' }}>
              <InfographicComponent />
            </div>
          </div>
        )}

        {/* ── 추이 그래프 (경제한잎에는 없는 섹션) ── */}
        <div style={{
          background: 'var(--c-surface)', border: '0.5px solid var(--c-line)',
          borderRadius: 14, padding: '16px 18px 14px', marginBottom: 12,
          boxShadow: 'var(--shadow-card)',
        }}>
          <SectionLabel Icon={LineChart} label="그래프로 읽어보기" />
          <TrendChartSection indicator={indicator} />
        </div>

        {/* ── 설명 → 왜 중요한지 → 실제 사례 → 내 삶에 미치는 영향 ── */}
        <InfoSection Icon={FileText}      label="쉽게 설명하면"        text={indicator.description} />
        <InfoSection Icon={Lightbulb}     label="왜 중요한가요?"       text={indicator.whyImportant} />
        <InfoSection Icon={MessageCircle} label="실제 사례"            text={indicator.realExample} />
        <InfoSection Icon={Heart}         label="내 삶에 미치는 영향"  text={indicator.realLifeExample} highlight />
        </>
        )}

        {/* ── 다른 지표도 보기 ── */}
        <div style={{ marginBottom: 12 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--c-muted)', letterSpacing: '0.5px', marginBottom: 10 }}>
            다른 지표도 보기
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {otherIndicators.map(item => (
              <button
                key={item.id}
                onClick={() => navigate(`/indicator/${item.id}`)}
                style={{
                  background: 'var(--c-line-soft)', border: '1px solid var(--c-line)',
                  borderRadius: 100, padding: '6px 14px',
                  fontSize: 12, color: 'var(--c-slate)', fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--c-green-50)'; e.currentTarget.style.color = 'var(--c-forest-700)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--c-line-soft)'; e.currentTarget.style.color = 'var(--c-slate)'; }}
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>

        {/* ── 완료 CTA ── */}
        <div style={{
          background: 'var(--c-surface)', border: '0.5px solid var(--c-line)',
          borderRadius: 16, padding: '22px 18px', textAlign: 'center',
          boxShadow: 'var(--shadow-card)',
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            background: 'var(--c-green-100)', border: '1.5px solid var(--c-green-300)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 12px',
          }}>
            <LineChart size={26} color="var(--c-green-500)" />
          </div>
          <p style={{ fontSize: 16, fontWeight: 800, color: 'var(--c-forest-700)', marginBottom: 6, letterSpacing: '-0.4px' }}>
            지표 읽는법 완료!
          </p>
          <p style={{ fontSize: 13, color: 'var(--c-muted)', marginBottom: 18, lineHeight: 1.6 }}>
            {indicator.title}, 이제 뉴스에서 봐도 의미를 알 수 있어요.
          </p>
          <button
            onClick={() => navigate('/read')}
            style={{
              width: '100%', padding: '13px', borderRadius: 12,
              background: 'var(--grad-action)', color: '#fff', border: 'none', cursor: 'pointer',
              fontSize: 14, fontWeight: 700, letterSpacing: '-0.3px',
              boxShadow: '0 3px 12px rgba(31,190,134,0.35)',
            }}
          >
            경제읽기로 돌아가기
          </button>
        </div>

      </div>
    </PageWrapper>
  );
}
