import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, TrendingUp, Briefcase, PiggyBank, Sprout,
  GraduationCap, Laptop, Building2, CreditCard, Home, Receipt, Newspaper,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { completeOnboarding } from '../services/onboardingService';

const BASE_URL = import.meta.env.BASE_URL;

/* ── 경제 수준 진단 문항 ──────────────────────────────────────── */
const DIAGNOSIS_QUESTIONS = [
  {
    id: 1, category: '기초 개념',
    question: 'GDP, 금리, 인플레이션이 무엇인지 설명할 수 있다',
    options: [
      { score: 1, label: '전혀 모른다' },
      { score: 2, label: '들어본 적 있다' },
      { score: 3, label: '대략 안다' },
      { score: 4, label: '잘 안다' },
      { score: 5, label: '남에게 설명할 수 있다' },
    ],
  },
  {
    id: 2, category: '뉴스 이해',
    question: '경제 뉴스를 읽으면 대략적인 내용을 이해할 수 있다',
    options: [
      { score: 1, label: '거의 못 이해한다' },
      { score: 2, label: '단어는 알지만 맥락이 어렵다' },
      { score: 3, label: '절반 정도 이해한다' },
      { score: 4, label: '대부분 이해한다' },
      { score: 5, label: '내 생활과 연결해서 읽을 수 있다' },
    ],
  },
  {
    id: 3, category: '금리',
    question: '한국은행이 금리를 올리면 내 대출과 저축에 어떤 영향이 있는지 안다',
    options: [
      { score: 1, label: '전혀 모른다' },
      { score: 2, label: '금리가 뭔지는 안다' },
      { score: 3, label: '대출이자가 오른다는 건 안다' },
      { score: 4, label: '대출·저축·주식에 미치는 영향을 안다' },
      { score: 5, label: '경제 전반에 미치는 연쇄 효과를 설명할 수 있다' },
    ],
  },
  {
    id: 4, category: '개인 재무',
    question: '내 한 달 고정 지출과 남는 돈을 정확히 알고 있다',
    options: [
      { score: 1, label: '전혀 파악 안 됨' },
      { score: 2, label: '대략적으로만 안다' },
      { score: 3, label: '주요 항목은 파악하고 있다' },
      { score: 4, label: '매달 꼼꼼히 확인한다' },
      { score: 5, label: '예산까지 세워서 관리한다' },
    ],
  },
  {
    id: 5, category: '저축·투자',
    question: '예금, 적금, ETF, 주식의 차이와 위험도를 설명할 수 있다',
    options: [
      { score: 1, label: '예금 적금도 헷갈린다' },
      { score: 2, label: '예금·적금 차이는 안다' },
      { score: 3, label: 'ETF가 뭔지 대략 안다' },
      { score: 4, label: '각 상품의 특징과 위험도를 안다' },
      { score: 5, label: '내 상황에 맞게 조합할 수 있다' },
    ],
  },
  {
    id: 6, category: '환율',
    question: '원/달러 환율이 오르면 내 생활에 어떤 영향이 있는지 안다',
    options: [
      { score: 1, label: '환율이 뭔지 모른다' },
      { score: 2, label: '환율이 뭔지는 안다' },
      { score: 3, label: '해외여행·수입품에 영향 준다는 건 안다' },
      { score: 4, label: '수출기업·물가에 미치는 영향도 안다' },
      { score: 5, label: '환율 변동이 경제 전반에 미치는 흐름을 안다' },
    ],
  },
  {
    id: 7, category: '비상금',
    question: '비상금이 왜 필요한지, 얼마나 모아야 하는지 안다',
    options: [
      { score: 1, label: '생각해본 적 없다' },
      { score: 2, label: '필요하다는 건 안다' },
      { score: 3, label: '3~6개월치 생활비라는 걸 안다' },
      { score: 4, label: '비상금을 실제로 마련하고 있다' },
      { score: 5, label: '비상금 전략까지 세워놨다' },
    ],
  },
  {
    id: 8, category: '세금',
    question: '근로소득세, 종합소득세, 연말정산의 개념을 안다',
    options: [
      { score: 1, label: '전혀 모른다' },
      { score: 2, label: '이름만 들어봤다' },
      { score: 3, label: '연말정산이 뭔지는 안다' },
      { score: 4, label: '절세 방법을 몇 가지 알고 실천한다' },
      { score: 5, label: '세금 신고를 직접 처리할 수 있다' },
    ],
  },
  {
    id: 9, category: '경제 흐름',
    question: '경기 침체, 인플레이션, 버블 같은 경제 사이클 개념을 안다',
    options: [
      { score: 1, label: '전혀 모른다' },
      { score: 2, label: '단어는 들어봤다' },
      { score: 3, label: '대략적인 개념을 안다' },
      { score: 4, label: '현재 경제 상황과 연결해서 이해한다' },
      { score: 5, label: '경기 사이클을 내 재무 계획에 반영할 수 있다' },
    ],
  },
  {
    id: 10, category: '목표 설정',
    question: '1년 후, 3년 후 나의 재무 목표가 구체적으로 있다',
    options: [
      { score: 1, label: '생각해본 적 없다' },
      { score: 2, label: '막연하게 있다' },
      { score: 3, label: '목표는 있지만 계획이 없다' },
      { score: 4, label: '목표와 대략적인 계획이 있다' },
      { score: 5, label: '구체적인 목표와 실행 계획이 있다' },
    ],
  },
];

/* ── 설문 데이터 ─────────────────────────────────────────────── */
const STEPS = [
  {
    id: 'economic_level',
    question: '경제 공부는\n어느 정도 해보셨나요?',
    nomingMsg: '어느 정도 경험을 가지고 계신지\n알아야 딱 맞는 이야기를 해줄 수 있어요!',
    multi: false,
    options: [
      { value: 'beginner',     icon: <Sprout size={18} color="#2A7A4B" />,     label: '처음이에요',           desc: '경제 공부, 어디서부터 시작할지 막막해요' },
      { value: 'intermediate', icon: <BookOpen size={18} color="#2A7A4B" />,   label: '조금 공부해봤어요',    desc: '기본 개념은 알지만 아직 배울 게 많아요' },
      { value: 'advanced',     icon: <TrendingUp size={18} color="#2A7A4B" />, label: '꾸준히 공부 중이에요', desc: '경제 뉴스, 투자 개념을 꾸준히 접하고 있어요' },
    ],
  },
  {
    id: 'investment_experience',
    question: '투자 경험이\n있나요?',
    nomingMsg: '투자 경험을 알면\n더 실질적인 도움을 드릴 수 있어요.',
    multi: false,
    options: [
      { value: 'none',  icon: <BookOpen size={18} color="#2A7A4B" />,    label: '없어요',                 desc: '투자는 아직 한 번도 해보지 않았어요' },
      { value: 'etf',   icon: <TrendingUp size={18} color="#2A7A4B" />,  label: 'ETF 투자 경험이 있어요', desc: '인덱스 펀드, ETF로 투자해본 적 있어요' },
      { value: 'stock', icon: <TrendingUp size={18} color="#2A7A4B" />,  label: '주식 투자 경험이 있어요', desc: '개별 종목 또는 다양한 자산에 투자해봤어요' },
    ],
  },
  {
    id: 'occupation',
    question: '현재 상황을\n알려주세요',
    nomingMsg: '상황에 맞는 경제 성장 여정을\n안내해드릴게요.',
    multi: false,
    options: [
      { value: 'student',    icon: <GraduationCap size={18} color="#2A7A4B" />, label: '학생',     desc: '대학생 또는 취업 준비 중이에요' },
      { value: 'employee',   icon: <Briefcase size={18} color="#2A7A4B" />,     label: '직장인',   desc: '월급을 받으며 일하고 있어요' },
      { value: 'freelancer', icon: <Laptop size={18} color="#2A7A4B" />,        label: '프리랜서', desc: '독립적으로 일하거나 부업 중이에요' },
      { value: 'business',   icon: <Building2 size={18} color="#2A7A4B" />,     label: '사업자',   desc: '사업을 운영하고 있어요' },
    ],
  },
  {
    id: 'interests',
    question: '어떤 분야에\n관심이 있나요?',
    nomingMsg: '관심 있는 분야를 모두 골라주세요.\n거기서부터 시작할게요!',
    multi: true,
    options: [
      { value: '소비 관리', icon: <CreditCard size={18} color="#2A7A4B" />,  label: '소비 관리', desc: '현명한 소비 습관 만들기' },
      { value: '저축',      icon: <PiggyBank size={18} color="#2A7A4B" />,   label: '저축',      desc: '목돈 만들기와 저축 전략' },
      { value: '투자',      icon: <TrendingUp size={18} color="#2A7A4B" />,  label: '투자',      desc: '주식, ETF, 펀드 투자' },
      { value: '부동산',    icon: <Home size={18} color="#2A7A4B" />,        label: '부동산',    desc: '부동산 시장 이해와 투자' },
      { value: '세금',      icon: <Receipt size={18} color="#2A7A4B" />,     label: '세금',      desc: '절세와 세금 신고 이해' },
      { value: '경제 뉴스', icon: <Newspaper size={18} color="#2A7A4B" />,   label: '경제 뉴스', desc: '경제 흐름 읽는 법' },
    ],
  },
];

const STEP_COLORS = ['#52C97A', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'];

/* ── 완료 화면 ────────────────────────────────────────────────── */
function CompletionScreen({ answers, onComplete, saving }) {
  const BASE_URL = import.meta.env.BASE_URL;
  const LEVEL_LABEL = { beginner: '입문자', elementary: '초급자', intermediate: '중급자', advanced: '고급자', expert: '전문가' };

  return (
    <div className="anim-fade" style={{ textAlign: 'center', padding: '16px 0' }}>
      <img
        src={`${BASE_URL}appicon.jpg`}
        alt="ECONOMING"
        style={{ width: '72px', height: '72px', borderRadius: '20px', objectFit: 'cover', margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(255,200,61,0.3)' }}
      />
      <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#0F172A', letterSpacing: '-0.8px', marginBottom: '8px' }}>
        준비 완료! 🎉
      </h2>
      <p style={{ fontSize: '15px', color: '#64748B', lineHeight: '1.7', marginBottom: '32px' }}>
        이제 당신만의 경제 성장 여정을<br />함께 시작해볼게요.
      </p>

      <div style={{ background: '#F2FBF5', border: '1.5px solid #DCF5EB', borderRadius: '20px', padding: '20px 24px', marginBottom: '28px', textAlign: 'left' }}>
        <p style={{ fontSize: '12px', fontWeight: '700', color: '#94A3B8', letterSpacing: '0.8px', marginBottom: '12px' }}>노밍이 파악한 내용</p>
        {[
          { label: '경제 수준', value: LEVEL_LABEL[answers.economic_level] ?? '-' },
          { label: '투자 경험', value: { none: '없음', etf: 'ETF', stock: '주식' }[answers.investment_experience] ?? '-' },
          { label: '상황',     value: { student: '학생', employee: '직장인', freelancer: '프리랜서', business: '사업자' }[answers.occupation] ?? '-' },
          { label: '관심 분야', value: (answers.interests ?? []).join(' · ') || '-' },
        ].map(row => (
          <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '8px 0', borderBottom: '1px solid #E8F5EF' }}>
            <span style={{ fontSize: '13px', color: '#64748B', fontWeight: '600' }}>{row.label}</span>
            <span style={{ fontSize: '14px', color: '#0F172A', fontWeight: '700' }}>{row.value}</span>
          </div>
        ))}
      </div>

      <button
        onClick={onComplete}
        disabled={saving}
        style={{
          width: '100%', padding: '16px', borderRadius: '16px',
          background: saving ? '#A7F3D0' : 'linear-gradient(135deg, #52C97A, #1AAD7D)',
          color: '#fff', border: 'none',
          fontSize: '16px', fontWeight: '800', letterSpacing: '-0.4px',
          cursor: saving ? 'not-allowed' : 'pointer',
          boxShadow: saving ? 'none' : '0 6px 20px rgba(33,197,142,0.35)',
          transition: 'all 0.2s',
        }}
      >
        {saving ? '노밍이 맞춤 코칭을 준비하고 있어요...' : '노밍과 함께 시작하기 →'}
      </button>
    </div>
  );
}

/* ── AI 결과 화면 ─────────────────────────────────────────────── */
function AIResultScreen({ aiResult, onGoHome }) {
  const BASE_URL   = import.meta.env.BASE_URL;
  const roadmap    = aiResult?.roadmap;
  const nomingIntro = aiResult?.nomingIntro;

  return (
    <div className="anim-fade" style={{ paddingBottom: '8px' }}>

      {/* 헤더 */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{ fontSize: '44px', marginBottom: '10px' }}>🎉</div>
        <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#2A7A4B', letterSpacing: '-0.6px', marginBottom: '6px' }}>
          노밍이 맞춤 코칭을 준비했어요!
        </h2>
        <p style={{ fontSize: '14px', color: '#64748B', lineHeight: '1.6' }}>
          당신만을 위한 경제 성장 로드맵이에요.
        </p>
      </div>

      {/* 노밍 인트로 말풍선 */}
      <div style={{
        background: '#FFF4D6', border: '0.5px solid #FAC775',
        borderRadius: '16px', padding: '18px 20px',
        display: 'flex', gap: '14px', alignItems: 'flex-start',
        marginBottom: '20px',
      }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <img src={`${BASE_URL}appicon.jpg`} alt="노밍" style={{ width: '52px', height: '52px', objectFit: 'contain' }} />
          <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '12px', height: '12px', borderRadius: '50%', background: '#52C97A', border: '2px solid #FFFBEA' }} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '11px', fontWeight: '700', color: '#B45309', marginBottom: '6px' }}>노밍의 첫 인사</p>
          <p style={{ fontSize: '14px', color: '#78350F', lineHeight: '1.75', fontWeight: '500' }}>
            {nomingIntro ?? '안녕하세요! 노밍이에요. 함께 경제 공부를 시작해볼게요 🌱'}
          </p>
        </div>
      </div>

      {/* 맞춤 로드맵 */}
      {roadmap ? (
        <div style={{ background: '#fff', border: '0.5px solid #B8EBC8', borderRadius: '16px', padding: '20px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '14px', fontWeight: '800', color: '#2A7A4B' }}>나만의 학습 로드맵</span>
          </div>
          {roadmap.goal && (
            <p style={{ fontSize: '12px', color: '#888780', marginBottom: '16px' }}>목표: {roadmap.goal}</p>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(roadmap.steps ?? []).map((step, i) => {
              const color = STEP_COLORS[i % STEP_COLORS.length];
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                    background: color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', fontWeight: '800', color: '#fff', marginTop: '1px',
                  }}>
                    {step.order}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '14px', fontWeight: '700', color: '#2A7A4B', marginBottom: '2px' }}>{step.title}</p>
                    <p style={{ fontSize: '12px', color: '#888780', lineHeight: '1.5' }}>{step.description}</p>
                    {step.topics?.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                        {step.topics.map(t => (
                          <span key={t} style={{
                            fontSize: '11px', fontWeight: '600',
                            color, background: color + '14',
                            border: `1px solid ${color}30`,
                            borderRadius: '100px', padding: '2px 8px',
                          }}>{t}</span>
                        ))}
                      </div>
                    )}
                    {step.estimatedDays && (
                      <p style={{ fontSize: '11px', color: '#CBD5E1', marginTop: '4px' }}>예상 {step.estimatedDays}일</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div style={{ background: '#F2FBF5', border: '0.5px solid #B8EBC8', borderRadius: '16px', padding: '20px', marginBottom: '20px', textAlign: 'center' }}>
          <p style={{ fontSize: '13px', color: '#888780' }}>로드맵은 내 성장 허브에서 확인할 수 있어요.</p>
        </div>
      )}

      {/* CTA */}
      <button
        onClick={onGoHome}
        style={{
          width: '100%', padding: '16px', borderRadius: '16px',
          background: 'linear-gradient(135deg, #52C97A, #1AAD7D)',
          color: '#fff', border: 'none',
          fontSize: '16px', fontWeight: '800', letterSpacing: '-0.4px',
          cursor: 'pointer',
          boxShadow: '0 6px 20px rgba(33,197,142,0.35)',
        }}
      >
        노밍과 함께 시작하기 →
      </button>

      <button
        onClick={() => { window.location.hash = '#/my-growth'; }}
        style={{ display: 'block', margin: '12px auto 0', background: 'none', border: 'none', fontSize: '13px', color: '#94A3B8', cursor: 'pointer', fontWeight: '500' }}
      >
        로드맵 자세히 보기 →
      </button>
    </div>
  );
}

/* ── 메인 ─────────────────────────────────────────────────────── */
export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user, loading, refreshProfile } = useAuth();

  const [stepIdx,   setStepIdx]  = useState(0);
  const [answers,   setAnswers]  = useState({});
  const [saving,    setSaving]   = useState(false);
  const [animKey,   setAnimKey]  = useState(0);
  const [aiResult,  setAiResult] = useState(null);
  const [currentQ,  setCurrentQ] = useState(0);
  const [scores,    setScores]   = useState(Array(10).fill(undefined));

  const handleAnswer = (score) => {
    const newScores = [...scores];
    newScores[currentQ] = score;
    setScores(newScores);
  };

  const calculateLevel = (scoresArr) => {
    const total = scoresArr.reduce((sum, s) => sum + s, 0);
    if (total <= 18) return 'beginner';
    if (total <= 26) return 'elementary';
    if (total <= 34) return 'intermediate';
    if (total <= 42) return 'advanced';
    return 'expert';
  };

  const handleStep1Complete = () => {
    const level = calculateLevel(scores);
    const total = scores.reduce((sum, s) => sum + s, 0);
    setAnswers(prev => ({ ...prev, economic_level: level, diagnosis_scores: scores, diagnosis_total: total }));
    setAnimKey(k => k + 1);
    setStepIdx(1);
  };

  /* 미인증 → 로그인 */
  useEffect(() => {
    if (loading) return;
    if (!user) navigate('/login', { replace: true });
  }, [loading, user, navigate]);

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#F2FBF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, border: '3px solid #B8EBC8', borderTop: '3px solid #52C97A', borderRadius: '50%', margin: '0 auto 12px', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ fontSize: 13, color: '#888780' }}>불러오는 중...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!user) return (
    <div style={{ minHeight: '100vh', background: '#F2FBF5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px', padding: '24px' }}>
      <img src={`${import.meta.env.BASE_URL}appicon.jpg`} alt="ECONOMING" style={{ width: 56, height: 56, borderRadius: 16, objectFit: 'cover' }} />
      <p style={{ fontSize: 16, fontWeight: 700, color: '#2A7A4B', textAlign: 'center' }}>로그인이 필요해요</p>
      <p style={{ fontSize: 13, color: '#888780', textAlign: 'center' }}>온보딩을 시작하려면 먼저 로그인해주세요.</p>
      <button
        onClick={() => navigate('/login')}
        style={{ padding: '12px 32px', borderRadius: 12, background: 'linear-gradient(135deg,#52C97A,#1AAD7D)', color: '#fff', border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
      >
        로그인하기
      </button>
    </div>
  );

  const step   = STEPS[stepIdx];
  const isDone = stepIdx === STEPS.length;

  const selectSingle = (value) => setAnswers(prev => ({ ...prev, [step.id]: value }));
  const toggleMulti  = (value) => setAnswers(prev => {
    const arr = prev[step.id] ?? [];
    return { ...prev, [step.id]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value] };
  });

  const canNext = !isDone && (step?.multi ? (answers[step.id] ?? []).length > 0 : !!answers[step.id]);

  const goNext = () => { setAnimKey(k => k + 1); setStepIdx(i => i + 1); };
  const goBack = () => { setAnimKey(k => k + 1); setStepIdx(i => i - 1); };

  /* 최종 저장 → AI 결과 화면 */
  const handleComplete = async () => {
    setSaving(true);
    try {
      const result = await completeOnboarding(user.id, answers);
      await refreshProfile();
      setAiResult(result);
    } catch (err) {
      console.error('온보딩 완료 실패:', err);
      navigate('/home', { replace: true });
    } finally {
      setSaving(false);
    }
  };

  const BASE_URL    = import.meta.env.BASE_URL;
  const progressPct = isDone ? 100 : (stepIdx / STEPS.length) * 100;

  /* AI 결과 화면 */
  if (aiResult) {
    return (
      <div style={{ minHeight: '100vh', background: '#F2FBF5', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 0 48px' }}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        {/* 헤더바 */}
        <div style={{ width: '100%', background: '#fff', borderBottom: '1px solid #E8F5EF', padding: '16px 24px', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#52C97A' }}>완료!</span>
            <span style={{ fontSize: '13px', color: '#94A3B8' }}>경제 성장 여정 준비</span>
          </div>
          <div style={{ height: '5px', background: '#E8F5EF', borderRadius: '100px', overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: '100px', background: 'linear-gradient(90deg, #52C97A, #1AAD7D)', width: '100%' }} />
          </div>
        </div>
        <div style={{ width: '100%', maxWidth: '520px', padding: '32px 24px 0', boxSizing: 'border-box' }}>
          <AIResultScreen aiResult={aiResult} onGoHome={() => navigate('/home', { replace: true })} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F2FBF5', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 0 48px' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* ── 상단 헤더 ── */}
      <div style={{ width: '100%', background: '#fff', borderBottom: '1px solid #E8F5EF', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '12px', boxSizing: 'border-box' }}>
        {stepIdx > 0 && !isDone && (
          <button
            onClick={goBack}
            style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#F2FBF5', border: '1.5px solid #DCF5EB', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '18px', color: '#64748B', flexShrink: 0, transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#DCF5EB'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#F2FBF5'; }}
          >
            ←
          </button>
        )}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#52C97A' }}>
              {isDone ? '완료!' : `${stepIdx + 1} / ${STEPS.length}`}
            </span>
            <span style={{ fontSize: '13px', color: '#94A3B8' }}>경제 성장 여정 준비</span>
          </div>
          <div style={{ height: '5px', background: '#E8F5EF', borderRadius: '100px', overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: '100px', background: 'linear-gradient(90deg, #52C97A, #1AAD7D)', width: `${progressPct}%`, transition: 'width 0.4s ease' }} />
          </div>
        </div>
      </div>

      {/* ── 본문 ── */}
      <div style={{ width: '100%', maxWidth: '520px', padding: '32px 24px 0', boxSizing: 'border-box' }}>

        {/* 노밍 말풍선 */}
        <div key={`noming-${animKey}`} className="anim-fade" style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '28px' }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <img src={`${BASE_URL}appicon.jpg`} alt="노밍" style={{ width: '52px', height: '52px', objectFit: 'contain' }} />
            <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '14px', height: '14px', borderRadius: '50%', background: '#52C97A', border: '2px solid #fff' }} />
          </div>
          <div style={{ background: '#fff', border: '1.5px solid #E8F5EF', borderRadius: '4px 18px 18px 18px', padding: '14px 18px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', flex: 1 }}>
            <p style={{ fontSize: '12px', fontWeight: '700', color: '#FFC83D', marginBottom: '4px' }}>노밍</p>
            <p style={{ fontSize: '15px', color: '#1E293B', lineHeight: '1.65', fontWeight: '500', whiteSpace: 'pre-line' }}>
              {isDone
                ? '정보를 저장하고 있어요...'
                : stepIdx === 0
                  ? '몇 가지 질문으로\n당신에게 맞는 경제 성장 여정을 준비할게요.'
                  : step.nomingMsg}
            </p>
          </div>
        </div>

        {/* 완료 화면 */}
        {isDone ? (
          <CompletionScreen answers={answers} onComplete={handleComplete} saving={saving} />
        ) : (
          <div key={`step-${animKey}`} className="anim-fade">
            {stepIdx === 0 ? (
              /* ── 경제 수준 진단 (10문항) ── */
              <>
                <h2 style={{ fontSize: 'clamp(20px, 4vw, 26px)', fontWeight: '900', color: '#0F172A', letterSpacing: '-0.8px', lineHeight: '1.3', marginBottom: '6px' }}>
                  나의 경제 이해도는?
                </h2>
                <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '20px', fontWeight: '500' }}>
                  각 항목을 읽고 나에게 해당하는 점수를 선택해주세요
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#52C97A', fontWeight: '700' }}>
                    {DIAGNOSIS_QUESTIONS[currentQ].category}
                  </span>
                  <span style={{ fontSize: '12px', color: '#888780' }}>
                    {currentQ + 1} / 10
                  </span>
                </div>
                <div style={{ background: '#E3F9EC', borderRadius: '20px', height: '4px', marginBottom: '20px' }}>
                  <div style={{ background: '#52C97A', width: `${((currentQ + 1) / 10) * 100}%`, borderRadius: '20px', height: '4px', transition: 'width 0.3s ease' }} />
                </div>

                <p style={{ fontSize: '16px', fontWeight: '600', color: '#2A7A4B', lineHeight: '1.6', marginBottom: '20px' }}>
                  {DIAGNOSIS_QUESTIONS[currentQ].question}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                  {DIAGNOSIS_QUESTIONS[currentQ].options.map(opt => (
                    <button
                      key={opt.score}
                      onClick={() => handleAnswer(opt.score)}
                      style={{
                        padding: '12px 16px', borderRadius: '10px', cursor: 'pointer',
                        border: scores[currentQ] === opt.score ? '2px solid #52C97A' : '0.5px solid #B8EBC8',
                        background: scores[currentQ] === opt.score ? '#E3F9EC' : '#fff',
                        display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left',
                        fontFamily: 'inherit', transition: 'all 0.15s',
                      }}
                    >
                      <div style={{
                        width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                        background: scores[currentQ] === opt.score ? '#52C97A' : '#F2FBF5',
                        color: scores[currentQ] === opt.score ? '#fff' : '#888780',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '12px', fontWeight: '600',
                      }}>
                        {opt.score}
                      </div>
                      <span style={{
                        fontSize: '13px',
                        color: scores[currentQ] === opt.score ? '#2A7A4B' : '#5F5E5A',
                        fontWeight: scores[currentQ] === opt.score ? '600' : '400',
                      }}>
                        {opt.label}
                      </span>
                    </button>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '28px' }}>
                  {currentQ > 0 && (
                    <button
                      onClick={() => setCurrentQ(q => q - 1)}
                      style={{ flex: 1, padding: '13px', borderRadius: '12px', border: '0.5px solid #B8EBC8', background: '#fff', color: '#2A7A4B', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}
                    >
                      이전
                    </button>
                  )}
                  <button
                    onClick={() => currentQ < 9 ? setCurrentQ(q => q + 1) : handleStep1Complete()}
                    disabled={scores[currentQ] === undefined}
                    style={{
                      flex: 2, padding: '13px', borderRadius: '12px', border: 'none',
                      background: scores[currentQ] !== undefined ? 'linear-gradient(135deg, #52C97A, #1AAD7D)' : '#E2E8F0',
                      color: scores[currentQ] !== undefined ? '#fff' : '#94A3B8',
                      fontSize: '14px', fontWeight: '800', letterSpacing: '-0.3px',
                      cursor: scores[currentQ] !== undefined ? 'pointer' : 'not-allowed',
                      fontFamily: 'inherit',
                      boxShadow: scores[currentQ] !== undefined ? '0 4px 14px rgba(33,197,142,0.3)' : 'none',
                      transition: 'all 0.2s',
                    }}
                  >
                    {currentQ < 9 ? '다음 →' : '진단 완료 →'}
                  </button>
                </div>

                <button
                  onClick={() => navigate('/home')}
                  style={{ display: 'block', margin: '0 auto', background: 'none', border: 'none', fontSize: '13px', color: '#94A3B8', cursor: 'pointer', fontWeight: '500' }}
                >
                  나중에 설정하기
                </button>
              </>
            ) : (
              /* ── 일반 선택 (Steps 2~4) ── */
              <>
                <h2 style={{ fontSize: 'clamp(22px, 4vw, 28px)', fontWeight: '900', color: '#0F172A', letterSpacing: '-0.8px', lineHeight: '1.3', marginBottom: step.multi ? '6px' : '20px', whiteSpace: 'pre-line' }}>
                  {step.question}
                </h2>
                {step.multi && (
                  <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '20px', fontWeight: '500' }}>여러 개 선택할 수 있어요</p>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: step.options.length === 4 || step.options.length === 6 ? '1fr 1fr' : '1fr', gap: '10px', marginBottom: '28px' }}>
                  {step.options.map(opt => {
                    const selected = step.multi ? (answers[step.id] ?? []).includes(opt.value) : answers[step.id] === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => step.multi ? toggleMulti(opt.value) : selectSingle(opt.value)}
                        style={{
                          display: 'flex',
                          flexDirection: step.options.length <= 3 ? 'row' : 'column',
                          alignItems: step.options.length <= 3 ? 'center' : 'flex-start',
                          gap: step.options.length <= 3 ? '14px' : '8px',
                          padding: step.options.length <= 3 ? '16px 20px' : '16px',
                          borderRadius: '16px',
                          background: selected ? '#F2FBF5' : '#fff',
                          border: `2px solid ${selected ? '#52C97A' : '#E2E8F0'}`,
                          cursor: 'pointer', textAlign: 'left',
                          transition: 'all 0.15s',
                          boxShadow: selected ? '0 0 0 4px rgba(33,197,142,0.1)' : 'none',
                          position: 'relative', overflow: 'hidden',
                        }}
                      >
                        {selected && (
                          <div style={{ position: 'absolute', top: '10px', right: '10px', width: '20px', height: '20px', borderRadius: '50%', background: '#52C97A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#fff', fontWeight: '800' }}>✓</div>
                        )}
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: '#E3F9EC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {opt.icon}
                        </div>
                        <div>
                          <p style={{ fontSize: '15px', fontWeight: '800', color: selected ? '#0F172A' : '#1E293B', letterSpacing: '-0.4px', marginBottom: '2px' }}>{opt.label}</p>
                          {step.options.length <= 3 && (
                            <p style={{ fontSize: '12px', color: '#64748B', lineHeight: '1.4', fontWeight: '500' }}>{opt.desc}</p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={goNext}
                  disabled={!canNext}
                  style={{
                    width: '100%', padding: '16px', borderRadius: '16px',
                    background: canNext ? 'linear-gradient(135deg, #52C97A, #1AAD7D)' : '#E2E8F0',
                    color: canNext ? '#fff' : '#94A3B8', border: 'none',
                    fontSize: '16px', fontWeight: '800', letterSpacing: '-0.4px',
                    cursor: canNext ? 'pointer' : 'not-allowed',
                    boxShadow: canNext ? '0 6px 20px rgba(33,197,142,0.35)' : 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  {stepIdx === STEPS.length - 1 ? '완료 →' : '다음 →'}
                </button>

                <button
                  onClick={() => navigate('/home')}
                  style={{ display: 'block', margin: '14px auto 0', background: 'none', border: 'none', fontSize: '13px', color: '#94A3B8', cursor: 'pointer', fontWeight: '500' }}
                >
                  나중에 설정하기
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
