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
      <div className="comparison-icon" style={{ background: c.bg, border: c.border }}>
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

// 하나의 원인에서 상반된 두 결과로 갈리는 개념용. 원인 노드는 두지 않는다 —
// 카드 제목/소제목이 이미 원인을 말하므로 중복이 된다. 흐름형과 같은 1단
// 구조로, 두 결과를 가운데 구분선을 두고 나란히 놓아 색 대비로 분기를 표현한다.
// [분기1] │ [분기2]  — 화살표/연결선 없이 한 줄.
export function ComparisonInfographic({ title, branches, result }) {
  return (
    <div style={{ width: '100%', overflow: 'hidden' }}>
      <style>{`
        .comparison-icon { width: 64px; height: 64px; border-radius: 14px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
        .comparison-items { display: flex; align-items: flex-start; justify-content: center; flex-wrap: nowrap; width: 100%; gap: 28px; }
        .comparison-divider { width: 1px; height: 64px; background: var(--c-line); margin-top: 0; flex-shrink: 0; }
        @media (max-width: 768px) {
          .comparison-icon { width: 44px !important; height: 44px !important; border-radius: 10px !important; }
          .comparison-items { gap: 16px; }
          .comparison-divider { height: 44px; }
        }
      `}</style>

      {title && (
        <div style={{ fontSize: 11, color: 'var(--c-forest-700)', fontWeight: 500, textAlign: 'center', marginBottom: 10 }}>
          {title}
        </div>
      )}

      <div className="comparison-items">
        <Chip {...branches[0]} />
        <div className="comparison-divider" />
        <Chip {...branches[1]} />
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
