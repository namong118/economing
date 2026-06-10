import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { saveOnboardingData } from '../services/profileService';

/* ── 설문 데이터 ─────────────────────────────────────────────── */
const STEPS = [
  {
    id: 'economic_level',
    question: '경제 공부는\n어느 정도 해보셨나요?',
    nomingMsg: '어느 정도 경험을 가지고 계신지\n알아야 딱 맞는 이야기를 해줄 수 있어요!',
    multi: false,
    options: [
      { value: 'beginner',     emoji: '🌱', label: '처음이에요',           desc: '경제 공부, 어디서부터 시작할지 막막해요' },
      { value: 'intermediate', emoji: '📚', label: '조금 공부해봤어요',    desc: '기본 개념은 알지만 아직 배울 게 많아요' },
      { value: 'advanced',     emoji: '📊', label: '꾸준히 공부 중이에요', desc: '경제 뉴스, 투자 개념을 꾸준히 접하고 있어요' },
    ],
  },
  {
    id: 'investment_experience',
    question: '투자 경험이\n있나요?',
    nomingMsg: '투자 경험을 알면\n더 실질적인 도움을 드릴 수 있어요.',
    multi: false,
    options: [
      { value: 'none',  emoji: '🤔', label: '없어요',                  desc: '투자는 아직 한 번도 해보지 않았어요' },
      { value: 'etf',   emoji: '📈', label: 'ETF 투자 경험이 있어요',  desc: '인덱스 펀드, ETF로 투자해본 적 있어요' },
      { value: 'stock', emoji: '💹', label: '주식 투자 경험이 있어요', desc: '개별 종목 또는 다양한 자산에 투자해봤어요' },
    ],
  },
  {
    id: 'occupation',
    question: '현재 상황을\n알려주세요',
    nomingMsg: '상황에 맞는 경제 성장 여정을\n안내해드릴게요.',
    multi: false,
    options: [
      { value: 'student',    emoji: '🎓', label: '학생',     desc: '대학생 또는 취업 준비 중이에요' },
      { value: 'employee',   emoji: '💼', label: '직장인',   desc: '월급을 받으며 일하고 있어요' },
      { value: 'freelancer', emoji: '💻', label: '프리랜서', desc: '독립적으로 일하거나 부업 중이에요' },
      { value: 'business',   emoji: '🏢', label: '사업자',   desc: '사업을 운영하고 있어요' },
    ],
  },
  {
    id: 'interests',
    question: '어떤 분야에\n관심이 있나요?',
    nomingMsg: '관심 있는 분야를 모두 골라주세요.\n거기서부터 시작할게요!',
    multi: true,
    options: [
      { value: '소비 관리',  emoji: '💳', label: '소비 관리', desc: '현명한 소비 습관 만들기' },
      { value: '저축',       emoji: '🏦', label: '저축',      desc: '목돈 만들기와 저축 전략' },
      { value: '투자',       emoji: '📈', label: '투자',      desc: '주식, ETF, 펀드 투자' },
      { value: '부동산',     emoji: '🏠', label: '부동산',    desc: '부동산 시장 이해와 투자' },
      { value: '세금',       emoji: '📋', label: '세금',      desc: '절세와 세금 신고 이해' },
      { value: '경제 뉴스',  emoji: '📰', label: '경제 뉴스', desc: '경제 흐름 읽는 법' },
    ],
  },
];

/* ── 완료 화면 ────────────────────────────────────────────────── */
function CompletionScreen({ answers, onComplete, saving }) {
  const BASE_URL = import.meta.env.BASE_URL;
  const LEVEL_LABEL = { beginner: '초급자', intermediate: '중급자', advanced: '고급자' };

  return (
    <div className="anim-fade" style={{ textAlign: 'center', padding: '16px 0' }}>
      {/* 노밍 */}
      <img
        src={`${BASE_URL}coach.png`}
        alt="노밍"
        style={{
          width: '72px', height: '72px', borderRadius: '20px',
          objectFit: 'cover', margin: '0 auto 16px',
          boxShadow: '0 8px 24px rgba(255,200,61,0.3)',
        }}
      />
      <h2 style={{
        fontSize: '24px', fontWeight: '900', color: '#0F172A',
        letterSpacing: '-0.8px', marginBottom: '8px',
      }}>
        준비 완료! 🎉
      </h2>
      <p style={{ fontSize: '15px', color: '#64748B', lineHeight: '1.7', marginBottom: '32px' }}>
        이제 당신만의 경제 성장 여정을<br />함께 시작해볼게요.
      </p>

      {/* 요약 카드 */}
      <div style={{
        background: '#F4FAF6', border: '1.5px solid #DCF5EB',
        borderRadius: '20px', padding: '20px 24px',
        marginBottom: '28px', textAlign: 'left',
      }}>
        <p style={{ fontSize: '12px', fontWeight: '700', color: '#94A3B8', letterSpacing: '0.8px', marginBottom: '12px' }}>
          노밍이 파악한 내용
        </p>
        {[
          { label: '경제 수준', value: LEVEL_LABEL[answers.economic_level] ?? '-' },
          { label: '투자 경험', value: { none: '없음', etf: 'ETF', stock: '주식' }[answers.investment_experience] ?? '-' },
          { label: '상황',     value: { student: '학생', employee: '직장인', freelancer: '프리랜서', business: '사업자' }[answers.occupation] ?? '-' },
          { label: '관심 분야', value: (answers.interests ?? []).join(' · ') || '-' },
        ].map(row => (
          <div key={row.label} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
            padding: '8px 0', borderBottom: '1px solid #E8F5EF',
          }}>
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
          background: saving ? '#A7F3D0' : 'linear-gradient(135deg, #21C58E, #1AAD7D)',
          color: '#fff', border: 'none',
          fontSize: '16px', fontWeight: '800', letterSpacing: '-0.4px',
          cursor: saving ? 'not-allowed' : 'pointer',
          boxShadow: saving ? 'none' : '0 6px 20px rgba(33,197,142,0.35)',
          transition: 'all 0.2s',
        }}
      >
        {saving ? '저장 중...' : '경제 성장 여정 시작하기 →'}
      </button>
    </div>
  );
}

/* ── 메인 ─────────────────────────────────────────────────────── */
export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user, profile, loading, refreshProfile } = useAuth();

  const [stepIdx,  setStepIdx]  = useState(0);   // 0~3 = 설문, 4 = 완료
  const [answers,  setAnswers]  = useState({});
  const [saving,   setSaving]   = useState(false);
  const [animKey,  setAnimKey]  = useState(0);    // step 전환 애니메이션 트리거

  /* 미인증 → 로그인 / 온보딩 완료 → 홈 */
  useEffect(() => {
    if (loading) return;
    if (!user)                            navigate('/login',  { replace: true });
    else if (profile?.onboarding_completed) navigate('/home', { replace: true });
  }, [loading, user, profile, navigate]);

  if (loading || !user) return null;

  const step    = STEPS[stepIdx];
  const isDone  = stepIdx === STEPS.length;
  const current = answers[step?.id];

  /* 단일 선택 */
  const selectSingle = (value) => {
    setAnswers(prev => ({ ...prev, [step.id]: value }));
  };

  /* 복수 선택 토글 */
  const toggleMulti = (value) => {
    setAnswers(prev => {
      const arr = prev[step.id] ?? [];
      return {
        ...prev,
        [step.id]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value],
      };
    });
  };

  const canNext = step?.multi
    ? (answers[step.id] ?? []).length > 0
    : !!answers[step.id];

  const goNext = () => {
    setAnimKey(k => k + 1);
    setStepIdx(i => i + 1);
  };

  const goBack = () => {
    setAnimKey(k => k + 1);
    setStepIdx(i => i - 1);
  };

  /* 최종 저장 */
  const handleComplete = async () => {
    setSaving(true);
    const { error } = await saveOnboardingData(user.id, {
      economicLevel:        answers.economic_level,
      investmentExperience: answers.investment_experience,
      occupation:           answers.occupation,
      interests:            answers.interests ?? [],
    });
    if (!error) {
      await refreshProfile();
      navigate('/home', { replace: true });
    } else {
      console.error('온보딩 저장 실패:', error.message);
      setSaving(false);
    }
  };

  const BASE_URL = import.meta.env.BASE_URL;
  const progressPct = isDone ? 100 : ((stepIdx) / STEPS.length) * 100;

  return (
    <div style={{
      minHeight: '100vh', background: '#F4FAF6',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '0 0 48px',
    }}>

      {/* ── 상단 헤더 ─────────────────────────────────────── */}
      <div style={{
        width: '100%', background: '#fff',
        borderBottom: '1px solid #E8F5EF',
        padding: '16px 24px',
        display: 'flex', alignItems: 'center', gap: '12px',
        boxSizing: 'border-box',
      }}>
        {stepIdx > 0 && !isDone && (
          <button
            onClick={goBack}
            style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: '#F4FAF6', border: '1.5px solid #DCF5EB',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: '18px', color: '#64748B',
              flexShrink: 0, transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#DCF5EB'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#F4FAF6'; }}
          >
            ←
          </button>
        )}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#21C58E' }}>
              {isDone ? '완료!' : `${stepIdx + 1} / ${STEPS.length}`}
            </span>
            <span style={{ fontSize: '13px', color: '#94A3B8' }}>경제 성장 여정 준비</span>
          </div>
          <div style={{ height: '5px', background: '#E8F5EF', borderRadius: '100px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: '100px',
              background: 'linear-gradient(90deg, #21C58E, #1AAD7D)',
              width: `${progressPct}%`,
              transition: 'width 0.4s ease',
            }} />
          </div>
        </div>
      </div>

      {/* ── 본문 ─────────────────────────────────────────── */}
      <div style={{ width: '100%', maxWidth: '520px', padding: '32px 24px 0', boxSizing: 'border-box' }}>

        {/* 노밍 말풍선 */}
        <div
          key={`noming-${animKey}`}
          className="anim-fade"
          style={{
            display: 'flex', alignItems: 'flex-start', gap: '14px',
            marginBottom: '28px',
          }}
        >
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <img
              src={`${BASE_URL}coach.png`}
              alt="노밍"
              style={{ width: '52px', height: '52px', borderRadius: '15px', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute', bottom: '-2px', right: '-2px',
              width: '14px', height: '14px', borderRadius: '50%',
              background: '#21C58E', border: '2px solid #fff',
            }} />
          </div>
          <div style={{
            background: '#fff', border: '1.5px solid #E8F5EF',
            borderRadius: '4px 18px 18px 18px', padding: '14px 18px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)', flex: 1,
          }}>
            <p style={{ fontSize: '12px', fontWeight: '700', color: '#FFC83D', marginBottom: '4px' }}>☀️ 노밍</p>
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
            {/* 질문 */}
            <h2 style={{
              fontSize: 'clamp(22px, 4vw, 28px)', fontWeight: '900',
              color: '#0F172A', letterSpacing: '-0.8px', lineHeight: '1.3',
              marginBottom: step.multi ? '6px' : '20px',
              whiteSpace: 'pre-line',
            }}>
              {step.question}
            </h2>
            {step.multi && (
              <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '20px', fontWeight: '500' }}>
                여러 개 선택할 수 있어요
              </p>
            )}

            {/* 선택 카드 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: step.options.length === 4 || step.options.length === 6
                ? '1fr 1fr'
                : '1fr',
              gap: '10px',
              marginBottom: '28px',
            }}>
              {step.options.map(opt => {
                const selected = step.multi
                  ? (answers[step.id] ?? []).includes(opt.value)
                  : answers[step.id] === opt.value;
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
                      background: selected ? '#F4FAF6' : '#fff',
                      border: `2px solid ${selected ? '#21C58E' : '#E2E8F0'}`,
                      cursor: 'pointer', textAlign: 'left',
                      transition: 'all 0.15s',
                      boxShadow: selected ? '0 0 0 4px rgba(33,197,142,0.1)' : 'none',
                      position: 'relative', overflow: 'hidden',
                    }}
                  >
                    {/* 선택 체크 */}
                    {selected && (
                      <div style={{
                        position: 'absolute', top: '10px', right: '10px',
                        width: '20px', height: '20px', borderRadius: '50%',
                        background: '#21C58E',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '11px', color: '#fff', fontWeight: '800',
                      }}>✓</div>
                    )}
                    <span style={{ fontSize: step.options.length <= 3 ? '28px' : '22px' }}>
                      {opt.emoji}
                    </span>
                    <div>
                      <p style={{
                        fontSize: '15px', fontWeight: '800',
                        color: selected ? '#0F172A' : '#1E293B',
                        letterSpacing: '-0.4px', marginBottom: '2px',
                      }}>
                        {opt.label}
                      </p>
                      {step.options.length <= 3 && (
                        <p style={{ fontSize: '12px', color: '#64748B', lineHeight: '1.4', fontWeight: '500' }}>
                          {opt.desc}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* 다음 버튼 */}
            <button
              onClick={goNext}
              disabled={!canNext}
              style={{
                width: '100%', padding: '16px', borderRadius: '16px',
                background: canNext
                  ? 'linear-gradient(135deg, #21C58E, #1AAD7D)'
                  : '#E2E8F0',
                color: canNext ? '#fff' : '#94A3B8',
                border: 'none',
                fontSize: '16px', fontWeight: '800', letterSpacing: '-0.4px',
                cursor: canNext ? 'pointer' : 'not-allowed',
                boxShadow: canNext ? '0 6px 20px rgba(33,197,142,0.35)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              {stepIdx === STEPS.length - 1 ? '완료 →' : '다음 →'}
            </button>

            {/* 건너뛰기 */}
            <button
              onClick={() => navigate('/home')}
              style={{
                display: 'block', margin: '14px auto 0',
                background: 'none', border: 'none',
                fontSize: '13px', color: '#94A3B8',
                cursor: 'pointer', fontWeight: '500',
              }}
            >
              나중에 설정하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
