import { CheckCircle } from 'lucide-react'

const colorMap = {
  green:  { bg: '#21C58E', border: 'none',                   icon: '#fff',    label: '#085041', sub: '#0F6E56'  },
  yellow: { bg: '#FFF4D6', border: '1px solid #FAC775',      icon: '#854F0B', label: '#633806', sub: '#854F0B'  },
  red:    { bg: '#FAECE7', border: '1px solid #F0997B',      icon: '#712B13', label: '#712B13', sub: '#993C1D'  },
  blue:   { bg: '#E8F4FD', border: '1px solid #90CAF9',      icon: '#1565C0', label: '#1565C0', sub: '#1976D2'  },
}

export function BiteInfographic({ steps, result, title }) {
  return (
    <div style={{ width: '100%' }}>
      {title && (
        <div style={{ fontSize: 11, color: '#0F6E56', fontWeight: 500, textAlign: 'center', marginBottom: 14 }}>
          {title}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-evenly', flexWrap: 'nowrap', width: '100%' }}>
        {steps.map((step, i) => {
          const c = colorMap[step.color ?? 'green']
          const Icon = step.icon
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: 64, height: 64, borderRadius: 14,
                  background: c.bg, border: c.border,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon size={30} color={c.icon} />
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: c.label, textAlign: 'center', lineHeight: 1.4 }}>
                  {step.label}
                </div>
                {step.sub && (
                  <div style={{ fontSize: 11, color: c.sub, textAlign: 'center', lineHeight: 1.3, marginTop: -3 }}>
                    {step.sub}
                  </div>
                )}
              </div>
              {i < steps.length - 1 && (
                <div style={{ color: '#C0DD97', fontSize: 26, padding: '0 4px', marginBottom: 34, flexShrink: 0 }}>›</div>
              )}
            </div>
          )
        })}
      </div>

      {result && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
          marginTop: 14, background: '#E1F5EE', borderRadius: 8, padding: '9px 12px',
        }}>
          <CheckCircle size={14} color="#21C58E" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: 11, color: '#085041', fontWeight: 500 }}>{result}</span>
        </div>
      )}
    </div>
  )
}
