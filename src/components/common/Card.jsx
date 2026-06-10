/* 재사용 가능한 카드 컴포넌트 */

export default function Card({ children, style = {}, onClick, padding = '20px', hoverable = false }) {
  const baseStyle = {
    background: '#FFFFFF',
    borderRadius: '16px',
    padding,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    border: '1px solid #F3F4F6',
    transition: hoverable ? 'all 0.2s ease' : 'none',
    cursor: onClick ? 'pointer' : 'default',
    ...style,
  };

  const handleMouseEnter = (e) => {
    if (hoverable || onClick) {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)';
    }
  };

  const handleMouseLeave = (e) => {
    if (hoverable || onClick) {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
    }
  };

  return (
    <div
      style={baseStyle}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}
