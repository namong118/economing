import { SectionTitle, Body, SubHeading, List } from './legalCommon';

export default function PrivacyPolicyContent() {
  return (
    <>
      <section style={{ marginBottom: '48px' }}>
        <h1 style={{
          fontSize: 'clamp(28px, 4.4vw, 38px)', fontWeight: '900',
          color: 'var(--c-ink)', letterSpacing: '-0.02em', lineHeight: 1.35,
          marginBottom: '14px', wordBreak: 'keep-all',
        }}>
          개인정보처리방침
        </h1>
        <Body style={{ marginBottom: 0 }}>
          ECONOMING(이하 "서비스")은 이용자의 개인정보를 소중히 다루며, 아래와 같이 개인정보를 수집·이용합니다.
        </Body>
      </section>

      <section style={{ marginBottom: '36px' }}>
        <SectionTitle>1. 수집하는 개인정보 항목</SectionTitle>

        <SubHeading>필수 항목 (회원가입 시)</SubHeading>
        <List items={[
          '이메일, 닉네임',
          '로그인 제공자 정보(Google, Kakao, 또는 이메일 가입 여부)',
          '프로필 이미지(소셜 로그인 제공 시)',
        ]} />

        <SubHeading>선택 항목 (온보딩 진단 시 입력)</SubHeading>
        <List items={[
          '경제 지식 수준, 투자 경험, 직업, 관심 분야, 재무 목표, 나이대, 월 소득 구간',
        ]} />

        <SubHeading>서비스 이용 중 자동으로 생성·저장되는 정보</SubHeading>
        <List items={[
          '학습 진도, XP·레벨, 연속 학습일',
          'AI 코치(노밍)와의 대화 내용',
          '저장한 경제 용어("나만의 사전")',
          '경제일기 작성 내용',
          '경제 자립 진단 결과(점수, 카테고리별 평가, 개인화 로드맵)',
        ]} />
      </section>

      <section style={{ marginBottom: '36px' }}>
        <SectionTitle>2. 개인정보의 이용 목적</SectionTitle>
        <List items={[
          '회원 식별 및 서비스 제공',
          '학습 수준에 맞춘 콘텐츠·AI 코치 응답 개인화',
          '서비스 개선을 위한 통계 분석 (개인을 식별할 수 없는 형태로 처리)',
        ]} style={{ marginBottom: 0 }} />
      </section>

      <section style={{ marginBottom: '36px' }}>
        <SectionTitle>3. 개인정보의 제3자 제공 및 처리 위탁</SectionTitle>
        <Body>
          서비스는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다. 다만 아래의 경우 서비스 제공을 위해 필요한 최소한의 정보가 외부 업체로 전송됩니다.
        </Body>
        <List items={[
          <><b style={{ color: 'var(--c-ink)' }}>AI 코치 응답 생성</b>: 이용자가 입력한 질문 및 대화 내용은 응답 생성을 위해 Upstage(업스테이지)의 Solar AI API로 전송됩니다.</>,
          <><b style={{ color: 'var(--c-ink)' }}>인증·데이터베이스</b>: 회원 인증 및 데이터 저장을 위해 Supabase를 이용하며, 관련 정보가 Supabase 서버에 저장됩니다.</>,
          <><b style={{ color: 'var(--c-ink)' }}>소셜 로그인</b>: Google, Kakao를 통한 로그인 시 각 사의 인증 정책에 따라 최소한의 정보(이메일, 프로필 이미지 등)를 제공받습니다.</>,
        ]} style={{ marginBottom: 0 }} />
      </section>

      <section style={{ marginBottom: '36px' }}>
        <SectionTitle>4. 개인정보의 보유 및 이용 기간</SectionTitle>
        <Body style={{ marginBottom: 0 }}>
          회원 탈퇴 시 관련 법령에서 별도로 정한 경우를 제외하고 지체 없이 파기합니다.
        </Body>
      </section>

      <section style={{ marginBottom: '36px' }}>
        <SectionTitle>5. 이용자의 권리</SectionTitle>
        <Body style={{ marginBottom: 0 }}>
          이용자는 언제든지 자신의 개인정보를 열람, 정정, 삭제, 처리 정지를 요구할 수 있습니다.
        </Body>
      </section>

      <section style={{ marginBottom: '36px' }}>
        <SectionTitle>6. 계정 및 데이터 삭제</SectionTitle>
        <SubHeading>계정을 유지한 채 일부 데이터만 삭제하기</SubHeading>
        <Body>
          계정을 탈퇴하지 않고도 경제일기 항목, 나만의 사전에 저장한 용어를 각각 앱 안에서 개별적으로 삭제할 수 있습니다(해당 화면에서 삭제 버튼 선택).
        </Body>
        <SubHeading>계정 전체 삭제(회원 탈퇴)</SubHeading>
        <List items={[
          '앱 실행 후 로그인',
          '하단 메뉴에서 "내 성장" 탭 이동',
          '화면 맨 아래 "회원 탈퇴" 선택 후 확인',
        ]} />
        <Body>
          탈퇴 즉시 계정과 함께 이메일·닉네임·프로필 이미지 등 개인정보, 학습 진도, 경제일기, 나만의 사전, 노밍과의 대화 내용, 경제 자립 진단 결과를 포함한 모든 데이터가 삭제되며 복구할 수 없습니다.
        </Body>
        <SubHeading>앱을 삭제해 접근할 수 없는 경우</SubHeading>
        <Body style={{ marginBottom: 0 }}>
          아래 이메일로 탈퇴하려는 계정의 이메일 주소를 포함해 삭제를 요청하시면 확인 후 처리해드립니다.
        </Body>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <SectionTitle>7. 문의처</SectionTitle>
        <Body>
          개인정보 관련 문의사항은 아래로 연락해주세요.
        </Body>
        <List items={[
          <>이메일: <a href="mailto:nmnmxe@gmail.com" style={{ color: 'var(--c-forest-700)', fontWeight: 700 }}>nmnmxe@gmail.com</a></>,
        ]} style={{ marginBottom: 0 }} />
      </section>

      <p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--c-muted)' }}>
        시행일자: 2026년 8월 1일
      </p>
    </>
  );
}
