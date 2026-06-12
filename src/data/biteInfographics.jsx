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
};

export function getBiteInfographic(title) {
  return BITE_INFOGRAPHICS[title] ?? null;
}
