import { BookOpen, NotebookPen, BookMarked } from 'lucide-react';

const BASE_URL = import.meta.env.BASE_URL;

const FEATURES = [
  {
    icon: <img src={`${BASE_URL}noming.png`} alt="노밍" style={{ width: 28, height: 28, objectFit: 'contain' }} />,
    title: 'AI 코치',
    desc: '모르는 경제 개념을\n쉽게 질문하세요.',
    bg: '#FEF9EC',
    accent: '#F59E0B',
    border: '#FDE68A',
    iconColor: '#F59E0B',
  },
  {
    icon: <BookOpen size={28} color="#2A7A4B" />,
    title: '경제 읽기',
    desc: '3분 만에\n경제 개념 하나를 이해해보세요.',
    bg: '#F0FDF4',
    accent: '#52C97A',
    border: '#BBF7D0',
    iconColor: '#52C97A',
  },
  {
    icon: <NotebookPen size={28} color="#3B82F6" />,
    title: '경제일기',
    desc: '배운 것과\n경제 뉴스를 기록해보세요.',
    bg: '#EFF6FF',
    accent: '#3B82F6',
    border: '#BFDBFE',
    iconColor: '#3B82F6',
  },
  {
    icon: <BookMarked size={28} color="#8B5CF6" />,
    title: '나만의 경제사전',
    desc: '모르는 경제 용어를\n저장하고 다시 확인하세요.',
    bg: '#FAF5FF',
    accent: '#8B5CF6',
    border: '#DDD6FE',
    iconColor: '#8B5CF6',
  },
];

export default function FeatureSection() {
  return (
    <section style={{
      background: '#F8FAFB',
      padding: 'clamp(60px, 8vw, 100px) 24px',
    }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        {/* 헤더 */}
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <p style={{
            display: 'inline-block',
            background: '#E8FAF3', color: '#059669',
            borderRadius: '100px', padding: '5px 14px',
            fontSize: '13px', fontWeight: '700',
            letterSpacing: '-0.2px', marginBottom: '16px',
          }}>
            핵심 기능
          </p>
          <h2 style={{
            fontSize: 'clamp(24px, 4vw, 36px)',
            fontWeight: '900', color: '#0F1F18',
            letterSpacing: '-1px', lineHeight: '1.25',
          }}>
            경제 성장을 위한<br/>4가지 도구
          </h2>
        </div>

        {/* 기능 카드 그리드 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
        }}>
          {FEATURES.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, desc, bg, accent, border }) {
  return (
    <div style={{
      background: bg,
      borderRadius: '24px',
      padding: '28px 24px',
      border: `1.5px solid ${border}`,
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
    }}>
      <div style={{
        width: '56px', height: '56px',
        background: '#fff',
        borderRadius: '16px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 4px 12px ${accent}22`,
        border: `1px solid ${border}`,
      }}>
        {icon}
      </div>
      <div>
        <h3 style={{
          fontSize: '17px', fontWeight: '800',
          color: '#0F1F18', letterSpacing: '-0.5px',
          marginBottom: '6px',
        }}>
          {title}
        </h3>
        <p style={{
          fontSize: '14px', color: '#64748B',
          lineHeight: '1.6', letterSpacing: '-0.2px',
          whiteSpace: 'pre-line',
        }}>
          {desc}
        </p>
      </div>
    </div>
  );
}
