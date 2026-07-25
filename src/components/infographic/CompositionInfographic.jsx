import { CheckCircle } from 'lucide-react'

const colorMap = {
  green:  { bg: 'var(--c-green-500)', border: 'none',                   icon: '#fff',    label: 'var(--c-forest-700)', sub: 'var(--c-forest-700)'  },
  yellow: { bg: 'var(--c-yellow-100)', border: '1px solid var(--c-yellow-border)',      icon: 'var(--c-amber-700)', label: 'var(--c-amber-700)', sub: 'var(--c-amber-700)'  },
  red:    { bg: 'var(--c-warn-bg)', border: '1px solid #F0997B',      icon: 'var(--c-warn)', label: 'var(--c-warn)', sub: '#993C1D'  },
  blue:   { bg: '#E8F4FD', border: '1px solid #90CAF9',      icon: '#1565C0', label: '#1565C0', sub: '#1976D2'  },
}

function Chip({ icon: Icon, label, sub, color }) {
  const c = colorMap[color ?? 'green']
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
      <div className="composition-icon" style={{ background: c.bg, border: c.border }}>
        <Icon size={30} color={c.icon} />
      </div>
      <div style={{ fontSize: 12, fontWeight: 600, color: c.label, textAlign: 'center', lineHeight: 1.3 }}>
        {label}
      </div>
      {sub && (
        <div style={{ fontSize: 11, color: c.sub, textAlign: 'center', lineHeight: 1.2, marginTop: -2 }}>
          {sub}
        </div>
      )}
    </div>
  )
}

// 부분이 모여 전체가 되는 개념용 — 흐름형과 같은 1단 구조를 쓰되, 화살표(순서/인과)
// 대신 +/=를 써서 "이것 다음에 저것"으로 잘못 읽히지 않게 한다.
// [항목1] + [항목2] + ... | (구분선) = [합계]  — 전부 한 줄, 줄바꿈 없음.
export function CompositionInfographic({ title, items, total, result }) {
  return (
    <div style={{ width: '100%', overflow: 'hidden' }}>
      <style>{`
        .composition-items { display: flex; align-items: flex-start; justify-content: center; flex-wrap: nowrap; width: 100%; }
        .composition-icon { width: 64px; height: 64px; border-radius: 14px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
        .composition-op { color: var(--c-line); font-size: 26px; padding: 0 4px; margin-bottom: 30px; flex-shrink: 0; }
        .composition-divider { width: 1px; height: 64px; background: var(--c-line); margin: 0 6px 30px; flex-shrink: 0; }
        @media (max-width: 768px) {
          .composition-items { gap: 2px; }
          .composition-icon { width: 44px !important; height: 44px !important; border-radius: 10px !important; }
          .composition-op { font-size: 20px; margin-bottom: 20px; padding: 0 2px; }
          .composition-divider { height: 44px; margin: 0 3px 20px; }
        }
      `}</style>

      {title && (
        <div style={{ fontSize: 11, color: 'var(--c-forest-700)', fontWeight: 500, textAlign: 'center', marginBottom: 10 }}>
          {title}
        </div>
      )}

      <div className="composition-items">
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
            <Chip {...item} />
            {i < items.length - 1 && <div className="composition-op">+</div>}
          </div>
        ))}
        {total && (
          <>
            <div className="composition-divider" />
            <div className="composition-op">=</div>
            <Chip {...total} />
          </>
        )}
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
