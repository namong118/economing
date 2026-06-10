/* 페이지 상단 헤더 */
import { useNavigate } from 'react-router-dom';

export default function Header({ title, showBack = true, rightAction, transparent = false }) {
  const navigate = useNavigate();

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        background: transparent ? 'transparent' : '#FFFFFF',
        borderBottom: transparent ? 'none' : '1px solid #F3F4F6',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      {showBack ? (
        <button
          onClick={() => navigate(-1)}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: '#F9FAFB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          ←
        </button>
      ) : (
        <div style={{ width: '36px' }} />
      )}

      <h1
        style={{
          fontSize: '17px',
          fontWeight: '700',
          color: '#111827',
          letterSpacing: '-0.5px',
          margin: 0,
        }}
      >
        {title}
      </h1>

      <div style={{ width: '36px', display: 'flex', justifyContent: 'flex-end' }}>
        {rightAction || null}
      </div>
    </header>
  );
}
