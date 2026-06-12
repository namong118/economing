/* ── 공통 화살표 헬퍼 ────────────────────────────── */
function Arr({ x1, y1, x2, y2, color = '#21C58E', w = 2.5 }) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const nx = dx / len, ny = dy / len;
  const baseX = x2 - nx * 8, baseY = y2 - ny * 8;
  const px = -ny * 5, py = nx * 5;
  return (
    <g>
      <line x1={x1} y1={y1} x2={baseX} y2={baseY} stroke={color} strokeWidth={w} strokeLinecap="round"/>
      <polygon points={`${x2},${y2} ${baseX + px},${baseY + py} ${baseX - px},${baseY - py}`} fill={color}/>
    </g>
  );
}

function Box({ x, y, w, h, rx = 10, fill, stroke, children }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={rx} fill={fill} stroke={stroke} strokeWidth={stroke ? 1.5 : 0}/>
      {children}
    </g>
  );
}

function T({ x, y, size = 12, weight = '600', fill = '#0F1F18', anchor = 'middle', children }) {
  return (
    <text x={x} y={y} fontSize={size} fontWeight={weight} fill={fill} textAnchor={anchor} fontFamily="system-ui, sans-serif">
      {children}
    </text>
  );
}

/* ── 1. 기준금리 ──────────────────────────────────── */
function KijunGraphic() {
  return (
    <svg viewBox="0 0 300 148" fill="none" width="100%" style={{ display: 'block' }}>
      {/* 한국은행 */}
      <rect x="12" y="44" width="76" height="60" rx="12" fill="#21C58E"/>
      <T x="50" y="69" size={11} weight="800" fill="#fff">한국은행</T>
      <T x="50" y="86" size={10} fill="rgba(255,255,255,0.85)">기준금리</T>
      <T x="50" y="99" size={10} fill="rgba(255,255,255,0.85)">결정</T>

      {/* 화살표 */}
      <Arr x1={90} y1={74} x2={122} y2={74} color="#FFC83D" w={2.5}/>

      {/* 시중은행 */}
      <rect x="124" y="44" width="76" height="60" rx="12" fill="#fff" stroke="#21C58E"/>
      <T x="162" y="69" size={11} weight="800" fill="#065F46">시중</T>
      <T x="162" y="86" size={11} weight="800" fill="#065F46">은행</T>

      {/* 대각 화살표 */}
      <Arr x1={202} y1={62} x2={238} y2={42} color="#FFC83D"/>
      <Arr x1={202} y1={86} x2={238} y2={106} color="#FFC83D"/>

      {/* 결과 박스들 */}
      <rect x="240" y="22" width="56" height="34" rx="8" fill="#FEF9EC" stroke="#FFC83D"/>
      <T x="268" y="40" size={10} weight="700" fill="#92400E">대출금리</T>
      <T x="268" y="52" size={9} fill="#92400E">↑ 또는 ↓</T>

      <rect x="240" y="90" width="56" height="34" rx="8" fill="#FEF9EC" stroke="#FFC83D"/>
      <T x="268" y="108" size={10} weight="700" fill="#92400E">예금금리</T>
      <T x="268" y="120" size={9} fill="#92400E">↑ 또는 ↓</T>
    </svg>
  );
}

/* ── 2. ETF ───────────────────────────────────────── */
function ETFGraphic() {
  const stocks = [
    { name: '삼성', color: '#3B82F6' },
    { name: 'SK', color: '#8B5CF6' },
    { name: '현대', color: '#EF4444' },
    { name: '카카오', color: '#F59E0B' },
  ];
  return (
    <svg viewBox="0 0 300 148" fill="none" width="100%" style={{ display: 'block' }}>
      {/* 개별 종목들 */}
      {stocks.map((s, i) => (
        <g key={s.name}>
          <rect x="12" y={12 + i * 32} width="64" height="24" rx="7" fill={s.color + '22'} stroke={s.color} strokeWidth="1.5"/>
          <T x="44" y={28 + i * 32} size={11} weight="700" fill={s.color}>{s.name}</T>
        </g>
      ))}

      {/* 수렴 화살표들 */}
      {[24, 56, 88, 120].map((y, i) => (
        <Arr key={i} x1={78} y1={y} x2={138} y2={74} color="#21C58E" w={1.8}/>
      ))}

      {/* ETF 박스 */}
      <rect x="140" y="36" width="80" height="76" rx="14" fill="#21C58E"/>
      <T x="180" y="68" size={18} weight="900" fill="#fff">ETF</T>
      <T x="180" y="88" size={10} fill="rgba(255,255,255,0.85)">묶음 투자</T>
      <T x="180" y="103" size={10} fill="rgba(255,255,255,0.85)">상품</T>

      {/* 투자자 화살표 */}
      <Arr x1={222} y1={74} x2={258} y2={74} color="#FFC83D" w={2.5}/>

      {/* 투자자 */}
      <circle cx="272" cy="60" r="14" fill="#FFC83D"/>
      <T x="272" y="64" size={16} weight="800" fill="#0F1F18">👤</T>
      <T x="272" y="92" size={9} weight="700" fill="#64748B">투자자</T>
    </svg>
  );
}

/* ── 3. 복리 ──────────────────────────────────────── */
function CompoundGraphic() {
  const data = [
    { year: '0년', val: 100, h: 48 },
    { year: '1년', val: 105, h: 51 },
    { year: '2년', val: 110, h: 53 },
    { year: '3년', val: 116, h: 57 },
    { year: '4년', val: 122, h: 60 },
    { year: '5년', val: 128, h: 64 },
  ];
  const barW = 32, gap = 12, base = 124;
  return (
    <svg viewBox="0 0 300 148" fill="none" width="100%" style={{ display: 'block' }}>
      {/* 기준선 */}
      <line x1="28" y1={base + 2} x2="280" y2={base + 2} stroke="#E2E8F0" strokeWidth="1.5"/>

      {data.map((d, i) => {
        const x = 30 + i * (barW + gap);
        const green = `hsl(${158 + i * 4}, ${65 + i * 3}%, ${48 - i * 2}%)`;
        return (
          <g key={d.year}>
            <rect x={x} y={base - d.h} width={barW} height={d.h} rx="6" fill={green}/>
            <T x={x + barW / 2} y={base - d.h - 5} size={9} weight="700" fill="#374151">{d.val}</T>
            <T x={x + barW / 2} y={base + 14} size={9} fill="#94A3B8">{d.year}</T>
          </g>
        );
      })}

      {/* 복리 설명 */}
      <rect x="196" y="18" width="96" height="28" rx="8" fill="#E8FAF3" stroke="#21C58E"/>
      <T x="244" y="30" size={9} fill="#065F46">이자에 이자가</T>
      <T x="244" y="42" size={9} fill="#065F46">붙어요 💚</T>

      {/* 성장 곡선 (선 그래프) */}
      <polyline
        points={data.map((d, i) => `${30 + i * (barW + gap) + barW / 2},${base - d.h}`).join(' ')}
        stroke="#FFC83D" strokeWidth="2" fill="none" strokeDasharray="4 2"
      />
    </svg>
  );
}

/* ── 4. 인플레이션 ─────────────────────────────────── */
function InflationGraphic() {
  return (
    <svg viewBox="0 0 300 148" fill="none" width="100%" style={{ display: 'block' }}>
      {/* 3 time panels */}
      {[
        { year: '2020', items: 3, x: 18 },
        { year: '2022', items: 2, x: 112 },
        { year: '2024', items: 1, x: 206 },
      ].map((p) => (
        <g key={p.year}>
          {/* 패널 배경 */}
          <rect x={p.x} y="14" width="82" height="110" rx="12" fill="#fff" stroke="#E2E8F0" strokeWidth="1.5"/>
          <T x={p.x + 41} y="30" size={11} weight="700" fill="#374151">{p.year}</T>

          {/* 돈 아이콘 */}
          <circle cx={p.x + 41} cy="50" r="12" fill="#FEF9EC" stroke="#FFC83D" strokeWidth="1.5"/>
          <T x={p.x + 41} y="55" size={9} weight="800" fill="#92400E">₩</T>
          <T x={p.x + 41} y="67" size={9} fill="#94A3B8">동일</T>

          {/* 아이템들 */}
          {Array.from({ length: p.items }).map((_, j) => (
            <g key={j}>
              <rect x={p.x + 14 + j * 22} y="80" width="18" height="14" rx="4" fill="#21C58E"/>
              <T x={p.x + 23 + j * 22} y="91" size={8} fill="#fff">🛒</T>
            </g>
          ))}
          {p.items === 1 && (
            <rect x={p.x + 14 + 22} y="80" width="18" height="14" rx="4" fill="#F1F5F9"/>
          )}
          {p.items <= 2 && (
            <rect x={p.x + 14 + 44} y="80" width="18" height="14" rx="4" fill="#F1F5F9"/>
          )}

          <T x={p.x + 41} y="114" size={9} fill="#EF4444" weight="700">{p.items}개</T>
        </g>
      ))}

      {/* 화살표 */}
      <Arr x1={102} y1={74} x2={110} y2={74} color="#EF4444"/>
      <Arr x1={196} y1={74} x2={204} y2={74} color="#EF4444"/>

      {/* 레이블 */}
      <T x="150" y="142" size={10} weight="600" fill="#EF4444" anchor="middle">같은 돈, 살 수 있는 것이 줄어요</T>
    </svg>
  );
}

/* ── 5. 배당금 ────────────────────────────────────── */
function DividendGraphic() {
  return (
    <svg viewBox="0 0 300 148" fill="none" width="100%" style={{ display: 'block' }}>
      {/* 회사 */}
      <rect x="28" y="44" width="84" height="60" rx="14" fill="#21C58E"/>
      <T x="70" y="68" size={11} weight="800" fill="#fff">기업</T>
      <T x="70" y="84" size={10} fill="rgba(255,255,255,0.85)">이익 발생</T>
      <T x="70" y="98" size={14} fill="#fff">🏢</T>

      {/* 이익 분배 */}
      <rect x="140" y="55" width="64" height="38" rx="10" fill="#FEF9EC" stroke="#FFC83D" strokeWidth="2"/>
      <T x="172" y="71" size={10} weight="700" fill="#92400E">이익의</T>
      <T x="172" y="84" size={10} weight="700" fill="#F59E0B">일부</T>
      <Arr x1={114} y1={74} x2={138} y2={74} color="#FFC83D" w={2.5}/>

      {/* 주주들 */}
      <Arr x1={206} y1={64} x2={235} y2={42} color="#FFC83D"/>
      <Arr x1={206} y1={84} x2={235} y2={106} color="#FFC83D"/>

      {[{ y: 22, label: '주주 A' }, { y: 88, label: '주주 B' }].map((p) => (
        <g key={p.label}>
          <circle cx="251" cy={p.y + 12} r="16" fill="#E8FAF3" stroke="#21C58E" strokeWidth="1.5"/>
          <T x="251" y={p.y + 17} size={14}>👤</T>
          <T x="251" y={p.y + 34} size={9} fill="#374151">{p.label}</T>
        </g>
      ))}

      {/* 배당금 표시 */}
      <T x="150" y="138" size={10} weight="700" fill="#92400E" anchor="middle">배당금 = 기업 이익의 일부를 주주에게</T>
    </svg>
  );
}

/* ── 6. 채권 ──────────────────────────────────────── */
function BondGraphic() {
  return (
    <svg viewBox="0 0 300 148" fill="none" width="100%" style={{ display: 'block' }}>
      {/* 타임라인 기준선 */}
      <line x1="24" y1="74" x2="276" y2="74" stroke="#E2E8F0" strokeWidth="2"/>

      {/* 시점 점들 */}
      {[
        { x: 36, label: '지금', sub: '-100만원', color: '#EF4444', isNeg: true },
        { x: 132, label: '1년 후', sub: '+이자', color: '#21C58E', isNeg: false },
        { x: 204, label: '2년 후', sub: '+이자', color: '#21C58E', isNeg: false },
        { x: 264, label: '만기', sub: '+100만원', color: '#21C58E', isNeg: false },
      ].map((p) => (
        <g key={p.label}>
          <circle cx={p.x} cy="74" r="10" fill={p.color}/>
          <T x={p.x} y="78" size={9} weight="700" fill="#fff">●</T>
          <T x={p.x} y="57" size={10} weight="700" fill="#374151">{p.label}</T>
          <T x={p.x} y="97" size={10} weight="700" fill={p.color}>{p.sub}</T>
        </g>
      ))}

      {/* 설명 */}
      <rect x="60" y="110" width="180" height="28" rx="8" fill="#F0FDF4" stroke="#21C58E"/>
      <T x="150" y="123" size={9} fill="#065F46">빌려주고 이자 받고 만기에 원금 돌려받아요</T>
      <T x="150" y="133" size={9} fill="#065F46">정부・기업이 발행하는 차용증</T>
    </svg>
  );
}

/* ── 7. 자산배분 ──────────────────────────────────── */
function AllocationGraphic() {
  const segments = [
    { label: '주식', pct: 40, color: '#21C58E', subColor: '#065F46' },
    { label: '채권', pct: 30, color: '#3B82F6', subColor: '#1E40AF' },
    { label: '현금', pct: 20, color: '#F59E0B', subColor: '#92400E' },
    { label: '기타', pct: 10, color: '#8B5CF6', subColor: '#4C1D95' },
  ];
  const barX = 24, barY = 60, barW = 252, barH = 38;
  let cursor = barX;

  return (
    <svg viewBox="0 0 300 148" fill="none" width="100%" style={{ display: 'block' }}>
      <T x="150" y="24" size={11} weight="800" fill="#374151" anchor="middle">나의 포트폴리오 구성</T>

      {/* 스택 바 */}
      {segments.map((s) => {
        const w = (s.pct / 100) * barW;
        const x = cursor;
        cursor += w;
        return (
          <g key={s.label}>
            <rect x={x} y={barY} width={w} height={barH} rx={x === barX ? 10 : x + w >= barX + barW ? 10 : 0} fill={s.color}/>
            {w > 28 && <T x={x + w / 2} y={barY + barH / 2 + 4} size={10} weight="700" fill="#fff">{s.pct}%</T>}
          </g>
        );
      })}

      {/* 레전드 */}
      {segments.map((s, i) => (
        <g key={s.label}>
          <circle cx={30 + i * 68} cy={115} r={6} fill={s.color}/>
          <T x={42 + i * 68} y={119} size={10} weight="600" fill={s.subColor} anchor="start">{s.label}</T>
          <T x={42 + i * 68} y={131} size={9} fill="#94A3B8" anchor="start">{s.pct}%</T>
        </g>
      ))}
    </svg>
  );
}

/* ── 8. 수요와 공급 ────────────────────────────────── */
function SupplyDemandGraphic() {
  return (
    <svg viewBox="0 0 300 148" fill="none" width="100%" style={{ display: 'block' }}>
      {/* 축 */}
      <line x1="60" y1="20" x2="60" y2="128" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round"/>
      <line x1="58" y1="128" x2="244" y2="128" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round"/>
      <T x="44" y="24" size={9} fill="#94A3B8">가격</T>
      <T x="248" y="132" size={9} fill="#94A3B8">거래량</T>

      {/* 수요선 (빨강, 우하향) */}
      <line x1="70" y1="38" x2="234" y2="118" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round"/>
      <T x="236" y="116" size={10} weight="700" fill="#EF4444" anchor="start">수요</T>

      {/* 공급선 (초록, 우상향) */}
      <line x1="70" y1="118" x2="234" y2="38" stroke="#21C58E" strokeWidth="2.5" strokeLinecap="round"/>
      <T x="236" y="42" size={10} weight="700" fill="#21C58E" anchor="start">공급</T>

      {/* 교차점 */}
      <circle cx="152" cy="78" r="9" fill="#FFC83D"/>
      <circle cx="152" cy="78" r="5" fill="#fff"/>

      {/* 교차점 라벨 */}
      <rect x="160" y="58" width="60" height="26" rx="7" fill="#FEF9EC" stroke="#FFC83D"/>
      <T x="190" y="70" size={9} weight="700" fill="#92400E">균형가격</T>
      <T x="190" y="80" size={9} fill="#92400E">결정 포인트</T>
      <line x1="152" y1="78" x2="159" y2="71" stroke="#FFC83D" strokeWidth="1"/>
    </svg>
  );
}

/* ── 9. 환율 ──────────────────────────────────────── */
function ExchangeRateGraphic() {
  return (
    <svg viewBox="0 0 300 148" fill="none" width="100%" style={{ display: 'block' }}>
      {/* 원화 */}
      <circle cx="70" cy="74" r="44" fill="#E8FAF3" stroke="#21C58E" strokeWidth="2"/>
      <T x="70" y="62" size={22} weight="900" fill="#21C58E">₩</T>
      <T x="70" y="84" size={13} weight="800" fill="#065F46">1,300</T>
      <T x="70" y="100" size={9} fill="#94A3B8">원</T>

      {/* 교환 화살표 */}
      <Arr x1={118} y1={66} x2={178} y2={66} color="#FFC83D" w={2.5}/>
      <Arr x1={178} y1={82} x2={118} y2={82} color="#FFC83D" w={2.5}/>
      <T x="148" y="110" size={9} fill="#B45309" weight="600">교환 (환전)</T>

      {/* 달러 */}
      <circle cx="228" cy="74" r="44" fill="#FEF9EC" stroke="#FFC83D" strokeWidth="2"/>
      <T x="228" y="62" size={22} weight="900" fill="#F59E0B">$</T>
      <T x="228" y="84" size={16} weight="800" fill="#92400E">1</T>
      <T x="228" y="100" size={9} fill="#94A3B8">달러</T>

      {/* 하단 설명 */}
      <T x="150" y="138" size={9} fill="#64748B" anchor="middle">원/달러 환율이 오르면 = 원화 가치 하락</T>
    </svg>
  );
}

/* ── 10. 비상금 ───────────────────────────────────── */
function EmergencyFundGraphic() {
  return (
    <svg viewBox="0 0 300 148" fill="none" width="100%" style={{ display: 'block' }}>
      {/* 월급 */}
      <rect x="10" y="50" width="62" height="48" rx="12" fill="#21C58E"/>
      <T x="41" y="70" size={10} weight="800" fill="#fff">월급</T>
      <T x="41" y="84" size={14} fill="#fff">💰</T>
      <T x="41" y="97" size={9} fill="rgba(255,255,255,0.8)">수입</T>

      {/* 화살표 → 비상금 */}
      <Arr x1={74} y1={74} x2={106} y2={74} color="#FFC83D" w={2.5}/>

      {/* 비상금 저수지 */}
      <rect x="108" y="30" width="84" height="88" rx="14" fill="#FEF9EC" stroke="#FFC83D" strokeWidth="2"/>
      <T x="150" y="52" size={10} weight="800" fill="#92400E">비상금</T>
      <T x="150" y="70" size={18}>🛡️</T>
      <T x="150" y="92" size={9} fill="#B45309">3~6개월</T>
      <T x="150" y="104" size={9} fill="#B45309">생활비</T>

      {/* 화살표 → 지출 */}
      <Arr x1={194} y1={74} x2={226} y2={74} color="#64748B" w={2.5}/>

      {/* 지출 */}
      <rect x="228" y="50" width="62" height="48" rx="12" fill="#F1F5F9"/>
      <T x="259" y="70" size={10} weight="800" fill="#374151">지출</T>
      <T x="259" y="83" size={14}>🏠</T>
      <T x="259" y="97" size={9} fill="#94A3B8">생활비</T>

      {/* 긴급상황 */}
      <T x="150" y="136" size={10} fill="#EF4444" weight="700" anchor="middle">⚡ 긴급 상황에 비상금 사용!</T>
    </svg>
  );
}

/* ── 11. 예금 ─────────────────────────────────────── */
function DepositGraphic() {
  return (
    <svg viewBox="0 0 300 148" fill="none" width="100%" style={{ display: 'block' }}>
      {/* 타임라인 */}
      <line x1="36" y1="80" x2="264" y2="80" stroke="#E2E8F0" strokeWidth="2"/>

      {/* 시점 1: 예치 */}
      <circle cx="60" cy="80" r="14" fill="#21C58E"/>
      <T x="60" y="84" size={9} weight="700" fill="#fff">예치</T>
      <T x="60" y="60" size={11} weight="700" fill="#374151">100만원</T>
      <T x="60" y="72" size={9} fill="#94A3B8">넣는다</T>
      <T x="60" y="105" size={9} fill="#21C58E">1년 정기</T>

      {/* 시간 흐름 */}
      <T x="150" y="58" size={10} fill="#94A3B8" anchor="middle">⏰ 1년 후...</T>
      <rect x="106" y="66" width="88" height="28" rx="8" fill="#F8FAFC" stroke="#E2E8F0"/>
      <T x="150" y="79" size={9} fill="#64748B">금리 3.5% 적용</T>
      <T x="150" y="90" size={9} fill="#64748B">중간에 인출 불가</T>

      {/* 시점 2: 수령 */}
      <circle cx="240" cy="80" r="14" fill="#FFC83D"/>
      <T x="240" y="84" size={9} weight="700" fill="#fff">수령</T>
      <T x="240" y="60" size={11} weight="800" fill="#374151">103.5만원</T>
      <T x="240" y="72" size={9} fill="#21C58E" weight="600">+3.5만원 이자!</T>
      <T x="240" y="105" size={9} fill="#FFC83D">원금 보장</T>
    </svg>
  );
}

/* ── 12. 유동성 ───────────────────────────────────── */
function LiquidityGraphic() {
  const items = [
    { label: '현금', emoji: '💵', color: '#21C58E', bg: '#E8FAF3', desc: '즉시 사용' },
    { label: '주식', emoji: '📈', color: '#3B82F6', bg: '#EFF6FF', desc: '실시간 매도' },
    { label: 'ETF', emoji: '📦', color: '#8B5CF6', bg: '#F5F3FF', desc: '실시간 매도' },
    { label: '부동산', emoji: '🏠', color: '#EF4444', bg: '#FEF2F2', desc: '수개월 소요' },
  ];

  return (
    <svg viewBox="0 0 300 148" fill="none" width="100%" style={{ display: 'block' }}>
      <T x="150" y="18" size={11} weight="800" fill="#374151" anchor="middle">유동성 높음 → 낮음</T>

      {/* 스펙트럼 그라디언트 바 */}
      <rect x="24" y="26" width="252" height="8" rx="4" fill="#E2E8F0"/>
      <rect x="24" y="26" width="190" height="8" rx="4" fill="url(#liquidGrad)"/>
      <defs>
        <linearGradient id="liquidGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#21C58E"/>
          <stop offset="100%" stopColor="#EF4444"/>
        </linearGradient>
      </defs>

      {items.map((item, i) => (
        <g key={item.label}>
          <rect x={14 + i * 68} y="42" width="60" height="74" rx="12" fill={item.bg} stroke={item.color} strokeWidth="1.5"/>
          <T x={44 + i * 68} y="65" size={18}>{item.emoji}</T>
          <T x={44 + i * 68} y="82" size={11} weight="700" fill={item.color}>{item.label}</T>
          <T x={44 + i * 68} y="97" size={8} fill="#64748B">{item.desc}</T>
          {i === 0 && <rect x={20 + i * 68} y="110" width="48" height="14" rx="4" fill="#21C58E"/>}
          {i === 0 && <T x={44} y="120" size={8} weight="700" fill="#fff">가장 유동적</T>}
        </g>
      ))}
    </svg>
  );
}

/* ── 13. 레버리지 ─────────────────────────────────── */
function LeverageGraphic() {
  return (
    <svg viewBox="0 0 300 148" fill="none" width="100%" style={{ display: 'block' }}>
      {/* 내 돈 */}
      <rect x="16" y="64" width="56" height="52" rx="12" fill="#21C58E"/>
      <T x="44" y="86" size={10} weight="800" fill="#fff">내 돈</T>
      <T x="44" y="100" size={11} weight="900" fill="#fff">100만</T>
      <T x="44" y="112" size={9} fill="rgba(255,255,255,0.8)">자기자본</T>

      {/* + */}
      <T x="86" y="96" size={22} weight="900" fill="#CBD5E1">+</T>

      {/* 대출 */}
      <rect x="100" y="64" width="56" height="52" rx="12" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1.5"/>
      <T x="128" y="86" size={10} weight="800" fill="#374151">대출</T>
      <T x="128" y="100" size={11} weight="900" fill="#374151">200만</T>
      <T x="128" y="112" size={9} fill="#94A3B8">빌린 돈</T>

      {/* = */}
      <T x="168" y="96" size={22} weight="900" fill="#CBD5E1">=</T>

      {/* 투자 */}
      <rect x="182" y="46" width="72" height="86" rx="14" fill="#FFC83D"/>
      <T x="218" y="74" size={10} weight="800" fill="#0F1F18">투자</T>
      <T x="218" y="92" size={15} weight="900" fill="#0F1F18">300만</T>
      <T x="218" y="108" size={9} fill="#78350F">총 투자금</T>
      <T x="218" y="122" size={9} fill="#78350F">3배 레버리지</T>

      {/* 경고 */}
      <rect x="16" y="126" width="166" height="18" rx="6" fill="#FEF2F2" stroke="#FECACA"/>
      <T x="99" y="138" size={9} weight="700" fill="#EF4444">⚠ 손실도 3배로 커져요</T>
    </svg>
  );
}

/* ── 14. 퇴직연금 ─────────────────────────────────── */
function RetirementGraphic() {
  return (
    <svg viewBox="0 0 300 148" fill="none" width="100%" style={{ display: 'block' }}>
      {/* 적립 흐름 */}
      {[1, 2, 3, 4].map((i) => (
        <g key={i}>
          <rect x={8 + (i - 1) * 42} y="28" width="34" height="28" rx="8" fill="#E8FAF3" stroke="#21C58E" strokeWidth="1.5"/>
          <T x={25 + (i - 1) * 42} y="40" size={8} fill="#065F46">{i}월</T>
          <T x={25 + (i - 1) * 42} y="52" size={9} weight="700" fill="#21C58E">+납입</T>
          {i < 4 && <Arr x1={44 + (i - 1) * 42} y1={42} x2={50 + (i - 1) * 42} y2={42} color="#21C58E" w={1.5}/>}
        </g>
      ))}

      <T x="88" y="72" size={11} fill="#CBD5E1">…</T>
      <T x="108" y="72" size={10} fill="#94A3B8">수십 년 적립</T>
      <Arr x1={88} y1={42} x2={176} y2={42} color="#21C58E" w={2}/>

      {/* 적립금 항아리 */}
      <rect x="178" y="22" width="72" height="72" rx="16" fill="#FFC83D"/>
      <T x="214" y="52" size={14}>🏺</T>
      <T x="214" y="70" size={10} weight="800" fill="#0F1F18">퇴직연금</T>
      <T x="214" y="83" size={9} fill="#78350F">적립금</T>

      {/* 화살표 → 수령 */}
      <Arr x1={252} y1={58} x2={270} y2={58} color="#FFC83D" w={2.5}/>

      {/* 수령 */}
      <rect x="272" y="34" width="22" height="48" rx="6" fill="#E8FAF3" stroke="#21C58E"/>
      <T x="283" y="58" size={8} weight="700" fill="#065F46">수령</T>

      {/* 혜택 */}
      <rect x="16" y="106" width="268" height="36" rx="10" fill="#F0FDF4" stroke="#21C58E"/>
      <T x="150" y="120" size={9} fill="#065F46" anchor="middle">• 연간 최대 900만원 세액공제</T>
      <T x="150" y="133" size={9} fill="#065F46" anchor="middle">• 55세 이후 연금 수령 시 세금 혜택</T>
    </svg>
  );
}

/* ── 15. GDP ──────────────────────────────────────── */
function GDPGraphic() {
  const sectors = [
    { label: '제조업', emoji: '🏭', color: '#3B82F6', pct: 28 },
    { label: '서비스', emoji: '🛍️', color: '#21C58E', pct: 35 },
    { label: '건설', emoji: '🏗️', color: '#F59E0B', pct: 15 },
    { label: '농업', emoji: '🌾', color: '#8B5CF6', pct: 22 },
  ];
  const cx = 136, cy = 80, r = 52;
  let angle = -Math.PI / 2;

  return (
    <svg viewBox="0 0 300 148" fill="none" width="100%" style={{ display: 'block' }}>
      <T x="150" y="16" size={11} weight="800" fill="#374151" anchor="middle">국내에서 1년 동안 만든 모든 것의 합</T>

      {/* 파이 차트 */}
      {sectors.map((s) => {
        const slice = (s.pct / 100) * Math.PI * 2;
        const midAngle = angle + slice / 2;
        const x1 = cx + r * Math.cos(angle);
        const y1 = cy + r * Math.sin(angle);
        angle += slice;
        const x2 = cx + r * Math.cos(angle);
        const y2 = cy + r * Math.sin(angle);
        const largeArc = s.pct > 50 ? 1 : 0;
        const d = `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc} 1 ${x2},${y2} Z`;
        return <path key={s.label} d={d} fill={s.color} stroke="#fff" strokeWidth="2"/>;
      })}

      {/* 레전드 */}
      {sectors.map((s, i) => (
        <g key={s.label}>
          <circle cx={206 + (i % 2) * 50} cy={54 + Math.floor(i / 2) * 22} r={5} fill={s.color}/>
          <T x={214 + (i % 2) * 50} y={58 + Math.floor(i / 2) * 22} size={9} fill="#374151" anchor="start">
            {s.label} {s.pct}%
          </T>
        </g>
      ))}

      {/* GDP 라벨 */}
      <T x="150" y="136" size={10} weight="700" fill="#374151" anchor="middle">GDP = 이 모든 것의 총합 (국내총생산)</T>
    </svg>
  );
}

/* ── 16. 인덱스 펀드 ─────────────────────────────── */
function IndexFundGraphic() {
  const stocks = [
    { name: '삼성전자', color: '#3B82F6' },
    { name: 'SK하이닉스', color: '#8B5CF6' },
    { name: 'NAVER', color: '#21C58E' },
    { name: '현대차', color: '#EF4444' },
  ];
  return (
    <svg viewBox="0 0 300 148" fill="none" width="100%" style={{ display: 'block' }}>
      {stocks.map((s, i) => (
        <g key={s.name}>
          <rect x="8" y={14 + i * 30} width="82" height="22" rx="7" fill={s.color + '18'} stroke={s.color} strokeWidth="1.5"/>
          <T x="49" y={29 + i * 30} size={9} weight="700" fill={s.color}>{s.name}</T>
        </g>
      ))}
      {[25, 55, 85, 115].map(y => (
        <Arr key={y} x1={92} y1={y} x2={136} y2={74} color="#21C58E" w={1.6}/>
      ))}
      <rect x="138" y="28" width="78" height="92" rx="14" fill="#21C58E"/>
      <T x="177" y="60" size={13} weight="900" fill="#fff">인덱스</T>
      <T x="177" y="78" size={13} weight="900" fill="#fff">펀드</T>
      <T x="177" y="96" size={9} fill="rgba(255,255,255,0.85)">시장 평균</T>
      <T x="177" y="109" size={9} fill="rgba(255,255,255,0.85)">수익률 추구</T>
      <Arr x1={218} y1={74} x2={243} y2={74} color="#FFC83D" w={2.5}/>
      <rect x="245" y="44" width="52" height="60" rx="12" fill="#FEF9EC" stroke="#FFC83D" strokeWidth="1.5"/>
      <T x="271" y="68" size={14}>👤</T>
      <T x="271" y="83" size={10} weight="800" fill="#92400E">한번에</T>
      <T x="271" y="96" size={10} weight="800" fill="#92400E">분산투자</T>
    </svg>
  );
}

/* ── 17. 주식 ────────────────────────────────────── */
function StockGraphic() {
  return (
    <svg viewBox="0 0 300 148" fill="none" width="100%" style={{ display: 'block' }}>
      <rect x="16" y="40" width="74" height="68" rx="14" fill="#3B82F6"/>
      <T x="53" y="62" size={18}>🏢</T>
      <T x="53" y="79" size={11} weight="800" fill="#fff">기업</T>
      <T x="53" y="93" size={9} fill="rgba(255,255,255,0.85)">총 10,000주</T>
      <Arr x1={92} y1={74} x2={124} y2={74} color="#FFC83D" w={2.5}/>
      <rect x="126" y="50" width="62" height="48" rx="10" fill="#FEF9EC" stroke="#FFC83D" strokeWidth="2"/>
      <T x="157" y="70" size={12} weight="800" fill="#92400E">주식</T>
      <T x="157" y="84" size={9} fill="#B45309">발행·판매</T>
      <Arr x1={190} y1={66} x2={218} y2={44} color="#21C58E"/>
      <Arr x1={190} y1={82} x2={218} y2={104} color="#21C58E"/>
      {[{ y: 24, pct: '0.05%' }, { y: 86, pct: '0.03%' }].map((p, idx) => (
        <g key={idx}>
          <circle cx="232" cy={p.y + 12} r="16" fill="#E8FAF3" stroke="#21C58E" strokeWidth="1.5"/>
          <T x="232" y={p.y + 17} size={13}>👤</T>
          <T x="256" y={p.y + 8} size={10} weight="800" fill="#065F46" anchor="start">주주</T>
          <T x="256" y={p.y + 22} size={9} fill="#21C58E" anchor="start">소유 {p.pct}</T>
        </g>
      ))}
      <T x="150" y="138" size={9} weight="600" fill="#374151" anchor="middle">주식 = 기업 소유권의 일부를 사는 것</T>
    </svg>
  );
}

/* ── 18. 적금 ────────────────────────────────────── */
function SavingsGraphic() {
  const months = [
    { m: '1월', h: 28 }, { m: '2월', h: 38 },
    { m: '3월', h: 48 }, { m: '4월', h: 60 }, { m: '5월', h: 74 },
  ];
  const base = 120;
  return (
    <svg viewBox="0 0 300 148" fill="none" width="100%" style={{ display: 'block' }}>
      <T x="150" y="14" size={10} weight="800" fill="#374151" anchor="middle">매달 꾸준히 납입 → 복리로 불어나요</T>
      {months.map((m, i) => {
        const green = `hsl(${158 + i * 5}, 65%, ${48 - i * 3}%)`;
        return (
          <g key={m.m}>
            <rect x={16 + i * 44} y={base - m.h} width={36} height={m.h} rx="7" fill={green}/>
            <T x={34 + i * 44} y={base - m.h - 5} size={9} weight="700" fill="#374151">+30만</T>
            <T x={34 + i * 44} y={base + 13} size={9} fill="#94A3B8">{m.m}</T>
          </g>
        );
      })}
      <Arr x1={238} y1={base - 37} x2={258} y2={base - 37} color="#FFC83D" w={2.5}/>
      <rect x="260" y={base - 62} width="34" height="70" rx="10" fill="#FFC83D"/>
      <T x="277" y={base - 38} size={10} weight="800" fill="#0F1F18">만기</T>
      <T x="277" y={base - 24} size={9} fill="#78350F">원금</T>
      <T x="277" y={base - 12} size={9} fill="#78350F">+이자</T>
      <line x1="16" y1={base + 2} x2="294" y2={base + 2} stroke="#E2E8F0" strokeWidth="1.5"/>
      <T x="150" y="140" size={10} weight="600" fill="#065F46" anchor="middle">5개월 150만원 납입 → 만기 수령</T>
    </svg>
  );
}

/* ── 19. 금리 인상 ───────────────────────────────── */
function RateHikeGraphic() {
  const steps = [
    { label: '중앙은행', sub: '기준금리 ↑', fill: '#21C58E', textFill: '#fff' },
    { label: '시중은행', sub: '대출금리 ↑', fill: '#fff',    textFill: '#065F46', stroke: '#21C58E' },
    { label: '가계·기업', sub: '이자 부담 ↑', fill: '#fff',  textFill: '#065F46', stroke: '#21C58E' },
    { label: '소비·투자', sub: '지출 감소',   fill: '#FEF9EC', textFill: '#92400E', stroke: '#FFC83D' },
  ];
  return (
    <svg viewBox="0 0 300 148" fill="none" width="100%" style={{ display: 'block' }}>
      <T x="150" y="13" size={10} weight="800" fill="#374151" anchor="middle">금리 인상이 경제에 미치는 효과</T>
      {steps.map((s, i) => {
        const x = 12 + i * 73;
        return (
          <g key={s.label}>
            <rect x={x} y={30} width={62} height={68} rx={10}
              fill={s.fill} stroke={s.stroke ?? 'none'} strokeWidth={s.stroke ? 1.5 : 0} />
            <T x={x + 31} y={56} size={10} weight="800" fill={s.textFill} anchor="middle">{s.label}</T>
            <T x={x + 31} y={72} size={9}  weight="700" fill={s.textFill} anchor="middle">{s.sub}</T>
            {i < steps.length - 1 && (
              <Arr x1={x + 63} y1={64} x2={x + 72} y2={64} color="#FFC83D" w={2.5} />
            )}
          </g>
        );
      })}
      <rect x="12" y="112" width="276" height="26" rx="8" fill="#F0FDF4" />
      <T x="150" y="129" size={10} weight="700" fill="#065F46" anchor="middle">→ 결과: 물가 안정 · 경기 냉각</T>
    </svg>
  );
}

/* ── 20. 금리 인하 ───────────────────────────────── */
function RateCutGraphic() {
  const steps = [
    { label: '중앙은행', sub: '기준금리 ↓', fill: '#FFC83D', textFill: '#78350F' },
    { label: '시중은행', sub: '대출금리 ↓', fill: '#fff',    textFill: '#065F46', stroke: '#21C58E' },
    { label: '가계·기업', sub: '대출 증가',  fill: '#fff',   textFill: '#065F46', stroke: '#21C58E' },
    { label: '소비·투자', sub: '지출 증가',  fill: '#E1F5EE', textFill: '#065F46', stroke: '#A7F3D0' },
  ];
  return (
    <svg viewBox="0 0 300 148" fill="none" width="100%" style={{ display: 'block' }}>
      <T x="150" y="13" size={10} weight="800" fill="#374151" anchor="middle">금리 인하가 경제에 미치는 효과</T>
      {steps.map((s, i) => {
        const x = 12 + i * 73;
        return (
          <g key={s.label}>
            <rect x={x} y={30} width={62} height={68} rx={10}
              fill={s.fill} stroke={s.stroke ?? 'none'} strokeWidth={s.stroke ? 1.5 : 0} />
            <T x={x + 31} y={56} size={10} weight="800" fill={s.textFill} anchor="middle">{s.label}</T>
            <T x={x + 31} y={72} size={9}  weight="700" fill={s.textFill} anchor="middle">{s.sub}</T>
            {i < steps.length - 1 && (
              <Arr x1={x + 63} y1={64} x2={x + 72} y2={64} color="#21C58E" w={2.5} />
            )}
          </g>
        );
      })}
      <rect x="12" y="112" width="276" height="26" rx="8" fill="#FFFBEA" />
      <T x="150" y="129" size={10} weight="700" fill="#92400E" anchor="middle">→ 결과: 경기 부양 · 물가 상승 위험</T>
    </svg>
  );
}

/* ── 1. 디플레이션 ─────────────────────────────────── */
function DeflationGraphic() {
  const steps = [
    { label: '물가', sub: '물가 ↓', fill: '#FAECE7', textFill: '#92400E', stroke: '#F0997B' },
    { label: '소비', sub: '소비 ↓', fill: '#FAECE7', textFill: '#92400E', stroke: '#F0997B' },
    { label: '기업', sub: '매출 ↓', fill: '#FAECE7', textFill: '#92400E', stroke: '#F0997B' },
    { label: '실업', sub: '실업 ↑', fill: '#EF4444', textFill: '#fff' },
  ];
  return (
    <svg viewBox="0 0 300 148" fill="none" width="100%" style={{ display: 'block' }}>
      <T x="150" y="13" size={10} weight="800" fill="#374151" anchor="middle">디플레이션 악순환 구조</T>
      {steps.map((s, i) => {
        const x = 12 + i * 73;
        return (
          <g key={s.label}>
            <rect x={x} y={26} width={62} height={72} rx={10}
              fill={s.fill} stroke={s.stroke ?? 'none'} strokeWidth={s.stroke ? 1.5 : 0} />
            <T x={x + 31} y={52} size={11} weight="800" fill={s.textFill} anchor="middle">{s.label}</T>
            <T x={x + 31} y={68} size={9} weight="700" fill={s.textFill} anchor="middle">{s.sub}</T>
            {i < steps.length - 1 && (
              <Arr x1={x + 63} y1={62} x2={x + 72} y2={62} color="#EF4444" w={2.5} />
            )}
          </g>
        );
      })}
      <rect x="12" y="110" width="276" height="28" rx="8" fill="#FFF5F5" />
      <T x="150" y="128" size={10} weight="700" fill="#EF4444" anchor="middle">→ 경기 침체 심화 · 일본 잃어버린 30년</T>
    </svg>
  );
}

/* ── 2. 소비자물가지수(CPI) ──────────────────────────── */
function CPIGraphic() {
  const steps = [
    { label: '생필품', sub: '가격 측정', fill: '#21C58E', textFill: '#fff' },
    { label: '가중', sub: '평균 산출', fill: '#fff', textFill: '#065F46', stroke: '#21C58E' },
    { label: 'CPI', sub: '수치화', fill: '#FFC83D', textFill: '#78350F' },
    { label: '물가', sub: '파악', fill: '#E1F5EE', textFill: '#065F46', stroke: '#9FE1CB' },
  ];
  return (
    <svg viewBox="0 0 300 148" fill="none" width="100%" style={{ display: 'block' }}>
      <T x="150" y="13" size={10} weight="800" fill="#374151" anchor="middle">소비자물가지수(CPI) 산출 과정</T>
      {steps.map((s, i) => {
        const x = 12 + i * 73;
        return (
          <g key={s.label}>
            <rect x={x} y={26} width={62} height={72} rx={10}
              fill={s.fill} stroke={s.stroke ?? 'none'} strokeWidth={s.stroke ? 1.5 : 0} />
            <T x={x + 31} y={52} size={11} weight="800" fill={s.textFill} anchor="middle">{s.label}</T>
            <T x={x + 31} y={68} size={9} weight="700" fill={s.textFill} anchor="middle">{s.sub}</T>
            {i < steps.length - 1 && (
              <Arr x1={x + 63} y1={62} x2={x + 72} y2={62} color="#21C58E" w={2.5} />
            )}
          </g>
        );
      })}
      <rect x="12" y="110" width="276" height="28" rx="8" fill="#F0FDF4" />
      <T x="150" y="128" size={10} weight="700" fill="#065F46" anchor="middle">→ CPI 상승 = 인플레이션 / CPI 하락 = 디플레이션</T>
    </svg>
  );
}

/* ── 3. 연금 ───────────────────────────────────────── */
function PensionGraphic() {
  const layers = [
    { label: '3층 개인연금', sub: 'IRP·연금저축', fill: '#21C58E', textFill: '#fff', y: 18, h: 36 },
    { label: '2층 퇴직연금', sub: 'DB·DC형', fill: '#FFC83D', textFill: '#78350F', y: 62, h: 36 },
    { label: '1층 국민연금', sub: '의무 가입', fill: '#3B82F6', textFill: '#fff', y: 106, h: 36 },
  ];
  return (
    <svg viewBox="0 0 300 148" fill="none" width="100%" style={{ display: 'block' }}>
      <T x="150" y="13" size={10} weight="800" fill="#374151" anchor="middle">3층 연금 구조</T>
      {layers.map((l) => (
        <g key={l.label}>
          <rect x={30} y={l.y} width={240} height={l.h} rx={10} fill={l.fill} />
          <T x={150} y={l.y + 15} size={11} weight="800" fill={l.textFill} anchor="middle">{l.label}</T>
          <T x={150} y={l.y + 28} size={9} weight="600" fill={l.textFill} anchor="middle">{l.sub}</T>
        </g>
      ))}
      <T x="290" y="32" size={9} fill="#374151" anchor="end">자율</T>
      <T x="290" y="76" size={9} fill="#374151" anchor="end">직장</T>
      <T x="290" y="120" size={9} fill="#374151" anchor="end">국가</T>
    </svg>
  );
}

/* ── 4. 청약 ───────────────────────────────────────── */
function CheongyakGraphic() {
  const steps = [
    { label: '청약통장', sub: '꾸준히 납입', fill: '#21C58E', textFill: '#fff' },
    { label: '청약신청', sub: '공고 확인', fill: '#fff', textFill: '#065F46', stroke: '#21C58E' },
    { label: '당첨', sub: '가점 순위', fill: '#FFC83D', textFill: '#78350F' },
    { label: '입주', sub: '계약·잔금', fill: '#E1F5EE', textFill: '#065F46', stroke: '#9FE1CB' },
  ];
  return (
    <svg viewBox="0 0 300 148" fill="none" width="100%" style={{ display: 'block' }}>
      <T x="150" y="13" size={10} weight="800" fill="#374151" anchor="middle">청약 4단계 프로세스</T>
      {steps.map((s, i) => {
        const x = 12 + i * 73;
        return (
          <g key={s.label}>
            <rect x={x} y={26} width={62} height={72} rx={10}
              fill={s.fill} stroke={s.stroke ?? 'none'} strokeWidth={s.stroke ? 1.5 : 0} />
            <T x={x + 31} y={52} size={10} weight="800" fill={s.textFill} anchor="middle">{s.label}</T>
            <T x={x + 31} y={68} size={9} weight="700" fill={s.textFill} anchor="middle">{s.sub}</T>
            <T x={x + 31} y={88} size={18} anchor="middle">{['🏦','📝','🎉','🏠'][i]}</T>
            {i < steps.length - 1 && (
              <Arr x1={x + 63} y1={62} x2={x + 72} y2={62} color="#FFC83D" w={2.5} />
            )}
          </g>
        );
      })}
      <rect x="12" y="110" width="276" height="28" rx="8" fill="#F0FDF4" />
      <T x="150" y="128" size={10} weight="700" fill="#065F46" anchor="middle">→ 청약통장 가입 기간·납입금이 당첨 가점</T>
    </svg>
  );
}

/* ── 5. 포트폴리오 ─────────────────────────────────── */
function PortfolioGraphic() {
  const items = [
    { label: '주식', pct: 40, color: '#21C58E', x: 20, y: 22, w: 120, h: 58 },
    { label: '채권', pct: 30, color: '#3B82F6', x: 148, y: 22, w: 90, h: 58 },
    { label: '현금', pct: 20, color: '#FFC83D', x: 20, y: 88, w: 60, h: 46 },
    { label: '부동산', pct: 10, color: '#8B5CF6', x: 88, y: 88, w: 150, h: 46 },
  ];
  return (
    <svg viewBox="0 0 300 148" fill="none" width="100%" style={{ display: 'block' }}>
      <T x="150" y="14" size={10} weight="800" fill="#374151" anchor="middle">분산투자 포트폴리오 구성</T>
      {items.map((s) => (
        <g key={s.label}>
          <rect x={s.x} y={s.y} width={s.w} height={s.h} rx={10} fill={s.color + '22'} stroke={s.color} strokeWidth={1.5} />
          <T x={s.x + s.w / 2} y={s.y + s.h / 2 - 5} size={11} weight="800" fill={s.color} anchor="middle">{s.label}</T>
          <T x={s.x + s.w / 2} y={s.y + s.h / 2 + 10} size={10} weight="700" fill={s.color} anchor="middle">{s.pct}%</T>
        </g>
      ))}
      <T x="150" y="143" size={9} fill="#64748B" anchor="middle">분산 → 리스크 감소</T>
    </svg>
  );
}

/* ── 6. 스태그플레이션 ──────────────────────────────── */
function StagflationGraphic() {
  return (
    <svg viewBox="0 0 300 148" fill="none" width="100%" style={{ display: 'block' }}>
      <T x="150" y="13" size={10} weight="800" fill="#374151" anchor="middle">스태그플레이션 = 침체 + 인플레이션</T>
      <rect x="12" y="26" width="126" height="80" rx="12" fill="#FAECE7" stroke="#F0997B" strokeWidth="1.5" />
      <T x="75" y="52" size={13} weight="900" fill="#92400E" anchor="middle">경기침체</T>
      <T x="75" y="68" size={10} fill="#92400E" anchor="middle">실업 ↑</T>
      <T x="75" y="82" size={10} fill="#92400E" anchor="middle">성장 ↓</T>
      <T x="75" y="96" size={10} fill="#92400E" anchor="middle">소득 ↓</T>
      <rect x="162" y="26" width="126" height="80" rx="12" fill="#FEF9EC" stroke="#FFC83D" strokeWidth="1.5" />
      <T x="225" y="52" size={13} weight="900" fill="#78350F" anchor="middle">인플레이션</T>
      <T x="225" y="68" size={10} fill="#92400E" anchor="middle">물가 ↑</T>
      <T x="225" y="82" size={10} fill="#92400E" anchor="middle">금리 ↑</T>
      <T x="225" y="96" size={10} fill="#92400E" anchor="middle">화폐가치 ↓</T>
      <rect x="100" y="44" width="100" height="36" rx="10" fill="#EF4444" />
      <T x="150" y="60" size={10} weight="800" fill="#fff" anchor="middle">동시 발생!</T>
      <T x="150" y="73" size={9} fill="#fff" anchor="middle">최악의 조합</T>
      <rect x="12" y="118" width="276" height="24" rx="8" fill="#FFF5F5" />
      <T x="150" y="133" size={10} weight="700" fill="#EF4444" anchor="middle">→ 금리 조정만으로 해결 불가능</T>
    </svg>
  );
}

/* ── 7. 수익률 ────────────────────────────────────── */
function ReturnRateGraphic() {
  return (
    <svg viewBox="0 0 300 148" fill="none" width="100%" style={{ display: 'block' }}>
      <T x="150" y="14" size={10} weight="800" fill="#374151" anchor="middle">수익률 계산 공식</T>
      <rect x="12" y="26" width="74" height="64" rx="12" fill="#21C58E" />
      <T x="49" y="52" size={10} weight="800" fill="#fff" anchor="middle">투자금</T>
      <T x="49" y="68" size={13} weight="900" fill="#fff" anchor="middle">100만</T>
      <T x="49" y="82" size={9} fill="rgba(255,255,255,0.8)" anchor="middle">원금</T>
      <Arr x1={88} y1={58} x2={118} y2={58} color="#FFC83D" w={2.5} />
      <rect x="120" y="26" width="74" height="64" rx="12" fill="#FFC83D" />
      <T x="157" y="52" size={10} weight="800" fill="#78350F" anchor="middle">수익금</T>
      <T x="157" y="68" size={13} weight="900" fill="#78350F" anchor="middle">110만</T>
      <T x="157" y="82" size={9} fill="#92400E" anchor="middle">+10만 이익</T>
      <Arr x1={196} y1={58} x2={220} y2={58} color="#FFC83D" w={2.5} />
      <rect x="222" y="14" width="70" height="88" rx="12" fill="#E1F5EE" stroke="#9FE1CB" strokeWidth="1.5" />
      <T x="257" y="42" size={9} fill="#065F46" anchor="middle">수익÷원금</T>
      <T x="257" y="55" size={9} fill="#065F46" anchor="middle">×100</T>
      <T x="257" y="72" size={14} weight="900" fill="#065F46" anchor="middle">10%</T>
      <T x="257" y="86" size={9} fill="#065F46" anchor="middle">수익률</T>
      <T x="257" y="97" size={9} fill="#065F46" anchor="middle">10÷100×100</T>
      <rect x="12" y="104" width="276" height="34" rx="8" fill="#F0FDF4" />
      <T x="150" y="119" size={10} weight="700" fill="#065F46" anchor="middle">수익률(%) = (수익금 ÷ 투자금) × 100</T>
      <T x="150" y="131" size={9} fill="#065F46" anchor="middle">양수 = 이익 / 음수 = 손실</T>
    </svg>
  );
}

/* ── 8. 단리 ───────────────────────────────────────── */
function SimpleInterestGraphic() {
  const years = [
    { y: '1년', si: 105, ci: 105 },
    { y: '5년', si: 125, ci: 128 },
    { y: '10년', si: 150, ci: 163 },
    { y: '20년', si: 200, ci: 265 },
  ];
  const base = 118, scale = 0.7;
  return (
    <svg viewBox="0 0 300 148" fill="none" width="100%" style={{ display: 'block' }}>
      <T x="150" y="13" size={10} weight="800" fill="#374151" anchor="middle">단리 vs 복리 (원금 100만원, 5%)</T>
      {years.map((d, i) => {
        const x = 20 + i * 68;
        const siH = (d.si - 100) * scale + 12;
        const ciH = (d.ci - 100) * scale + 12;
        return (
          <g key={d.y}>
            <rect x={x} y={base - siH} width={22} height={siH} rx="4" fill="#94A3B8" />
            <rect x={x + 26} y={base - ciH} width={22} height={ciH} rx="4" fill="#21C58E" />
            <T x={x + 24} y={base + 12} size={8} fill="#64748B" anchor="middle">{d.y}</T>
          </g>
        );
      })}
      <line x1="12" y1={base} x2="288" y2={base} stroke="#E2E8F0" strokeWidth="1.5" />
      <rect x="12" y="128" width="76" height="14" rx="4" fill="#94A3B820" />
      <circle cx="18" cy="135" r="4" fill="#94A3B8" />
      <T x="24" y="138" size={8} fill="#64748B" anchor="start">단리</T>
      <circle cx="56" cy="135" r="4" fill="#21C58E" />
      <T x="62" y="138" size={8} fill="#065F46" anchor="start">복리</T>
      <T x="200" y="138" size={9} weight="700" fill="#21C58E" anchor="middle">복리가 장기에서 압도!</T>
    </svg>
  );
}

/* ── 9. 펀드 ───────────────────────────────────────── */
function FundGraphic() {
  return (
    <svg viewBox="0 0 300 148" fill="none" width="100%" style={{ display: 'block' }}>
      <T x="150" y="13" size={10} weight="800" fill="#374151" anchor="middle">펀드 운용 구조</T>
      {[{ label: '투자자A', y: 26 }, { label: '투자자B', y: 62 }, { label: '투자자C', y: 98 }].map((p) => (
        <g key={p.label}>
          <rect x="10" y={p.y} width="64" height="28" rx="8" fill="#E1F5EE" stroke="#9FE1CB" strokeWidth="1.5" />
          <T x="42" y={p.y + 17} size={10} weight="700" fill="#065F46" anchor="middle">{p.label}</T>
          <Arr x1={75} y1={p.y + 14} x2={108} y2={74} color="#21C58E" w={1.8} />
        </g>
      ))}
      <rect x="110" y="44" width="68" height="58" rx="12" fill="#21C58E" />
      <T x="144" y="67" size={11} weight="800" fill="#fff" anchor="middle">펀드</T>
      <T x="144" y="82" size={9} fill="rgba(255,255,255,0.85)" anchor="middle">통합 운용</T>
      <T x="144" y="95" size={9} fill="rgba(255,255,255,0.85)" anchor="middle">풀(Pool)</T>
      <Arr x1={180} y1={73} x2={210} y2={73} color="#FFC83D" w={2.5} />
      <rect x="212" y="44" width="68" height="58" rx="12" fill="#FEF9EC" stroke="#FFC83D" strokeWidth="1.5" />
      <T x="246" y="67" size={10} weight="800" fill="#92400E" anchor="middle">매니저</T>
      <T x="246" y="82" size={9} fill="#B45309" anchor="middle">전문 운용</T>
      <T x="246" y="95" size={9} fill="#B45309" anchor="middle">수익 배분</T>
      <rect x="10" y="118" width="280" height="24" rx="8" fill="#F0FDF4" />
      <T x="150" y="133" size={10} weight="700" fill="#065F46" anchor="middle">→ 소액으로 분산투자 · 운용 보수 발생</T>
    </svg>
  );
}

/* ── 10. 경기침체 ──────────────────────────────────── */
function RecessionGraphic() {
  const steps = [
    { label: '소비', sub: '소비 ↓', x: 140, y: 22, fill: '#FAECE7', textFill: '#92400E', stroke: '#F0997B' },
    { label: '기업매출', sub: '매출 ↓', x: 214, y: 66, fill: '#FAECE7', textFill: '#92400E', stroke: '#F0997B' },
    { label: '고용', sub: '고용 ↓', x: 140, y: 110, fill: '#EF4444', textFill: '#fff' },
    { label: '소득', sub: '소득 ↓', x: 66, y: 66, fill: '#FAECE7', textFill: '#92400E', stroke: '#F0997B' },
  ];
  return (
    <svg viewBox="0 0 300 148" fill="none" width="100%" style={{ display: 'block' }}>
      <T x="150" y="13" size={10} weight="800" fill="#374151" anchor="middle">경기침체 악순환 사이클</T>
      {steps.map((s) => (
        <g key={s.label}>
          <rect x={s.x} y={s.y} width={66} height={36} rx="9"
            fill={s.fill} stroke={s.stroke ?? 'none'} strokeWidth={s.stroke ? 1.5 : 0} />
          <T x={s.x + 33} y={s.y + 14} size={10} weight="800" fill={s.textFill} anchor="middle">{s.label}</T>
          <T x={s.x + 33} y={s.y + 27} size={9} weight="700" fill={s.textFill} anchor="middle">{s.sub}</T>
        </g>
      ))}
      <Arr x1={206} y1={40} x2={230} y2={70} color="#EF4444" w={2} />
      <Arr x1={230} y1={100} x2={206} y2={116} color="#EF4444" w={2} />
      <Arr x1={138} y1={122} x2={120} y2={102} color="#EF4444" w={2} />
      <Arr x1={120} y1={74} x2={138} y2={44} color="#EF4444" w={2} />
      <rect x="116" y="60" width="58" height="24" rx="8" fill="#EF4444" />
      <T x="145" y="75" size={9} weight="700" fill="#fff" anchor="middle">악순환</T>
    </svg>
  );
}

/* ── 11. 기회비용 ──────────────────────────────────── */
function OpportunityCostGraphic() {
  return (
    <svg viewBox="0 0 300 148" fill="none" width="100%" style={{ display: 'block' }}>
      <T x="150" y="13" size={10} weight="800" fill="#374151" anchor="middle">기회비용 = 포기한 최선의 가치</T>
      <rect x="30" y="28" width="80" height="56" rx="12" fill="#21C58E" />
      <T x="70" y="50" size={11} weight="800" fill="#fff" anchor="middle">A 선택</T>
      <T x="70" y="65" size={10} fill="rgba(255,255,255,0.9)" anchor="middle">대학 진학</T>
      <T x="70" y="78" size={10} fill="rgba(255,255,255,0.9)" anchor="middle">연 1000만원</T>
      <T x="120" y="57" size={16} weight="900" fill="#CBD5E1" anchor="middle">→</T>
      <rect x="136" y="28" width="80" height="56" rx="12" fill="#FAECE7" stroke="#F0997B" strokeWidth="1.5" />
      <T x="176" y="50" size={11} weight="800" fill="#92400E" anchor="middle">B 포기</T>
      <T x="176" y="65" size={10} fill="#92400E" anchor="middle">취업</T>
      <T x="176" y="78" size={10} fill="#92400E" anchor="middle">연 2000만원</T>
      <rect x="12" y="98" width="276" height="42" rx="10" fill="#FEF9EC" stroke="#FFC83D" strokeWidth="1.5" />
      <T x="150" y="116" size={11} weight="800" fill="#92400E" anchor="middle">기회비용 = 2000만원</T>
      <T x="150" y="131" size={9} fill="#B45309" anchor="middle">A를 선택함으로써 포기한 B의 가치</T>
    </svg>
  );
}

/* ── 12. 매몰비용 ──────────────────────────────────── */
function SunkCostGraphic() {
  return (
    <svg viewBox="0 0 300 148" fill="none" width="100%" style={{ display: 'block' }}>
      <T x="150" y="13" size={10} weight="800" fill="#374151" anchor="middle">매몰비용 오류 주의!</T>
      <rect x="10" y="24" width="86" height="60" rx="12" fill="#94A3B8" />
      <T x="53" y="48" size={10} weight="800" fill="#fff" anchor="middle">이미 지출</T>
      <T x="53" y="63" size={10} fill="rgba(255,255,255,0.85)" anchor="middle">100만원</T>
      <T x="53" y="76" size={9} fill="rgba(255,255,255,0.7)" anchor="middle">영화 티켓</T>
      <rect x="118" y="24" width="86" height="60" rx="12" fill="#EF4444" />
      <T x="161" y="48" size={10} weight="800" fill="#fff" anchor="middle">회수 불가</T>
      <T x="161" y="63" size={18} anchor="middle">🚫</T>
      <T x="161" y="80" size={9} fill="rgba(255,255,255,0.85)" anchor="middle">되찾을 수 없어요</T>
      <rect x="10" y="96" width="194" height="44" rx="10" fill="#F0FDF4" stroke="#21C58E" strokeWidth="1.5" />
      <T x="107" y="113" size={10} weight="800" fill="#065F46" anchor="middle">올바른 판단:</T>
      <T x="107" y="127" size={9} fill="#065F46" anchor="middle">미래 이익만 보고 결정하세요</T>
      <rect x="216" y="96" width="74" height="44" rx="10" fill="#FAECE7" stroke="#F0997B" strokeWidth="1.5" />
      <T x="253" y="113" size={9} weight="800" fill="#92400E" anchor="middle">오류:</T>
      <T x="253" y="127" size={9} fill="#92400E" anchor="middle">아까워서<br/>계속 투자</T>
    </svg>
  );
}

/* ── 13. 양적완화(QE) ───────────────────────────────── */
function QEGraphic() {
  const steps = [
    { label: '중앙은행', sub: '채권 매입', fill: '#21C58E', textFill: '#fff' },
    { label: '통화 공급', sub: '증가', fill: '#FFC83D', textFill: '#78350F' },
    { label: '금리', sub: '하락', fill: '#E1F5EE', textFill: '#065F46', stroke: '#9FE1CB' },
    { label: '경기 부양', sub: '투자·소비 ↑', fill: '#3B82F6', textFill: '#fff' },
  ];
  return (
    <svg viewBox="0 0 300 148" fill="none" width="100%" style={{ display: 'block' }}>
      <T x="150" y="13" size={10} weight="800" fill="#374151" anchor="middle">양적완화(QE) 작동 원리</T>
      {steps.map((s, i) => {
        const x = 12 + i * 73;
        return (
          <g key={s.label}>
            <rect x={x} y={26} width={62} height={72} rx={10}
              fill={s.fill} stroke={s.stroke ?? 'none'} strokeWidth={s.stroke ? 1.5 : 0} />
            <T x={x + 31} y={52} size={10} weight="800" fill={s.textFill} anchor="middle">{s.label}</T>
            <T x={x + 31} y={68} size={9} weight="700" fill={s.textFill} anchor="middle">{s.sub}</T>
            {i < steps.length - 1 && (
              <Arr x1={x + 63} y1={62} x2={x + 72} y2={62} color="#21C58E" w={2.5} />
            )}
          </g>
        );
      })}
      <rect x="12" y="110" width="276" height="28" rx="8" fill="#F0FDF4" />
      <T x="150" y="128" size={10} weight="700" fill="#065F46" anchor="middle">→ 시중 유동성 확대, 인플레이션 위험 동반</T>
    </svg>
  );
}

/* ── 14. PER ────────────────────────────────────────── */
function PERGraphic() {
  return (
    <svg viewBox="0 0 300 148" fill="none" width="100%" style={{ display: 'block' }}>
      <T x="150" y="13" size={10} weight="800" fill="#374151" anchor="middle">PER (주가수익비율) 공식</T>
      <rect x="20" y="28" width="80" height="58" rx="12" fill="#21C58E" />
      <T x="60" y="52" size={10} weight="800" fill="#fff" anchor="middle">주가</T>
      <T x="60" y="68" size={14} weight="900" fill="#fff" anchor="middle">50,000원</T>
      <T x="112" y="62" size={22} weight="900" fill="#CBD5E1" anchor="middle">÷</T>
      <rect x="128" y="28" width="80" height="58" rx="12" fill="#FFC83D" />
      <T x="168" y="48" size={10} weight="800" fill="#78350F" anchor="middle">EPS</T>
      <T x="168" y="62" size={9} fill="#92400E" anchor="middle">주당순이익</T>
      <T x="168" y="76" size={12} weight="900" fill="#78350F" anchor="middle">5,000원</T>
      <T x="218" y="62" size={22} weight="900" fill="#CBD5E1" anchor="middle">=</T>
      <rect x="232" y="22" width="62" height="70" rx="12" fill="#3B82F6" />
      <T x="263" y="48" size={10} weight="800" fill="#fff" anchor="middle">PER</T>
      <T x="263" y="65" size={16} weight="900" fill="#fff" anchor="middle">10배</T>
      <T x="263" y="82" size={9} fill="rgba(255,255,255,0.85)" anchor="middle">저평가?</T>
      <rect x="12" y="104" width="276" height="36" rx="8" fill="#FFFCEB" />
      <T x="150" y="120" size={10} weight="700" fill="#92400E" anchor="middle">PER 낮을수록 → 저평가 가능성</T>
      <T x="150" y="133" size={9} fill="#B45309" anchor="middle">업종 평균과 비교해서 판단하세요</T>
    </svg>
  );
}

/* ── 15. 무역수지 ──────────────────────────────────── */
function TradeBalanceGraphic() {
  return (
    <svg viewBox="0 0 300 148" fill="none" width="100%" style={{ display: 'block' }}>
      <T x="150" y="13" size={10} weight="800" fill="#374151" anchor="middle">무역수지 = 수출 - 수입</T>
      <rect x="10" y="26" width="130" height="78" rx="12" fill="#E1F5EE" stroke="#9FE1CB" strokeWidth="1.5" />
      <T x="75" y="48" size={10} weight="800" fill="#065F46" anchor="middle">수출 흑자</T>
      <T x="75" y="64" size={9} fill="#065F46" anchor="middle">수출 &gt; 수입</T>
      <T x="75" y="78" size={13} weight="900" fill="#21C58E" anchor="middle">+흑자</T>
      <T x="75" y="94" size={9} fill="#065F46" anchor="middle">외화 유입 ↑</T>
      <rect x="158" y="26" width="130" height="78" rx="12" fill="#FAECE7" stroke="#F0997B" strokeWidth="1.5" />
      <T x="223" y="48" size={10} weight="800" fill="#92400E" anchor="middle">수입 적자</T>
      <T x="223" y="64" size={9} fill="#92400E" anchor="middle">수출 &lt; 수입</T>
      <T x="223" y="78" size={13} weight="900" fill="#EF4444" anchor="middle">-적자</T>
      <T x="223" y="94" size={9} fill="#92400E" anchor="middle">외화 유출 ↑</T>
      <rect x="10" y="116" width="280" height="24" rx="8" fill="#F8FAFC" />
      <T x="150" y="131" size={10} weight="700" fill="#374151" anchor="middle">한국은 전통적으로 무역수지 흑자국</T>
    </svg>
  );
}

/* ── 16. 실업률 ────────────────────────────────────── */
function UnemploymentGraphic() {
  return (
    <svg viewBox="0 0 300 148" fill="none" width="100%" style={{ display: 'block' }}>
      <T x="150" y="13" size={10} weight="800" fill="#374151" anchor="middle">실업률 계산 공식</T>
      <rect x="10" y="28" width="80" height="56" rx="12" fill="#FAECE7" stroke="#F0997B" strokeWidth="1.5" />
      <T x="50" y="50" size={10} weight="800" fill="#92400E" anchor="middle">실업자 수</T>
      <T x="50" y="66" size={14} weight="900" fill="#EF4444" anchor="middle">200만</T>
      <T x="50" y="78" size={9} fill="#92400E" anchor="middle">일자리 없음</T>
      <T x="100" y="57" size={18} weight="900" fill="#CBD5E1" anchor="middle">÷</T>
      <rect x="114" y="28" width="96" height="56" rx="12" fill="#E1F5EE" stroke="#9FE1CB" strokeWidth="1.5" />
      <T x="162" y="48" size={10} weight="800" fill="#065F46" anchor="middle">경제활동인구</T>
      <T x="162" y="64" size={14} weight="900" fill="#21C58E" anchor="middle">2,700만</T>
      <T x="162" y="78" size={9} fill="#065F46" anchor="middle">취업+실업자</T>
      <T x="220" y="57" size={18} weight="900" fill="#CBD5E1" anchor="middle">=</T>
      <rect x="234" y="22" width="58" height="68" rx="12" fill="#EF4444" />
      <T x="263" y="48" size={10} weight="800" fill="#fff" anchor="middle">실업률</T>
      <T x="263" y="64" size={14} weight="900" fill="#fff" anchor="middle">7.4%</T>
      <T x="263" y="80" size={9} fill="rgba(255,255,255,0.85)" anchor="middle">높을수록 ↓</T>
      <rect x="10" y="100" width="280" height="38" rx="8" fill="#F8FAFC" />
      <T x="150" y="117" size={10} weight="700" fill="#374151" anchor="middle">실업률(%) = (실업자 ÷ 경제활동인구) × 100</T>
      <T x="150" y="130" size={9} fill="#64748B" anchor="middle">자연실업률(4~5%)은 완전고용 상태로 봄</T>
    </svg>
  );
}

/* ── 17. 공매도 ────────────────────────────────────── */
function ShortSellingGraphic() {
  const steps = [
    { label: '주식 빌림', sub: '100주', fill: '#94A3B8', textFill: '#fff' },
    { label: '고가 매도', sub: '10,000원', fill: '#EF4444', textFill: '#fff' },
    { label: '가격 하락', sub: '7,000원', fill: '#FAECE7', textFill: '#92400E', stroke: '#F0997B' },
    { label: '저가 매수', sub: '+3,000원 차익', fill: '#21C58E', textFill: '#fff' },
  ];
  return (
    <svg viewBox="0 0 300 148" fill="none" width="100%" style={{ display: 'block' }}>
      <T x="150" y="13" size={10} weight="800" fill="#374151" anchor="middle">공매도 작동 원리</T>
      {steps.map((s, i) => {
        const x = 12 + i * 73;
        return (
          <g key={s.label}>
            <rect x={x} y={26} width={62} height={72} rx={10}
              fill={s.fill} stroke={s.stroke ?? 'none'} strokeWidth={s.stroke ? 1.5 : 0} />
            <T x={x + 31} y={52} size={9} weight="800" fill={s.textFill} anchor="middle">{s.label}</T>
            <T x={x + 31} y={68} size={9} weight="700" fill={s.textFill} anchor="middle">{s.sub}</T>
            {i < steps.length - 1 && (
              <Arr x1={x + 63} y1={62} x2={x + 72} y2={62} color="#FFC83D" w={2.5} />
            )}
          </g>
        );
      })}
      <rect x="12" y="110" width="276" height="28" rx="8" fill="#FFF5F5" />
      <T x="150" y="128" size={10} weight="700" fill="#EF4444" anchor="middle">→ 하락장 이익 전략 · 무한 손실 위험 주의</T>
    </svg>
  );
}

/* ── 18. 코스피 ────────────────────────────────────── */
function KOSPIGraphic() {
  const items = [
    { name: '삼성전자', color: '#3B82F6', x: 10, y: 28, w: 74 },
    { name: 'SK하이닉스', color: '#8B5CF6', x: 10, y: 62, w: 74 },
    { name: '현대차', color: '#EF4444', x: 10, y: 96, w: 74 },
  ];
  return (
    <svg viewBox="0 0 300 148" fill="none" width="100%" style={{ display: 'block' }}>
      <T x="150" y="13" size={10} weight="800" fill="#374151" anchor="middle">코스피 지수 구성 원리</T>
      {items.map((s) => (
        <g key={s.name}>
          <rect x={s.x} y={s.y} width={s.w} height={24} rx="7" fill={s.color + '22'} stroke={s.color} strokeWidth="1.5" />
          <T x={s.x + s.w / 2} y={s.y + 15} size={9} weight="700" fill={s.color} anchor="middle">{s.name}</T>
        </g>
      ))}
      <T x="18" y="136" size={8} fill="#64748B" anchor="start">상장기업 800+</T>
      {[40, 74, 108].map((y) => (
        <Arr key={y} x1={86} y1={y} x2={134} y2={74} color="#21C58E" w={1.8} />
      ))}
      <rect x="136" y="36" width="74" height="76" rx="12" fill="#21C58E" />
      <T x="173" y="66" size={10} weight="800" fill="#fff" anchor="middle">시가총액</T>
      <T x="173" y="80" size={9} fill="rgba(255,255,255,0.85)" anchor="middle">가중 평균</T>
      <T x="173" y="95" size={9} fill="rgba(255,255,255,0.85)" anchor="middle">산출</T>
      <Arr x1={212} y1={74} x2={238} y2={74} color="#FFC83D" w={2.5} />
      <rect x="240" y="42" width="54" height="64" rx="12" fill="#FEF9EC" stroke="#FFC83D" strokeWidth="1.5" />
      <T x="267" y="66" size={10} weight="800" fill="#92400E" anchor="middle">KOSPI</T>
      <T x="267" y="82" size={10} fill="#92400E" anchor="middle">지수</T>
      <T x="267" y="97" size={9} fill="#B45309" anchor="middle">2,xxx</T>
    </svg>
  );
}

/* ── 19. 재무제표 ──────────────────────────────────── */
function FinancialStatementsGraphic() {
  return (
    <svg viewBox="0 0 300 148" fill="none" width="100%" style={{ display: 'block' }}>
      <T x="150" y="13" size={10} weight="800" fill="#374151" anchor="middle">재무제표 핵심 구성</T>
      <rect x="10" y="22" width="134" height="116" rx="12" fill="#E1F5EE" stroke="#9FE1CB" strokeWidth="1.5" />
      <T x="77" y="40" size={10} weight="800" fill="#065F46" anchor="middle">재무상태표 (B/S)</T>
      <rect x="18" y="46" width="56" height="32" rx="7" fill="#21C58E" />
      <T x="46" y="60" size={9} weight="700" fill="#fff" anchor="middle">자산</T>
      <T x="46" y="72" size={8} fill="rgba(255,255,255,0.85)" anchor="middle">현금·부동산</T>
      <rect x="80" y="46" width="56" height="14" rx="5" fill="#FAECE7" stroke="#F0997B" strokeWidth="1" />
      <T x="108" y="56" size={8} weight="700" fill="#92400E" anchor="middle">부채</T>
      <rect x="80" y="64" width="56" height="14" rx="5" fill="#FEF9EC" stroke="#FFC83D" strokeWidth="1" />
      <T x="108" y="74" size={8} weight="700" fill="#92400E" anchor="middle">자본</T>
      <T x="77" y="98" size={9} fill="#065F46" anchor="middle">자산 = 부채 + 자본</T>
      <rect x="156" y="22" width="134" height="116" rx="12" fill="#FFFCEB" stroke="#FFC83D" strokeWidth="1.5" />
      <T x="223" y="40" size={10} weight="800" fill="#92400E" anchor="middle">손익계산서 (I/S)</T>
      <rect x="164" y="46" width="118" height="20" rx="7" fill="#FFC83D" />
      <T x="223" y="59" size={9} weight="700" fill="#78350F" anchor="middle">매출 100</T>
      <rect x="164" y="70" width="118" height="20" rx="7" fill="#FAECE7" stroke="#F0997B" strokeWidth="1" />
      <T x="223" y="83" size={9} weight="700" fill="#92400E" anchor="middle">비용 70</T>
      <rect x="164" y="94" width="118" height="20" rx="7" fill="#21C58E" />
      <T x="223" y="107" size={9} weight="700" fill="#fff" anchor="middle">순이익 30</T>
      <T x="223" y="125" size={8} fill="#92400E" anchor="middle">매출 - 비용 = 이익</T>
    </svg>
  );
}

/* ── 20. 배당수익률 ────────────────────────────────── */
function DividendYieldGraphic() {
  return (
    <svg viewBox="0 0 300 148" fill="none" width="100%" style={{ display: 'block' }}>
      <T x="150" y="13" size={10} weight="800" fill="#374151" anchor="middle">배당수익률 계산 공식</T>
      <rect x="14" y="28" width="84" height="60" rx="12" fill="#21C58E" />
      <T x="56" y="52" size={10} weight="800" fill="#fff" anchor="middle">주당배당금</T>
      <T x="56" y="68" size={13} weight="900" fill="#fff" anchor="middle">2,000원</T>
      <T x="56" y="82" size={9} fill="rgba(255,255,255,0.8)" anchor="middle">DPS</T>
      <T x="110" y="60" size={20} weight="900" fill="#CBD5E1" anchor="middle">÷</T>
      <rect x="124" y="28" width="84" height="60" rx="12" fill="#FFC83D" />
      <T x="166" y="52" size={10} weight="800" fill="#78350F" anchor="middle">현재 주가</T>
      <T x="166" y="68" size={13} weight="900" fill="#78350F" anchor="middle">50,000원</T>
      <T x="166" y="82" size={9} fill="#92400E" anchor="middle">시장 가격</T>
      <T x="220" y="60" size={20} weight="900" fill="#CBD5E1" anchor="middle">=</T>
      <rect x="234" y="22" width="60" height="72" rx="12" fill="#E1F5EE" stroke="#9FE1CB" strokeWidth="1.5" />
      <T x="264" y="48" size={9} weight="700" fill="#065F46" anchor="middle">배당</T>
      <T x="264" y="60" size={9} weight="700" fill="#065F46" anchor="middle">수익률</T>
      <T x="264" y="76" size={14} weight="900" fill="#21C58E" anchor="middle">4%</T>
      <T x="264" y="88" size={8} fill="#065F46" anchor="middle">×100</T>
      <rect x="14" y="104" width="280" height="36" rx="8" fill="#F0FDF4" />
      <T x="150" y="120" size={10} weight="700" fill="#065F46" anchor="middle">배당수익률(%) = 주당배당금 ÷ 주가 × 100</T>
      <T x="150" y="133" size={9} fill="#065F46" anchor="middle">높을수록 배당 매력 ↑ (단, 주가 하락 이유 확인)</T>
    </svg>
  );
}

/* ── 21. 달러 인덱스 ────────────────────────────────── */
function DollarIndexGraphic() {
  const currencies = [
    { name: 'EUR', pct: 57.6, color: '#3B82F6' },
    { name: 'JPY', pct: 13.6, color: '#EF4444' },
    { name: 'GBP', pct: 11.9, color: '#8B5CF6' },
    { name: 'CAD', pct: 9.1, color: '#F59E0B' },
    { name: 'SEK', pct: 4.2, color: '#6B7280' },
    { name: 'CHF', pct: 3.6, color: '#10B981' },
  ];
  const barX = 24, barY = 56, barW = 252, barH = 32;
  let cursor = barX;
  return (
    <svg viewBox="0 0 300 148" fill="none" width="100%" style={{ display: 'block' }}>
      <T x="150" y="13" size={10} weight="800" fill="#374151" anchor="middle">달러 인덱스(DXY) 구성 통화</T>
      <rect x="100" y="22" width="100" height="28" rx="8" fill="#21C58E" />
      <T x="150" y="40" size={12} weight="800" fill="#fff" anchor="middle">달러($) vs 6개 통화</T>
      {currencies.map((s) => {
        const w = (s.pct / 100) * barW;
        const x = cursor;
        cursor += w;
        return (
          <g key={s.name}>
            <rect x={x} y={barY} width={w} height={barH} rx={x === barX ? 8 : x + w >= barX + barW ? 8 : 0} fill={s.color} />
            {w > 20 && <T x={x + w / 2} y={barY + barH / 2 + 4} size={8} weight="700" fill="#fff" anchor="middle">{s.name}</T>}
          </g>
        );
      })}
      <rect x="10" y="98" width="280" height="42" rx="8" fill="#F8FAFC" />
      {currencies.map((s, i) => (
        <g key={s.name}>
          <circle cx={22 + i * 46} cy="112" r="4" fill={s.color} />
          <T x={28 + i * 46} y="116" size={8} fill="#374151" anchor="start">{s.name} {s.pct}%</T>
        </g>
      ))}
      <T x="150" y="133" size={9} fill="#64748B" anchor="middle">DXY ↑ = 달러 강세 / DXY ↓ = 달러 약세</T>
    </svg>
  );
}

/* ── 22. 규모의 경제 ────────────────────────────────── */
function EconomiesOfScaleGraphic() {
  const data = [
    { qty: '100개', fixed: 60, unit: 100 },
    { qty: '500개', fixed: 60, unit: 30 },
    { qty: '1,000개', fixed: 60, unit: 15 },
    { qty: '5,000개', fixed: 60, unit: 8 },
  ];
  const base = 114, maxH = 80;
  return (
    <svg viewBox="0 0 300 148" fill="none" width="100%" style={{ display: 'block' }}>
      <T x="150" y="13" size={10} weight="800" fill="#374151" anchor="middle">규모의 경제: 생산량↑ → 단위비용↓</T>
      {data.map((d, i) => {
        const x = 18 + i * 68;
        const h = (d.unit / 100) * maxH;
        return (
          <g key={d.qty}>
            <rect x={x} y={base - h} width={44} height={h} rx="6" fill={`hsl(158, 65%, ${30 + i * 8}%)`} />
            <T x={x + 22} y={base - h - 6} size={9} weight="700" fill="#374151" anchor="middle">{d.unit}원</T>
            <T x={x + 22} y={base + 12} size={8} fill="#94A3B8" anchor="middle">{d.qty}</T>
          </g>
        );
      })}
      <line x1="14" y1={base} x2="286" y2={base} stroke="#E2E8F0" strokeWidth="1.5" />
      <rect x="14" y="128" width="272" height="16" rx="6" fill="#F0FDF4" />
      <T x="150" y="139" size={9} weight="700" fill="#065F46" anchor="middle">고정비 분산 → 단위당 비용 대폭 감소</T>
    </svg>
  );
}

/* ── 23. 자산 유형 ──────────────────────────────────── */
function AssetsGraphic() {
  const assets = [
    { label: '현금', sub: '유동성 최고', fill: '#21C58E', textFill: '#fff', emoji: '💵' },
    { label: '주식', sub: '수익성 높음', fill: '#3B82F6', textFill: '#fff', emoji: '📈' },
    { label: '부동산', sub: '안정·실물', fill: '#F59E0B', textFill: '#fff', emoji: '🏠' },
    { label: '채권', sub: '안전·이자', fill: '#8B5CF6', textFill: '#fff', emoji: '📜' },
  ];
  return (
    <svg viewBox="0 0 300 148" fill="none" width="100%" style={{ display: 'block' }}>
      <T x="150" y="13" size={10} weight="800" fill="#374151" anchor="middle">4가지 주요 자산 유형</T>
      {assets.map((a, i) => {
        const x = 12 + (i % 2) * 148;
        const y = 22 + Math.floor(i / 2) * 64;
        return (
          <g key={a.label}>
            <rect x={x} y={y} width={130} height={54} rx="10" fill={a.fill} />
            <T x={x + 32} y={y + 26} size={20} anchor="middle">{a.emoji}</T>
            <T x={x + 88} y={y + 22} size={11} weight="800" fill={a.textFill} anchor="middle">{a.label}</T>
            <T x={x + 88} y={y + 37} size={9} fill="rgba(255,255,255,0.85)" anchor="middle">{a.sub}</T>
          </g>
        );
      })}
      <rect x="12" y="150" width="276" height="0" rx="0" fill="none" />
    </svg>
  );
}

/* ── 24. 부채 ───────────────────────────────────────── */
function LiabilitiesGraphic() {
  return (
    <svg viewBox="0 0 300 148" fill="none" width="100%" style={{ display: 'block' }}>
      <T x="150" y="13" size={10} weight="800" fill="#374151" anchor="middle">부채 구조 및 부채비율</T>
      <rect x="10" y="24" width="134" height="84" rx="12" fill="#FAECE7" stroke="#F0997B" strokeWidth="1.5" />
      <T x="77" y="44" size={11} weight="800" fill="#92400E" anchor="middle">부채 = 대출금</T>
      <rect x="20" y="52" width="114" height="22" rx="7" fill="#EF4444" />
      <T x="77" y="66" size={9} weight="700" fill="#fff" anchor="middle">원금: 1억원</T>
      <rect x="20" y="78" width="114" height="22" rx="7" fill="#FAECE7" stroke="#F0997B" strokeWidth="1" />
      <T x="77" y="92" size={9} weight="700" fill="#92400E" anchor="middle">이자: 연 4%</T>
      <rect x="156" y="24" width="134" height="84" rx="12" fill="#E1F5EE" stroke="#9FE1CB" strokeWidth="1.5" />
      <T x="223" y="44" size={11} weight="800" fill="#065F46" anchor="middle">부채비율 공식</T>
      <T x="223" y="62" size={9} fill="#065F46" anchor="middle">부채 ÷ 자기자본 × 100</T>
      <rect x="164" y="70" width="118" height="30" rx="8" fill="#21C58E" />
      <T x="223" y="83" size={10} weight="800" fill="#fff" anchor="middle">100% 이하 = 양호</T>
      <T x="223" y="94" size={9} fill="rgba(255,255,255,0.85)" anchor="middle">200%+ = 위험 신호</T>
      <rect x="10" y="118" width="280" height="24" rx="8" fill="#FFF5F5" />
      <T x="150" y="133" size={10} weight="700" fill="#EF4444" anchor="middle">→ 과도한 부채는 재무 위기 위험 증가</T>
    </svg>
  );
}

/* ── 25. 경상수지 ──────────────────────────────────── */
function CurrentAccountGraphic() {
  const items = [
    { label: '무역수지', sub: '상품 수출입', color: '#21C58E', x: 10, y: 28 },
    { label: '서비스수지', sub: '관광·특허', color: '#3B82F6', x: 156, y: 28 },
    { label: '소득수지', sub: '임금·배당', color: '#8B5CF6', x: 10, y: 86 },
    { label: '이전수지', sub: '해외 송금', color: '#F59E0B', x: 156, y: 86 },
  ];
  return (
    <svg viewBox="0 0 300 148" fill="none" width="100%" style={{ display: 'block' }}>
      <T x="150" y="13" size={10} weight="800" fill="#374151" anchor="middle">경상수지 = 4가지 수지 합계</T>
      {items.map((s) => (
        <g key={s.label}>
          <rect x={s.x} y={s.y} width={130} height={48} rx="10"
            fill={s.color + '22'} stroke={s.color} strokeWidth="1.5" />
          <T x={s.x + 65} y={s.y + 20} size={10} weight="800" fill={s.color} anchor="middle">{s.label}</T>
          <T x={s.x + 65} y={s.y + 35} size={9} fill={s.color} anchor="middle">{s.sub}</T>
        </g>
      ))}
      <T x="150" y="144" size={10} weight="700" fill="#374151" anchor="middle">합계 흑자 → 외화 순유입</T>
    </svg>
  );
}

/* ── 26. 소득세 ────────────────────────────────────── */
function IncomeTaxGraphic() {
  const brackets = [
    { label: '~1,400만', rate: 6, color: '#21C58E' },
    { label: '~5,000만', rate: 15, color: '#FFC83D' },
    { label: '~8,800만', rate: 24, color: '#F59E0B' },
    { label: '~1.5억', rate: 35, color: '#EF4444' },
  ];
  const base = 112, maxH = 72;
  return (
    <svg viewBox="0 0 300 148" fill="none" width="100%" style={{ display: 'block' }}>
      <T x="150" y="13" size={10} weight="800" fill="#374151" anchor="middle">소득세 누진세율 구조</T>
      {brackets.map((b, i) => {
        const h = (b.rate / 35) * maxH;
        const x = 22 + i * 68;
        return (
          <g key={b.label}>
            <rect x={x} y={base - h} width={50} height={h} rx="6" fill={b.color} />
            <T x={x + 25} y={base - h - 6} size={9} weight="700" fill="#374151" anchor="middle">{b.rate}%</T>
            <T x={x + 25} y={base + 12} size={8} fill="#64748B" anchor="middle">{b.label}</T>
          </g>
        );
      })}
      <line x1="14" y1={base} x2="286" y2={base} stroke="#E2E8F0" strokeWidth="1.5" />
      <T x="14" y="16" size={8} fill="#94A3B8" anchor="start">세율</T>
      <rect x="14" y="128" width="272" height="16" rx="6" fill="#FFFCEB" />
      <T x="150" y="139" size={9} weight="700" fill="#92400E" anchor="middle">소득이 높을수록 더 높은 세율 적용</T>
    </svg>
  );
}

/* ── 27. 가처분소득 ─────────────────────────────────── */
function DisposableIncomeGraphic() {
  return (
    <svg viewBox="0 0 300 148" fill="none" width="100%" style={{ display: 'block' }}>
      <T x="150" y="13" size={10} weight="800" fill="#374151" anchor="middle">가처분소득 계산</T>
      <rect x="10" y="26" width="80" height="64" rx="12" fill="#21C58E" />
      <T x="50" y="50" size={10} weight="800" fill="#fff" anchor="middle">총소득</T>
      <T x="50" y="65" size={13} weight="900" fill="#fff" anchor="middle">400만</T>
      <T x="50" y="80" size={9} fill="rgba(255,255,255,0.8)" anchor="middle">월급여</T>
      <T x="102" y="60" size={16} weight="900" fill="#EF4444" anchor="middle">−</T>
      <rect x="112" y="26" width="80" height="30" rx="8" fill="#FAECE7" stroke="#F0997B" strokeWidth="1" />
      <T x="152" y="44" size={9} weight="700" fill="#92400E" anchor="middle">소득세 35만</T>
      <rect x="112" y="60" width="80" height="30" rx="8" fill="#FAECE7" stroke="#F0997B" strokeWidth="1" />
      <T x="152" y="78" size={9} weight="700" fill="#92400E" anchor="middle">4대보험 30만</T>
      <T x="204" y="60" size={16} weight="900" fill="#21C58E" anchor="middle">=</T>
      <rect x="212" y="22" width="78" height="72" rx="12" fill="#FFC83D" />
      <T x="251" y="48" size={10} weight="800" fill="#78350F" anchor="middle">가처분</T>
      <T x="251" y="63" size={10} weight="800" fill="#78350F" anchor="middle">소득</T>
      <T x="251" y="80" size={13} weight="900" fill="#78350F" anchor="middle">335만</T>
      <rect x="10" y="104" width="280" height="36" rx="8" fill="#F0FDF4" />
      <T x="150" y="120" size={10} weight="700" fill="#065F46" anchor="middle">가처분소득 = 총소득 − 세금 − 4대보험</T>
      <T x="150" y="133" size={9} fill="#065F46" anchor="middle">실제 소비·저축에 사용 가능한 소득</T>
    </svg>
  );
}

/* ── 28. S&P 500 ────────────────────────────────────── */
function SP500Graphic() {
  const sectors = [
    { label: 'IT', color: '#3B82F6', pct: 29 },
    { label: '헬스케어', color: '#21C58E', pct: 13 },
    { label: '금융', color: '#F59E0B', pct: 13 },
    { label: '소비재', color: '#8B5CF6', pct: 10 },
    { label: '기타', color: '#94A3B8', pct: 35 },
  ];
  const barX = 24, barY = 56, barW = 252, barH = 32;
  let cursor = barX;
  return (
    <svg viewBox="0 0 300 148" fill="none" width="100%" style={{ display: 'block' }}>
      <T x="150" y="13" size={10} weight="800" fill="#374151" anchor="middle">S&P 500 = 미국 500대 기업 지수</T>
      <rect x="60" y="22" width="180" height="26" rx="8" fill="#3B82F6" />
      <T x="150" y="39" size={11} weight="800" fill="#fff" anchor="middle">시가총액 가중 평균 산출</T>
      {sectors.map((s) => {
        const w = (s.pct / 100) * barW;
        const x = cursor;
        cursor += w;
        return (
          <g key={s.label}>
            <rect x={x} y={barY} width={w} height={barH} rx={x === barX ? 8 : x + w >= barX + barW ? 8 : 0} fill={s.color} />
            {w > 20 && <T x={x + w / 2} y={barY + barH / 2 + 4} size={8} weight="700" fill="#fff" anchor="middle">{s.label}</T>}
          </g>
        );
      })}
      <rect x="10" y="98" width="280" height="44" rx="8" fill="#F8FAFC" />
      {sectors.map((s, i) => (
        <g key={s.name}>
          <circle cx={22 + i * 54} cy="112" r="4" fill={s.color} />
          <T x={28 + i * 54} y="116" size={8} fill="#374151" anchor="start">{s.label} {s.pct}%</T>
        </g>
      ))}
      <T x="150" y="135" size={9} fill="#64748B" anchor="middle">미국 주식시장 시총의 약 80% 커버</T>
    </svg>
  );
}

/* ── 29. 금(Gold) ──────────────────────────────────── */
function GoldGraphic() {
  const roles = [
    { label: '안전자산', sub: '위기 시 가치 유지', fill: '#FFC83D', textFill: '#78350F', emoji: '🛡️' },
    { label: '실물자산', sub: '실물 기반 가치', fill: '#F59E0B', textFill: '#fff', emoji: '🥇' },
    { label: '인플레 헤지', sub: '물가 상승 방어', fill: '#EF4444', textFill: '#fff', emoji: '📈' },
  ];
  return (
    <svg viewBox="0 0 300 148" fill="none" width="100%" style={{ display: 'block' }}>
      <T x="150" y="13" size={10} weight="800" fill="#374151" anchor="middle">금(Gold)의 3가지 역할</T>
      {roles.map((r, i) => (
        <g key={r.label}>
          <rect x={12 + i * 96} y={24} width={84} height={84} rx="12" fill={r.fill} />
          <T x={12 + i * 96 + 42} y={52} size={20} anchor="middle">{r.emoji}</T>
          <T x={12 + i * 96 + 42} y={72} size={10} weight="800" fill={r.textFill} anchor="middle">{r.label}</T>
          <T x={12 + i * 96 + 42} y={87} size={8} fill={r.textFill} anchor="middle">{r.sub}</T>
        </g>
      ))}
      <rect x="12" y="118" width="276" height="24" rx="8" fill="#FFFCEB" />
      <T x="150" y="133" size={10} weight="700" fill="#92400E" anchor="middle">→ 포트폴리오 5~10% 금 편입 권장</T>
    </svg>
  );
}

/* ── 30. 긴축정책 ──────────────────────────────────── */
function AusterityGraphic() {
  return (
    <svg viewBox="0 0 300 148" fill="none" width="100%" style={{ display: 'block' }}>
      <T x="150" y="13" size={10} weight="800" fill="#374151" anchor="middle">긴축정책 작동 구조</T>
      <rect x="10" y="26" width="118" height="50" rx="10" fill="#FAECE7" stroke="#F0997B" strokeWidth="1.5" />
      <T x="69" y="46" size={10} weight="800" fill="#92400E" anchor="middle">정부 지출 ↓</T>
      <T x="69" y="62" size={9} fill="#92400E" anchor="middle">재정 축소</T>
      <rect x="10" y="84" width="118" height="50" rx="10" fill="#FAECE7" stroke="#F0997B" strokeWidth="1.5" />
      <T x="69" y="104" size={10} weight="800" fill="#92400E" anchor="middle">금리 인상 ↑</T>
      <T x="69" y="120" size={9} fill="#92400E" anchor="middle">대출 억제</T>
      <Arr x1={130} y1={42} x2={164} y2={66} color="#21C58E" w={2} />
      <Arr x1={130} y1={106} x2={164} y2={82} color="#21C58E" w={2} />
      <rect x="166" y="48" width="70" height="48" rx="10" fill="#E1F5EE" stroke="#9FE1CB" strokeWidth="1.5" />
      <T x="201" y="68" size={10} weight="800" fill="#065F46" anchor="middle">통화량</T>
      <T x="201" y="83" size={9} fill="#065F46" anchor="middle">감소</T>
      <Arr x1={238} y1={72} x2={262} y2={72} color="#21C58E" w={2.5} />
      <rect x="264" y="48" width="28" height="48" rx="8" fill="#21C58E" />
      <T x="278" y="68" size={9} weight="700" fill="#fff" anchor="middle">물가</T>
      <T x="278" y="82" size={9} weight="700" fill="#fff" anchor="middle">안정</T>
      <rect x="10" y="144" width="0" height="0" fill="none" />
    </svg>
  );
}

/* ── 31. 부가가치세(VAT) ─────────────────────────────── */
function VATGraphic() {
  const stages = [
    { label: '제조업체', sub: '원가 100원', tax: '10원 납부', fill: '#21C58E', textFill: '#fff', x: 10 },
    { label: '도매상', sub: '판가 200원', tax: '10원 납부', fill: '#FFC83D', textFill: '#78350F', x: 106 },
    { label: '소매상', sub: '판가 300원', tax: '10원 납부', fill: '#3B82F6', textFill: '#fff', x: 202 },
  ];
  return (
    <svg viewBox="0 0 300 148" fill="none" width="100%" style={{ display: 'block' }}>
      <T x="150" y="13" size={10} weight="800" fill="#374151" anchor="middle">부가가치세(VAT) 10% 단계별 부과</T>
      {stages.map((s, i) => (
        <g key={s.label}>
          <rect x={s.x} y={26} width={88} height={76} rx="10" fill={s.fill} />
          <T x={s.x + 44} y={48} size={10} weight="800" fill={s.textFill} anchor="middle">{s.label}</T>
          <T x={s.x + 44} y={63} size={9} fill={s.textFill} anchor="middle">{s.sub}</T>
          <rect x={s.x + 8} y={70} width={72} height={22} rx="6" fill="rgba(0,0,0,0.15)" />
          <T x={s.x + 44} y={84} size={9} weight="700" fill="#fff" anchor="middle">VAT {s.tax}</T>
          {i < stages.length - 1 && (
            <Arr x1={s.x + 89} y1={64} x2={s.x + 104} y2={64} color="#FFC83D" w={2.5} />
          )}
        </g>
      ))}
      <rect x="10" y="112" width="280" height="30" rx="8" fill="#F0FDF4" />
      <T x="150" y="127" size={10} weight="700" fill="#065F46" anchor="middle">최종 소비자가 전체 VAT 부담</T>
      <T x="150" y="139" size={9} fill="#065F46" anchor="middle">각 단계에서 세금 분담 후 국가 납부</T>
    </svg>
  );
}

/* ── 32. 할인율 ────────────────────────────────────── */
function DiscountRateGraphic() {
  return (
    <svg viewBox="0 0 300 148" fill="none" width="100%" style={{ display: 'block' }}>
      <T x="150" y="13" size={10} weight="800" fill="#374151" anchor="middle">할인율 — 미래 가치의 현재화</T>
      <rect x="186" y="26" width="102" height="64" rx="12" fill="#FFC83D" />
      <T x="237" y="48" size={10} weight="800" fill="#78350F" anchor="middle">미래 가치</T>
      <T x="237" y="64" size={15} weight="900" fill="#78350F" anchor="middle">100만원</T>
      <T x="237" y="80" size={9} fill="#92400E" anchor="middle">3년 후</T>
      <rect x="100" y="38" width="80" height="44" rx="10" fill="#E1F5EE" stroke="#9FE1CB" strokeWidth="1.5" />
      <T x="140" y="56" size={9} weight="700" fill="#065F46" anchor="middle">할인율 10%</T>
      <T x="140" y="70" size={9} fill="#065F46" anchor="middle">÷ (1+0.1)³</T>
      <Arr x1={184} y1={58} x2={182} y2={58} color="#21C58E" w={2.5} />
      <Arr x1={99} y1={58} x2={74} y2={58} color="#21C58E" w={2.5} />
      <rect x="10" y="26" width="88" height="64" rx="12" fill="#21C58E" />
      <T x="54" y="48" size={10} weight="800" fill="#fff" anchor="middle">현재 가치</T>
      <T x="54" y="64" size={14} weight="900" fill="#fff" anchor="middle">75.1만원</T>
      <T x="54" y="80" size={9} fill="rgba(255,255,255,0.85)" anchor="middle">현재 기준</T>
      <rect x="10" y="104" width="280" height="36" rx="8" fill="#FFFCEB" />
      <T x="150" y="120" size={10} weight="700" fill="#92400E" anchor="middle">PV = FV ÷ (1 + r)ⁿ</T>
      <T x="150" y="133" size={9} fill="#B45309" anchor="middle">할인율 높을수록 현재가치 낮아짐</T>
    </svg>
  );
}

/* ── 33. 신용등급 ──────────────────────────────────── */
function CreditRatingGraphic() {
  const grades = [
    { grade: 'AAA', desc: '최우량', fill: '#21C58E', textFill: '#fff', y: 22, w: 210 },
    { grade: 'AA', desc: '우량', fill: '#3B82F6', textFill: '#fff', y: 50, w: 180 },
    { grade: 'A', desc: '양호', fill: '#8B5CF6', textFill: '#fff', y: 78, w: 148 },
    { grade: 'BBB', desc: '투자적격', fill: '#F59E0B', textFill: '#fff', y: 106, w: 116 },
    { grade: 'BB~D', desc: '투기·부도', fill: '#EF4444', textFill: '#fff', y: 118, w: 84 },
  ];
  return (
    <svg viewBox="0 0 300 148" fill="none" width="100%" style={{ display: 'block' }}>
      <T x="150" y="14" size={10} weight="800" fill="#374151" anchor="middle">신용등급 피라미드</T>
      {grades.map((g) => {
        const x = (300 - g.w) / 2;
        return (
          <g key={g.grade}>
            <rect x={x} y={g.y} width={g.w} height={g.grade === 'BB~D' ? 22 : 24} rx="6" fill={g.fill} />
            <T x={150} y={g.y + (g.grade === 'BB~D' ? 15 : 16)} size={10} weight="800" fill={g.textFill} anchor="middle">
              {g.grade}  {g.desc}
            </T>
          </g>
        );
      })}
      <rect x="10" y="144" width="80" height="0" fill="none" />
      <T x="14" y="48" size={8} fill="#21C58E" anchor="start">투자</T>
      <T x="14" y="128" size={8} fill="#EF4444" anchor="start">투기</T>
    </svg>
  );
}

/* ── 34. PBR ────────────────────────────────────────── */
function PBRGraphic() {
  return (
    <svg viewBox="0 0 300 148" fill="none" width="100%" style={{ display: 'block' }}>
      <T x="150" y="13" size={10} weight="800" fill="#374151" anchor="middle">PBR (주가순자산비율) 공식</T>
      <rect x="14" y="28" width="82" height="60" rx="12" fill="#21C58E" />
      <T x="55" y="52" size={10} weight="800" fill="#fff" anchor="middle">주가</T>
      <T x="55" y="68" size={14} weight="900" fill="#fff" anchor="middle">10,000원</T>
      <T x="55" y="82" size={9} fill="rgba(255,255,255,0.8)" anchor="middle">시장가격</T>
      <T x="108" y="62" size={20} weight="900" fill="#CBD5E1" anchor="middle">÷</T>
      <rect x="122" y="28" width="82" height="60" rx="12" fill="#FFC83D" />
      <T x="163" y="48" size={10} weight="800" fill="#78350F" anchor="middle">BPS</T>
      <T x="163" y="62" size={9} fill="#92400E" anchor="middle">주당순자산</T>
      <T x="163" y="76" size={12} weight="900" fill="#78350F" anchor="middle">8,000원</T>
      <T x="216" y="62" size={20} weight="900" fill="#CBD5E1" anchor="middle">=</T>
      <rect x="230" y="22" width="62" height="72" rx="12" fill="#3B82F6" />
      <T x="261" y="48" size={10} weight="800" fill="#fff" anchor="middle">PBR</T>
      <T x="261" y="64" size={15} weight="900" fill="#fff" anchor="middle">1.25배</T>
      <T x="261" y="80" size={9} fill="rgba(255,255,255,0.85)" anchor="middle">1배=장부가</T>
      <rect x="14" y="106" width="276" height="36" rx="8" fill="#FFFCEB" />
      <T x="150" y="121" size={10} weight="700" fill="#92400E" anchor="middle">{'PBR 1 미만 = 주가 < 순자산 (저평가)'}</T>
      <T x="150" y="134" size={9} fill="#B45309" anchor="middle">청산 가치 이하로 거래되는 상황</T>
    </svg>
  );
}

/* ── 35. 경제적 해자 ────────────────────────────────── */
function EconomicMoatGraphic() {
  return (
    <svg viewBox="0 0 300 148" fill="none" width="100%" style={{ display: 'block' }}>
      <T x="150" y="13" size={10} weight="800" fill="#374151" anchor="middle">경제적 해자 (Economic Moat)</T>
      <circle cx="150" cy="80" r="38" fill="#21C58E" />
      <T x="150" y="74" size={10} weight="800" fill="#fff" anchor="middle">핵심</T>
      <T x="150" y="88" size={10} weight="800" fill="#fff" anchor="middle">기업 가치</T>
      <circle cx="150" cy="80" r="54" fill="none" stroke="#FFC83D" strokeWidth="4" strokeDasharray="6 4" />
      <T x="150" y="26" size={9} weight="700" fill="#FFC83D" anchor="middle">해자(보호막)</T>
      {[
        { label: '특허', x: 204, y: 42 },
        { label: '브랜드', x: 228, y: 80 },
        { label: '네트워크', x: 204, y: 118 },
        { label: '비용우위', x: 72, y: 118 },
        { label: '전환비용', x: 48, y: 80 },
      ].map((m) => (
        <g key={m.label}>
          <rect x={m.x - 24} y={m.y - 12} width={48} height={22} rx="6" fill="#FEF9EC" stroke="#FFC83D" strokeWidth="1" />
          <T x={m.x} y={m.y + 3} size={9} weight="700" fill="#92400E" anchor="middle">{m.label}</T>
        </g>
      ))}
    </svg>
  );
}

/* ── 36. 4대보험 ────────────────────────────────────── */
function FourInsurancesGraphic() {
  const ins = [
    { label: '국민연금', sub: '노후 소득 보장', fill: '#21C58E', textFill: '#fff', emoji: '👴' },
    { label: '건강보험', sub: '의료비 보장', fill: '#3B82F6', textFill: '#fff', emoji: '🏥' },
    { label: '고용보험', sub: '실업급여', fill: '#F59E0B', textFill: '#fff', emoji: '💼' },
    { label: '산재보험', sub: '업무상 재해', fill: '#EF4444', textFill: '#fff', emoji: '⛑️' },
  ];
  return (
    <svg viewBox="0 0 300 148" fill="none" width="100%" style={{ display: 'block' }}>
      <T x="150" y="13" size={10} weight="800" fill="#374151" anchor="middle">4대 사회보험 구조</T>
      {ins.map((s, i) => {
        const x = 12 + (i % 2) * 148;
        const y = 22 + Math.floor(i / 2) * 64;
        return (
          <g key={s.label}>
            <rect x={x} y={y} width={130} height={54} rx="10" fill={s.fill} />
            <T x={x + 26} y={y + 30} size={20} anchor="middle">{s.emoji}</T>
            <T x={x + 88} y={y + 22} size={10} weight="800" fill={s.textFill} anchor="middle">{s.label}</T>
            <T x={x + 88} y={y + 37} size={9} fill="rgba(255,255,255,0.85)" anchor="middle">{s.sub}</T>
          </g>
        );
      })}
      <T x="150" y="143" size={9} fill="#374151" anchor="middle">사용자+근로자 공동 부담</T>
    </svg>
  );
}

/* ── 37. 시가총액 ──────────────────────────────────── */
function MarketCapGraphic() {
  return (
    <svg viewBox="0 0 300 148" fill="none" width="100%" style={{ display: 'block' }}>
      <T x="150" y="13" size={10} weight="800" fill="#374151" anchor="middle">시가총액 계산 공식</T>
      <rect x="10" y="28" width="96" height="62" rx="12" fill="#21C58E" />
      <T x="58" y="52" size={10} weight="800" fill="#fff" anchor="middle">주가</T>
      <T x="58" y="68" size={14} weight="900" fill="#fff" anchor="middle">70,000원</T>
      <T x="58" y="82" size={9} fill="rgba(255,255,255,0.8)" anchor="middle">현재 주식 가격</T>
      <T x="116" y="61" size={20} weight="900" fill="#CBD5E1" anchor="middle">×</T>
      <rect x="126" y="28" width="96" height="62" rx="12" fill="#FFC83D" />
      <T x="174" y="52" size={10} weight="800" fill="#78350F" anchor="middle">발행주식수</T>
      <T x="174" y="68" size={14} weight="900" fill="#78350F" anchor="middle">59억주</T>
      <T x="174" y="82" size={9} fill="#92400E" anchor="middle">총 발행 주식</T>
      <T x="232" y="61" size={20} weight="900" fill="#CBD5E1" anchor="middle">=</T>
      <rect x="240" y="22" width="52" height="74" rx="12" fill="#3B82F6" />
      <T x="266" y="52" size={9} weight="800" fill="#fff" anchor="middle">시가</T>
      <T x="266" y="64" size={9} weight="800" fill="#fff" anchor="middle">총액</T>
      <T x="266" y="78" size={11} weight="900" fill="#fff" anchor="middle">413조</T>
      <T x="266" y="90" size={8} fill="rgba(255,255,255,0.8)" anchor="middle">원</T>
      <rect x="10" y="104" width="280" height="36" rx="8" fill="#F8FAFC" />
      <T x="150" y="120" size={10} weight="700" fill="#374151" anchor="middle">시가총액 = 주가 × 발행주식수</T>
      <T x="150" y="133" size={9} fill="#64748B" anchor="middle">기업의 시장 평가 총가치</T>
    </svg>
  );
}

/* ── 38. 전세 ───────────────────────────────────────── */
function JeonseGraphic() {
  const steps = [
    { label: '전세금 예치', sub: '2억~수억원', fill: '#21C58E', textFill: '#fff' },
    { label: '거주권 취득', sub: '계약 기간', fill: '#fff', textFill: '#065F46', stroke: '#21C58E' },
    { label: '2년 거주', sub: '월세 없음', fill: '#E1F5EE', textFill: '#065F46', stroke: '#9FE1CB' },
    { label: '전세금 반환', sub: '만기 후 100%', fill: '#FFC83D', textFill: '#78350F' },
  ];
  return (
    <svg viewBox="0 0 300 148" fill="none" width="100%" style={{ display: 'block' }}>
      <T x="150" y="13" size={10} weight="800" fill="#374151" anchor="middle">한국 전세 제도 구조</T>
      {steps.map((s, i) => {
        const x = 12 + i * 73;
        return (
          <g key={s.label}>
            <rect x={x} y={26} width={62} height={72} rx={10}
              fill={s.fill} stroke={s.stroke ?? 'none'} strokeWidth={s.stroke ? 1.5 : 0} />
            <T x={x + 31} y={52} size={9} weight="800" fill={s.textFill} anchor="middle">{s.label}</T>
            <T x={x + 31} y={68} size={8} weight="700" fill={s.textFill} anchor="middle">{s.sub}</T>
            {i < steps.length - 1 && (
              <Arr x1={x + 63} y1={62} x2={x + 72} y2={62} color="#21C58E" w={2.5} />
            )}
          </g>
        );
      })}
      <rect x="12" y="110" width="276" height="28" rx="8" fill="#F0FDF4" />
      <T x="150" y="128" size={10} weight="700" fill="#065F46" anchor="middle">→ 월 이자 없이 거주 · 역전세 위험 주의</T>
    </svg>
  );
}

/* ── 39. 리밸런싱 ──────────────────────────────────── */
function RebalancingGraphic() {
  return (
    <svg viewBox="0 0 300 148" fill="none" width="100%" style={{ display: 'block' }}>
      <T x="150" y="13" size={10} weight="800" fill="#374151" anchor="middle">리밸런싱 프로세스</T>
      <rect x="10" y="26" width="80" height="64" rx="12" fill="#21C58E" />
      <T x="50" y="48" size={10} weight="800" fill="#fff" anchor="middle">목표비율</T>
      <T x="50" y="63" size={9} fill="#fff" anchor="middle">주식 60%</T>
      <T x="50" y="76" size={9} fill="#fff" anchor="middle">채권 40%</T>
      <T x="50" y="84" size={9} fill="rgba(255,255,255,0.8)" anchor="middle">설정</T>
      <Arr x1={92} y1={58} x2={118} y2={58} color="#FFC83D" w={2.5} />
      <rect x="120" y="26" width="80" height="64" rx="12" fill="#FAECE7" stroke="#F0997B" strokeWidth="1.5" />
      <T x="160" y="48" size={10} weight="800" fill="#92400E" anchor="middle">시장 변동</T>
      <T x="160" y="63" size={9} fill="#92400E" anchor="middle">주식 75%</T>
      <T x="160" y="76" size={9} fill="#92400E" anchor="middle">채권 25%</T>
      <T x="160" y="84" size={9} fill="#B45309" anchor="middle">이탈!</T>
      <Arr x1={202} y1={58} x2={226} y2={58} color="#FFC83D" w={2.5} />
      <rect x="228" y="26" width="64" height="64" rx="12" fill="#E1F5EE" stroke="#9FE1CB" strokeWidth="1.5" />
      <T x="260" y="50" size={10} weight="800" fill="#065F46" anchor="middle">재조정</T>
      <T x="260" y="65" size={9} fill="#065F46" anchor="middle">주식 매도</T>
      <T x="260" y="79" size={9} fill="#065F46" anchor="middle">채권 매수</T>
      <rect x="10" y="104" width="280" height="36" rx="8" fill="#F0FDF4" />
      <T x="150" y="120" size={10} weight="700" fill="#065F46" anchor="middle">→ 목표 비율 복원 → 리스크 관리</T>
      <T x="150" y="133" size={9} fill="#065F46" anchor="middle">보통 분기 또는 연 1~2회 실시</T>
    </svg>
  );
}

/* ── 40. 인플레이션 헤지 ─────────────────────────────── */
function InflationHedgeGraphic() {
  return (
    <svg viewBox="0 0 300 148" fill="none" width="100%" style={{ display: 'block' }}>
      <T x="150" y="13" size={10} weight="800" fill="#374151" anchor="middle">인플레이션 헤지 전략</T>
      <rect x="100" y="24" width="100" height="34" rx="10" fill="#EF4444" />
      <T x="150" y="42" size={11} weight="800" fill="#fff" anchor="middle">물가 상승 ↑</T>
      <T x="150" y="52" size={9} fill="rgba(255,255,255,0.85)" anchor="middle">실질자산 가치 감소</T>
      <Arr x1={90} y1={72} x2={74} y2={86} color="#FFC83D" w={2} />
      <Arr x1={150} y1={60} x2={150} y2={80} color="#FFC83D" w={2} />
      <Arr x1={210} y1={72} x2={226} y2={86} color="#FFC83D" w={2} />
      <rect x="10" y="86" width="76" height="46" rx="10" fill="#FFC83D" />
      <T x="48" y="106" size={10} weight="800" fill="#78350F" anchor="middle">금(Gold)</T>
      <T x="48" y="120" size={9} fill="#92400E" anchor="middle">안전자산</T>
      <rect x="112" y="86" width="76" height="46" rx="10" fill="#F59E0B" />
      <T x="150" y="106" size={10} weight="800" fill="#fff" anchor="middle">부동산</T>
      <T x="150" y="120" size={9} fill="rgba(255,255,255,0.85)" anchor="middle">실물자산</T>
      <rect x="214" y="86" width="76" height="46" rx="10" fill="#3B82F6" />
      <T x="252" y="106" size={10} weight="800" fill="#fff" anchor="middle">TIPS</T>
      <T x="252" y="120" size={9} fill="rgba(255,255,255,0.85)" anchor="middle">물가연동채</T>
      <rect x="10" y="140" width="280" height="0" fill="none" />
    </svg>
  );
}

/* ── 인포그래픽 매핑 ──────────────────────────────── */
export const BITE_INFOGRAPHICS = {
  '기준금리':   { graphic: KijunGraphic,      bg: '#FFFCEB' },
  'ETF':       { graphic: ETFGraphic,        bg: '#F0FDF4' },
  '복리':      { graphic: CompoundGraphic,   bg: '#F0FDF4' },
  '인플레이션': { graphic: InflationGraphic,  bg: '#FFF5F5' },
  '배당금':    { graphic: DividendGraphic,   bg: '#F0FDF4' },
  '채권':      { graphic: BondGraphic,       bg: '#F0F9FF' },
  '자산배분':  { graphic: AllocationGraphic, bg: '#F0FDF4' },
  '수요와 공급': { graphic: SupplyDemandGraphic, bg: '#F8FAFC' },
  '환율':      { graphic: ExchangeRateGraphic, bg: '#F0FDF4' },
  '비상금':    { graphic: EmergencyFundGraphic, bg: '#FFFCEB' },
  '예금':      { graphic: DepositGraphic,    bg: '#F0FDF4' },
  '유동성':    { graphic: LiquidityGraphic,  bg: '#F8FAFC' },
  '레버리지':  { graphic: LeverageGraphic,   bg: '#FFF5F5' },
  '퇴직연금':  { graphic: RetirementGraphic, bg: '#F0FDF4' },
  'GDP':         { graphic: GDPGraphic,         bg: '#F0F9FF' },
  '인덱스 펀드':  { graphic: IndexFundGraphic,  bg: '#F0FDF4' },
  '주식':        { graphic: StockGraphic,       bg: '#EFF6FF' },
  '적금':        { graphic: SavingsGraphic,     bg: '#F0FDF4' },
  '금리 인상':   { graphic: RateHikeGraphic,    bg: '#F0FDF4' },
  '금리 인하':   { graphic: RateCutGraphic,     bg: '#FFFCEB' },
  '디플레이션':  { graphic: DeflationGraphic,   bg: '#FFF5F5' },
  'CPI':         { graphic: CPIGraphic,          bg: '#F8FAFC' },
  '연금':        { graphic: PensionGraphic,      bg: '#F0FDF4' },
  '청약':        { graphic: CheongyakGraphic,    bg: '#F0FDF4' },
  '포트폴리오':  { graphic: PortfolioGraphic,    bg: '#F0FDF4' },
  '스태그플레이션': { graphic: StagflationGraphic, bg: '#FFF5F5' },
  '수익률':      { graphic: ReturnRateGraphic,   bg: '#FFFCEB' },
  '단리':        { graphic: SimpleInterestGraphic, bg: '#F0FDF4' },
  '펀드':        { graphic: FundGraphic,         bg: '#F0FDF4' },
  '경기침체':    { graphic: RecessionGraphic,    bg: '#FFF5F5' },
  '기회비용':    { graphic: OpportunityCostGraphic, bg: '#F8FAFC' },
  '매몰비용':    { graphic: SunkCostGraphic,     bg: '#FFF5F5' },
  '양적완화':    { graphic: QEGraphic,           bg: '#F0FDF4' },
  'PER':         { graphic: PERGraphic,          bg: '#FFFCEB' },
  '무역수지':    { graphic: TradeBalanceGraphic, bg: '#F8FAFC' },
  '실업률':      { graphic: UnemploymentGraphic, bg: '#FFF5F5' },
  '공매도':      { graphic: ShortSellingGraphic, bg: '#FFF5F5' },
  '코스피':      { graphic: KOSPIGraphic,        bg: '#F8FAFC' },
  '재무제표':    { graphic: FinancialStatementsGraphic, bg: '#F8FAFC' },
  '배당수익률':  { graphic: DividendYieldGraphic, bg: '#FFFCEB' },
  '달러 인덱스': { graphic: DollarIndexGraphic,  bg: '#F8FAFC' },
  '규모의 경제': { graphic: EconomiesOfScaleGraphic, bg: '#F0FDF4' },
  '자산':        { graphic: AssetsGraphic,       bg: '#FFFCEB' },
  '부채':        { graphic: LiabilitiesGraphic,  bg: '#FFF5F5' },
  '경상수지':    { graphic: CurrentAccountGraphic, bg: '#F8FAFC' },
  '소득세':      { graphic: IncomeTaxGraphic,    bg: '#FFFCEB' },
  '가처분소득':  { graphic: DisposableIncomeGraphic, bg: '#F0FDF4' },
  'S&P 500':     { graphic: SP500Graphic,        bg: '#F8FAFC' },
  '금':          { graphic: GoldGraphic,         bg: '#FFFCEB' },
  '긴축정책':    { graphic: AusterityGraphic,    bg: '#FFF5F5' },
  '부가가치세':  { graphic: VATGraphic,          bg: '#F8FAFC' },
  '할인율':      { graphic: DiscountRateGraphic, bg: '#FFFCEB' },
  '신용등급':    { graphic: CreditRatingGraphic, bg: '#F8FAFC' },
  'PBR':         { graphic: PBRGraphic,          bg: '#FFFCEB' },
  '경제적 해자': { graphic: EconomicMoatGraphic, bg: '#FFFCEB' },
  '4대보험':     { graphic: FourInsurancesGraphic, bg: '#F0FDF4' },
  '시가총액':    { graphic: MarketCapGraphic,    bg: '#FFFCEB' },
  '전세':        { graphic: JeonseGraphic,       bg: '#F0FDF4' },
  '리밸런싱':    { graphic: RebalancingGraphic,  bg: '#F0FDF4' },
  '인플레이션 헤지': { graphic: InflationHedgeGraphic, bg: '#FFFCEB' },
};

export function getBiteInfographic(title) {
  return BITE_INFOGRAPHICS[title] ?? null;
}
