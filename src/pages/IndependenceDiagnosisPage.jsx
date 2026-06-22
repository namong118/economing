import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Target } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabaseClient';
import { generateIndependenceRoadmap, generateTodayAction } from '../services/onboardingService';

const QUESTIONS = [
  {
    id: 1, category: '비상금',
    question: '비상금(생활비 3~6개월치)이 준비되어 있나요?',
    options: [
      { score: 1, label: '전혀 없다' },
      { score: 2, label: '1개월치 미만' },
      { score: 3, label: '1~3개월치' },
      { score: 4, label: '3~6개월치' },
      { score: 5, label: '6개월치 이상' },
    ],
  },
  {
    id: 2, category: '저축',
    question: '월 소득 대비 저축률이 어느 정도인가요?',
    options: [
      { score: 1, label: '저축 못 하고 있다' },
      { score: 2, label: '5% 미만' },
      { score: 3, label: '5~10%' },
      { score: 4, label: '10~20%' },
      { score: 5, label: '20% 이상' },
    ],
  },
  {
    id: 3, category: '지출 파악',
    question: '내 월 고정지출과 변동지출을 정확히 알고 있나요?',
    options: [
      { score: 1, label: '전혀 모른다' },
      { score: 2, label: '대략만 안다' },
      { score: 3, label: '주요 항목은 안다' },
      { score: 4, label: '꼼꼼히 파악한다' },
      { score: 5, label: '예산까지 세워 관리한다' },
    ],
  },
  {
    id: 4, category: '부채',
    question: '고금리 부채(카드론, 현금서비스 등)가 있나요?',
    options: [
      { score: 1, label: '고금리 부채가 많다' },
      { score: 2, label: '조금 있다' },
      { score: 3, label: '없지만 일반 대출 있다' },
      { score: 4, label: '저금리 대출만 있다' },
      { score: 5, label: '부채 없음' },
    ],
  },
  {
    id: 5, category: '연금',
    question: '노후를 위한 연금(국민연금 외)을 준비하고 있나요?',
    options: [
      { score: 1, label: '전혀 없다' },
      { score: 2, label: '생각은 해봤다' },
      { score: 3, label: 'IRP 또는 연금저축 있다' },
      { score: 4, label: '꾸준히 납입 중' },
      { score: 5, label: '목표 금액으로 관리 중' },
    ],
  },
  {
    id: 6, category: '보험',
    question: '나에게 필요한 보험이 적절히 가입되어 있나요?',
    options: [
      { score: 1, label: '보험이 전혀 없다' },
      { score: 2, label: '잘 모르겠다' },
      { score: 3, label: '기본 실손만 있다' },
      { score: 4, label: '실손+필요 보장 있다' },
      { score: 5, label: '적정 보장으로 최적화됨' },
    ],
  },
  {
    id: 7, category: '투자',
    question: '장기 자산 증식을 위한 투자를 하고 있나요?',
    options: [
      { score: 1, label: '투자 전혀 안 함' },
      { score: 2, label: '관심은 있다' },
      { score: 3, label: '소액 ETF/펀드 있다' },
      { score: 4, label: '정기적으로 투자 중' },
      { score: 5, label: '포트폴리오 관리 중' },
    ],
  },
  {
    id: 8, category: '절세',
    question: '세금 혜택(연말정산, ISA, IRP 등)을 활용하고 있나요?',
    options: [
      { score: 1, label: '전혀 모른다' },
      { score: 2, label: '연말정산만 한다' },
      { score: 3, label: '공제 항목 챙긴다' },
      { score: 4, label: 'ISA/IRP 활용 중' },
      { score: 5, label: '절세 전략 세워 관리' },
    ],
  },
  {
    id: 9, category: '재무 목표',
    question: '3년 후 재무 목표가 구체적으로 있나요?',
    options: [
      { score: 1, label: '없다' },
      { score: 2, label: '막연하게 있다' },
      { score: 3, label: '목표는 있다' },
      { score: 4, label: '목표+계획 있다' },
      { score: 5, label: '월별 실행 계획 있다' },
    ],
  },
  {
    id: 10, category: '금융 이해',
    question: '내 자산과 부채 현황을 한 눈에 파악할 수 있나요?',
    options: [
      { score: 1, label: '전혀 모른다' },
      { score: 2, label: '대략만 안다' },
      { score: 3, label: '주요 항목은 안다' },
      { score: 4, label: '정기적으로 확인한다' },
      { score: 5, label: '순자산 계산까지 한다' },
    ],
  },
];

const LEVELS = [
  { level: 'seed',   label: '씨앗 단계',  desc: '재무 기초부터 시작해요',    color: '#78909C', bg: '#ECEFF1', maxScore: 18 },
  { level: 'sprout', label: '새싹 단계',  desc: '기초 습관을 만들어가요',    color: '#66BB6A', bg: '#E8F5E9', maxScore: 26 },
  { level: 'leaf',   label: '잎 단계',    desc: '안정적인 재무 구조예요',    color: '#26A69A', bg: '#E0F2F1', maxScore: 34 },
  { level: 'flower', label: '꽃 단계',    desc: '자립 기반이 잡혔어요',      color: '#AB47BC', bg: '#F3E5F5', maxScore: 42 },
  { level: 'fruit',  label: '열매 단계',  desc: '경제 자립에 가까워요',      color: '#FFA726', bg: '#FFF3E0', maxScore: 50 },
];

function calculateLevel(total) {
  if (total <= 18) return LEVELS[0];
  if (total <= 26) return LEVELS[1];
  if (total <= 34) return LEVELS[2];
  if (total <= 42) return LEVELS[3];
  return LEVELS[4];
}

export default function IndependenceDiagnosisPage() {
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();

  const [currentQ, setCurrentQ]   = useState(0);
  const [scores,   setScores]      = useState([]);
  const [selected, setSelected]    = useState(null);
  const [result,   setResult]      = useState(null);
  const [saving,   setSaving]      = useState(false);

  const question = QUESTIONS[currentQ];
  const total    = QUESTIONS.length;
  const isDone   = result !== null;

  const handleSelect = (score) => setSelected(score);

  const handleNext = () => {
    const newScores = [...scores, selected];

    if (currentQ < total - 1) {
      setScores(newScores);
      setSelected(null);
      setCurrentQ(q => q + 1);
    } else {
      const sum = newScores.reduce((a, b) => a + b, 0);
      const lvl = calculateLevel(sum);
      setScores(newScores);
      setResult({ ...lvl, score: sum, scores: newScores });
    }
  };

  const handleBack = () => {
    if (currentQ === 0) { navigate(-1); return; }
    const newScores = scores.slice(0, -1);
    setScores(newScores);
    setSelected(newScores[currentQ - 1] ?? null);
    setCurrentQ(q => q - 1);
  };

  const handleSave = async () => {
    if (!user?.id || !result) {
      navigate('/my-growth', { state: { tab: 'independence' } });
      return;
    }
    setSaving(true);
    try {
      const diagnosisData = {
        score: result.score,
        level: result.level,
        label: result.label,
        desc:  result.desc,
        scores: result.scores,
        categories: QUESTIONS.map((q, i) => ({ category: q.category, score: result.scores[i] })),
      };

      await supabase
        .from('profiles')
        .update({
          independence_score:     result.score,
          independence_diagnosis: diagnosisData,
        })
        .eq('id', user.id);

      const answers = {
        financial_goal:       profile?.financial_goal,
        age_group:            profile?.age_group,
        income_range:         profile?.income_range,
        economic_level:       profile?.economic_level,
        investment_experience: profile?.investment_experience,
        interests:            profile?.interests,
      };

      const [roadmap] = await Promise.allSettled([
        generateIndependenceRoadmap(answers, { score: result.score, label: result.label }),
        generateTodayAction(user.id, profile?.financial_goal, result.level),
      ]);

      if (roadmap.status === 'fulfilled' && roadmap.value) {
        await supabase
          .from('profiles')
          .update({ independence_roadmap: roadmap.value })
          .eq('id', user.id);
      }

      await refreshProfile();
    } catch (err) {
      console.error('자립 진단 저장 실패:', err);
    } finally {
      setSaving(false);
      navigate('/my-growth', { state: { tab: 'independence' } });
    }
  };

  const progressPct = isDone ? 100 : ((currentQ) / total) * 100;

  if (isDone) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--c-canvas)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 0 48px' }}>
        {/* 헤더 */}
        <div style={{ width: '100%', background: 'var(--c-surface)', borderBottom: '1px solid var(--c-line-soft)', padding: '16px 24px', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--c-green-500)' }}>완료!</span>
            <span style={{ fontSize: '13px', color: 'var(--c-muted)' }}>경제 자립 진단</span>
          </div>
          <div style={{ height: '5px', background: 'var(--c-green-50)', borderRadius: '100px', overflow: 'hidden' }}>
            <div style={{ height: '100%', background: 'linear-gradient(90deg, var(--c-green-500), var(--c-green-500))', width: '100%', borderRadius: '100px' }} />
          </div>
        </div>

        {/* 결과 */}
        <div style={{ width: '100%', maxWidth: '520px', padding: '32px 24px', boxSizing: 'border-box' }} className="anim-fade">
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: result.bg, border: `3px solid ${result.color}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <Target size={36} color={result.color} />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--c-forest-700)', letterSpacing: '-0.7px', marginBottom: '6px' }}>
              {result.label}
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--c-slate)', marginBottom: '4px' }}>{result.desc}</p>
            <p style={{ fontSize: '22px', fontWeight: '900', color: result.color }}>
              {result.score} <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--c-muted)' }}>/ 50점</span>
            </p>
          </div>

          {/* 카테고리별 점수 */}
          <div style={{ background: 'var(--c-surface)', borderRadius: '16px', border: '0.5px solid var(--c-line)', padding: '20px', marginBottom: '24px' }}>
            <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--c-muted)', letterSpacing: '0.5px', marginBottom: '14px' }}>항목별 점수</p>
            {QUESTIONS.map((q, i) => (
              <div key={q.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', color: 'var(--c-slate)', width: '60px', flexShrink: 0 }}>{q.category}</span>
                <div style={{ flex: 1, height: '6px', background: 'var(--c-line-soft)', borderRadius: '100px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: result.color, borderRadius: '100px', width: `${(result.scores[i] / 5) * 100}%`, transition: 'width 0.5s' }} />
                </div>
                <span style={{ fontSize: '12px', fontWeight: '700', color: result.color, width: '20px', textAlign: 'right', flexShrink: 0 }}>{result.scores[i]}</span>
              </div>
            ))}
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              width: '100%', padding: '16px', borderRadius: '16px',
              background: saving ? 'var(--c-green-100)' : 'var(--grad-action)',
              color: saving ? 'var(--c-green-500)' : '#fff',
              border: 'none', fontSize: '16px', fontWeight: '800',
              letterSpacing: '-0.4px', cursor: saving ? 'not-allowed' : 'pointer',
              boxShadow: saving ? 'none' : '0 6px 20px rgba(33,197,142,0.35)',
              transition: 'all 0.2s',
            }}
          >
            {saving ? '로드맵 생성 중...' : '결과 저장하고 로드맵 보기 →'}
          </button>

          <button
            onClick={() => navigate('/home')}
            style={{ display: 'block', margin: '14px auto 0', background: 'none', border: 'none', fontSize: '13px', color: 'var(--c-muted)', cursor: 'pointer', fontWeight: '500' }}
          >
            나중에 확인하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--c-canvas)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 0 48px' }}>

      {/* 상단 헤더 */}
      <div style={{ width: '100%', background: 'var(--c-surface)', borderBottom: '1px solid var(--c-line-soft)', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '12px', boxSizing: 'border-box' }}>
        <button
          onClick={handleBack}
          style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--c-canvas)', border: '1.5px solid var(--c-line-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--c-slate)', flexShrink: 0 }}
        >
          <ChevronLeft size={18} />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--c-green-500)' }}>{currentQ + 1} / {total}</span>
            <span style={{ fontSize: '13px', color: 'var(--c-muted)' }}>경제 자립 진단</span>
          </div>
          <div style={{ height: '5px', background: 'var(--c-green-50)', borderRadius: '100px', overflow: 'hidden' }}>
            <div style={{ height: '100%', background: 'linear-gradient(90deg, var(--c-green-500), var(--c-green-500))', width: `${progressPct}%`, borderRadius: '100px', transition: 'width 0.4s ease' }} />
          </div>
        </div>
      </div>

      {/* 본문 */}
      <div style={{ width: '100%', maxWidth: '520px', padding: '32px 24px 0', boxSizing: 'border-box' }} className="anim-fade" key={currentQ}>

        {/* 카테고리 + 질문 */}
        <div style={{ marginBottom: '28px' }}>
          <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--c-green-500)', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
            {question.category}
          </span>
          <h2 style={{ fontSize: 'clamp(20px, 4vw, 26px)', fontWeight: '900', color: 'var(--c-ink)', letterSpacing: '-0.6px', lineHeight: '1.35' }}>
            {question.question}
          </h2>
        </div>

        {/* 선택지 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
          {question.options.map(opt => {
            const isSelected = selected === opt.score;
            return (
              <button
                key={opt.score}
                onClick={() => handleSelect(opt.score)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '16px 20px', borderRadius: '14px', textAlign: 'left',
                  background: isSelected ? 'var(--c-canvas)' : 'var(--c-surface)',
                  border: `2px solid ${isSelected ? 'var(--c-green-500)' : 'var(--c-line)'}`,
                  cursor: 'pointer', transition: 'all 0.15s',
                  boxShadow: isSelected ? '0 0 0 4px rgba(33,197,142,0.1)' : 'none',
                }}
              >
                <span style={{ fontSize: '15px', fontWeight: '600', color: 'var(--c-ink)', letterSpacing: '-0.3px' }}>
                  {opt.label}
                </span>
                {isSelected && (
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--c-green-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#fff', fontWeight: '800', flexShrink: 0 }}>
                    ✓
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleNext}
          disabled={selected === null}
          style={{
            width: '100%', padding: '16px', borderRadius: '16px',
            background: selected !== null ? 'var(--grad-action)' : 'var(--c-line)',
            color: selected !== null ? '#fff' : 'var(--c-muted)',
            border: 'none', fontSize: '16px', fontWeight: '800', letterSpacing: '-0.4px',
            cursor: selected !== null ? 'pointer' : 'not-allowed',
            boxShadow: selected !== null ? '0 6px 20px rgba(33,197,142,0.35)' : 'none',
            transition: 'all 0.2s',
          }}
        >
          {currentQ === total - 1 ? '결과 보기 →' : '다음 →'}
        </button>

        <button
          onClick={() => navigate(-1)}
          style={{ display: 'block', margin: '14px auto 0', background: 'none', border: 'none', fontSize: '13px', color: 'var(--c-muted)', cursor: 'pointer', fontWeight: '500' }}
        >
          나중에 하기
        </button>
      </div>
    </div>
  );
}
