import { Check } from 'lucide-react';

/* ── 공통 조각 ─────────────────────────────────────────── */

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

function ProblemCard({ title, children }) {
  return (
    <div style={{
      background: 'var(--c-surface)', border: '1.5px solid var(--c-line)',
      borderRadius: '18px', padding: '24px', marginBottom: '14px',
    }}>
      <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--c-forest-700)', marginBottom: '10px', letterSpacing: '-0.3px' }}>
        {title}
      </h3>
      <p style={{ fontSize: '14.5px', color: 'var(--c-slate)', lineHeight: '1.8', whiteSpace: 'pre-line', margin: 0 }}>
        {children}
      </p>
    </div>
  );
}

function ChecklistItem({ children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '14px' }}>
      <div style={{
        width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0, marginTop: '2px',
        background: 'var(--c-green-100)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Check size={13} color="var(--c-forest-700)" strokeWidth={3} />
      </div>
      <p style={{ fontSize: '15.5px', color: 'var(--c-ink)', lineHeight: '1.65', margin: 0 }}>{children}</p>
    </div>
  );
}

function CompareCard({ before, after }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0,
      border: '1.5px solid var(--c-line)', borderRadius: '16px', overflow: 'hidden', marginBottom: '10px',
    }}>
      <div style={{ padding: '16px 18px', background: 'var(--c-surface)', borderRight: '1.5px solid var(--c-line)' }}>
        <p style={{ fontSize: '10.5px', fontWeight: '800', color: 'var(--c-muted)', letterSpacing: '0.5px', marginBottom: '6px' }}>그때의 문제</p>
        <p style={{ fontSize: '14px', color: 'var(--c-slate)', lineHeight: '1.6', margin: 0 }}>{before}</p>
      </div>
      <div style={{ padding: '16px 18px', background: 'var(--c-green-50)' }}>
        <p style={{ fontSize: '10.5px', fontWeight: '800', color: 'var(--c-forest-700)', letterSpacing: '0.5px', marginBottom: '6px' }}>지금의 기능</p>
        <p style={{ fontSize: '14px', color: 'var(--c-forest-700)', lineHeight: '1.6', fontWeight: '600', margin: 0 }}>{after}</p>
      </div>
    </div>
  );
}

function StepBlock({ num, title, children }) {
  return (
    <div style={{ display: 'flex', gap: '16px', marginBottom: '36px' }}>
      <div style={{
        width: '34px', height: '34px', borderRadius: '10px', flexShrink: 0,
        background: 'var(--grad-action)', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '15px', fontWeight: '900',
      }}>
        {num}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--c-ink)', marginBottom: '10px', letterSpacing: '-0.3px' }}>
          {title}
        </h3>
        {children}
      </div>
    </div>
  );
}

const CURRICULUM_CHAPTERS = [
  '자산의 기본', '저축과 보험', '물가', '금리와 통화정책', '집',
  '투자 첫걸음', '포트폴리오와 투자 위험', '나라 경제 읽기', '세금',
  '노후 준비', '시장을 움직이는 원리',
];

/* ── 메인 ─────────────────────────────────────────────────── */
export default function AboutPage() {
  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '88px 32px 140px' }}>

      {/* 1. 히어로 */}
      <section style={{ marginBottom: '112px' }}>
        <h1 style={{
          fontSize: 'clamp(30px, 5vw, 42px)', fontWeight: '900',
          color: 'var(--c-ink)', letterSpacing: '-0.02em', lineHeight: 1.35,
          marginBottom: '24px',
        }}>
          경제 공부, 어디서부터 시작해야 할지 모르는 사람들을 위해
        </h1>
        <p style={{ fontSize: '17px', color: 'var(--c-slate)', lineHeight: '1.9', whiteSpace: 'pre-line', margin: 0 }}>
          {'주식도 부동산도 뉴스도 다 어렵게 느껴질 때.\nECONOMING은 AI가 수준을 진단하고, 사람이 검증한 커리큘럼으로 배우고,\n막히면 AI 코치에게 다시 묻는 경제 학습 앱입니다.'}
        </p>
      </section>

      {/* 2. 문제 — 세 가지 벽 */}
      <section style={{ marginBottom: '96px' }}>
        <SectionTitle>경제 공부를 시작하려는 사람 앞에는 세 가지 벽이 있습니다.</SectionTitle>

        <ProblemCard title="어렵다">
          {'경제 뉴스는 이미 아는 사람을 전제로 쓰여 있습니다.\n기준금리, 무역수지, 장단기 금리 역전.\n모르는 단어를 검색하면 그 설명에 또 모르는 단어가 나옵니다.'}
        </ProblemCard>
        <ProblemCard title="지속되지 않는다">
          {'유튜브로 배워보려 하지만, 유튜브에는 경제 영상 말고도 재미있는 게 너무 많습니다.\n영상 하나를 보다가 추천 영상으로 넘어가고,\n며칠 지나면 공부를 시작했다는 사실조차 흐려집니다.'}
        </ProblemCard>
        <ProblemCard title="순서가 없다">
          {'주식, 투자, 부동산, 연금, 절세.\n해야 할 것 같은 이야기는 계속 들려오는데\n무엇부터 손대야 하는지 알려주는 곳이 없습니다.\n\n서점의 입문서는 두껍고, 유튜브는 이미 투자를 하는 사람을 향해 말합니다.'}
        </ProblemCard>

        <Quote emphasized>
          {'"경제적으로 자립하고 싶은데, 어디서 어떻게 무엇부터 해야 하는가."\n\n이 질문에 답하는 것이 ECONOMING의 목표입니다.'}
        </Quote>
      </section>

      {/* 3. 누구를 위한 앱인가 */}
      <section style={{ marginBottom: '96px' }}>
        <SectionTitle>누구를 위한 앱인가</SectionTitle>
        <p style={{
          fontSize: 'clamp(20px, 3vw, 24px)', fontWeight: '900', color: 'var(--c-forest-700)',
          letterSpacing: '-0.02em', marginBottom: '28px',
        }}>
          20~30대 사회초년생 · 경제 초보자
        </p>

        <ChecklistItem>첫 월급을 받았는데 어디에 어떻게 둬야 할지 모르는 사람</ChecklistItem>
        <ChecklistItem>대출 금리 뉴스가 내 이야기인 건 알겠는데 정확히 뭘 뜻하는지 모르는 사람</ChecklistItem>
        <ChecklistItem>투자를 해야 할 것 같은데 시작점을 못 찾는 사람</ChecklistItem>
        <ChecklistItem>경제 기사를 열었다가 세 줄 만에 닫아본 적 있는 사람</ChecklistItem>

        <Body style={{ marginTop: '24px', marginBottom: 0 }}>
          주식 종목을 추천받고 싶은 사람이 아니라,{'\n'}
          <b style={{ color: 'var(--c-ink)', fontWeight: '800' }}>스스로 판단할 수 있게 되고 싶은 사람</b>을 위해 만들었습니다.
        </Body>
      </section>

      {/* 4. 나의 이야기 */}
      <section style={{ marginBottom: '96px' }}>
        <SectionTitle>나의 이야기</SectionTitle>

        <Body>경제 공부를 시작하고 싶었습니다.</Body>
        <Body>{'경제 뉴스를 읽어보려 했지만 재미가 없었습니다.\n무슨 말인지 모르겠으니 재미있을 수가 없었습니다.'}</Body>
        <Body>{'그래서 유튜브를 켰습니다.\n그런데 유튜브에는 경제 영상 말고도 재미있는 게 너무 많았습니다.\n영상 하나를 보다가 추천 영상으로 넘어가고, 며칠 지나면 경제 공부를\n시작했다는 사실조차 잊고 있었습니다.'}</Body>
        <Body>{'주식이니 투자니 부동산이니 하는 이야기는 계속 들려왔습니다.\n경제적으로 자립하고 싶다는 마음은 있었습니다.'}</Body>
        <Body>그런데 어디서, 어떻게, 무엇부터 시작해야 하는지를 몰랐습니다.</Body>
        <Body style={{ marginBottom: '40px' }}>ECONOMING은 그때 제가 필요했던 것을 만든 결과입니다.</Body>

        <h3 style={{
          fontSize: '21px', fontWeight: '900', color: 'var(--c-forest-700)',
          letterSpacing: '-0.02em', marginBottom: '20px',
        }}>
          막혔던 지점이 그대로 기능이 되었습니다
        </h3>

        <CompareCard
          before="뉴스가 어려워서 못 읽었다"
          after="AI가 뉴스를 초보자 관점으로 다시 쓰고, 모르는 용어를 뽑아 설명합니다"
        />
        <CompareCard
          before="유튜브로는 흥미를 유지하지 못했다"
          after="하루에 한 개, 끝이 있는 96개 커리큘럼. 진도와 연속 학습일이 남습니다"
        />
        <CompareCard
          before="무엇부터 할지 몰랐다"
          after="순서가 정해진 11챕터. 일상에 가까운 것부터 배웁니다"
        />
        <CompareCard
          before="자립하고 싶은데 방법을 몰랐다"
          after="자립 진단과 실행 로드맵. 오늘 5분 안에 할 일까지 알려줍니다"
        />

        <Body style={{ marginTop: '24px', marginBottom: 0 }}>
          경제학자가 되려고 만든 앱이 아닙니다.{'\n'}
          <b style={{ color: 'var(--c-ink)', fontWeight: '800' }}>내 돈에 대해 스스로 판단할 수 있게 되는 것</b>이 목표입니다.{'\n'}
          뉴스 한 줄을 읽어내는 것도, 첫 저축 상품을 고르는 것도 그 안에 있습니다.
        </Body>
      </section>

      {/* 5. 어떻게 풀었나 — 세 단계 */}
      <section style={{ marginBottom: '96px' }}>
        <SectionTitle>어떻게 풀었나 — 세 단계</SectionTitle>

        <StepBlock num="1" title="AI가 수준을 진단합니다">
          <Body style={{ marginBottom: 0 }}>
            {'10개 문항으로 경제 지식 수준을 5단계로 나눕니다.\n같은 질문에도 사람마다 다른 설명이 필요하기 때문입니다.'}
          </Body>
        </StepBlock>

        <StepBlock num="2" title="사람이 검증한 커리큘럼으로 배웁니다">
          <Body>
            <b style={{ color: 'var(--c-ink)', fontWeight: '800' }}>11챕터 96개 단어.</b> 순서가 있습니다.
          </Body>
          <div style={{
            overflowX: 'auto', whiteSpace: 'nowrap', WebkitOverflowScrolling: 'touch',
            padding: '14px 16px', background: 'var(--c-green-50)', border: '1px solid var(--c-green-100)',
            borderRadius: '12px', marginBottom: '18px',
          }}>
            <span style={{ fontSize: '13.5px', color: 'var(--c-forest-700)', fontWeight: '600' }}>
              {CURRICULUM_CHAPTERS.join(' → ')}
            </span>
          </div>
          <Body>
            {'일상에 가까운 것에서 먼 것으로 배치했습니다.\n96개 전부 설명 · 인포그래픽 · 퀴즈를 갖추고 있습니다.'}
          </Body>
          <Body style={{ marginBottom: 0 }}>
            <b style={{ color: 'var(--c-ink)', fontWeight: '800' }}>무엇을 가르칠지, 어떤 순서로 배울지는 사람이 정했습니다.</b>{'\n'}
            실제 경제 뉴스 420건을 분석해 어떤 용어가 얼마나 자주 쓰이는지 측정하고,{'\n'}
            그 데이터를 근거로 96개를 선별하고 순서를 잡았습니다.
          </Body>
        </StepBlock>

        <StepBlock num="3" title="막히면 AI 코치에게 다시 묻습니다">
          <Body>
            {'커리큘럼 밖의 질문, 오늘 뉴스에 나온 낯선 단어,\n"그래서 내가 뭘 해야 하죠?" 같은 물음은 AI 코치 노밍이 받습니다.'}
          </Body>
          <Body style={{ marginBottom: 0 }}>
            노밍은 사용자 레벨에 따라 설명 깊이를 5단계로 바꾸고,{'\n'}
            모든 답변 끝에 <b style={{ color: 'var(--c-ink)', fontWeight: '800' }}>"오늘 5분 안에 할 수 있는 한 가지"</b>를 붙입니다.
          </Body>
        </StepBlock>
      </section>

      {/* 6. 배우고 나면 그다음 */}
      <section style={{ marginBottom: '96px' }}>
        <SectionTitle>배우고 나면 그다음</SectionTitle>

        <Body>경제 용어를 안다고 통장이 달라지지는 않습니다.</Body>
        <Body>
          그래서 <b style={{ color: 'var(--c-ink)', fontWeight: '800' }}>경제 자립 진단</b>과 <b style={{ color: 'var(--c-ink)', fontWeight: '800' }}>AI 개인화 로드맵</b>을 붙였습니다.{'\n'}
          비상금·저축·부채·연금·보험·투자·절세 등 10개 영역을 진단하고,{'\n'}
          그 결과로 실행 계획을 만듭니다.
        </Body>
        <Body>로드맵의 각 단계는 이렇게 생겼습니다.</Body>

        <Quote>
          {'"네이버에서 \'ISA 계좌\' 검색 → 나이 확인 →\n일반형 / 서민형 중 해당 유형 메모하기 (5분)"'}
        </Quote>

        <Body style={{ marginBottom: 0 }}>
          "절세 상품을 알아보세요" 같은 말은 쓰지 않습니다.{'\n'}
          <b style={{ color: 'var(--c-ink)', fontWeight: '800' }}>앱 이름과 클릭 순서와 소요 시간까지</b> 적습니다.
        </Body>
      </section>

      {/* 7. 만들면서 내린 판단 */}
      <section style={{ marginBottom: '96px' }}>
        <SectionTitle>만들면서 내린 판단</SectionTitle>

        <Body style={{ fontWeight: '800', color: 'var(--c-ink)', fontSize: '17px' }}>
          AI를 어디까지 믿을 것인가.
        </Body>
        <Body>
          {'콘텐츠가 부족해지자 뉴스에서 AI가 학습 카드를 자동 생성하는 파이프라인을\n검토했습니다. 사람 손을 거치지 않고 콘텐츠가 계속 늘어나는 구조입니다.'}
        </Body>
        <Body>만들기 전에 먼저 검증했습니다.</Body>
        <Body>
          {'AI에게 "우리 콘텐츠와 뉴스 용어가 이름만 다른 것인가"를 물었더니\n'}76%가 그렇다고 답했습니다. 그 말대로라면 별칭만 붙여도 해결되는{'\n문제였습니다.'}
        </Body>
        <Body>
          {'같은 데이터를 두고 질문만 바꿨습니다.\n"틀렸다고 가정하고 근거를 찾아라."'}
        </Body>

        {/* 76% -> 13% 강조 */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px',
          margin: '32px 0', padding: '32px 20px',
          background: 'var(--c-forest-700)', borderRadius: '20px',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 'clamp(36px, 6vw, 48px)', fontWeight: '900', color: 'rgba(255,255,255,0.55)', letterSpacing: '-0.02em' }}>76%</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', fontWeight: '700', marginTop: '4px' }}>같은 것이다</div>
          </div>
          <div style={{ fontSize: '22px', color: 'rgba(255,255,255,0.4)' }}>→</div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 'clamp(44px, 7vw, 60px)', fontWeight: '900', color: '#fff', letterSpacing: '-0.02em' }}>13%</div>
            <div style={{ fontSize: '12px', color: 'var(--c-green-300)', fontWeight: '700', marginTop: '4px' }}>근거를 찾아라</div>
          </div>
        </div>

        <Body>
          정답 목록을 프롬프트에 전부 넣었는데도, 존재하지 않는 콘텐츠를{'\n'}지어낸 경우가 7건 있었습니다.
        </Body>

        <Body style={{ fontWeight: '800', color: 'var(--c-ink)', fontSize: '16.5px' }}>
          그래서 자동 발행을 포기하고, 검수를 거치는 구조로 바꿨습니다.
        </Body>
        <Body>
          AI는 지금도 학습 카드의 초안을 씁니다. 다만 발행 전에 사람이 확인합니다.{'\n'}
          특히 <b style={{ color: 'var(--c-ink)', fontWeight: '800' }}>금액과 계산이 들어간 문장, 퀴즈의 정답</b>은 반드시 눈으로 봅니다.{'\n'}
          금융 정보는 틀려도 사용자가 알아차리지 못하기 때문입니다.
        </Body>
        <Body>
          {'무엇을 가르칠지, 어떤 순서로 배울지는 사람이 정했습니다.\n실제 경제 뉴스 420건을 분석한 데이터를 근거로요.'}
        </Body>
        <Body>
          {'AI는 코치 · 뉴스 요약 · 로드맵 생성 · 인포그래픽에도 사용합니다.\n틀려도 사용자가 다시 물어볼 수 있는 영역입니다.'}
        </Body>

        <Quote emphasized style={{ marginBottom: 0 }}>
          판단 기준은 "AI냐 아니냐"가 아니라 "틀렸을 때 비용이 얼마인가"였습니다.
        </Quote>
      </section>

    </div>
  );
}
