/* 지표 "정독형" 페이지 전용 — 오늘 값이 최근 10년 범위 안 어디쯤인지,
   과거 기준점(anchors)과 함께 눈금으로 보여준다. StaticTrendChart(추이 그래프)와는
   목적이 달라서 별도 컴포넌트로 둔다: 저건 "변화"를, 이건 "오늘의 위치"를 보여준다.
   트랙 자체는 단색 — 밝기 단계로 구간(band) 경계를 암시했었지만 그 경계가 눈금에
   드러나지 않아 의미 없는 명암 차이로만 보였다. 구간 의미는 "지금은 이런 상태"
   섹션에서 이미 텍스트로 전달하므로, 여기서는 오늘 값의 "위치"에만 집중한다. */
const WIDTH   = 400;
const HEIGHT  = 120;
const PAD_X   = 16;
const TRACK_Y = 66;
const TRACK_H = 10;

// 라벨(값 텍스트) 겹침 방지 — anchor 2개 + 오늘까지 값이 서로 가까우면(예: 환율의
// 1444/1470/1561처럼 셋이 몰린 경우) 단순히 "오늘과의 거리"만 보는 걸로는 부족하다.
// x좌표 순으로 정렬해서 이웃 라벨과 가까울 때마다 한 단씩 더 높이 쌓는다.
const LABEL_COLLIDE_DIST = 55;
const LABEL_LEVEL_GAP = 16;

function pct(value, min, max) {
  return Math.min(1, Math.max(0, (value - min) / (max - min)));
}

export default function RangeGauge({ range, anchors, today, unit = '' }) {
  const { min, max } = range;
  const innerW = WIDTH - PAD_X * 2;
  const xFor = v => PAD_X + pct(v, min, max) * innerW;

  const todayX = xFor(today);
  // anchors에는 과거 기준점만 온다는 전제 — 혹시 오늘과 값이 겹치는 항목이 있어도
  // 중복 표시를 막기 위해 한 번 더 걸러준다.
  const pastAnchors = anchors.filter(a => Math.abs(a.value - today) > 0.001);

  const points = [
    ...pastAnchors.map(a => ({ x: xFor(a.value), type: 'anchor', anchor: a })),
    { x: todayX, type: 'today' },
  ].sort((a, b) => a.x - b.x);

  let level = 0;
  points.forEach((p, i) => {
    level = (i > 0 && p.x - points[i - 1].x < LABEL_COLLIDE_DIST) ? level + 1 : 0;
    p.level = level;
  });
  const anchorLevel = new Map(points.filter(p => p.type === 'anchor').map(p => [p.anchor, p.level]));
  const todayLevel = points.find(p => p.type === 'today').level;

  return (
    <div style={{ width: '100%' }}>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} width="100%" style={{ display: 'block', overflow: 'visible' }}>
        {/* 트랙 배경 — 단색 */}
        <rect x={PAD_X} y={TRACK_Y} width={innerW} height={TRACK_H} rx={TRACK_H / 2} fill="var(--c-green-500)" opacity={0.16} />

        {/* 과거 기준점 — 값은 크고 진하게, 설명은 작고 옅게 대비를 준다 */}
        {pastAnchors.map((a, i) => {
          const x = xFor(a.value);
          const valueY = TRACK_Y - 12 - (anchorLevel.get(a) ?? 0) * LABEL_LEVEL_GAP;
          return (
            <g key={i}>
              <line x1={x} y1={TRACK_Y - 4} x2={x} y2={TRACK_Y + TRACK_H + 4} stroke="var(--c-slate)" strokeWidth={1.5} />
              <text x={x} y={valueY} fontSize="11.5" fontWeight="800" fill="var(--c-ink)" textAnchor="middle">
                {a.value}{unit}
              </text>
              <text x={x} y={TRACK_Y + TRACK_H + 24} fontSize="9.5" fontWeight="600" fill="var(--c-muted)" textAnchor="middle">
                {a.when}
              </text>
            </g>
          );
        })}

        {/* 오늘 — 유일한 "현재" 표시, 가장 크고 진하게 */}
        <line x1={todayX} y1={TRACK_Y - 14} x2={todayX} y2={TRACK_Y + TRACK_H + 14} stroke="var(--c-forest-700)" strokeWidth={2.5} />
        <circle cx={todayX} cy={TRACK_Y + TRACK_H / 2} r={8} fill="var(--c-forest-700)" stroke="#fff" strokeWidth={2} />
        <text x={todayX} y={TRACK_Y - 20 - todayLevel * LABEL_LEVEL_GAP} fontSize="13" fontWeight="900" fill="var(--c-forest-700)" textAnchor="middle">
          오늘 {today}{unit}
        </text>
      </svg>
    </div>
  );
}
