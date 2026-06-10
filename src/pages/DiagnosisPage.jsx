/* AI 경제 레벨 진단 페이지 — PC 중앙 정렬 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { diagnosisQuestions, getLevelByScore } from '../data/diagnosisQuestions';
import ProgressBar from '../components/common/ProgressBar';
import Button from '../components/common/Button';
import TopNav from '../components/layout/TopNav';

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
        const score = newAnswers.filter(Boolean).length;
        navigate('/result', { state: { level: getLevelByScore(score), score, answers: newAnswers } });
      } else {
        setAnswers(newAnswers);
        setCurrent((p) => p + 1);
        setSelected(null);
        setIsAnimating(false);
      }
    }, 280);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <TopNav />

      {/* 중앙 정렬 카드 */}
      <div
        style={{
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 24px',
        }}
      >
        <div
          className="anim-scale"
          key={current}
          style={{
            width: '100%',
            maxWidth: '560px',
            background: '#fff',
            borderRadius: '24px',
            boxShadow: 'var(--shadow-lg)',
            overflow: 'hidden',
            border: '1px solid var(--border-light)',
          }}
        >
          {/* 상단 진행 바 */}
          <div style={{ padding: '28px 32px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    background: '#ECFDF5',
                    color: '#059669',
                    fontSize: '12px',
                    fontWeight: '700',
                    padding: '3px 12px',
                    borderRadius: '100px',
                    letterSpacing: '-0.2px',
                  }}
                >
                  {question.category}
                </span>
              </div>
              <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: '600' }}>
                {current + 1} / {diagnosisQuestions.length}
              </span>
            </div>
            <ProgressBar current={current + 1} total={diagnosisQuestions.length} height={6} />
          </div>

          {/* 질문 본문 */}
          <div style={{ padding: '32px 32px 24px' }}>
            <div style={{ fontSize: '64px', lineHeight: 1, marginBottom: '24px' }}>
              {question.emoji}
            </div>
            <h2
              style={{
                fontSize: '22px',
                fontWeight: '800',
                color: '#0F172A',
                lineHeight: '1.4',
                letterSpacing: '-0.8px',
                marginBottom: '10px',
              }}
            >
              {question.question}
            </h2>
            <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: '1.6', letterSpacing: '-0.3px' }}>
              💡 {question.hint}
            </p>
          </div>

          {/* 답변 선택 */}
          <div style={{ padding: '0 32px 32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { value: true, emoji: '✅', label: '네, 알고 있어요!' },
              { value: false, emoji: '❌', label: '아니요, 잘 모르겠어요' },
            ].map((option) => (
              <button
                key={String(option.value)}
                onClick={() => setSelected(option.value)}
                style={{
                  padding: '18px 24px',
                  borderRadius: '14px',
                  fontSize: '16px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  border: selected === option.value ? '2px solid #10B981' : '2px solid #E2E8F0',
                  background: selected === option.value ? 'linear-gradient(135deg, #ECFDF5, #D1FAE5)' : '#F8FAFC',
                  color: selected === option.value ? '#047857' : '#374151',
                  transform: selected === option.value ? 'scale(1.01)' : 'scale(1)',
                  boxShadow: selected === option.value ? '0 4px 12px rgba(16,185,129,0.18)' : 'none',
                }}
              >
                <span style={{ fontSize: '24px' }}>{option.emoji}</span>
                <span style={{ letterSpacing: '-0.3px' }}>{option.label}</span>
              </button>
            ))}

            <Button
              disabled={selected === null}
              onClick={handleNext}
              style={{ borderRadius: '14px', marginTop: '8px', fontSize: '15px' }}
            >
              {isLast ? '🎯 결과 확인하기' : '다음 질문 →'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
