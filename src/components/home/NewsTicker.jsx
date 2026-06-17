import { useEffect, useState } from 'react'
import { fetchEconomyNews } from '../../services/newsService'

export function NewsTicker() {
  const [headlines, setHeadlines] = useState([])
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    fetchEconomyNews().then((items) => {
      setHeadlines(items)
      setLoading(false)
    })
  }, [])

  const tickerText = headlines.map((h) => h.title).join('   ·   ')

  return (
    <div style={{
      marginTop: 8,
      background: '#fff',
      borderRadius: 8,
      border: '0.5px solid #d4ede3',
      padding: '8px 12px',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      overflow: 'hidden',
      width: '100%',
      minWidth: 0,
      position: 'relative',
      contain: 'paint',
    }}>
      <span style={{
        fontSize: 10,
        padding: '2px 8px',
        borderRadius: 20,
        background: '#21C58E',
        color: '#fff',
        fontWeight: 500,
        flexShrink: 0,
      }}>
        LIVE
      </span>

      {/* position:relative + 고정 height → 애니메이션 요소를 레이아웃 흐름에서 완전히 분리 */}
      <div style={{ overflow: 'hidden', flex: 1, minWidth: 0, position: 'relative', height: '18px' }}>
        {loading ? (
          <span style={{ fontSize: 12, color: '#888780', position: 'absolute', top: 0, left: 0, lineHeight: '18px' }}>
            뉴스 불러오는 중...
          </span>
        ) : headlines.length === 0 ? (
          <span style={{ fontSize: 12, color: '#888780', position: 'absolute', top: 0, left: 0, lineHeight: '18px' }}>
            오늘의 경제 뉴스를 불러올 수 없어요
          </span>
        ) : (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            fontSize: 12,
            color: '#2C2C2A',
            whiteSpace: 'nowrap',
            lineHeight: '18px',
            animation: 'ticker 28s linear infinite',
            willChange: 'transform',
          }}>
            {tickerText}
          </div>
        )}
      </div>

      <style>{`
        @keyframes ticker {
          0%   { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  )
}
