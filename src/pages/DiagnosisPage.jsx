import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lightbulb, Target, TrendingUp, Home, Receipt, BarChart2, Wallet, PiggyBank } from 'lucide-react';
import { diagnosisQuestions, answerOptions, getLevelByScore } from '../data/diagnosisQuestions';
import ProgressBar from '../components/common/ProgressBar';
import Button from '../components/common/Button';
import TopNav from '../components/layout/TopNav';

const CATEGORY_ICONS = {
  '투자': TrendingUp,
  '부동산': Home,
  '세금': Receipt,
  '경제': BarChart2,
  '저축': PiggyBank,
};

export default function DiagnosisPage() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const question = diagnosisQuestions[current];
  const isLast = current === diagnosisQuestions.length - 1;

  const handleNext = () => {
    if (selected === null || isAnimating) return;
    setIsAnimating(true);
    const newAnswers = [...answers, selected];
    setTimeout(() => {
      if (isLast) {
        const score = newAnswers.reduce((sum, v) => sum + v, 0);
        navigate('/result', { state: { level: getLevelByScore(score), score, answers: newAnswers } });
      } else {
        setAnswers(newAnswers);
        setCurrent((p) => p + 1);
        setSelected(null);
        setIsAnimating(false);
      }
    }, 280);
  };

  const QIcon = CATEGORY_ICONS[question.category] ?? BarChart2;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--c-canvas)' }}>
      <TopNav />

      <div style={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px 20px 160px',
      }}>
        <div
          className="anim-scale"
          key={current}
          style={{
            width: '100%',
            maxWidth: '520px',
            background: 'var(--c-surface)',
            borderRadius: 24,
            boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
            overflow: 'hidden',
            border: '1px solid var(--c-line-soft)',
          }}
        >
          {/* 진행 바 */}
          <div style={{ padding: '24px 28px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{
                background: 'var(--c-green-50)', color: 'var(--c-forest-700)',
                fontSize: 11, fontWeight: 700, padding: '3px 12px',
                borderRadius: 100, letterSpacing: '-0.2px',
              }}>
                {question.category}
              </span>
              <span style={{ fontSize: 12, color: 'var(--c-muted)', fontWeight: 600 }}>
                {current + 1} / {diagnosisQuestions.length}
              </span>
            </div>
            <ProgressBar current={current + 1} total={diagnosisQuestions.length} height={5} />
          </div>

          {/* 질문 */}
          <div style={{ padding: '24px 28px 20px' }}>
            <div style={{
              width: 60, height: 60, borderRadius: 16,
              background: 'var(--c-green-50)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 18,
            }}>
              <QIcon size={32} color="var(--c-green-500)" />
            </div>
            <h2 style={{
              fontSize: 19, fontWeight: 800, color: 'var(--c-ink)',
              lineHeight: 1.45, letterSpacing: '-0.6px', marginBottom: 8,
            }}>
              {question.question}
            </h2>
            <p style={{
              fontSize: 13, color: 'var(--c-muted)', lineHeight: 1.6,
              display: 'flex', alignItems: 'flex-start', gap: 5,
            }}>
              <Lightbulb size={13} color="var(--c-muted)" style={{ flexShrink: 0, marginTop: 2 }} />
              {question.hint}
            </p>
          </div>

          {/* 5단계 답변 */}
          <div style={{ padding: '0 28px 28px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {answerOptions.map((option) => {
              const isActive = selected === option.score;
              return (
                <button
                  key={option.score}
                  onClick={() => setSelected(option.score)}
                  style={{
                    padding: '13px 18px',
                    borderRadius: 12,
                    fontSize: 14, fontWeight: 600,
                    display: 'flex', alignItems: 'center', gap: 12,
                    cursor: 'pointer', transition: 'all 0.15s',
                    border: `1.5px solid ${isActive ? 'var(--c-green-500)' : 'var(--c-line)'}`,
                    background: isActive ? 'var(--c-green-50)' : 'var(--c-surface)',
                    color: isActive ? 'var(--c-forest-700)' : 'var(--c-slate)',
                    fontFamily: 'inherit', textAlign: 'left',
                  }}
                >
                  {/* 점수 뱃지 */}
                  <span style={{
                    width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 800,
                    background: isActive ? 'var(--c-green-500)' : 'var(--c-line-soft)',
                    color: isActive ? '#fff' : 'var(--c-muted)',
                    transition: 'all 0.15s',
                  }}>
                    {option.score}
                  </span>
                  {option.label}
                </button>
              );
            })}

            <Button
              disabled={selected === null}
              onClick={handleNext}
              style={{ borderRadius: 12, marginTop: 4, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              {isLast ? <><Target size={15} /> 결과 확인하기</> : '다음 질문 →'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
