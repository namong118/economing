/* 진단 결과 페이지 */
import { useLocation, useNavigate } from 'react-router-dom';
import { Sprout, Leaf, TrendingUp, Zap, Star } from 'lucide-react';
import { levelInfo } from '../data/diagnosisQuestions';
import { useLocalStorage } from '../hooks/useLocalStorage';
import TopNav from '../components/layout/TopNav';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { updateLevel } from '../services/profileService';
import { initProgress } from '../services/roadmapService';

const LEVEL_ICONS = {
  beginner:     Sprout,
  elementary:   Leaf,
  intermediate: TrendingUp,
  advanced:     Star,
  expert:       Zap,
};

export default function ResultPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [, setUserLevel] = useLocalStorage('economing_level', null);
  const { user, refreshProfile } = useAuth();

  const level = state?.level || 'beginner';
  const score = state?.score ?? 0;
  const info = levelInfo[level] ?? levelInfo['beginner'];

  const handleStart = async () => {
    setUserLevel(level);
    if (user) {
      await Promise.all([
        updateLevel(user.id, level),
        initProgress(user.id),
      ]);
      await refreshProfile();
      navigate('/onboarding', { state: { economic_level: level }, replace: true });
    } else {
      navigate('/home');
    }
  };

  const LIcon = LEVEL_ICONS[level] ?? Sprout;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <TopNav />

      <div style={{
        maxWidth: '440px',
        margin: '0 auto',
        padding: '32px 20px 80px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
      }}>
        {/* 결과 카드 */}
        <Card
          className="anim-fade"
          style={{
            width: '100%',
            background: `linear-gradient(135deg, ${info.bgColor} 0%, #fff 70%)`,
            border: `1.5px solid ${info.color}33`,
            padding: '24px 20px',
            textAlign: 'center',
          }}
        >
          {/* 아이콘 */}
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: info.bgColor,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 12px',
            border: `1px solid ${info.color}33`,
          }}>
            <LIcon size={30} color={info.color} />
          </div>

          {/* 배지 */}
          <div style={{
            display: 'inline-flex', alignItems: 'center',
            background: info.bgColor, color: info.color,
            borderRadius: 100, padding: '4px 14px',
            fontSize: 11, fontWeight: 700,
            border: `1px solid ${info.color}44`,
            marginBottom: 10,
          }}>
            진단 결과
          </div>

          {/* 레벨명 */}
          <h2 style={{
            fontSize: 26, fontWeight: 900,
            color: info.color, letterSpacing: '-1px',
            marginBottom: 8,
          }}>
            {info.label}
          </h2>

          {/* 설명 */}
          <p style={{
            fontSize: 13, color: 'var(--c-slate)',
            lineHeight: 1.65, letterSpacing: '-0.2px',
            whiteSpace: 'pre-line',
            marginBottom: 16,
          }}>
            {info.description}
          </p>

          {/* 점수 바 */}
          <div style={{ maxWidth: 160, margin: '0 auto' }}>
            <div style={{ background: 'var(--c-line)', borderRadius: 99, height: 5, overflow: 'hidden' }}>
              <div style={{
                width: `${Math.max(0, ((score - 10) / 40) * 100)}%`,
                height: '100%', borderRadius: 99,
                background: info.color,
                transition: 'width 0.8s ease',
              }} />
            </div>
            <p style={{ fontSize: 11, color: 'var(--c-muted)', marginTop: 6 }}>
              총점 {score}점 / 50점
            </p>
          </div>
        </Card>

        {/* 버튼 */}
        <div style={{ width: '100%', display: 'flex', gap: '10px' }}>
          <Button
            size="lg"
            onClick={handleStart}
            style={{ flex: 2, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            <Zap size={15} /> 학습하러 가기
          </Button>
          <button
            onClick={() => navigate('/diagnosis')}
            style={{
              flex: 1, padding: '14px', borderRadius: 12,
              background: 'var(--c-line-soft)', border: 'none',
              fontSize: 14, color: 'var(--c-slate)',
              cursor: 'pointer', fontWeight: 600,
            }}
          >
            다시 진단
          </button>
        </div>
      </div>
    </div>
  );
}
