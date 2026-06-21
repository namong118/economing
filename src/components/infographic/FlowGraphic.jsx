export default function FlowGraphic({ data }) {
  const { steps } = data;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        return (
          <div key={i}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '10px 12px', borderRadius: '12px',
              background: isLast ? 'var(--c-green-50)' : 'var(--c-surface)',
              border: `1.5px solid ${isLast ? 'var(--c-green-100)' : 'var(--c-line)'}`,
            }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                background: isLast ? 'var(--c-green-500)' : '#fff',
                border: `1.5px solid ${isLast ? 'var(--c-green-500)' : 'var(--c-line)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '18px',
              }}>
                {step.icon}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{
                  fontSize: '13px', fontWeight: '700',
                  color: isLast ? 'var(--c-forest-900)' : 'var(--c-ink)',
                  lineHeight: '1.4',
                }}>
                  {step.label}
                </p>
                {step.note && (
                  <p style={{ fontSize: '11px', color: 'var(--c-slate)', marginTop: '3px', fontWeight: '500' }}>
                    {step.note}
                  </p>
                )}
              </div>
              {isLast && (
                <span style={{
                  fontSize: '10px', fontWeight: '700', color: 'var(--c-green-500)',
                  background: '#DCFCE7', borderRadius: '100px', padding: '2px 8px',
                  flexShrink: 0, whiteSpace: 'nowrap',
                }}>
                  완료
                </span>
              )}
            </div>

            {!isLast && (
              <div style={{
                display: 'flex', justifyContent: 'flex-start',
                paddingLeft: '29px', padding: '3px 0 3px 29px',
              }}>
                <span style={{ fontSize: '14px', color: '#CBD5E1', lineHeight: 1 }}>↓</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
