/* 지표 실시간 값 계산 — IndicatorInsightView(상세 페이지)와 IndicatorGuideGrid(목록 카드)가
   같은 계산 로직(YoY 변환, 단위 변환)을 쓰도록 공유한다. 로직이 두 곳에서 따로 자라면
   나중에 어긋나기 쉬워서(예: CPI를 지수 그대로 보여주는 실수) 한 곳에만 둔다. */

/* 지수 레벨(예: CPI 2020=100) 시계열에서 전년동월대비(YoY) 증감률을 계산한다.
   같은 달(YYYYMM) 12개월 전 값이 있는 지점만 결과에 남는다. */
export function deriveYoYSeries(series) {
  const byDate = new Map(series.map(p => [p.date, p.value]));
  return series
    .map(p => {
      const year = Number(p.date.slice(0, 4));
      const month = p.date.slice(4, 6);
      const prevValue = byDate.get(`${year - 1}${month}`);
      if (prevValue == null) return null;
      return { date: p.date, value: Math.round((p.value / prevValue - 1) * 10000) / 100 };
    })
    .filter(Boolean);
}

/* insight(indicatorInsights.js 항목)와 이미 받아온 statsData/indicesData로부터
   "오늘의 값" 하나만 뽑아낸다. IndicatorInsightView의 useLiveSeries와 같은 변환 규칙
   (deriveYoY → transform 순)을 따르되, 목록 카드에는 최신값 하나만 있으면 되므로
   델타·밴드 계산 없이 값만 반환한다. */
export function getLatestInsightValue(insight, dataKey, statsData, indicesData) {
  if (!insight) return null;

  let series = insight.liveIndexKey
    ? indicesData?.[insight.liveIndexKey]?.history
    : statsData?.[dataKey];

  if (!Array.isArray(series) || series.length === 0) return null;
  if (insight.deriveYoY) series = deriveYoYSeries(series);
  if (insight.transform) series = series.map(p => ({ date: p.date, value: insight.transform(p.value) }));
  if (series.length === 0) return null;

  return series[series.length - 1].value;
}
