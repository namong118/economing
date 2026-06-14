/* 학습 로드맵 페이지 — 5단계 경제 성장 경로 */
import { useState } from 'react';
import { Map, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { roadmap, levelStartStep } from '../data/roadmapData';
import { levelInfo } from '../data/diagnosisQuestions';
import PageWrapper from '../components/layout/PageWrapper';
import Card from '../components/common/Card';

export default function RoadmapPage() {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const [localLevel] = useLocalStorage('economing_level', null);

  const level     = userProfile?.level || localLevel;
  const startStep = level ? levelStartStep[level] ?? 1 : null;
  const info      = level ? levelInfo[level] : null;

  const [expandedStep, setExpandedStep] = useState(startStep ? startStep - 1 : 0);

  return (
    <PageWrapper>
      <div className="anim-fade">

        {/* 헤더 */}
        <div style={{ borderBottom: '1px solid #F1F5F9', background: '#fff', padding: '32px 0 28px' }}>
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <p style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
                  학습 로드맵
                </p>
                <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#0F172A', letterSpacing: '-1px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  경제 성장 5단계 로드맵 <Map size={26} color="#0F172A" />
                </h1>
                <p style={{ fontSize: '15px', color: '#64748B' }}>
                  {info
                    ? `${info.label}을 위한 맞춤 시작점 · STEP ${startStep}부터 시작하세요`
                    : '돈의 흐름부터 부동산까지, 단계별로 배워요'}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                {level && (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    background: info.bgColor, border: `1.5px solid ${info.color}44`,
                    borderRadius: '12px', padding: '8px 16px',
                    fontSize: '14px', fontWeight: '700', color: info.color,
                  }}>
                    <span>{info.emoji}</span>
                    <span>{info.label}</span>
                  </div>
                )}
                <button
                  onClick={() => navigate('/diagnosis')}
                  style={{
                    padding: '9px 18px', borderRadius: '10px',
                    background: '#F1F5F9', border: 'none',
                    fontSize: '13px', fontWeight: '600', color: '#64748B', cursor: 'pointer',
                  }}
                >
                  수준 재진단
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 로드맵 */}
        <div style={{ padding: '40px 0' }}>
          <div className="container">

            {/* 진행 표시바 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '32px', overflowX: 'auto' }} className="no-scrollbar">
              {roadmap.map((step, idx) => {
                const isDone    = startStep && step.step < startStep;
                const isCurrent = startStep && step.step === startStep;
                return (
                  <div key={step.step} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                    <button
                      onClick={() => setExpandedStep(idx)}
                      style={{
                        width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
                        background: isDone
                          ? '#10B981'
                          : isCurrent
                          ? step.color
                          : '#E2E8F0',
                        border: expandedStep === idx ? `3px solid ${step.color}` : '3px solid transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '18px', cursor: 'pointer', transition: 'all 0.2s',
                        boxShadow: expandedStep === idx ? `0 0 0 3px ${step.color}22` : 'none',
                      }}
                    >
                      {isDone ? <CheckCircle size={18} color="#10B981" /> : step.emoji}
                    </button>
                    {idx < roadmap.length - 1 && (
                      <div style={{
                        width: '48px', height: '3px', flexShrink: 0,
                        background: isDone ? '#10B981' : '#E2E8F0',
                        transition: 'background 0.3s',
                      }} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* 스텝 카드들 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {roadmap.map((step, idx) => {
                const isDone    = startStep && step.step < startStep;
                const isCurrent = startStep && step.step === startStep;
                const isExpanded = expandedStep === idx;

                return (
                  <Card
                    key={step.step}
                    style={{
                      border: isCurrent
                        ? `2px solid ${step.color}55`
                        : isExpanded
                        ? '1.5px solid #CBD5E1'
                        : '1.5px solid #F1F5F9',
                      transition: 'all 0.2s ease',
                      opacity: isDone ? 0.75 : 1,
                    }}
                  >
                    {/* 스텝 헤더 (클릭 가능) */}
                    <div
                      onClick={() => setExpandedStep(isExpanded ? -1 : idx)}
                      style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px' }}
                    >
                      <div style={{
                        width: '56px', height: '56px', borderRadius: '16px', flexShrink: 0,
                        background: isDone
                          ? '#ECFDF5'
                          : isCurrent
                          ? `linear-gradient(135deg, ${step.color}, ${step.color}88)`
                          : `${step.color}12`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '28px',
                        boxShadow: isCurrent ? `0 4px 14px ${step.color}35` : 'none',
                      }}>
                        {isDone ? <CheckCircle size={18} color="#10B981" /> : step.emoji}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{ fontSize: '11px', fontWeight: '700', color: isCurrent ? step.color : '#94A3B8', letterSpacing: '0.5px' }}>
                            STEP {step.step}
                          </span>
                          {isCurrent && (
                            <span style={{ background: step.color, color: '#fff', fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '100px' }}>
                              시작 추천
                            </span>
                          )}
                          {isDone && (
                            <span style={{ background: '#ECFDF5', color: '#059669', fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '100px' }}>
                              완료
                            </span>
                          )}
                        </div>
                        <h3 style={{ fontSize: '17px', fontWeight: '800', color: isDone ? '#94A3B8' : '#0F172A', letterSpacing: '-0.5px' }}>
                          {step.title}
                        </h3>
                      </div>

                      <span style={{ fontSize: '18px', color: '#CBD5E1', transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>
                        ›
                      </span>
                    </div>

                    {/* 펼쳐진 내용 */}
                    {isExpanded && (
                      <div className="anim-slide" style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #F1F5F9' }}>
                        <p style={{ fontSize: '14px', color: '#64748B', lineHeight: '1.7', marginBottom: '16px' }}>
                          {step.description}
                        </p>

                        {/* 학습 주제 태그 */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                          {step.topics.map(topic => (
                            <span key={topic} style={{
                              background: '#F8FAFC', border: '1px solid #E2E8F0',
                              borderRadius: '8px', padding: '5px 12px',
                              fontSize: '13px', color: '#374151', fontWeight: '500',
                            }}>
                              {topic}
                            </span>
                          ))}
                        </div>

                        {/* 이 단계 관련 추천 질문 */}
                        <div style={{ marginBottom: '20px' }}>
                          <p style={{ fontSize: '12px', fontWeight: '700', color: '#94A3B8', letterSpacing: '0.5px', marginBottom: '10px' }}>
                            AI 코치에게 물어보세요
                          </p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {step.coachQuestions.map(q => (
                              <button
                                key={q}
                                onClick={() => navigate('/coach', { state: { initialQuestion: q } })}
                                style={{
                                  textAlign: 'left', padding: '10px 14px', borderRadius: '10px',
                                  background: '#F8FAFC', border: '1.5px solid #E2E8F0',
                                  fontSize: '13px', color: '#374151', cursor: 'pointer',
                                  transition: 'all 0.15s',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = step.color; e.currentTarget.style.color = step.color; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.color = '#374151'; }}
                              >
                                💬 {q}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '12px', color: '#94A3B8' }}>⏱ 예상 기간: {step.duration}</span>
                          <button
                            onClick={() => navigate('/coach', { state: { initialQuestion: `${step.title}에 대해 알고 싶어요` } })}
                            style={{
                              padding: '8px 18px', borderRadius: '10px',
                              background: step.color, color: '#fff', border: 'none',
                              fontSize: '13px', fontWeight: '700', cursor: 'pointer',
                            }}
                          >
                            🤖 AI 코치에게 질문하기 →
                          </button>
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>

            {/* 하단 안내 */}
            {!level && (
              <Card style={{ marginTop: '24px', background: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)', border: '1.5px solid #A7F3D0', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '36px' }}>🎯</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '16px', fontWeight: '700', color: '#0F172A', marginBottom: '4px' }}>
                      어느 단계부터 시작해야 할지 모르겠나요?
                    </p>
                    <p style={{ fontSize: '14px', color: '#64748B' }}>
                      5문항 진단으로 나에게 맞는 시작 단계를 바로 알려드려요.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/diagnosis')}
                    style={{
                      padding: '10px 22px', borderRadius: '12px',
                      background: 'linear-gradient(135deg, #10B981, #059669)',
                      color: '#fff', border: 'none', fontSize: '14px',
                      fontWeight: '700', cursor: 'pointer', flexShrink: 0,
                      boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
                    }}
                  >
                    수준 진단받기 →
                  </button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
