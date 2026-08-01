/* ── 공통 조각 (다른 발표용 페이지와 동일 톤) ────────────────── */

function SectionTitle({ children, style }) {
  return (
    <h2 style={{
      fontSize: 'clamp(20px, 2.6vw, 23px)', fontWeight: '900',
      color: 'var(--c-ink)', letterSpacing: '-0.02em',
      marginBottom: '14px', lineHeight: 1.35, ...style,
    }}>
      {children}
    </h2>
  );
}

function Body({ children, style }) {
  return (
    <p style={{
      fontSize: '15px', color: 'var(--c-slate)', lineHeight: '1.85',
      whiteSpace: 'pre-line', marginBottom: '14px', ...style,
    }}>
      {children}
    </p>
  );
}

function List({ items, style }) {
  return (
    <ul style={{ margin: '0 0 14px', paddingLeft: '20px', ...style }}>
      {items.map((item, i) => (
        <li key={i} style={{ fontSize: '15px', color: 'var(--c-slate)', lineHeight: '1.85', marginBottom: '4px' }}>
          {item}
        </li>
      ))}
    </ul>
  );
}

/* ── 페이지 ───────────────────────────────────────────────── */

export default function TermsPage() {
  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '88px 32px 140px' }}>

      <section style={{ marginBottom: '48px' }}>
        <h1 style={{
          fontSize: 'clamp(28px, 4.4vw, 38px)', fontWeight: '900',
          color: 'var(--c-ink)', letterSpacing: '-0.02em', lineHeight: 1.35,
          marginBottom: '0', wordBreak: 'keep-all',
        }}>
          이용약관
        </h1>
      </section>

      <section style={{ marginBottom: '36px' }}>
        <SectionTitle>제1조 (목적)</SectionTitle>
        <Body style={{ marginBottom: 0 }}>
          이 약관은 ECONOMING(이하 "회사")이 제공하는 경제 교육 서비스(이하 "서비스")의 이용조건 및 절차, 회사와 회원 간의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.
        </Body>
      </section>

      <section style={{ marginBottom: '36px' }}>
        <SectionTitle>제2조 (정의)</SectionTitle>
        <List items={[
          <>"회사"란 ECONOMING 서비스를 운영하는 주체를 말합니다.</>,
          <>"회원"이란 이 약관에 동의하고 회사와 서비스 이용계약을 체결한 자를 말합니다.</>,
          <>"서비스"란 경제 교육 콘텐츠, AI 코치 대화, 경제 뉴스·지표 해설, 경제일기 등 회사가 제공하는 일체의 서비스를 말합니다.</>,
          <>"콘텐츠"란 서비스 내에서 제공되거나 회원이 작성한 텍스트, 학습 기록 등 일체의 정보를 말합니다.</>,
        ]} style={{ marginBottom: 0 }} />
      </section>

      <section style={{ marginBottom: '36px' }}>
        <SectionTitle>제3조 (서비스의 제공)</SectionTitle>
        <Body style={{ marginBottom: 0 }}>
          회사는 회원에게 경제 교육 콘텐츠, AI 코치 대화, 경제 뉴스·지표 해설, 경제일기 등의 기능을 제공합니다. 현재 모든 서비스는 무료로 제공되며, 향후 유료 서비스를 도입할 경우 이용요금·환불·자동결제 관련 사항을 본 약관에 반영하여 사전에 별도로 고지합니다.
        </Body>
      </section>

      <section style={{ marginBottom: '36px' }}>
        <SectionTitle>제4조 (회원의 의무)</SectionTitle>
        <Body>회원은 다음 각 호의 행위를 해서는 안 됩니다.</Body>
        <List items={[
          '타인의 명의를 도용하거나 허위 정보를 등록하는 행위',
          '서비스 운영을 방해하거나 서버에 부정하게 접근하는 행위',
          '서비스를 통해 얻은 정보를 회사의 사전 동의 없이 복제·배포·상업적으로 이용하는 행위',
          '관계 법령 및 이 약관에서 금지하는 행위',
        ]} style={{ marginBottom: 0 }} />
      </section>

      <section style={{ marginBottom: '36px' }}>
        <SectionTitle>제5조 (서비스 이용의 정지 및 회원 탈퇴)</SectionTitle>
        <Body style={{ marginBottom: 0 }}>
          회원이 제4조를 위반하는 경우, 회사는 사전 통지 후 서비스 이용을 일부 또는 전부 제한할 수 있습니다. 회원은 언제든지 서비스 내 절차를 통해 탈퇴를 요청할 수 있으며, 탈퇴 시 회원의 개인정보는 개인정보처리방침에 따라 처리됩니다.
        </Body>
      </section>

      <section style={{ marginBottom: '36px' }}>
        <SectionTitle>제6조 (면책조항)</SectionTitle>
        <Body>
          1. 서비스에서 제공하는 AI 코치의 답변 및 경제 정보는 참고용 정보이며, 투자 자문이나 법률·세무 자문을 대체하지 않습니다. 회사는 특정 금융 상품을 추천하거나 투자를 권유하지 않으며, 회원이 AI 코치의 답변을 근거로 내린 판단에 대해 책임을 지지 않습니다.
        </Body>
        <Body style={{ marginBottom: 0 }}>
          2. 회사는 천재지변, 시스템 점검, 외부 서비스(AI·인증 등) 장애 등 회사의 통제 범위를 벗어난 사유로 서비스가 일시 중단되는 경우, 그로 인한 손해에 대해 책임을 지지 않습니다.
        </Body>
      </section>

      <section style={{ marginBottom: '36px' }}>
        <SectionTitle>제7조 (분쟁 해결)</SectionTitle>
        <Body style={{ marginBottom: 0 }}>
          서비스 이용과 관련하여 분쟁이 발생한 경우, 회사와 회원은 우선 상호 협의를 통해 해결하도록 노력합니다. 협의가 이루어지지 않을 경우 관계 법령에 따른 절차에 따릅니다.
        </Body>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <SectionTitle>제8조 (약관의 변경)</SectionTitle>
        <Body style={{ marginBottom: 0 }}>
          회사는 필요 시 이 약관을 변경할 수 있으며, 변경 시 서비스 내 공지를 통해 사전에 안내합니다.
        </Body>
      </section>

      <p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--c-muted)' }}>
        시행일자: 2026년 8월 1일
      </p>

    </div>
  );
}
