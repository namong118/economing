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

      <div style={{ overflow: 'hidden', flex: 1, minWidth: 0 }}>
        {loading ? (
          <span style={{ fontSize: 12, color: '#888780' }}>뉴스 불러오는 중...</span>
        ) : headlines.length === 0 ? (
          <span style={{ fontSize: 12, color: '#888780' }}>오늘의 경제 뉴스를 불러올 수 없어요</span>
        ) : (
          <div style={{
            fontSize: 12,
            color: '#2C2C2A',
            whiteSpace: 'nowrap',
            animation: 'ticker 25s linear infinite',
            willChange: 'transform',
          }}>
            {tickerText}
          </div>
        )}
      </div>

      <style>{`
        @keyframes ticker {
          0%   { transform: translateX(100vw); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  )
}
