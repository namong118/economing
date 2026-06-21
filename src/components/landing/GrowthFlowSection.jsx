import { BookOpen, NotebookPen, Sprout, Sun } from 'lucide-react';

const BASE_URL = import.meta.env.BASE_URL;

const STEPS = [
  {
    num: 1,
    icon: <Sun size={24} color="#F59E0B" />,
    label: '노밍에게 질문하기',
    desc: '모르는 경제 개념을 편하게 물어보세요',
  },
  {
    num: 2,
    icon: <BookOpen size={22} color="var(--c-forest-700)" />,
    label: '경제 읽기',
    desc: '3분짜리 쉬운 경제 콘텐츠를 읽어보세요',
  },
  {
    num: 3,
    icon: <NotebookPen size={22} color="var(--c-forest-700)" />,
    label: '경제일기 작성',
    desc: '오늘 배운 것을 짧게 기록해보세요',
  },
  {
    num: 4,
    icon: <Sprout size={22} color="var(--c-forest-700)" />,
    label: '내 성장 확인',
    desc: '쌓인 지식과 성장 단계를 확인하세요',
  },
];

export default function GrowthFlowSection() {
  return (
    <section style={{
      background: 'linear-gradient(170deg, var(--c-canvas) 0%, var(--c-green-50) 100%)',
      padding: 'clamp(60px, 8vw, 100px) 24px',
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {/* 헤더 */}
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <p style={{
            display: 'inline-block',
            background: 'var(--c-green-100)', color: 'var(--c-green-500)',
            borderRadius: '100px', padding: '5px 14px',
            fontSize: '13px', fontWeight: '700',
            letterSpacing: '-0.2px', marginBottom: '16px',
          }}>
            어떻게 성장하나요?
          </p>
          <h2 style={{
            fontSize: 'clamp(24px, 4vw, 36px)',
            fontWeight: '900', color: 'var(--c-ink)',
            letterSpacing: '-1px', lineHeight: '1.25',
            marginBottom: '12px',
          }}>
            하루 3분이면 충분합니다.
          </h2>
          <p style={{
            fontSize: 'clamp(14px, 2vw, 16px)',
            color: '#4A6455', lineHeight: '1.7',
            letterSpacing: '-0.3px',
          }}>
            조금씩 배우고, 기록하고, 성장해보세요.
          </p>
        </div>

        {/* 스텝 흐름 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {STEPS.map((step, i) => (
            <div key={step.num}>
              <StepCard {...step} />
              {i < STEPS.length - 1 && (
                <div style={{
                  display: 'flex', justifyContent: 'center',
                  padding: '4px 0',
                }}>
                  <div style={{
                    width: '2px', height: '28px',
                    background: 'linear-gradient(to bottom, var(--c-green-500), var(--c-green-100))',
                    borderRadius: '2px',
                  }}/>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StepCard({ num, icon, label, desc }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '16px',
      background: '#fff',
      borderRadius: '20px',
      padding: '20px 22px',
      border: '1.5px solid var(--c-green-100)',
      boxShadow: '0 2px 12px rgba(33,197,142,0.08)',
    }}>
      {/* 번호 */}
      <div style={{
        width: '36px', height: '36px', borderRadius: '12px',
        background: 'var(--grad-action)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '15px', fontWeight: '900', color: '#fff',
        flexShrink: 0,
      }}>
        {num}
      </div>
      {/* 아이콘 박스 */}
      <div style={{
        width: 40, height: 40, borderRadius: 10,
        background: 'var(--c-green-100)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        {icon}
      </div>
      {/* 텍스트 */}
      <div>
        <p style={{
          fontSize: '16px', fontWeight: '800',
          color: 'var(--c-ink)', letterSpacing: '-0.5px',
          marginBottom: '3px',
        }}>
          {label}
        </p>
        <p style={{
          fontSize: '13px', color: 'var(--c-slate)',
          letterSpacing: '-0.2px', lineHeight: '1.4',
        }}>
          {desc}
        </p>
      </div>
    </div>
  );
}
