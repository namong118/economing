/* 진단 결과 페이지 — PC 중앙 정렬 */
import { useLocation, useNavigate } from 'react-router-dom';
import { Map } from 'lucide-react';
import { levelInfo } from '../data/diagnosisQuestions';
import { roadmaps } from '../data/roadmapData';
import { useLocalStorage } from '../hooks/useLocalStorage';
import TopNav from '../components/layout/TopNav';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { updateLevel } from '../services/profileService';
import { initProgress } from '../services/roadmapService';

export default function ResultPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [, setUserLevel] = useLocalStorage('economing_level', null);
  const { user, refreshProfile } = useAuth();

  const level = state?.level || 'beginner';
  const score = state?.score ?? 0;
  const info = levelInfo[level];
  const roadmap = roadmaps[level];

  const handleStart = async () => {
    setUserLevel(level); // localStorage에도 저장 (비로그인 폴백)

    // 로그인된 경우 Supabase에도 저장
    if (user) {
      await Promise.all([
        updateLevel(user.id, level),   // profiles 테이블 업데이트
        initProgress(user.id),         // roadmap_progress 초기화
      ]);
      await refreshProfile(); // AuthContext 프로필 새로고침
    }

    navigate('/home');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <TopNav />

      <div
        style={{
          maxWidth: '860px',
          margin: '0 auto',
          padding: '48px 24px',
        }}
      >
        {/* 결과 헤더 카드 */}
        <Card
          className="anim-fade"
          style={{
            background: `linear-gradient(135deg, ${info.bgColor} 0%, #fff 60%)`,
            border: `1.5px solid ${info.color}33`,
            padding: '48px',
            textAlign: 'center',
            marginBottom: '24px',
          }}
        >
          <div style={{ fontSize: '80px', lineHeight: 1, marginBottom: '20px' }}>{info.emoji}</div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: info.bgColor,
              color: info.color,
              borderRadius: '100px',
              padding: '6px 20px',
              fontSize: '13px',
              fontWeight: '700',
              marginBottom: '16px',
              border: `1px solid ${info.color}44`,
            }}
          >
            진단 결과
          </div>
          <h2
            style={{
              fontSize: '36px',
              fontWeight: '900',
              color: info.color,
              letterSpacing: '-1.5px',
              marginBottom: '16px',
            }}
          >
            {info.label}
          </h2>
          <p
            style={{
              fontSize: '16px',
              color: '#64748B',
              lineHeight: '1.7',
              letterSpacing: '-0.3px',
              whiteSpace: 'pre-line',
              maxWidth: '480px',
              margin: '0 auto 24px',
            }}
          >
            {info.description}
          </p>
          {/* 점수 도트 */}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  background: i < score ? info.color : '#E2E8F0',
                  transition: `background ${0.1 + i * 0.1}s ease`,
                }}
              />
            ))}
          </div>
          <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '10px' }}>5문항 중 {score}개 정답</p>
        </Card>

        {/* 맞춤 로드맵 */}
        <div className="anim-slide">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.7px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Map size={20} color="#0F172A" /> 나만의 학습 로드맵
              </h3>
              <p style={{ fontSize: '14px', color: '#64748B' }}>{info.shortDesc}을 위한 4단계 커리큘럼</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '28px' }}>
            {roadmap.map((step, idx) => (
              <Card
                key={step.step}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  opacity: 0.6 + idx * 0.12,
                  border: idx === 0 ? `1.5px solid ${step.color}44` : '1.5px solid var(--border-light)',
                }}
              >
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '14px',
                    background: idx === 0
                      ? `linear-gradient(135deg, ${step.color}, ${step.color}88)`
                      : '#F1F5F9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    flexShrink: 0,
                    boxShadow: idx === 0 ? `0 4px 12px ${step.color}35` : 'none',
                  }}
                >
                  {step.emoji}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: idx === 0 ? step.color : '#94A3B8', letterSpacing: '0.3px' }}>
                      STEP {step.step}
                    </span>
                    {idx === 0 && (
                      <span style={{ background: step.color, color: '#fff', fontSize: '10px', fontWeight: '700', padding: '1px 7px', borderRadius: '100px' }}>
                        시작
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '15px', fontWeight: '700', color: '#0F172A', letterSpacing: '-0.4px' }}>
                    {step.title}
                  </p>
                  <p style={{ fontSize: '12px', color: '#94A3B8' }}>{step.description}</p>
                </div>
              </Card>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Button size="lg" onClick={handleStart} style={{ flex: 2, borderRadius: '14px' }}>
              🚀 학습 시작하기
            </Button>
            <button
              onClick={() => navigate('/diagnosis')}
              style={{
                flex: 1,
                padding: '14px',
                borderRadius: '14px',
                background: '#F1F5F9',
                border: 'none',
                fontSize: '14px',
                color: '#64748B',
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              다시 진단받기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
