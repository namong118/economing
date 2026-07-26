/* 아키텍처 다이어그램 — 원고의 ASCII 아트를 SVG로 재구성.
   앱에서 이미 쓰는 색 토큰 값만 사용(딥그린 --c-forest-700/900, 라임 --c-green-500,
   민트 --c-green-100/50). 모바일에서는 바깥 wrapper가 가로 스크롤을 허용한다. */
export default function ArchitectureDiagram() {
  return (
    <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <svg
        viewBox="0 0 680 470"
        role="img"
        aria-label="사용자가 React/Vite 앱을 통해 Supabase를 거쳐 Solar AI와 외부 데이터에 접근하는 아키텍처 흐름도"
        style={{ display: 'block', width: '100%', minWidth: 520, maxWidth: 640, margin: '0 auto' }}
      >
        <defs>
          <marker id="arch-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#1FBE86" />
          </marker>
        </defs>

        {/* 사용자 */}
        <rect x="260" y="16" width="160" height="48" rx="12" fill="#F1FBF6" stroke="#8FE3C2" strokeWidth="1.5" />
        <text x="340" y="46" textAnchor="middle" fontSize="16" fontWeight="800" fill="#14211C">사용자</text>

        {/* 화살표: 사용자 -> React/Vite */}
        <line x1="340" y1="64" x2="340" y2="94" stroke="#1FBE86" strokeWidth="2" markerEnd="url(#arch-arrow)" />

        {/* React + Vite */}
        <rect x="190" y="98" width="300" height="66" rx="12" fill="#FFFFFF" stroke="#DBF4E8" strokeWidth="1.5" />
        <text x="340" y="126" textAnchor="middle" fontSize="16" fontWeight="800" fill="#0B5D49">React + Vite</text>
        <text x="340" y="149" textAnchor="middle" fontSize="12.5" fill="#54635C">웹 · 안드로이드(Capacitor)</text>

        {/* 화살표: React/Vite -> Supabase */}
        <line x1="340" y1="164" x2="340" y2="196" stroke="#1FBE86" strokeWidth="2" markerEnd="url(#arch-arrow)" />

        {/* Supabase */}
        <rect x="120" y="200" width="440" height="84" rx="14" fill="#0B5D49" />
        <text x="340" y="234" textAnchor="middle" fontSize="18" fontWeight="900" fill="#FFFFFF">Supabase</text>
        <text x="340" y="258" textAnchor="middle" fontSize="12.5" fill="#DBF4E8">Auth · PostgreSQL · Edge Function</text>

        {/* 분기 화살표 + 프록시 라벨 */}
        <line x1="340" y1="284" x2="212" y2="354" stroke="#1FBE86" strokeWidth="2" markerEnd="url(#arch-arrow)" />
        <line x1="340" y1="284" x2="468" y2="354" stroke="#1FBE86" strokeWidth="2" markerEnd="url(#arch-arrow)" />
        <text x="340" y="316" textAnchor="middle" fontSize="12" fontStyle="italic" fill="#54635C">(키 노출 방지 프록시)</text>

        {/* Solar AI */}
        <rect x="130" y="360" width="160" height="68" rx="12" fill="#F1FBF6" stroke="#8FE3C2" strokeWidth="1.5" />
        <text x="210" y="390" textAnchor="middle" fontSize="15" fontWeight="800" fill="#14211C">Solar AI</text>
        <text x="210" y="410" textAnchor="middle" fontSize="12" fill="#54635C">(Upstage)</text>

        {/* 외부 데이터 */}
        <rect x="390" y="360" width="180" height="92" rx="12" fill="#F1FBF6" stroke="#8FE3C2" strokeWidth="1.5" />
        <text x="480" y="384" textAnchor="middle" fontSize="15" fontWeight="800" fill="#14211C">외부 데이터</text>
        <text x="480" y="404" textAnchor="middle" fontSize="12" fill="#54635C">네이버 뉴스</text>
        <text x="480" y="421" textAnchor="middle" fontSize="12" fill="#54635C">한국은행 ECOS</text>
        <text x="480" y="438" textAnchor="middle" fontSize="12" fill="#54635C">통계청 KOSIS</text>
      </svg>
    </div>
  );
}
