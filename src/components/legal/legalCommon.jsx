/* ── 법적 문서(개인정보처리방침/이용약관) 공용 조각 ─────────────── */

export function SectionTitle({ children, style }) {
  return (
    <h2 style={{
      fontSize: 'clamp(20px, 2.6vw, 23px)', fontWeight: '900',
      color: 'var(--c-ink)', letterSpacing: '-0.02em',
      marginBottom: '14px', lineHeight: 1.35, ...style,
    }}>
      {children}
    </h2>
  );
}

export function Body({ children, style }) {
  return (
    <p style={{
      fontSize: '15px', color: 'var(--c-slate)', lineHeight: '1.85',
      whiteSpace: 'pre-line', marginBottom: '14px', ...style,
    }}>
      {children}
    </p>
  );
}

export function SubHeading({ children }) {
  return (
    <p style={{ fontSize: '14px', fontWeight: '800', color: 'var(--c-ink)', marginBottom: '8px' }}>
      {children}
    </p>
  );
}

export function List({ items, style }) {
  return (
    <ul style={{ margin: '0 0 14px', paddingLeft: '20px', ...style }}>
      {items.map((item, i) => (
        <li key={i} style={{ fontSize: '15px', color: 'var(--c-slate)', lineHeight: '1.85', marginBottom: '4px' }}>
          {item}
        </li>
      ))}
    </ul>
  );
}
