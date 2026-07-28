/* 경제읽기 탭 — 지표 11종으로 가는 유일한 진입로.
   IndicesTicker(코스피·코스닥·환율 "지금 시세")와는 성격이 달라서 별도 섹션으로 둔다 —
   여기는 "이 숫자를 어떻게 읽는지" 학습 페이지로 가는 목록이라, 시세 티커에
   나머지 8종을 끼워 넣지 않는다. indicatorsData.js를 그대로 읽어오므로 지표가
   추가되면 하드코딩 없이 자동으로 나온다. */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import indicatorsData, { getIndicatorById } from '../../data/indicatorsData';
import { getIndicatorInsight } from '../../data/indicatorInsights';
import { getEconomicStats } from '../../services/economicStatsService';
import { getMarketIndices } from '../../services/indicesService';
import { getLatestInsightValue } from '../../utils/liveIndicatorValue';

/* 성격별로 묶어서 보여준다 — 11개를 그냥 나열하면 기준금리 옆에 PER이 붙는 식으로
   섞여서 훑기 어렵다. 그룹 헤더 4개 정도는 세로 길이에 큰 영향이 없다. */
const GROUPS = [
  { title: '시장 지표',    ids: [61, 81, 62] },
  { title: '물가와 금리',  ids: [63, 64, 69] },
  { title: '경제 전반',    ids: [67, 66, 65] },
  { title: '투자 참고',    ids: [68, 70] },
];

function formatValue(value, unit) {
  const rounded = Math.round(value * 100) / 100;
  return `${rounded.toLocaleString('ko-KR', { maximumFractionDigits: 2 })}${unit ?? ''}`;
}

function IndicatorCard({ indicator, valueText, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', flexDirection: 'column', gap: 4,
        background: 'var(--c-surface)', border: '0.5px solid var(--c-line)',
        borderRadius: 12, padding: '12px 14px', textAlign: 'left', cursor: 'pointer',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--c-ink)' }}>{indicator.title}</span>
        {valueText && (
          <span style={{
            fontSize: 11, fontWeight: 700, color: 'var(--c-forest-700)',
            background: 'var(--c-green-50)', border: '0.5px solid var(--c-green-100)',
            borderRadius: 100, padding: '2px 8px', whiteSpace: 'nowrap',
          }}>
            {valueText}
          </span>
        )}
      </div>
      <p style={{
        fontSize: 11.5, color: 'var(--c-slate)', lineHeight: 1.5, margin: 0,
        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>
        {indicator.summary}
      </p>
    </button>
  );
}

export default function IndicatorGuideGrid() {
  const navigate = useNavigate();
  const [statsData, setStatsData] = useState(null);
  const [indicesData, setIndicesData] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [{ data: stats }, { data: indices }] = await Promise.all([
        getEconomicStats(),
        getMarketIndices(),
      ]);
      if (cancelled) return;
      setStatsData(stats);
      setIndicesData(indices);
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div style={{ marginBottom: 20 }}>
      {GROUPS.map(group => (
        <div key={group.title} style={{ marginBottom: 14 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--c-muted)', letterSpacing: '0.3px', marginBottom: 8 }}>
            {group.title}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {group.ids.map(id => {
              const indicator = getIndicatorById(id) ?? indicatorsData.find(d => d.id === id);
              if (!indicator) return null;
              const insight = getIndicatorInsight(id);
              const rawValue = insight
                ? getLatestInsightValue(insight, indicator.dataKey, statsData, indicesData)
                : null;
              const valueText = rawValue != null ? formatValue(rawValue, insight?.unit ?? '%') : null;
              return (
                <IndicatorCard
                  key={id}
                  indicator={indicator}
                  valueText={valueText}
                  onClick={() => navigate(`/indicator/${id}`)}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
