/* 나만의 경제 사전 페이지 — Supabase 연결 버전 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookMarked, Calendar, Search, Loader2, Inbox } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import Card from '../components/common/Card';
import { useAuth } from '../context/AuthContext';
import { getVocabulary, deleteVocabulary } from '../services/vocabularyService';

export default function DictionaryPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [items,       setItems]       = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selected,    setSelected]    = useState(null);
  const [loadError,   setLoadError]   = useState('');
  const [isLoading,   setIsLoading]   = useState(true);

  // 컴포넌트가 처음 마운트될 때 저장된 단어 불러오기
  useEffect(() => {
    if (!user) return;
    loadVocabulary();
  }, [user]);

  const loadVocabulary = async () => {
    setIsLoading(true);
    const { data, error } = await getVocabulary(user.id);
    setIsLoading(false);

    if (error) {
      setLoadError('단어를 불러오는 데 실패했어요.');
      return;
    }
    setItems(data);
  };

  // 단어 삭제
  const handleDelete = async (id) => {
    const { error } = await deleteVocabulary(id);
    if (error) {
      alert('삭제에 실패했어요. 다시 시도해주세요.');
      return;
    }
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const filtered = items.filter(
    (item) =>
      item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.fullName || '').includes(searchQuery) ||
      (item.explanation || '').includes(searchQuery)
  );

  return (
    <PageWrapper>
      <div className="anim-fade">
        {/* 페이지 헤더 */}
        <div style={{ borderBottom: '1px solid var(--border-light)', background: '#fff', padding: '32px 0 28px' }}>
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
                  내 단어장
                </p>
                <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#0F172A', letterSpacing: '-1px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  나만의 경제 사전 <BookMarked size={24} color="#10B981" />
                </h1>
                <p style={{ fontSize: '15px', color: '#64748B' }}>
                  내가 저장한 경제 용어 모음
                </p>
              </div>
              <button
                onClick={() => navigate('/terms')}
                style={{
                  padding: '12px 24px', borderRadius: '12px',
                  background: 'linear-gradient(135deg, #10B981, #059669)',
                  color: '#fff', border: 'none', fontSize: '14px',
                  fontWeight: '700', cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
                }}
              >
                + 용어 추가하기
              </button>
            </div>
          </div>
        </div>

        <div style={{ padding: '40px 0' }}>
          <div className="container">
            {/* 통계 카드 행 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
              {[
                { Icon: BookMarked, value: isLoading ? '...' : items.length, label: '저장된 용어', color: '#EC4899', bg: '#FDF2F8' },
                { Icon: Calendar,   value: items[items.length - 1]?.savedAt ?? '-', label: '첫 저장일', color: '#6366F1', bg: '#EEF2FF' },
                { Icon: Search,     value: filtered.length, label: '검색 결과', color: '#F59E0B', bg: '#FFFBEB' },
              ].map((stat) => (
                <Card key={stat.label} style={{ background: stat.bg, border: 'none', padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <stat.Icon size={28} color={stat.color} />
                    <div>
                      <p style={{ fontSize: '18px', fontWeight: '900', color: stat.color, letterSpacing: '-0.6px', lineHeight: 1 }}>
                        {stat.value}
                      </p>
                      <p style={{ fontSize: '12px', color: '#64748B', marginTop: '3px' }}>{stat.label}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* 에러 표시 */}
            {loadError && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '12px', padding: '14px 20px', marginBottom: '20px', fontSize: '14px', color: '#DC2626' }}>
                ⚠️ {loadError}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 400px' : '1fr', gap: '24px' }}>
              {/* 용어 목록 */}
              <div>
                {/* 검색 */}
                <div
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    background: '#fff', borderRadius: '14px',
                    border: '2px solid #E2E8F0', padding: '4px 16px',
                    marginBottom: '20px', boxShadow: 'var(--shadow-xs)',
                  }}
                >
                  <Search size={16} color="#94A3B8" style={{ flexShrink: 0 }} />
                  <input
                    type="text" placeholder="저장된 용어 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      flex: 1, border: 'none', fontSize: '15px',
                      padding: '12px 0', background: 'transparent', color: '#0F172A',
                    }}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      style={{ color: '#94A3B8', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* 로딩 상태 */}
                {isLoading ? (
                  <Card style={{ textAlign: 'center', padding: '60px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                      <Loader2 size={40} color="#94A3B8" />
                    </div>
                    <p style={{ fontSize: '15px', color: '#94A3B8' }}>불러오는 중...</p>
                  </Card>
                ) : filtered.length === 0 ? (
                  <Card style={{ textAlign: 'center', padding: '60px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                      {items.length === 0 ? <Inbox size={48} color="#94A3B8" /> : <Search size={48} color="#94A3B8" />}
                    </div>
                    <p style={{ fontSize: '16px', color: '#374151', fontWeight: '700', marginBottom: '8px' }}>
                      {items.length === 0 ? '아직 저장된 용어가 없어요' : '검색 결과가 없어요'}
                    </p>
                    {items.length === 0 && (
                      <button
                        onClick={() => navigate('/terms')}
                        style={{
                          marginTop: '12px', padding: '10px 24px',
                          borderRadius: '10px', background: '#10B981',
                          color: '#fff', border: 'none', fontSize: '14px',
                          fontWeight: '700', cursor: 'pointer',
                        }}
                      >
                        용어사전에서 저장하기 →
                      </button>
                    )}
                  </Card>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                    {filtered.map((item) => (
                      <Card
                        key={item.id}
                        hoverable
                        onClick={() => setSelected(selected?.id === item.id ? null : item)}
                        style={{
                          border: selected?.id === item.id ? '2px solid #10B981' : '1.5px solid var(--border-light)',
                          background: selected?.id === item.id ? '#ECFDF5' : '#fff',
                          padding: '18px', cursor: 'pointer', position: 'relative',
                        }}
                      >
                        {/* 삭제 버튼 */}
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                          style={{
                            position: 'absolute', top: '10px', right: '10px',
                            width: '22px', height: '22px', borderRadius: '50%',
                            background: '#FEF2F2', color: '#DC2626',
                            border: 'none', fontSize: '10px', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: '700', lineHeight: 1,
                          }}
                          title="삭제"
                        >
                          ✕
                        </button>

                        <div style={{ fontSize: '28px', marginBottom: '12px' }}>{item.emoji || '📌'}</div>
                        <p style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px', marginBottom: '3px' }}>
                          {item.term}
                        </p>
                        <p style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '8px' }}>{item.fullName}</p>
                        <p style={{ fontSize: '12px', color: '#64748B', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {item.explanation}
                        </p>
                        <p style={{ fontSize: '11px', color: '#94A3B8', marginTop: '10px' }}>저장 {item.savedAt}</p>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* 상세 패널 */}
              {selected && (
                <div className="anim-scale" style={{ position: 'sticky', top: '84px' }}>
                  <Card style={{ padding: '28px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
                      <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                        <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: '#FDF2F8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px' }}>
                          {selected.emoji || '📌'}
                        </div>
                        <div>
                          <h3 style={{ fontSize: '22px', fontWeight: '900', color: '#0F172A', letterSpacing: '-0.8px' }}>
                            {selected.term}
                          </h3>
                          <p style={{ fontSize: '13px', color: '#64748B' }}>{selected.fullName}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelected(null)}
                        style={{ color: '#94A3B8', background: '#F1F5F9', border: 'none', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', fontSize: '14px' }}
                      >
                        ✕
                      </button>
                    </div>

                    <p style={{ fontSize: '15px', color: '#374151', lineHeight: '1.8', marginBottom: '20px', letterSpacing: '-0.3px' }}>
                      {selected.explanation}
                    </p>

                    <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: '#94A3B8' }}>저장일: {selected.savedAt}</span>
                      <button
                        onClick={() => handleDelete(selected.id)}
                        style={{
                          padding: '8px 16px', borderRadius: '9px',
                          background: '#FEF2F2', color: '#DC2626',
                          border: '1px solid #FECACA',
                          fontSize: '13px', fontWeight: '700', cursor: 'pointer',
                        }}
                      >
                        삭제
                      </button>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
