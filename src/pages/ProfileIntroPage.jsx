import { Check, Mail } from 'lucide-react';
import SectionNav from '../components/layout/SectionNav';

function GithubIcon({ size = 18 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.05 11.05 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.8 1.18 1.83 1.18 3.09 0 4.43-2.69 5.4-5.25 5.69.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .31.21.68.8.56A10.51 10.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z" />
    </svg>
  );
}

/* ── 공통 조각 (About · Tech와 동일 톤) ─────────────────────── */

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

/* ── 이 페이지 전용 조각 ──────────────────────────────────── */

function InfoRow({ label, value }) {
  return (
    <div style={{ display: 'flex', gap: '16px', marginBottom: '14px' }}>
      <span style={{ flex: '0 0 88px', fontSize: '13px', fontWeight: '800', color: 'var(--c-muted)', letterSpacing: '0.3px', paddingTop: '2px' }}>
        {label}
      </span>
      <span style={{ flex: 1, fontSize: '15px', color: 'var(--c-ink)', lineHeight: '1.6' }}>
        {value}
      </span>
    </div>
  );
}

function TagRow({ label, tags }) {
  return (
    <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', alignItems: 'flex-start' }}>
      <span style={{ flex: '0 0 88px', fontSize: '13px', fontWeight: '800', color: 'var(--c-muted)', letterSpacing: '0.3px', paddingTop: '6px' }}>
        {label}
      </span>
      <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {tags.map(tag => (
          <span key={tag} style={{
            fontSize: '13.5px', fontWeight: '700', color: 'var(--c-forest-700)',
            background: 'var(--c-green-50)', border: '1px solid var(--c-green-100)',
            borderRadius: '100px', padding: '6px 14px',
          }}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function PastExperienceCard({ title, children }) {
  return (
    <div style={{
      background: 'var(--c-surface)', border: '1.5px solid var(--c-line)',
      borderRadius: '18px', padding: '26px 28px', marginBottom: '18px',
    }}>
      <h3 style={{ fontSize: '17.5px', fontWeight: '800', color: 'var(--c-forest-700)', marginBottom: '12px', letterSpacing: '-0.3px' }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

const TECH_GROUPS = [
  { label: 'Game Dev', tags: ['Unity', 'C#', 'C++', 'UGUI', 'UniRx', 'Addressable', 'Flatbuffer'] },
  { label: '3D / Art', tags: ['Unreal Engine 5', '3ds Max', 'ZBrush', 'Substance 3D Painter', 'Blender', 'Houdini'] },
  { label: 'Shader', tags: ['HLSL', 'Unreal Material Editor'] },
  { label: 'Tools', tags: ['Jenkins', 'GitHub', 'SourceTree', 'Photoshop', 'Slack'] },
];

/* ── 메인 ─────────────────────────────────────────────────── */
export default function ProfileIntroPage() {
  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '96px 32px 120px' }}>

      <SectionNav sections={[
        { id: 'hero',            label: '소개·경력' },
        { id: 'after-quitting',  label: '퇴사 이후' },
        { id: 'newly-learned',   label: '새로 배운 것' },
        { id: 'what-to-build',   label: '무엇을 만들 것인가' },
        { id: 'past-experience', label: '이전 경험' },
      ]} />

      {/* 1. 히어로 + 경력 */}
      <section id="hero" style={{ marginBottom: '112px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <h1 style={{
            fontSize: 'clamp(36px, 6vw, 52px)', fontWeight: '900',
            color: 'var(--c-ink)', letterSpacing: '-0.02em', margin: 0,
          }}>
            박남영
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <a
              href="mailto:nmnmxe@gmail.com"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '8px 14px', borderRadius: '100px', flexShrink: 0,
                background: 'var(--c-green-50)', border: '1.5px solid var(--c-green-100)',
                color: 'var(--c-forest-700)', textDecoration: 'none',
                fontSize: '13.5px', fontWeight: '700',
              }}
            >
              <Mail size={16} strokeWidth={2} />
              nmnmxe@gmail.com
            </a>
            <a
              href="https://github.com/namong118"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '8px 14px', borderRadius: '100px', flexShrink: 0,
                background: 'var(--c-green-50)', border: '1.5px solid var(--c-green-100)',
                color: 'var(--c-forest-700)', textDecoration: 'none',
                fontSize: '13.5px', fontWeight: '700',
              }}
            >
              <GithubIcon size={16} />
              github.com/namong118
            </a>
          </div>
        </div>
        <Body style={{ wordBreak: 'keep-all', marginBottom: 0 }}>
          {'디자인과를 졸업해 프로그래밍을 공부했고, 게임 클라이언트 개발자로 3년 4개월을 보냈습니다.\n지금은 AI 개발자가 되기 위해 공부하고 있습니다.'}
        </Body>

        <SectionTitle style={{ marginTop: '44px' }}>경력</SectionTitle>

        <p style={{ fontSize: '17px', fontWeight: '800', color: 'var(--c-forest-700)', marginBottom: '18px', letterSpacing: '-0.2px' }}>
          게임 클라이언트 개발자 · 2021.04 – 2024.07 (3년 4개월)
        </p>

        <ChecklistItem>
          신규 캐주얼 방치형 타이쿤 게임, 초기 개발부터 알파 테스트까지
        </ChecklistItem>
        <ChecklistItem>
          라이브 서비스 유지 및 기능 개발
        </ChecklistItem>

        <div style={{ marginTop: '32px' }}>
          <InfoRow label="학력" value="시각정보디자인 졸업" />
          {TECH_GROUPS.map(g => <TagRow key={g.label} label={g.label} tags={g.tags} />)}
        </div>
      </section>

      {/* 2. 퇴사 이후 */}
      <section id="after-quitting" style={{ marginBottom: '112px' }}>
        <SectionTitle>퇴사 이후</SectionTitle>

        <Body style={{ marginBottom: '28px' }}>
          {'2024년 7월 퇴사 후 3D 아트를 깊이 파고들었습니다.\nHoudini와 Unreal Engine 5를 공부하며 테크니컬 아티스트를 준비했습니다.'}
        </Body>
        <Body>
          {'방향을 다시 생각하던 중 「쉬었음 청년 디지털 맞춤 교육」을 알게 되었고,\nAI 개발이라는 새로운 길을 선택했습니다.'}
        </Body>
        <Body style={{ marginBottom: 0 }}>
          {'이 과정을 수료하면 「리부트 AI 활용대회」 참가 자격이 주어집니다.\nECONOMING은 그 자격으로 만든 첫 결과물입니다.'}
        </Body>
      </section>

      {/* 3. 새로 배운 것 */}
      <section id="newly-learned" style={{ marginBottom: '112px' }}>
        <SectionTitle>새로 배운 것</SectionTitle>

        <p style={{ fontSize: '17px', fontWeight: '800', color: 'var(--c-forest-700)', marginBottom: '18px', letterSpacing: '-0.2px' }}>
          쉬었음 청년 디지털 맞춤 교육 · 서울 ICT 이노베이션스퀘어
        </p>

        <Body>
          이 교육에서 <b style={{ color: 'var(--c-ink)', fontWeight: '800' }}>AI로 개발하는 방법</b>을 배웠고,{'\n'}
          그동안 다뤄본 적 없던 영역을 처음 익혔습니다.
        </Body>

        <ChecklistItem>
          <b style={{ color: 'var(--c-ink)', fontWeight: '800' }}>React</b> — 컴포넌트 기반 UI 설계
        </ChecklistItem>
        <ChecklistItem>
          <b style={{ color: 'var(--c-ink)', fontWeight: '800' }}>CSS</b> — 반응형 레이아웃과 디자인 시스템
        </ChecklistItem>
        <ChecklistItem>
          <b style={{ color: 'var(--c-ink)', fontWeight: '800' }}>웹 · 앱 개발 전반</b> — 라우팅, 상태 관리, 배포
        </ChecklistItem>
      </section>

      {/* 4. 그래서 무엇을 만들 것인가 */}
      <section id="what-to-build" style={{ marginBottom: '112px' }}>
        <SectionTitle>그래서 무엇을 만들 것인가</SectionTitle>

        <Body>AI로 개발하는 법을 배우고 나니, 무엇을 만들지 정해야 했습니다.</Body>
        <Body>
          그때 떠오른 것이 <b style={{ color: 'var(--c-ink)', fontWeight: '800' }}>제가 계속 미뤄왔던 경제 공부</b>였습니다.
        </Body>
        <Body>
          {'주식이니 투자니 부동산이니 하는 이야기는 계속 들려왔습니다.\n경제적으로 자립하고 싶은 마음도 있었습니다.\n그런데 어디서, 어떻게, 무엇부터 시작해야 할지 몰라\n손을 대지 못하고 있었습니다.'}
        </Body>

        <Quote emphasized>그래서 제가 쓸 앱을 만들기로 했습니다.</Quote>

        <Body style={{ marginBottom: 0 }}>
          이 프로젝트를 왜 이렇게 설계했는지는 「ABOUT」에 적었습니다.
        </Body>
      </section>

      {/* 5. 이전 경험이 쓰인 곳 */}
      <section id="past-experience" style={{ marginBottom: '112px' }}>
        <SectionTitle>이전 경험이 쓰인 곳</SectionTitle>

        <PastExperienceCard title="방치형 타이쿤 게임 → 성장과 리텐션 설계">
          <Body>
            방치형 게임은 <b style={{ color: 'var(--c-ink)', fontWeight: '800' }}>사용자가 계속 돌아오게 만드는 구조 자체가 제품</b>입니다.{'\n'}
            레벨, 경험치, 진도, 연속 출석. 초기 개발부터 알파 테스트까지 다루며{'\n'}
            익힌 개념들입니다.
          </Body>
          <Body style={{ marginBottom: 0 }}>
            ECONOMING의 <b style={{ color: 'var(--c-ink)', fontWeight: '800' }}>XP · 7단계 성장 · 연속 학습일 · 챕터 진도</b>는{'\n'}
            그 경험에서 그대로 나왔습니다.
          </Body>
        </PastExperienceCard>

        <PastExperienceCard title="라이브 서비스 → 만든 뒤에 계속 고치는 습관">
          <Body>
            라이브 서비스는 배포가 끝이 아닙니다.{'\n'}
            쓰이는 걸 보고 계속 고쳐야 합니다.
          </Body>
          <Body style={{ marginBottom: 0 }}>
            이 프로젝트의 커밋 303개 중 <b style={{ color: 'var(--c-ink)', fontWeight: '800' }}>76개가 fix</b>입니다.{'\n'}
            만든 것을 다시 열어 검증하고 고치는 일을 당연하게 여깁니다.
          </Body>
        </PastExperienceCard>

        <PastExperienceCard title="시각정보디자인 → 혼자 만들어도 정돈된 화면">
          <Body style={{ marginBottom: 0 }}>
            색, 여백, 아이콘, 정보 구조를 다뤄본 경험이 그대로 쓰였습니다.{'\n'}
            디자이너 없이 혼자 만들었지만 화면이 흐트러지지 않은 이유입니다.
          </Body>
        </PastExperienceCard>
      </section>

    </div>
  );
}
