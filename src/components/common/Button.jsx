/* 재사용 가능한 버튼 컴포넌트 */

const styles = {
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    borderRadius: '14px',
    fontWeight: '600',
    fontSize: '16px',
    padding: '14px 24px',
    width: '100%',
    transition: 'all 0.15s ease',
    cursor: 'pointer',
    border: 'none',
    letterSpacing: '-0.2px',
  },
  primary: {
    background: 'var(--grad-action)',
    color: '#fff',
    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
  },
  secondary: {
    background: '#F3F4F6',
    color: 'var(--c-slate)',
  },
  outline: {
    background: 'transparent',
    color: 'var(--c-green-500)',
    border: '2px solid var(--c-green-500)',
  },
  ghost: {
    background: 'transparent',
    color: '#6B7280',
  },
  danger: {
    background: 'linear-gradient(135deg, #EF4444, #DC2626)',
    color: '#fff',
    boxShadow: '0 4px 14px rgba(239, 68, 68, 0.3)',
  },
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  style = {},
  icon,
}) {
  const sizeStyle = {
    sm: { fontSize: '14px', padding: '10px 18px', borderRadius: '10px' },
    md: {},
    lg: { fontSize: '18px', padding: '16px 28px', borderRadius: '16px' },
  }[size];

  const disabledStyle = disabled
    ? { opacity: 0.5, cursor: 'not-allowed', transform: 'none', boxShadow: 'none' }
    : {};

  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={{
        ...styles.base,
        ...styles[variant],
        ...sizeStyle,
        ...disabledStyle,
        ...style,
      }}
      disabled={disabled}
    >
      {icon && <span style={{ fontSize: '18px' }}>{icon}</span>}
      {children}
    </button>
  );
}
