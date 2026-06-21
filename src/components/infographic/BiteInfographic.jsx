import { CheckCircle } from 'lucide-react'

const colorMap = {
  green:  { bg: 'var(--c-green-500)', border: 'none',                   icon: '#fff',    label: 'var(--c-forest-700)', sub: 'var(--c-forest-700)'  },
  yellow: { bg: 'var(--c-yellow-100)', border: '1px solid var(--c-yellow-border)',      icon: 'var(--c-amber-700)', label: 'var(--c-amber-700)', sub: 'var(--c-amber-700)'  },
  red:    { bg: 'var(--c-warn-bg)', border: '1px solid #F0997B',      icon: 'var(--c-warn)', label: 'var(--c-warn)', sub: '#993C1D'  },
  blue:   { bg: '#E8F4FD', border: '1px solid #90CAF9',      icon: '#1565C0', label: '#1565C0', sub: '#1976D2'  },
}

export function BiteInfographic({ steps, result, title }) {
  return (
    <div style={{ width: '100%', overflow: 'hidden' }}>
      <style>{`
        .bite-steps { display: flex; align-items: flex-start; justify-content: space-evenly; flex-wrap: nowrap; width: 100%; }
        .bite-step-icon { width: 64px; height: 64px; border-radius: 14px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
        @media (max-width: 768px) {
          .bite-steps { gap: 4px; }
          .bite-step-icon { width: 44px !important; height: 44px !important; border-radius: 10px !important; }
        }
      `}</style>

      {title && (
        <div style={{ fontSize: 11, color: 'var(--c-forest-700)', fontWeight: 500, textAlign: 'center', marginBottom: 10 }}>
          {title}
        </div>
      )}

      <div className="bite-steps">
        {steps.map((step, i) => {
          const c = colorMap[step.color ?? 'green']
          const Icon = step.icon
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                <div
                  className="bite-step-icon"
                  style={{ background: c.bg, border: c.border }}
                >
                  <Icon size={30} color={c.icon} />
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: c.label, textAlign: 'center', lineHeight: 1.3 }}>
                  {step.label}
                </div>
                {step.sub && (
                  <div style={{ fontSize: 11, color: c.sub, textAlign: 'center', lineHeight: 1.2, marginTop: -2 }}>
                    {step.sub}
                  </div>
                )}
              </div>
              {i < steps.length - 1 && (
                <div style={{ color: 'var(--c-line)', fontSize: 26, padding: '0 4px', marginBottom: 30, flexShrink: 0 }}>›</div>
              )}
            </div>
          )
        })}
      </div>

      {result && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
          marginTop: 10, background: 'var(--c-green-100)', borderRadius: 8, padding: '8px 12px',
        }}>
          <CheckCircle size={13} color="var(--c-green-500)" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: 11, color: 'var(--c-forest-700)', fontWeight: 500 }}>{result}</span>
        </div>
      )}
    </div>
  )
}
