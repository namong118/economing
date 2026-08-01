import { useState, useEffect } from 'react'

export default function SectionNav({ sections }) {
  const [hoveredId, setHoveredId] = useState(null)
  const [activeId, setActiveId] = useState(sections[0]?.id)

  useEffect(() => {
    const container = document.querySelector('.ps-content')
    const backBar = document.querySelector('.ps-back-bar')
    if (!container) return
    const topOffset = backBar ? backBar.getBoundingClientRect().height : 0

    const observer = new IntersectionObserver(
      (entries) => {
        // 화면(back-bar 아래 영역) 안에 가장 위쪽에 걸쳐있는 섹션을 active로
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActiveId(visible[0].target.id)
      },
      {
        root: container,
        rootMargin: `-${topOffset + 4}px 0px -60% 0px`,
        threshold: 0,
      }
    )

    sections.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [sections])

  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    const container = document.querySelector('.ps-content')
    if (!el || !container) return
    const backBar = document.querySelector('.ps-back-bar')
    const offset = backBar ? backBar.getBoundingClientRect().height + 12 : 12
    const elTop = el.getBoundingClientRect().top
    const containerTop = container.getBoundingClientRect().top
    const scrollTarget = container.scrollTop + (elTop - containerTop) - offset
    container.scrollTo({ top: scrollTarget, behavior: 'smooth' })
  }

  return (
    <div className="section-nav">
      {sections.map(({ id, label }) => {
        const isActive = activeId === id
        return (
          <button
            key={id}
            className={`section-nav-dot ${isActive ? 'section-nav-dot-active' : ''}`}
            onClick={() => scrollToSection(id)}
            onMouseEnter={() => setHoveredId(id)}
            onMouseLeave={() => setHoveredId(null)}
            aria-label={label}
          >
            <span className="section-nav-dot-circle" />
            {(hoveredId === id || isActive) && (
              <span className="section-nav-tooltip">{label}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
