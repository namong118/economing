import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';

const BASE = import.meta.env.BASE_URL;

/* ── 공통 조각 (다른 발표용 페이지와 동일 톤) ────────────────── */

function SectionTitle({ children, style }) {
  return (
    <h2 style={{
      fontSize: 'clamp(22px, 3vw, 26px)', fontWeight: '900',
      color: 'var(--c-ink)', letterSpacing: '-0.02em',
      marginBottom: '24px', lineHeight: 1.35, ...style,
    }}>
      {children}
    </h2>
  );
}

function Body({ children, style }) {
  return (
    <p style={{
      fontSize: '16px', color: 'var(--c-slate)', lineHeight: '1.9',
      whiteSpace: 'pre-line', marginBottom: '18px', ...style,
    }}>
      {children}
    </p>
  );
}

function Quote({ children, emphasized, style }) {
  return (
    <blockquote style={{
      margin: '24px 0', padding: '20px 24px',
      background: emphasized ? 'var(--c-green-50)' : 'var(--c-surface)',
      border: `1.5px solid ${emphasized ? 'var(--c-green-100)' : 'var(--c-line)'}`,
      borderLeft: `4px solid var(--c-green-500)`,
      borderRadius: '4px 14px 14px 4px',
      fontSize: emphasized ? '19px' : '15.5px',
      fontWeight: emphasized ? '800' : '600',
      color: emphasized ? 'var(--c-forest-700)' : 'var(--c-ink)',
      lineHeight: 1.7, whiteSpace: 'pre-line',
      ...style,
    }}>
      {children}
    </blockquote>
  );
}

function ChecklistItem({ children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '10px' }}>
      <div style={{
        width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0, marginTop: '2px',
        background: 'var(--c-green-100)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Check size={12} color="var(--c-forest-700)" strokeWidth={3} />
      </div>
      <p style={{ fontSize: '15px', color: 'var(--c-ink)', lineHeight: '1.6', margin: 0 }}>{children}</p>
    </div>
  );
}

/* ── 이 페이지 전용 조각 ──────────────────────────────────── */

function MobileFrame({ src, alt }) {
  return (
    <img
      src={src}
      alt={alt}
      style={{
        width: '100%', maxWidth: '340px', display: 'block', margin: '0 auto',
        borderRadius: '28px', border: '1px solid var(--c-line)',
        boxShadow: '0 16px 36px rgba(8,53,43,0.14)',
      }}
    />
  );
}

function SideBySide({ image, imageAlt, reverse, children }) {
  return (
    <div style={{
      display: 'flex', gap: '36px', alignItems: 'center',
      flexDirection: reverse ? 'row-reverse' : 'row',
      marginBottom: '56px',
    }}>
      <div style={{ flex: '0 0 auto', width: '340px' }}>
        <MobileFrame src={image} alt={imageAlt} />
      </div>
      <div style={{ flex: '1 1 0', minWidth: 0 }}>
        {children}
      </div>
    </div>
  );
}

function StepHeading({ num, title }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
      <span style={{
        width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
        background: 'var(--grad-action)', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '13px', fontWeight: '900',
      }}>
        {num}
      </span>
      <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--c-ink)', letterSpacing: '-0.3px', margin: 0 }}>
        {title}
      </h3>
    </div>
  );
}

function ItemHeading({ children }) {
  return (
    <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--c-ink)', marginBottom: '12px', letterSpacing: '-0.3px' }}>
      {children}
    </h3>
  );
}

function TourRow({ label, path, children, last }) {
  const labelEl = (
    <span style={{ fontWeight: '800', color: path ? 'var(--c-forest-700)' : 'var(--c-ink)', fontSize: '15px' }}>
      {label}
    </span>
  );
  return (
    <div style={{
      display: 'flex', gap: '18px', padding: '16px 18px',
      borderBottom: last ? 'none' : '1px solid var(--c-line-soft)',
      alignItems: 'flex-start', flexWrap: 'wrap',
    }}>
      <div style={{ flex: '0 0 180px' }}>
        {path ? (
          <Link to={path} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
            {labelEl}
            <ArrowRight size={13} color="var(--c-green-500)" />
          </Link>
        ) : labelEl}
        {path && (
          <div style={{ fontSize: '11.5px', color: 'var(--c-muted)', fontFamily: 'monospace', marginTop: '2px' }}>
            {path}
          </div>
        )}
      </div>
      <div style={{ flex: '1 1 260px', fontSize: '14px', color: 'var(--c-slate)', lineHeight: '1.6' }}>
        {children}
      </div>
    </div>
  );
}

/* ── 메인 ─────────────────────────────────────────────────── */
export default function GuidePage() {
  return (
    <div style={{ maxWidth: 780, margin: '0 auto', padding: '96px 32px 120px' }}>

      {/* 1. 히어로 */}
      <section style={{ marginBottom: '96px' }}>
        <h1 style={{
          fontSize: 'clamp(30px, 5vw, 42px)', fontWeight: '900',
          color: 'var(--c-ink)', letterSpacing: '-0.02em', marginBottom: '20px',
        }}>
          ECONOMING 사용법
        </h1>
        <p style={{ fontSize: '17px', color: 'var(--c-slate)', lineHeight: '1.9', whiteSpace: 'pre-line', margin: 0 }}>
          {'경제 공부를 처음 시작하는 분을 위해 만들었습니다.\n순서대로 따라오시면 됩니다.'}
        </p>
      </section>

      {/* 2. 처음 오신 분은 이렇게 */}
      <section style={{ marginBottom: '40px' }}>
        <SectionTitle>처음 오신 분은 이렇게</SectionTitle>

        <SideBySide image={`${BASE}guide/01-diagnosis.png`} imageAlt="진단 문항과 5개 선택지 화면">
          <StepHeading num="①" title="내 수준부터 확인합니다" />
          <Body>
            10개 문항으로 경제 지식 수준을 진단합니다. 3분이면 끝납니다.
          </Body>
          <Body style={{ fontWeight: '800', color: 'var(--c-ink)', fontSize: '16.5px' }}>
            맞히는 시험이 아닙니다.
          </Body>
          <Body style={{ marginBottom: 0 }}>
            <b style={{ color: 'var(--c-ink)', fontWeight: '800' }}>어느 수준으로 설명해드릴지 정하기 위한 것</b>입니다.{'\n'}
            결과에 따라 AI 코치의 설명 깊이가 5단계로 달라집니다.
          </Body>
        </SideBySide>

        <SideBySide image={`${BASE}guide/02-onboarding.png`} imageAlt="선택형 온보딩 화면" reverse>
          <StepHeading num="②" title="나에 대해 알려줍니다" />
          <Body>
            재무 목표, 나이대, 소득 구간, 관심 분야, 직업을 선택합니다.
          </Body>
          <Body style={{ marginBottom: 0 }}>
            이 정보로 AI가 <b style={{ color: 'var(--c-ink)', fontWeight: '800' }}>나만의 성장 로드맵</b>과 첫 인사말을 만듭니다.{'\n'}
            같은 앱이지만 사람마다 다른 화면으로 시작합니다.
          </Body>
        </SideBySide>

        <SideBySide image={`${BASE}guide/03-today-bite.png`} imageAlt="홈의 오늘의 한잎 카드 화면">
          <StepHeading num="③" title="첫 한잎을 읽습니다" />
          <Body>
            홈 화면에 <b style={{ color: 'var(--c-ink)', fontWeight: '800' }}>오늘의 한잎</b>이 기다리고 있습니다.
          </Body>
          <Body style={{ marginBottom: 0 }}>
            커리큘럼 1장 첫 번째 카드부터 시작합니다. 설명을 읽고, 인포그래픽으로 한 번 더 보고, 퀴즈를 풀면 끝.{'\n'}
            <b style={{ color: 'var(--c-ink)', fontWeight: '800' }}>하루 한 개, 3분이면 충분합니다.</b>
          </Body>
        </SideBySide>
      </section>

      {/* 3. 매일은 이렇게 */}
      <section style={{ marginBottom: '40px' }}>
        <SectionTitle>매일은 이렇게</SectionTitle>

        <SideBySide image={`${BASE}guide/04-home.png`} imageAlt="홈 화면 전체">
          <ItemHeading>홈에서 오늘 할 일을 확인합니다</ItemHeading>
          <ChecklistItem>오늘의 한잎</ChecklistItem>
          <ChecklistItem>노밍의 오늘 행동 제안 — 5분 안에 할 수 있는 것 하나</ChecklistItem>
          <ChecklistItem>연속 학습일과 현재 성장 단계</ChecklistItem>
        </SideBySide>

        <SideBySide image={`${BASE}guide/05-archive.png`} imageAlt="아카이브 챕터 목록 화면" reverse>
          <ItemHeading>한잎을 읽습니다</ItemHeading>
          <Body>
            11챕터 96개가 순서대로 정리되어 있습니다.
          </Body>
          <Body style={{ marginBottom: 0 }}>
            <b style={{ color: 'var(--c-ink)', fontWeight: '800' }}>어디까지 왔는지 진도로 보입니다.</b>
          </Body>
        </SideBySide>

        <SideBySide image={`${BASE}guide/06-read.png`} imageAlt="뉴스 요약과 지표 티커 화면">
          <ItemHeading>오늘의 경제를 봅니다</ItemHeading>
          <Body>
            실시간 뉴스를 AI가 초보자 관점으로 요약해줍니다.
          </Body>
          <Body style={{ marginBottom: 0 }}>
            지표 11종은 <i>쉽게 설명 → 왜 중요한지 → 실제 사례 → 내 삶에 미치는 영향</i>{'\n'}
            네 단계로 풀어냅니다.
          </Body>
        </SideBySide>

        <SideBySide image={`${BASE}guide/07-diary.png`} imageAlt="경제일기 6개 항목 화면" reverse>
          <ItemHeading>하루를 기록합니다</ItemHeading>
          <Body>
            배운 것, 뉴스를 보고 든 생각, 오늘의 소비까지 6개 항목으로.
          </Body>
          <Body style={{ marginBottom: 0 }}>
            <b style={{ color: 'var(--c-ink)', fontWeight: '800' }}>빈 화면이 아니라 질문에 답하는 방식</b>이라 막히지 않습니다.
          </Body>
        </SideBySide>
      </section>

      {/* 4. 필요할 때 */}
      <section style={{ marginBottom: '40px' }}>
        <SectionTitle>필요할 때</SectionTitle>

        <SideBySide image={`${BASE}guide/08-coach.png`} imageAlt="코치 답변 화면">
          <ItemHeading>모르는 게 생기면 — 노밍에게 묻습니다</ItemHeading>
          <Body>
            AI 경제 코치입니다. 내 수준에 맞춰 답해줍니다.
          </Body>
          <Body>
            모든 답변 끝에 <b style={{ color: 'var(--c-ink)', fontWeight: '800' }}>"오늘 5분 안에 할 수 있는 한 가지"</b>가 붙습니다.{'\n'}
            설명만 듣고 끝나지 않도록 만들었습니다.
          </Body>
          <Body style={{ marginBottom: 0 }}>
            무엇을 물어야 할지 모를 때를 위해 추천 질문 3개가 준비되어 있습니다.
          </Body>
        </SideBySide>

        {/* 이미지 없는 항목 — 스크린샷 대상에서 제외됨 */}
        <div style={{ marginBottom: '56px' }}>
          <ItemHeading>낯선 용어를 만나면 — 사전에 저장합니다</ItemHeading>
          <Body>
            뉴스를 읽다가, 코치와 대화하다가 모르는 단어가 나오면{'\n'}
            <b style={{ color: 'var(--c-ink)', fontWeight: '800' }}>버튼 하나로 저장</b>할 수 있습니다.
          </Body>
          <Body style={{ marginBottom: 0 }}>
            검색해서 찾아보는 사전이 아니라,{'\n'}
            <b style={{ color: 'var(--c-ink)', fontWeight: '800' }}>내가 실제로 막혔던 단어가 쌓이는</b> 사전입니다.{'\n'}
            내 성장 탭에서 볼 수 있습니다.
          </Body>
        </div>

        <SideBySide image={`${BASE}guide/09-roadmap.png`} imageAlt="자립 로드맵 화면">
          <ItemHeading>돈 관리 방향을 잡고 싶으면 — 자립 진단</ItemHeading>
          <Body>
            비상금 · 저축 · 지출 · 부채 · 연금 · 보험 · 투자 · 절세 등{'\n'}
            10개 영역을 진단합니다.
          </Body>
          <Body>
            결과에 따라 AI가 <b style={{ color: 'var(--c-ink)', fontWeight: '800' }}>실행 로드맵</b>을 만듭니다.{'\n'}
            "절세 상품을 알아보세요" 같은 말은 없습니다.
          </Body>
          <Body style={{ marginBottom: 0, fontWeight: '800', color: 'var(--c-ink)', fontSize: '16.5px' }}>
            앱 이름과 클릭 순서와 소요 시간까지 적힌 계획이 나옵니다.
          </Body>
        </SideBySide>

        <SideBySide image={`${BASE}guide/10-my-growth.png`} imageAlt="내 성장 탭 화면" reverse>
          <ItemHeading>내 성장을 보고 싶으면</ItemHeading>
          <Body style={{ marginBottom: 0 }}>
            학습 진도, 성장 단계, 연속 학습일, 자립 로드맵, 나만의 사전이{'\n'}
            한곳에 모여 있습니다.
          </Body>
        </SideBySide>
      </section>

      {/* 5. 모바일로 이어서 보기 */}
      <section style={{ marginBottom: '96px' }}>
        <SectionTitle>모바일로 이어서 보기</SectionTitle>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '36px', flexWrap: 'wrap',
          padding: '40px', background: 'var(--c-surface)', border: '1.5px solid var(--c-line)', borderRadius: '20px',
        }}>
          <img
            src={`${BASE}qr-mobile.png`}
            alt="모바일로 이어서 보기 QR 코드"
            style={{
              width: '200px', height: '200px', flexShrink: 0, display: 'block',
              background: '#fff', border: '1px solid var(--c-line)', borderRadius: '16px', padding: '12px',
            }}
          />
          <div style={{ flex: '1 1 240px', minWidth: 0 }}>
            <Body style={{ marginBottom: 0 }}>
              휴대폰으로 스캔하면 바로 이어서 학습할 수 있습니다.{'\n'}
              <b style={{ color: 'var(--c-ink)', fontWeight: '800' }}>안드로이드 앱</b>으로도 설치할 수 있습니다.
            </Body>
          </div>
        </div>
      </section>

      {/* 6. 짧게 둘러보실 분들을 위해 */}
      <section>
        <SectionTitle>짧게 둘러보실 분들을 위해</SectionTitle>
        <Body>시간이 많지 않다면 이 순서로 보시면 됩니다.</Body>

        <div style={{ border: '1.5px solid var(--c-line)', borderRadius: '16px', overflow: 'hidden', marginBottom: '24px' }}>
          <TourRow label="1. 한잎 아카이브" path="/bites">
            11챕터 96개 커리큘럼의 전체 구조와 학습 진도
          </TourRow>
          <TourRow label="2. 한잎 하나 열기">
            설명 · 인포그래픽 3종 · 퀴즈 · 해설이 한 장에
          </TourRow>
          <TourRow label="3. 경제읽기" path="/read">
            AI 뉴스 요약과 정부 실데이터 기반 지표
          </TourRow>
          <TourRow label="4. 노밍 코치" path="/coach">
            레벨별로 달라지는 AI 답변과 "오늘 5분 실천"
          </TourRow>
          <TourRow label="5. 내 성장" path="/my-growth" last>
            자립 로드맵과 진도 관리
          </TourRow>
        </div>

        <Quote emphasized style={{ marginBottom: 0 }}>
          <b style={{ fontWeight: '900' }}>한 화면만 보신다면 한잎 아카이브</b>를 권합니다.{'\n'}
          이 앱이 무엇을 만들었는지 가장 잘 보이는 곳입니다.
        </Quote>
      </section>

    </div>
  );
}
