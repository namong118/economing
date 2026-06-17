import { useEffect, useState } from 'react'
import { getConversationList, deleteConversation } from '../../services/conversationService'
import { Plus, MessageCircle, X } from 'lucide-react'

export function CoachSidebar({ user, onNewChat, onSelectConversation, activeId, refreshKey }) {
  const [groups,   setGroups]   = useState({})
  const [loading,  setLoading]  = useState(true)
  const [hoveredId, setHoveredId] = useState(null)

  useEffect(() => {
    if (!user?.id) { setLoading(false); return }
    setLoading(true)
    getConversationList(user.id)
      .then(setGroups)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [user?.id, refreshKey])

  const handleDelete = async (id) => {
    try {
      await deleteConversation(id)
      if (activeId === id) onNewChat()
      getConversationList(user.id).then(setGroups)
    } catch (err) {
      console.error('삭제 실패:', err)
    }
  }

  return (
    <div style={{
      width: 240,
      flexShrink: 0,
      background: '#fff',
      borderRight: '0.5px solid #B8EBC8',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
    }}>
      {/* 새 대화 버튼 */}
      <div style={{ padding: '16px 12px 12px' }}>
        <button
          onClick={onNewChat}
          style={{
            width: '100%',
            background: '#52C97A',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '9px 12px',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            fontFamily: 'inherit',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#1AAD7D' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#52C97A' }}
        >
          <Plus size={16} />
          새 대화
        </button>
      </div>

      {/* 구분선 */}
      <div style={{ height: '0.5px', background: '#B8EBC8', margin: '0 12px' }} />

      {/* 대화 목록 */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 8px 16px' }}>
        {loading ? (
          <div style={{ fontSize: 12, color: '#888780', textAlign: 'center', padding: 16 }}>
            불러오는 중...
          </div>
        ) : !user?.id ? (
          <div style={{ fontSize: 12, color: '#B0B8B3', textAlign: 'center', padding: 16, lineHeight: 1.6 }}>
            로그인하면<br />대화 기록이 저장돼요
          </div>
        ) : Object.keys(groups).length === 0 ? (
          <div style={{ fontSize: 12, color: '#888780', textAlign: 'center', padding: 16 }}>
            대화 기록이 없어요
          </div>
        ) : (
          Object.entries(groups).map(([label, convs]) => (
            <div key={label} style={{ marginBottom: 12 }}>
              <div style={{
                fontSize: 10,
                color: '#B0B8B3',
                fontWeight: 600,
                padding: '6px 8px 4px',
                letterSpacing: '0.3px',
              }}>
                {label}
              </div>

              {convs.map(conv => (
                <div
                  key={conv.id}
                  style={{ position: 'relative', marginBottom: 2 }}
                  onMouseEnter={() => setHoveredId(conv.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <button
                    onClick={() => onSelectConversation(conv, convs)}
                    style={{
                      width: '100%',
                      background: activeId === conv.id ? '#E3F9EC' : hoveredId === conv.id ? '#F2FBF5' : 'transparent',
                      border: 'none',
                      borderRadius: 8,
                      padding: '7px 28px 7px 10px',
                      fontSize: 12,
                      color: activeId === conv.id ? '#2A7A4B' : '#5F5E5A',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 7,
                      fontFamily: 'inherit',
                      transition: 'background 0.12s',
                    }}
                  >
                    <MessageCircle size={13} color={activeId === conv.id ? '#52C97A' : '#B8EBC8'} style={{ flexShrink: 0 }} />
                    <span style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      flex: 1,
                    }}>
                      {conv.question}
                    </span>
                  </button>

                  {hoveredId === conv.id && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(conv.id); }}
                      style={{
                        position: 'absolute', right: 6, top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'transparent', border: 'none',
                        padding: 2, cursor: 'pointer',
                        display: 'flex', alignItems: 'center',
                        color: '#888780',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#712B13' }}
                      onMouseLeave={e => { e.currentTarget.style.color = '#888780' }}
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
