import { Check, ArrowRight } from 'lucide-react';
import ArchitectureDiagram from '../components/presentation/ArchitectureDiagram';
import SectionNav from '../components/layout/SectionNav';

/* ── 공통 조각 (About과 동일 톤) ─────────────────────────── */

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

/* ── 이 페이지 전용 조각 ──────────────────────────────────── */

function CodeBlock({ children }) {
  return (
    <pre style={{
      background: 'var(--c-forest-900)', color: 'var(--c-green-100)',
      borderRadius: '14px', padding: '20px 22px',
      fontSize: '13px', lineHeight: '1.75', fontFamily: 'monospace',
      overflowX: 'auto', margin: '16px 0 20px',
    }}>
      {children}
    </pre>
  );
}

function Mono({ children }) {
  return (
    <code style={{
      fontFamily: 'monospace', fontSize: '13px', color: 'var(--c-forest-700)',
      background: 'var(--c-green-50)', padding: '2px 6px', borderRadius: '5px',
    }}>
      {children}
    </code>
  );
}

function DataTable({ columns, rows }) {
  return (
    <div style={{ overflowX: 'auto', marginBottom: '18px', border: '1.5px solid var(--c-line)', borderRadius: '14px' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
        <thead>
          <tr>
            {columns.map((c, i) => (
              <th key={i} style={{
                textAlign: 'left', padding: '12px 16px',
                background: 'var(--c-canvas)', borderBottom: '1.5px solid var(--c-line)',
                color: 'var(--c-muted)', fontSize: '11px', fontWeight: '800', letterSpacing: '0.4px',
                whiteSpace: 'nowrap',
              }}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((cell, j) => (
                <td key={j} style={{
                  padding: '13px 16px',
                  borderBottom: i < rows.length - 1 ? '1px solid var(--c-line-soft)' : 'none',
                  color: 'var(--c-ink)', lineHeight: 1.6, verticalAlign: 'top',
                }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatCard({ label, value, sub }) {
  return (
    <div style={{
      background: 'var(--c-surface)', border: '1.5px solid var(--c-line)',
      borderRadius: '16px', padding: '20px 18px',
    }}>
      <p style={{ fontSize: '11px', fontWeight: '800', color: 'var(--c-muted)', letterSpacing: '0.4px', marginBottom: '8px' }}>
        {label}
      </p>
      <p style={{ fontSize: '24px', fontWeight: '900', color: 'var(--c-forest-700)', letterSpacing: '-0.02em', marginBottom: sub ? '4px' : 0 }}>
        {value}
      </p>
      {sub && <p style={{ fontSize: '12px', color: 'var(--c-muted)', fontWeight: '600' }}>{sub}</p>}
    </div>
  );
}

function GithubLink({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        padding: '13px 22px', borderRadius: '14px',
        background: 'var(--grad-action)', color: '#fff',
        fontSize: '14.5px', fontWeight: '800', letterSpacing: '-0.2px',
        textDecoration: 'none', boxShadow: '0 6px 18px rgba(31,190,134,0.28)',
      }}
    >
      {children} <ArrowRight size={15} />
    </a>
  );
}

function StepHeading({ num, children }) {
  return (
    <h3 style={{
      display: 'flex', alignItems: 'center', gap: '10px',
      fontSize: '18px', fontWeight: '800', color: 'var(--c-forest-700)',
      letterSpacing: '-0.3px', marginTop: '40px', marginBottom: '14px',
    }}>
      <span style={{
        width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
        background: 'var(--c-forest-700)', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '13px', fontWeight: '900',
      }}>
        {num}
      </span>
      {children}
    </h3>
  );
}

function ApiGroup({ title, highlight, note, rows }) {
  return (
    <div style={{
      marginBottom: '22px', padding: highlight ? '20px' : 0,
      background: highlight ? 'var(--c-green-50)' : 'transparent',
      border: highlight ? '1.5px solid var(--c-green-100)' : 'none',
      borderRadius: highlight ? '16px' : 0,
    }}>
      <p style={{
        fontSize: '12px', fontWeight: '800', letterSpacing: '0.4px',
        color: highlight ? 'var(--c-forest-700)' : 'var(--c-muted)', marginBottom: '10px',
      }}>
        {title}
      </p>
      <DataTable columns={['API', '엔드포인트', '용도']} rows={rows} />
      {note && <Body style={{ marginBottom: 0, fontSize: '14px' }}>{note}</Body>}
    </div>
  );
}

function CommitBar({ label, count, max }) {
  const pct = Math.round((count / max) * 100);
  return (
    <div style={{ marginBottom: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--c-ink)' }}>{label}</span>
        <span style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--c-forest-700)' }}>{count}</span>
      </div>
      <div style={{ height: '10px', background: 'var(--c-line-soft)', borderRadius: '100px', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: 'var(--grad-action)', borderRadius: '100px' }} />
      </div>
    </div>
  );
}

/* ── 데이터 ───────────────────────────────────────────────── */

const STATS = [
  { label: '커밋', value: '301개' },
  { label: '코드', value: '19,864줄', sub: '105개 파일' },
  { label: '개발일지', value: '1,938줄', sub: '23개 항목' },
  { label: '학습 콘텐츠', value: '96개', sub: '11챕터 · 본문·퀴즈·인포그래픽' },
  { label: 'AI 기능', value: '9개' },
  { label: '외부 API', value: '7개' },
  { label: '개발 인원', value: '1인' },
];

const AI_SCREENS = [
  ['온보딩', '성장 로드맵 생성 · 첫 환영 메시지'],
  ['홈', '오늘의 인사말 · 오늘의 행동 제안'],
  ['한잎', '인포그래픽 생성 (정적 데이터에 없을 때)'],
  ['노밍', '답변 생성 · 추천 질문 3개'],
  ['경제읽기', '뉴스 요약 · 용어 추출'],
  ['내 성장', '자립 로드맵 생성'],
];

const TECH_STACK = [
  ['프론트엔드', 'React 18 + Vite · React Router · Lucide Icons'],
  ['백엔드', 'Supabase — Auth / PostgreSQL / Edge Functions'],
  ['AI', "Solar AI (Upstage solar-1-mini-chat)"],
  ['외부 데이터', '7개 API — 위 「사용한 API」 참고'],
  ['배포', 'GitHub Pages (웹) · Capacitor (안드로이드)'],
  ['데이터베이스', '9개 테이블 · 전 테이블 RLS 적용'],
];

const DOCS = [
  [<span key="a"><Mono>DEVLOG.md</Mono> (1,272줄)</span>, '작업 단위 개발 기록 11개 항목'],
  [<span key="b"><Mono>개발일지.md</Mono> (666줄)</span>, '판단과 회고 중심 기록 12개 항목'],
  [<Mono key="c">docs/curriculum/</Mono>, '커리큘럼 확정본 + 초안 v1~v3 + 실패한 접근 기록'],
  [<Mono key="d">docs/content-backlog.md</Mono>, '뉴스 분석으로 검증한 콘텐츠 후보 224개'],
];

const COMMIT_TYPES = [
  { label: 'feat (기능 추가)', count: 87 },
  { label: 'fix (버그 수정)', count: 66 },
  { label: 'docs (문서)', count: 16 },
  { label: 'design (디자인)', count: 10 },
  { label: 'chore · style · refactor · remove', count: 25 },
];
const MAX_COMMIT = Math.max(...COMMIT_TYPES.map(c => c.count));

/* ── 메인 ─────────────────────────────────────────────────── */
export default function TechStackPage() {
  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '88px 32px 140px' }}>

      <SectionNav sections={[
        { id: 'hero',             label: '소개' },
        { id: 'solar-placement',  label: 'Solar AI 배치' },
        { id: 'solar-design',     label: 'AI 설계' },
        { id: 'architecture',     label: '아키텍처' },
        { id: 'apis',             label: '사용한 API' },
        { id: 'tech-stack',       label: '기술 스택' },
        { id: 'devlog',           label: '기록' },
        { id: 'quality',          label: '품질 관리' },
        { id: 'troubleshooting',  label: '트러블슈팅' },
        { id: 'commits',          label: '커밋 이력' },
        { id: 'future-plans',     label: '향후 계획' },
      ]} />

      {/* 1. 히어로 */}
      <section id="hero" style={{ marginBottom: '96px' }}>
        <h1 style={{
          fontSize: 'clamp(28px, 4.6vw, 40px)', fontWeight: '900',
          color: 'var(--c-ink)', letterSpacing: '-0.02em', lineHeight: 1.35,
          marginBottom: '14px', wordBreak: 'keep-all', whiteSpace: 'pre-line',
        }}>
          {'AI가 진단하고, 사람이 검증하고,\nAI가 돕습니다'}
        </h1>
        <p style={{ fontSize: '16px', color: 'var(--c-slate)', marginBottom: '32px', whiteSpace: 'pre-line', lineHeight: 1.7 }}>
          {'Solar AI를 5개 탭 전부에 배치했습니다.\n다만 틀리면 안 되는 곳에는 사람의 검수를 두었습니다.'}
        </p>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '12px', marginBottom: '32px',
        }}>
          {STATS.map(s => <StatCard key={s.label} {...s} />)}
        </div>

        <GithubLink href="https://github.com/namong118/economing">
          GitHub에서 전체 코드 보기
        </GithubLink>
      </section>

      {/* 2. Solar AI — 제품 전반에 배치 */}
      <section id="solar-placement" style={{ marginBottom: '96px' }}>
        <SectionTitle>Solar AI — 제품 전반에 배치</SectionTitle>
        <Body>
          Upstage Solar AI(<Mono>solar-1-mini-chat</Mono>)를 <b style={{ color: 'var(--c-ink)', fontWeight: '800' }}>5개 탭 전부</b>에서 사용합니다.{'\n'}
          부가 기능이 아니라 서비스의 뼈대입니다.
        </Body>

        <DataTable columns={['화면', 'AI가 하는 일']} rows={AI_SCREENS} />

        <Quote emphasized style={{ marginBottom: 0 }}>
          총 9개의 AI 기능이 실제로 동작합니다.
        </Quote>
      </section>

      {/* 3. Solar AI를 어떻게 다뤘나 */}
      <section id="solar-design" style={{ marginBottom: '96px' }}>
        <SectionTitle>Solar AI의 특성에 맞춰 설계했습니다</SectionTitle>

        <Body>
          <Mono>solar-1-mini-chat</Mono>은 가볍고 빠른 모델입니다. 한국어 경제 용어와{'\n'}
          국내 뉴스 문맥을 다루는 데 무리가 없었고, 짧은 호출을 자주 하는{'\n'}
          이 서비스의 구조와 잘 맞았습니다.
        </Body>
        <Body>다만 쓰면서 세 가지를 확인했습니다.</Body>

        <Body>
          <b style={{ color: 'var(--c-ink)', fontWeight: '800' }}>① 형식을 항상 지키지는 않습니다.</b>{'\n'}
          JSON으로 응답하라고 명시해도 어기는 경우가 있었습니다.
        </Body>
        <Body>
          <b style={{ color: 'var(--c-ink)', fontWeight: '800' }}>② 지시만으로는 추상적인 답을 벗어나지 못합니다.</b>{'\n'}
          "구체적으로 쓰라"고 해도 "절세 상품을 알아보세요" 같은 답이 나왔습니다.
        </Body>
        <Body>
          <b style={{ color: 'var(--c-ink)', fontWeight: '800' }}>③ 자유를 주면 존재하지 않는 것을 만들어냅니다.</b>{'\n'}
          정답 목록을 프롬프트에 전부 넣었는데도 없는 항목을 지어냈습니다.
        </Body>
        <Body>
          세 가지 모두 모델의 한계라기보다{' '}
          <b style={{ color: 'var(--c-ink)', fontWeight: '800' }}>다루는 쪽의 설계 문제</b>라고 보고,{'\n'}
          아래처럼 대응했습니다.
        </Body>

        <StepHeading num="①">3층 프롬프트 — 질문을 그대로 넘기지 않습니다</StepHeading>
        <CodeBlock>{'3층  응답 형식      JSON 스키마로 강제\n2층  레벨별 컨텍스트  사용자 수준에 따라 5단계 분기\n1층  기본 인격      노밍의 철학 + 금지 목록'}</CodeBlock>
        <Body>
          <b style={{ color: 'var(--c-ink)', fontWeight: '800' }}>1층</b>에는 금융 앱으로서의 금지 사항을 명시했습니다 —{'\n'}
          투자 종목 추천, 수익률 예측, "~을 공부하세요" 같은 막연한 조언.
        </Body>
        <Body style={{ marginBottom: 0 }}>
          <b style={{ color: 'var(--c-ink)', fontWeight: '800' }}>2층</b>은 같은 질문에도 다른 답이 나가게 합니다.{'\n'}
          입문자에게는 "금리 = 돈을 빌려쓰는 대가" 같은 비유를 쓰고,{'\n'}
          초급자에게는 용어 설명을 줄이고 활용 방법을 앞세웁니다.
        </Body>

        <StepHeading num="②">자유 서술을 받지 않습니다</StepHeading>
        <Body>코치의 답변은 텍스트가 아니라 구조화된 데이터로 받습니다.</Body>
        <CodeBlock>{'advice     핵심 답변 2~3문장\nknowFirst  알아야 할 것 3가지\nnextStep   오늘 5분 안에 할 한 가지\nterms      용어 + 생활 연결 설명\nwarning    투자 위험 경고'}</CodeBlock>
        <Body style={{ marginBottom: 0 }}>
          각 필드를 UI 컴포넌트에 매핑합니다.{'\n'}
          <Mono>nextStep</Mono>이 필수 필드이므로 <b style={{ color: 'var(--c-ink)', fontWeight: '800' }}>AI가 실천 항목을 빼먹을 수 없습니다.</b>{'\n'}
          <Mono>warning</Mono>을 분리했기 때문에 위험 경고가 본문에 묻히지 않습니다.
        </Body>

        <StepHeading num="③">프롬프트에 좋은 예와 나쁜 예를 직접 씁니다</StepHeading>
        <Body>
          자립 로드맵의 첫 버전은 "절세형 금융 상품 조사하기" 같은 답을 냈습니다.{'\n'}
          맞는 말이지만 실행할 수 없습니다.
        </Body>
        <Body>
          "추상적으로 쓰지 말라"는 지시만으로는 개선되지 않았습니다.{'\n'}
          그래서 프롬프트에 예시를 직접 넣었습니다.
        </Body>
        <CodeBlock>{'나쁜 예 (절대 금지)\n  "절세형 금융 상품 조사하기"\n  "포트폴리오 재배분"\n\n좋은 예 (이렇게 작성)\n  "네이버에서 \'ISA 계좌\' 검색 → 나이 확인 →\n   일반형 / 서민형 중 해당 유형 메모하기 (5분)"'}</CodeBlock>
        <Body style={{ marginBottom: 0 }}>지금은 앱 이름과 클릭 순서와 소요 시간까지 나옵니다.</Body>

        <StepHeading num="④">AI를 최대한 늦게 호출합니다</StepHeading>
        <Body>인포그래픽 생성은 4단계를 거쳐야 AI에 도달합니다.</Body>
        <CodeBlock>{'① 정적 데이터에 있으면    → 사용 (AI 호출 없음)\n② 경제 개념 키워드 없으면  → 스킵\n③ 캐시에 있으면          → 재사용\n④ 여기까지 왔을 때만      → AI 생성\n⑤ 스키마 불일치          → 폐기'}</CodeBlock>
        <Body style={{ marginBottom: 0 }}>매번 호출하면 느리고, 비용이 들고, 같은 질문에 매번 다른 결과가 나옵니다.</Body>

        <StepHeading num="⑤">실패를 전제로 설계합니다</StepHeading>
        <Body>
          AI는 JSON 형식을 어깁니다. 실제로 겪었습니다.{'\n'}
          그래서 파싱에 실패하면 정규식으로 필드를 개별 추출하는 폴백을 두었습니다.{'\n'}
          요약 하나가 깨져도 화면 전체가 멈추지 않습니다.
        </Body>
        <Body style={{ marginBottom: 0 }}>
          뉴스 요약이 느려 화면이 멈춘 것처럼 보이던 문제는{'\n'}
          <b style={{ color: 'var(--c-ink)', fontWeight: '800' }}>프로그레시브 로딩</b>으로 해결했습니다. 먼저 도착한 기사부터 렌더링합니다.
        </Body>
      </section>

      {/* 4. 아키텍처 */}
      <section id="architecture" style={{ marginBottom: '96px' }}>
        <SectionTitle>아키텍처</SectionTitle>
        <div style={{ marginBottom: '24px' }}>
          <ArchitectureDiagram />
        </div>
        <Body style={{ marginBottom: 0 }}>
          <b style={{ color: 'var(--c-ink)', fontWeight: '800' }}>모든 외부 API 키는 Supabase Edge Function을 프록시로 거칩니다.</b>{'\n'}
          클라이언트에 노출되지 않습니다. 현재 4개의 Edge Function이 동작합니다 —{'\n'}
          <Mono>solar</Mono> · <Mono>news</Mono> · <Mono>indices</Mono> · <Mono>economic-stats</Mono>.
        </Body>
        <Body style={{ marginBottom: 0, marginTop: '16px' }}>
          개인정보처리방침·이용약관을 갖추고, 회원가입 시 실제로 동의하지 않으면
          가입이 진행되지 않도록 막았습니다.
        </Body>
      </section>

      {/* 5. 사용한 API */}
      <section id="apis" style={{ marginBottom: '96px' }}>
        <SectionTitle>사용한 API</SectionTitle>
        <Body>
          7개의 외부 API를 사용합니다. 모두 Supabase Edge Function 4개를 통해{'\n'}
          호출하며, 클라이언트에 키가 노출되지 않습니다.
        </Body>

        <ApiGroup
          title="AI"
          rows={[['Upstage Solar AI', <Mono key="1">api.upstage.ai/v1/solar/chat/completions</Mono>, '코치 답변 · 뉴스 요약 · 로드맵 생성 · 인포그래픽 생성 등 9개 기능']]}
        />
        <ApiGroup
          title="뉴스"
          rows={[['네이버 검색 API', <Mono key="1">openapi.naver.com/v1/search/news.json</Mono>, '경제 뉴스 수집 (카테고리별 · 최신순)']]}
        />
        <ApiGroup
          title="정부 · 공공 통계"
          highlight
          rows={[
            ['한국은행 ECOS', <Mono key="1">ecos.bok.or.kr/api/StatisticSearch</Mono>, '기준금리 · 장단기 금리 · 무역수지'],
            ['통계청 KOSIS', <Mono key="2">kosis.kr/openapi/Param/statisticsParameterData.do</Mono>, '소비자물가지수 · 실업률 · GDP 성장률'],
          ]}
          note={'지표 11종 중 6종이 정부 실제 데이터입니다.\n나머지는 무료 실시간 소스가 없어 예시 데이터임을 화면에 명시했습니다.'}
        />
        <ApiGroup
          title="시장 지표"
          rows={[
            ['Yahoo Finance', <Mono key="1">query1.finance.yahoo.com/v8/finance/chart</Mono>, '코스피 · 코스닥 실시간 지수'],
            ['ExchangeRate API', <Mono key="2">open.er-api.com/v6/latest/USD</Mono>, '원/달러 환율'],
            ['Frankfurter', <Mono key="3">api.frankfurter.app</Mono>, '환율 백업 소스'],
          ]}
          note={'환율은 두 곳을 쓰는데, 한 곳이 실패하면 다른 곳으로 넘어가도록\n폴백을 두었습니다. 외부 API는 언제든 응답하지 않을 수 있기 때문입니다.'}
        />

        <p style={{ fontSize: '12px', fontWeight: '800', color: 'var(--c-muted)', letterSpacing: '0.4px', marginTop: '28px', marginBottom: '10px' }}>
          EDGE FUNCTION 구성
        </p>
        <CodeBlock>{'solar            → Upstage Solar AI\nnews             → 네이버 검색 API\nindices          → Yahoo Finance · ExchangeRate · Frankfurter\neconomic-stats   → 한국은행 ECOS · 통계청 KOSIS'}</CodeBlock>
      </section>

      {/* 6. 기술 스택 */}
      <section id="tech-stack" style={{ marginBottom: '96px' }}>
        <SectionTitle>기술 스택</SectionTitle>
        <DataTable columns={['영역', '사용 기술']} rows={TECH_STACK} />
        <Body style={{ marginBottom: 0 }}>
          <b style={{ color: 'var(--c-ink)', fontWeight: '800' }}>모바일 우선으로 설계했지만 데스크톱도 고려했습니다.</b>{'\n'}
          좁은 화면에서는 앱처럼, 넓은 화면에서는 브랜드 패널과 함께{'\n'}
          중앙 컬럼으로 배치됩니다. 안드로이드는 Capacitor로 패키징해{'\n'}
          갤럭시 S24 실기기에서 검증을 마쳤습니다.
        </Body>
      </section>

      {/* 7. 기록을 남기며 만들었습니다 */}
      <section id="devlog" style={{ marginBottom: '96px' }}>
        <SectionTitle>기록을 남기며 만들었습니다</SectionTitle>
        <Body>무엇을 왜 그렇게 결정했는지 전부 기록하며 만들었습니다.</Body>

        <DataTable columns={['문서', '내용']} rows={DOCS} />

        <div style={{ marginBottom: '32px' }}>
          <GithubLink href="https://github.com/namong118/economing/blob/main/개발일지.md">
            개발일지 전문 보기 → GitHub
          </GithubLink>
        </div>

        {/* 실제 기록 발췌 — 접기/펼치기: 애니메이션 없는 순수 HTML <details>라 JS 없이도 동작 */}
        <details style={{
          background: 'var(--c-surface)', border: '1.5px solid var(--c-line)',
          borderRadius: '16px', padding: '4px 20px', marginBottom: '28px',
        }}>
          <summary style={{
            cursor: 'pointer', padding: '16px 0',
            fontSize: '14px', fontWeight: '800', color: 'var(--c-forest-700)',
          }}>
            실제 기록 — 2026.07.25 (개발일지 원문 발췌) 펼쳐보기
          </summary>

          <div style={{ paddingBottom: '20px' }}>
            <Quote style={{ marginTop: 0 }}>
              아래는 개발일지 원문 일부입니다. 편집하지 않았습니다.
            </Quote>

            <blockquote style={{
              margin: '0 0 20px', padding: '20px 22px',
              background: 'var(--c-canvas)', border: '1.5px solid var(--c-line)',
              borderLeft: '4px solid var(--c-forest-700)',
              borderRadius: '4px 14px 14px 4px',
              fontSize: '14px', color: 'var(--c-ink)', lineHeight: 1.85,
            }}>
              <p style={{ fontWeight: '800', marginBottom: '12px' }}>Google 로그인 버그 발견 및 해결</p>
              <p style={{ whiteSpace: 'pre-line', marginBottom: '12px' }}>
                {'실기기 테스트 중 발견: 소셜 로그인 시 앱이 완전히 웹사이트로 이탈해서\n못 돌아오는 문제'}
              </p>
              <p style={{ whiteSpace: 'pre-line', marginBottom: '12px' }}>
                {'- 원인: signInWithOAuth가 앱의 WebView를 직접 이동시키는 방식이라,\n  네이티브 앱 안에서는 redirectTo가 실제 도메인이 아니라서\n  로그인 후 앱으로 복귀 불가'}
              </p>
              <p style={{ whiteSpace: 'pre-line', marginBottom: '12px' }}>
                {'1차 수정: @capacitor/browser + @capacitor/app으로 인앱 브라우저\n+ 커스텀 URL 스킴 딥링크 방식으로 전환'}
              </p>
              <p style={{ whiteSpace: 'pre-line', marginBottom: '12px' }}>
                {'그런데 실기기(삼성 갤럭시)에서 재현 테스트 결과,\n삼성 인터넷의 Custom Tabs 구현이 커스텀 스킴 딥링크를 앱으로 못 넘겨줌\n— adb logcat / dumpsys window로 실제 포그라운드가\ncom.sec.android.app.sbrowser임을 직접 증명'}
              </p>
              <p style={{ whiteSpace: 'pre-line', marginBottom: '12px' }}>
                {'최종 해결: Google 로그인을 Credential Manager 기반 네이티브 로그인으로\n전면 교체 — 브라우저를 아예 거치지 않아 이 문제 자체가 발생하지 않음'}
              </p>
              <p style={{ whiteSpace: 'pre-line', marginBottom: '16px' }}>
                {'카카오는 이번엔 네이티브 SDK로 못 넘어감 — 조사해본 커뮤니티 플러그인이\nSupabase가 요구하는 OIDC id_token을 아예 반환하지 않는 걸\n소스 코드까지 열어서 확인 → 추후 과제로 남김'}
              </p>
              <p style={{ fontWeight: '800', marginBottom: '8px' }}>검증</p>
              <p style={{ whiteSpace: 'pre-line', margin: 0 }}>
                {'- 실제 갤럭시 S24에서 설치 → 네이티브 로그인 → 홈 화면까지 전 과정 확인\n- adb logcat으로 매번 실제 로그 기반 진단 — 추측 대신 증거로 디버깅'}
              </p>
            </blockquote>
          </div>
        </details>

        <Quote emphasized>이런 기록이 19개 있습니다.</Quote>

        <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--c-forest-700)', letterSpacing: '-0.3px', marginTop: '32px', marginBottom: '14px' }}>
          실패한 시도도 남겼습니다
        </h3>
        <Body>
          커리큘럼 작업 기록에는 폐기된 초안 3개와{'\n'}
          <b style={{ color: 'var(--c-ink)', fontWeight: '800' }}>실패로 끝난 선행 개념 분석</b>이 그대로 남아 있습니다.
        </Body>
        <Body>
          커리큘럼 순서를 "A를 알아야 B를 안다"는 관계로 정하려 했으나,{'\n'}
          70개 중 44개가 선행 개념 없음으로 나와 실패했습니다.{'\n'}
          대신 난이도와 선행 깊이가 별개 축이라는 것을 확인했고,{'\n'}
          순서 기준을 "일상에 가까운 것부터"로 바꿨습니다.
        </Body>
        <Quote emphasized style={{ marginBottom: 0 }}>
          어떤 판단이 왜 뒤집혔는지가 기록의 핵심입니다.
        </Quote>
      </section>

      {/* 8. 품질 관리 */}
      <section id="quality" style={{ marginBottom: '96px' }}>
        <SectionTitle>품질 관리</SectionTitle>
        <Body>콘텐츠가 늘어나면서 수동 확인이 불가능해져 검사 스크립트를 만들었습니다.</Body>
        <CodeBlock>npm run check:content</CodeBlock>

        <ChecklistItem>본문 · 퀴즈 · 인포그래픽 3종의 짝 누락</ChecklistItem>
        <ChecklistItem>커리큘럼 챕터/순서 누락 및 중복</ChecklistItem>
        <ChecklistItem>존재하지 않는 개념을 참조하는 깨진 링크</ChecklistItem>
        <ChecklistItem>퀴즈 구조(4지선다 · 정답 인덱스 범위)와 정답 위치 분포</ChecklistItem>

        <Body style={{ marginTop: '20px' }}>
          마지막 항목은 실제 문제를 발견했습니다.{'\n'}
          기존 60문항 중 1번 자리 정답이{' '}
          <b style={{ color: 'var(--c-ink)', fontWeight: '900', fontSize: '17px' }}>0개</b>, 4번이 1개였습니다.{'\n'}
          <b style={{ color: 'var(--c-ink)', fontWeight: '900', fontSize: '17px' }}>98%</b>가 2~3번에 몰려 있어 사실상 2지선다였습니다.
        </Body>
        <Body style={{ marginBottom: 0 }}>
          전 문항을 재배치해 <b style={{ color: 'var(--c-ink)', fontWeight: '900', fontSize: '17px' }}>25 / 25 / 26 / 25</b>로 균등화했습니다.
        </Body>
      </section>

      {/* 9. 트러블슈팅 */}
      <section id="troubleshooting" style={{ marginBottom: '96px' }}>
        <SectionTitle>트러블슈팅</SectionTitle>
        <Body>만들면서 실제로 막힌 문제 넷을 그대로 남깁니다. 추측이 아니라 증거로 찾았습니다.</Body>

        <StepHeading num="①">안드로이드 로그인 — 실기기에서만 나타난 버그</StepHeading>
        <Body>
          구글 로그인 시 앱이 웹사이트로 이탈해서 못 돌아오는 문제가 실기기(갤럭시)에서만{'\n'}
          재현됐습니다. 안드로이드 실시간 로그(adb logcat)와 화면 전환 기록(dumpsys window)으로{'\n'}
          그 순간 실제로 떠 있는 화면을 추적한 결과, 삼성 인터넷의 인앱 브라우저 기능(Custom Tabs)이{'\n'}
          앱으로 되돌아가는 연결(딥링크)을 넘겨주지 못한다는 걸 직접 증명했습니다.
        </Body>
        <Body>
          구글 로그인은 브라우저를 아예 거치지 않는 안드로이드 기본 로그인 방식(Credential Manager)으로{'\n'}
          전면 교체해 해결했습니다. 카카오 로그인은 커뮤니티 플러그인의 소스 코드를 직접 열어,{'\n'}
          Supabase 인증이 요구하는 형식의 로그인 토큰을 카카오 SDK가 돌려주지 않는다는 걸{'\n'}
          확인했고, 이 부분은 향후 과제로 남겼습니다.
        </Body>
        <Quote>
          추측 대신 로그로 증명하고, 안 되는 이유를 소스 코드까지 확인한 뒤 남은 과제로 분리했습니다.
        </Quote>

        <StepHeading num="②">AI 검증 — 76%가 아니라 13%였습니다</StepHeading>
        <Body>
          뉴스 기반 콘텐츠 자동생성을 검토하며 AI에게 '우리 콘텐츠와 뉴스 용어가{'\n'}
          이름만 다른 것인가'를 물었더니 76%가 그렇다고 답했습니다. 같은 데이터를 두고{'\n'}
          질문만 '틀렸다고 가정하고 근거를 찾아라'로 바꾸자 13%로 줄었습니다.
        </Body>
        <Body>
          정답 목록을 프롬프트에 전부 넣었는데도 존재하지 않는 콘텐츠를 지어낸 경우가{'\n'}
          7건 있었습니다. 질문 하나를 잘못 던지면 검증 결과 자체가 뒤집힐 수 있다는 걸{'\n'}
          확인하고, 자동 발행을 포기하고 사람이 검수하는 구조로 바꿨습니다.
        </Body>

        <StepHeading num="③">퀴즈 정답 위치 편향 — 0%와 98%</StepHeading>
        <Body>
          앞서 만든 정합성 검사 스크립트로 정답 위치 분포를 집계해보니 기존 60문항 중 1번 자리{'\n'}
          정답이 0개, 4번이 1개였습니다. 98%가 2~3번에 몰려 있어 사실상 2지선다였습니다.
        </Body>
        <Body>
          전 문항을 재배치해 25 / 25 / 26 / 25로 균등화했고, 이후 신규 문항도{'\n'}
          이 검사를 통과해야 병합되도록 했습니다.
        </Body>

        <StepHeading num="④">미연결 코드 — 붙어 있지만 안 쓰이던 함수</StepHeading>
        <Body>
          학습 완료를 기록하는 함수가 있었는데, 실제로는 홈 화면 로딩{'\n'}
          경로 한 곳에만 연결돼 있어서 다른 진입 경로로 카드를 봐도 진도가 오르지 않는{'\n'}
          문제가 있었습니다.
        </Body>
        <Body style={{ marginBottom: 0 }}>
          같은 패턴 — 함수는 존재하지만 호출부가 다 안 붙어 있는 경우 — 이 네 번{'\n'}
          반복되는 걸 확인하고, 그 정합성 검사 스크립트에 연결 여부를 자동으로 잡는 항목을{'\n'}
          추가했습니다.
        </Body>

        <StepHeading num="⑤">등락률 계산 오류 — "어제"가 아니라 "한 달 전"이었습니다</StepHeading>
        <Body>
          코스피·코스닥 등락률이 이상하게 크게 나온 적이 있습니다. 데이터를{'\n'}
          직접 찍어보니 −33% 같은 값이 나왔는데, 실제 하루 변동은 −0.8% 정도였습니다.
        </Body>
        <Body style={{ marginBottom: 0 }}>
          원인은 Yahoo Finance API의 <Mono>chartPreviousClose</Mono> 필드였습니다.{'\n'}
          1개월치 데이터를 요청할 때 이 필드가 "어제 종가"가 아니라 "한 달 전{'\n'}
          종가"를 가리키고 있었습니다. 외부 API 응답에 이미 갖고 있던 일별{'\n'}
          데이터(history)에서 직접 전일 대비를 계산하는 방식으로 바꿔서 해결했습니다.
        </Body>

        <StepHeading num="⑥">뉴스 검색어 — 키워드 하나로는 부족했습니다</StepHeading>
        <Body>
          "경제"라는 단어 하나로 뉴스를 검색하니, 본문 어딘가에 그 단어만{'\n'}
          들어가면 다 걸렸습니다. 섬유 산업 전시회 기사가 "국가 경제에 기여한다"는{'\n'}
          문장 하나 때문에 경제 뉴스로 분류되는 식이었습니다.
        </Body>
        <Body style={{ marginBottom: 0 }}>
          카테고리마다 더 구체적인 복합 키워드(예: "경제 금리 물가 증시 수출입")로{'\n'}
          바꾸자, 무관한 기사가 눈에 띄게 줄었습니다.
        </Body>

        <Quote emphasized style={{ marginBottom: 0 }}>
          여섯 가지 모두 '왜 안 되는지'를 증거로 확인한 뒤에 고쳤다는 공통점이 있습니다.
        </Quote>
      </section>

      {/* 10. 커밋 이력 */}
      <section id="commits" style={{ marginBottom: '96px' }}>
        <SectionTitle>커밋 이력</SectionTitle>

        <div style={{ marginBottom: '20px' }}>
          {COMMIT_TYPES.map(c => <CommitBar key={c.label} {...c} max={MAX_COMMIT} />)}
        </div>

        <Body style={{ marginBottom: 0 }}>
          <Mono>fix</Mono>가 <Mono>feat</Mono>에 근접하는 것은 만든 것을 계속 검증하고 고쳤다는 뜻입니다.
        </Body>
      </section>

      {/* 11. 향후 계획 */}
      <section id="future-plans" style={{ marginBottom: '96px' }}>
        <SectionTitle>향후 계획</SectionTitle>
        <Body>지금 버전은 시작점입니다. 다음 일곱 가지를 순서대로 진행할 계획입니다.</Body>

        <DataTable
          columns={['계획', '내용']}
          rows={[
            [
              <ChecklistItem key="1">커리큘럼 확장</ChecklistItem>,
              <span key="1c">뉴스 분석으로 검증한 콘텐츠 후보 224개를 순차 반영해 11챕터 96개에서 확장</span>,
            ],
            [
              <ChecklistItem key="2">복습 설계</ChecklistItem>,
              '커리큘럼을 완주한 사용자를 위한 복습/재진단 흐름 설계 — 현재는 첫 완주 이후 경험이 비어 있음',
            ],
            [
              <ChecklistItem key="3">지표 데이터 실측 전환</ChecklistItem>,
              'PER · 공포탐욕지수 2종은 현재 예시 데이터 — 무료 실시간 소스를 확보해 나머지 2종도 실제 숫자로 전환',
            ],
            [
              <ChecklistItem key="4">카카오 로그인 네이티브 전환</ChecklistItem>,
              '카카오 SDK가 Supabase 인증에 필요한 형식의 로그인 토큰을 아직 지원하지 않아, 이를 지원하는 방식을 추가로 조사해 구글과 동일한 네이티브 로그인으로 전환',
            ],
            [
              <ChecklistItem key="5">스토어 배포</ChecklistItem>,
              '현재 APK 직접 설치로 실기기 검증까지 마친 상태 — Google Play 정식 등록 절차 진행',
            ],
            [
              <ChecklistItem key="6">노밍 답변 근거화(RAG 도입)</ChecklistItem>,
              '지금은 콘텐츠 규모가 작아 검색 품질을 보장하기 어려워, 커리큘럼이 충분히 확장되어 검색 대상 데이터가 늘어나는 시점에 Supabase pgvector 기반으로 노밍 답변에 경제한잎 콘텐츠를 근거로 제시하는 기능 추가 예정',
            ],
            [
              <ChecklistItem key="8">결제 시스템 도입</ChecklistItem>,
              '지금은 전 기능 무료 — 사용자 기반이 쌓인 뒤, 무제한 노밍 대화·인포그래픽 생성 등을 중심으로 한 프리미엄 구독 모델 도입 예정',
            ],
          ]}
        />

        <Quote emphasized style={{ marginBottom: 0 }}>
          기능을 늘리는 계획과, 이미 만든 걸 더 정확하게 만드는 계획을 같이 가져갑니다.
        </Quote>
      </section>

    </div>
  );
}

function ChecklistItem({ children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
      <div style={{
        width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0, marginTop: '2px',
        background: 'var(--c-green-100)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Check size={12} color="var(--c-forest-700)" strokeWidth={3} />
      </div>
      <p style={{ fontSize: '14.5px', color: 'var(--c-ink)', lineHeight: '1.6', margin: 0 }}>{children}</p>
    </div>
  );
}
