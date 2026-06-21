/* AI 용어 설명 페이지 — Supabase 저장 연결 버전 */
import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { explainTerm } from '../services/aiService';
import { popularTerms, termExplanations } from '../data/termData';
import PageWrapper from '../components/layout/PageWrapper';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { saveVocabulary } from '../services/vocabularyService';

export default function TermsPage() {
  const navigate   = useNavigate();
  const { user }   = useAuth();

  const [query,     setQuery]     = useState('');
  const [result,    setResult]    = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [saved,     setSaved]     = useState(false);
  const [saveError, setSaveError] = useState('');

  const handleSearch = async (term) => {
    const searchTerm = (term || query).trim();
    if (!searchTerm) return;
    setLoading(true);
    setResult(null);
    setSaved(false);
    setSaveError('');
    setQuery(searchTerm);
    const res = await explainTerm(searchTerm);
    setResult(res.data);
    setLoading(false);
  };

  // 단어 저장 — 로그인 필요
  const handleSave = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!result) return;

    const { error } = await saveVocabulary(user.id, {
      term:        result.term,
      fullName:    result.fullName,
      explanation: result.explanation,
      emoji:       result.emoji,
    });

    if (error) {
      // 중복 저장이면 이미 저장됨 처리
      if (error.message?.includes('duplicate') || error.message?.includes('이미')) {
        setSaved(true);
      } else {
        setSaveError('저장에 실패했어요. 다시 시도해주세요.');
      }
      return;
    }
    setSaved(true);
  };

  const allTermData = Object.values(termExplanations);

  return (
    <PageWrapper>
      <div className="anim-fade">
        {/* 페이지 헤더 */}
        <div style={{ borderBottom: '1px solid var(--border-light)', background: '#fff', padding: '32px 0 28px' }}>
          <div className="container">
            <p style={{ fontSize: '12px', color: 'var(--c-muted)', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
              AI 용어 설명
            </p>
            <h1 style={{ fontSize: '28px', fontWeight: '900', color: 'var(--c-ink)', letterSpacing: '-1px', marginBottom: '6px' }}>
              경제 용어 사전 🔍
            </h1>
            <p style={{ fontSize: '15px', color: 'var(--c-slate)' }}>
              어려운 경제 용어를 AI가 초보자 눈높이로 설명해드려요
            </p>
          </div>
        </div>

        <div style={{ padding: '40px 0' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '32px', alignItems: 'start' }}>

              {/* ── 왼쪽: 검색 + 결과 ── */}
              <div>
                {/* 검색 바 */}
                <div
                  style={{
                    display: 'flex',
                    gap: '10px',
                    background: '#fff',
                    borderRadius: '16px',
                    padding: '6px 6px 6px 20px',
                    border: '2px solid var(--c-line)',
                    boxShadow: 'var(--shadow-sm)',
                    marginBottom: '24px',
                    transition: 'border-color 0.15s',
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'var(--c-green-500)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'var(--c-line)'}
                >
                  <span style={{ fontSize: '18px', display: 'flex', alignItems: 'center', color: 'var(--c-muted)' }}>🔍</span>
                  <input
                    type="text"
                    placeholder="경제 용어를 입력하세요  (예: ETF, 금리, 인플레이션)"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    style={{
                      flex: 1,
                      border: 'none',
                      fontSize: '15px',
                      color: 'var(--c-ink)',
                      background: 'transparent',
                      padding: '10px 0',
                      letterSpacing: '-0.3px',
                    }}
                  />
                  <button
                    onClick={() => handleSearch()}
                    style={{
                      background: 'var(--grad-action)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '10px 24px',
                      fontSize: '14px',
                      fontWeight: '700',
                      cursor: 'pointer',
                    }}
                  >
                    검색
                  </button>
                </div>

                {/* 인기 검색어 태그 */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '32px' }}>
                  {popularTerms.map((term) => (
                    <button
                      key={term}
                      onClick={() => handleSearch(term)}
                      style={{
                        background: 'var(--c-surface)',
                        border: '1.5px solid var(--c-line)',
                        borderRadius: '100px',
                        padding: '6px 16px',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: 'var(--c-slate)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--c-green-500)'; e.currentTarget.style.color = 'var(--c-green-500)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--c-line)'; e.currentTarget.style.color = 'var(--c-slate)'; }}
                    >
                      {term}
                    </button>
                  ))}
                </div>

                {/* 로딩 */}
                {loading && (
                  <div className="anim-fade" style={{ textAlign: 'center', padding: '80px 0' }}>
                    <div style={{ fontSize: '56px', marginBottom: '20px', animation: 'pulse 1.5s infinite' }}>🤖</div>
                    <p style={{ fontSize: '16px', color: 'var(--c-slate)', fontWeight: '500' }}>AI가 설명을 준비 중이에요...</p>
                  </div>
                )}

                {/* 결과 카드 */}
                {result && !loading && (
                  <div className="anim-slide">
                    <Card style={{ marginBottom: '16px', padding: '32px' }}>
                      {/* 용어 헤더 */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px', paddingBottom: '24px', borderBottom: '1px solid var(--border-light)' }}>
                        <div
                          style={{
                            width: '72px',
                            height: '72px',
                            borderRadius: '20px',
                            background: 'var(--c-green-50)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '36px',
                          }}
                        >
                          {result.emoji}
                        </div>
                        <div>
                          <h2 style={{ fontSize: '28px', fontWeight: '900', color: 'var(--c-ink)', letterSpacing: '-1px', marginBottom: '4px' }}>
                            {result.term}
                          </h2>
                          <p style={{ fontSize: '14px', color: 'var(--c-slate)' }}>{result.fullName}</p>
                        </div>
                        <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
                          <div style={{ display: 'flex', gap: '10px' }}>
                          <Button
                            variant={saved ? 'secondary' : 'primary'}
                            onClick={handleSave}
                            disabled={saved}
                            icon={saved ? '✅' : (user ? '📚' : '🔑')}
                            style={{ width: 'auto', padding: '10px 20px', fontSize: '13px' }}
                          >
                            {saved ? '저장됨' : (user ? '사전에 저장' : '로그인 후 저장')}
                          </Button>
                          <button
                            onClick={() => { setResult(null); setQuery(''); setSaved(false); setSaveError(''); }}
                            style={{
                              padding: '10px 16px',
                              borderRadius: '10px',
                              background: 'var(--c-line-soft)',
                              border: 'none',
                              fontSize: '13px',
                              color: 'var(--c-slate)',
                              cursor: 'pointer',
                              fontWeight: '600',
                            }}
                          >
                            다시 검색
                          </button>
                          </div>
                          {saveError && (
                            <p style={{ fontSize: '12px', color: '#DC2626' }}>⚠️ {saveError}</p>
                          )}
                        </div>
                      </div>

                      {/* 설명 */}
                      <p style={{ fontSize: '16px', color: 'var(--c-slate)', lineHeight: '1.8', marginBottom: '24px', letterSpacing: '-0.3px' }}>
                        {result.explanation}
                      </p>

                      {/* 예시 + 핵심 포인트 */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                        <div style={{ background: 'var(--c-yellow-100)', borderRadius: '14px', padding: '18px', borderLeft: '3px solid var(--c-yellow-500)' }}>
                          <p style={{ fontSize: '12px', fontWeight: '700', color: '#D97706', marginBottom: '8px', letterSpacing: '0.3px' }}>
                            💡 예시
                          </p>
                          <p style={{ fontSize: '14px', color: 'var(--c-slate)', lineHeight: '1.6' }}>{result.example}</p>
                        </div>
                        <div style={{ background: 'var(--c-green-50)', borderRadius: '14px', padding: '18px', borderLeft: '3px solid var(--c-green-500)' }}>
                          <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--c-green-500)', marginBottom: '8px', letterSpacing: '0.3px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <CheckCircle size={13} color="var(--c-green-500)" /> 핵심 포인트
                          </p>
                          <p style={{ fontSize: '14px', color: 'var(--c-slate)', lineHeight: '1.6' }}>{result.point}</p>
                        </div>
                      </div>

                      {/* 관련 용어 */}
                      {result.relatedTerms?.length > 0 && (
                        <div>
                          <p style={{ fontSize: '12px', color: 'var(--c-muted)', fontWeight: '700', marginBottom: '10px', letterSpacing: '0.5px' }}>
                            관련 용어
                          </p>
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {result.relatedTerms.map((term) => (
                              <button
                                key={term}
                                onClick={() => handleSearch(term)}
                                style={{
                                  background: 'var(--c-line-soft)',
                                  border: '1px solid var(--c-line)',
                                  borderRadius: '8px',
                                  padding: '6px 14px',
                                  fontSize: '13px',
                                  color: 'var(--c-slate)',
                                  cursor: 'pointer',
                                  fontWeight: '500',
                                  transition: 'all 0.15s',
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--c-green-50)'; e.currentTarget.style.color = 'var(--c-green-500)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--c-line-soft)'; e.currentTarget.style.color = 'var(--c-slate)'; }}
                              >
                                {term}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </Card>
                  </div>
                )}

                {/* 초기 안내 */}
                {!result && !loading && (
                  <Card style={{ background: 'linear-gradient(135deg, #EEF2FF, #F5F3FF)', border: '1.5px solid #C7D2FE', padding: '32px' }}>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                      <span style={{ fontSize: '48px' }}>🤖</span>
                      <div>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--c-ink)', marginBottom: '8px' }}>
                          AI가 쉽게 설명해드려요
                        </h3>
                        <p style={{ fontSize: '14px', color: 'var(--c-slate)', lineHeight: '1.6' }}>
                          어떤 경제 용어든 초보자 눈높이로 설명, 예시, 핵심 포인트까지 알려드려요.
                          <br />위 태그를 클릭하거나 직접 입력해보세요!
                        </p>
                      </div>
                    </div>
                  </Card>
                )}
              </div>

              {/* ── 오른쪽: 전체 용어 목록 ── */}
              <div>
                <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--c-muted)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>
                  전체 용어 목록
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {allTermData.map((item) => (
                    <button
                      key={item.term}
                      onClick={() => handleSearch(item.term)}
                      className="card-hover"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        background: '#fff',
                        border: '1.5px solid var(--border-light)',
                        borderRadius: '12px',
                        padding: '12px 14px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        boxShadow: 'var(--shadow-xs)',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--c-green-100)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-light)'; }}
                    >
                      <span style={{ fontSize: '22px' }}>{item.emoji}</span>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--c-ink)', letterSpacing: '-0.4px' }}>
                          {item.term}
                        </p>
                        <p style={{ fontSize: '11px', color: 'var(--c-muted)' }}>{item.fullName}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.7;transform:scale(1.05)} }`}</style>
    </PageWrapper>
  );
}
