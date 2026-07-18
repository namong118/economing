/* 인터랙션 없는 정적 주석 차트 — 오늘 값 + 최고/최저에 라벨을 처음부터 다 보여줘서
   "그래프 읽는법"을 그림만 봐도 이해하게 하는 용도. 480px 좁은 화면 기준으로 설계 */
import { useMemo } from 'react';

const WIDTH  = 400;
const HEIGHT = 140;
const PAD_X      = 12;
const PAD_TOP    = 34; // "최고"/"오늘" 라벨 공간
const PAD_BOTTOM = 26; // "최저" 라벨 공간

const UP_COLOR      = '#DC2626'; // 상승 — 한국 주식시장 관례상 빨강
const DOWN_COLOR    = '#2563EB'; // 하락 — 파랑
const EXAMPLE_COLOR = '#9CA3AF'; // 예시 그래프는 실선이 아닌 회색 점선으로 구분

function formatNum(n, unit) {
  const str = n.toLocaleString('ko-KR', { maximumFractionDigits: 1 });
  return unit ? `${str}${unit}` : str;
}

function buildChart(data) {
  if (!Array.isArray(data) || data.length < 2) return null;

  const values = data.map(d => d.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range  = maxVal - minVal || 1;

  const innerW = WIDTH - PAD_X * 2;
  const innerH = HEIGHT - PAD_TOP - PAD_BOTTOM;

  const points = data.map((d, i) => ({
    idx:   i,
    x:     PAD_X + (i / (data.length - 1)) * innerW,
    y:     PAD_TOP + innerH - ((d.value - minVal) / range) * innerH,
    value: d.value,
    label: d.label,
  }));

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const floorY = PAD_TOP + innerH;
  const areaD  = `${pathD} L ${points[points.length - 1].x.toFixed(1)} ${floorY} L ${points[0].x.toFixed(1)} ${floorY} Z`;

  const todayPoint = points[points.length - 1];
  let maxPoint = points[0], minPoint = points[0];
  points.forEach(p => {
    if (p.value > maxPoint.value) maxPoint = p;
    if (p.value < minPoint.value) minPoint = p;
  });

  const color = todayPoint.value >= points[0].value ? UP_COLOR : DOWN_COLOR;

  return { points, pathD, areaD, todayPoint, maxPoint, minPoint, color };
}

export default function StaticTrendChart({ data, isExample = false, unit = '' }) {
  const chart = useMemo(() => buildChart(data), [data]);
  if (!chart) return null;

  const { pathD, areaD, todayPoint, maxPoint, minPoint, color } = chart;
  const lineColor = isExample ? EXAMPLE_COLOR : color;
  const fillId = isExample ? 'exampleFill' : (color === UP_COLOR ? 'upFill' : 'downFill');

  const todayLabelBelow = todayPoint.y < HEIGHT / 2;
  // 점이 좌우 끝에 가까우면 라벨이 SVG 밖으로 잘리지 않도록 정렬 기준을 바꿈
  const anchorFor = x => (x > WIDTH - 50 ? 'end' : x < 50 ? 'start' : 'middle');
  const todayAnchor = anchorFor(todayPoint.x);
  const maxAnchor   = anchorFor(maxPoint.x);
  const minAnchor   = anchorFor(minPoint.x);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {isExample && (
        <span style={{
          position: 'absolute', top: 0, right: 0, zIndex: 1,
          fontSize: 10, fontWeight: 700, color: '#92400E', background: '#FEF3C7',
          border: '1px solid #FDE68A', borderRadius: 100, padding: '2px 8px',
        }}>
          예시 그래프
        </span>
      )}

      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} width="100%" style={{ display: 'block', maxWidth: '100%' }}>
        <defs>
          <linearGradient id="upFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={UP_COLOR} stopOpacity="0.18" />
            <stop offset="100%" stopColor={UP_COLOR} stopOpacity="0" />
          </linearGradient>
          <linearGradient id="downFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={DOWN_COLOR} stopOpacity="0.18" />
            <stop offset="100%" stopColor={DOWN_COLOR} stopOpacity="0" />
          </linearGradient>
          <linearGradient id="exampleFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={EXAMPLE_COLOR} stopOpacity="0.12" />
            <stop offset="100%" stopColor={EXAMPLE_COLOR} stopOpacity="0" />
          </linearGradient>
        </defs>

        {!isExample && <path d={areaD} fill={`url(#${fillId})`} stroke="none" />}

        <path
          d={pathD}
          fill="none"
          stroke={lineColor}
          strokeWidth={2}
          strokeDasharray={isExample ? '5 4' : undefined}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 최고점 주석 */}
        {maxPoint.idx !== todayPoint.idx && (
          <g>
            <circle cx={maxPoint.x} cy={maxPoint.y} r={3} fill={lineColor} />
            <text x={maxPoint.x} y={maxPoint.y - 8} textAnchor={maxAnchor} fontSize="9" fontWeight="700" fill="var(--c-slate)">
              최고 {formatNum(maxPoint.value, unit)}
            </text>
          </g>
        )}

        {/* 최저점 주석 */}
        {minPoint.idx !== todayPoint.idx && minPoint.idx !== maxPoint.idx && (
          <g>
            <circle cx={minPoint.x} cy={minPoint.y} r={3} fill={lineColor} />
            <text x={minPoint.x} y={minPoint.y + 14} textAnchor={minAnchor} fontSize="9" fontWeight="700" fill="var(--c-slate)">
              최저 {formatNum(minPoint.value, unit)}
            </text>
          </g>
        )}

        {/* 오늘(마지막) 포인트 — 항상 강조 */}
        <circle cx={todayPoint.x} cy={todayPoint.y} r={4} fill="#fff" stroke={lineColor} strokeWidth={2} />
        <text
          x={todayPoint.x}
          y={todayLabelBelow ? todayPoint.y + 18 : todayPoint.y - 10}
          textAnchor={todayAnchor}
          fontSize="10"
          fontWeight="800"
          fill="var(--c-ink)"
        >
          오늘 {formatNum(todayPoint.value, unit)}
        </text>
      </svg>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--c-muted)', marginTop: 2 }}>
        <span>{data[0]?.label}</span>
        <span>{data[data.length - 1]?.label}</span>
      </div>
    </div>
  );
}
