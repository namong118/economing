/* 경제 일기 페이지 — Supabase 연결 버전 */
import { useState, useEffect } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { getDiaries, saveDiary, deleteDiary } from '../services/diaryService';

const MOODS = [
  { emoji: '😊', label: '좋았어요' },
  { emoji: '🤔', label: '헷갈려요' },
  { emoji: '😮', label: '놀라워요' },
  { emoji: '😴', label: '어려워요' },
];

export default function DiaryPage() {
  const { user } = useAuth();

  const [diaries,       setDiaries]       = useState([]);
  const [isWriting,     setIsWriting]     = useState(false);
  const [selectedDiary, setSelectedDiary] = useState(null);
  const [newTitle,      setNewTitle]      = useState('');
  const [newContent,    setNewContent]    = useState('');
  const [newMood,       setNewMood]       = useState('😊');
  const [isLoading,     setIsLoading]     = useState(true);
  const [isSaving,      setIsSaving]      = useState(false);
  const [saveError,     setSaveError]     = useState('');

  // 컴포넌트 마운트 시 일기 목록 불러오기
  useEffect(() => {
    if (!user) return;
    loadDiaries();
  }, [user]);

  const loadDiaries = async () => {
    setIsLoading(true);
    const { data } = await getDiaries(user.id);
    setDiaries(data);
    setIsLoading(false);
  };

  // 일기 저장
  const handleSubmit = async () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    setIsSaving(true);
    setSaveError('');

    const { data, error } = await saveDiary(user.id, {
      title:        newTitle.trim(),
      content:      newContent.trim(),
      mood:         newMood,
      learnedTerms: [],
    });

    setIsSaving(false);

    if (error) {
      setSaveError('저장에 실패했어요. 다시 시도해주세요.');
      return;
    }

    // 로컬 상태 맨 앞에 추가 (새로고침 없이 즉시 반영)
    setDiaries((prev) => [data, ...prev]);
    setNewTitle(''); setNewContent(''); setNewMood('😊');
    setIsWriting(false);
  };

  // 일기 삭제
  const handleDelete = async (id) => {
    if (!window.confirm('이 일기를 삭제할까요?')) return;
    const { error } = await deleteDiary(id);
    if (error) { alert('삭제에 실패했어요.'); return; }
    setDiaries((prev) => prev.filter((d) => d.id !== id));
    if (selectedDiary?.id === id) setSelectedDiary(null);
  };

  // 학습한 용어 수 합산
  const totalTerms = diaries.reduce((sum, d) => sum + (d.learnedTerms?.length || 0), 0);

  return (
    <PageWrapper>
      <div className="anim-fade">
        {/* 페이지 헤더 */}
        <div style={{ borderBottom: '1px solid var(--border-light)', background: '#fff', padding: '32px 0 28px' }}>
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
                  경제 일기
                </p>
                <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#0F172A', letterSpacing: '-1px', marginBottom: '6px' }}>
                  나의 경제 학습 일기 ✏️
                </h1>
                <p style={{ fontSize: '15px', color: '#64748B' }}>
                  오늘 배운 내용을 기록하면 AI가 다음 학습을 추천해드려요
                </p>
              </div>
              <button
                onClick={() => { setIsWriting(true); setSelectedDiary(null); }}
                style={{
                  padding: '12px 24px', borderRadius: '12px',
                  background: 'linear-gradient(135deg, #10B981, #059669)',
                  color: '#fff', border: 'none', fontSize: '14px',
                  fontWeight: '700', cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
                }}
              >
                ✏️ 오늘 일기 쓰기
              </button>
            </div>
          </div>
        </div>

        <div style={{ padding: '40px 0' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: isWriting || selectedDiary ? '1fr 480px' : '1fr', gap: '32px', alignItems: 'start' }}>

              {/* ── 왼쪽: 통계 + 일기 목록 ── */}
              <div>
                {/* 통계 행 */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '28px' }}>
                  {[
                    { emoji: '📝', value: isLoading ? '...' : diaries.length, label: '작성한 일기', color: '#6366F1', bg: '#EEF2FF' },
                    { emoji: '🔥', value: '-', label: '연속 작성', color: '#F59E0B', bg: '#FFFBEB' },
                    { emoji: '📚', value: totalTerms, label: '학습한 용어', color: '#10B981', bg: '#ECFDF5' },
                  ].map((s) => (
                    <Card key={s.label} style={{ background: s.bg, border: 'none', padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '24px' }}>{s.emoji}</span>
                        <div>
                          <p style={{ fontSize: '20px', fontWeight: '900', color: s.color, letterSpacing: '-0.6px', lineHeight: 1 }}>{s.value}</p>
                          <p style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>{s.label}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* 로딩 */}
                {isLoading ? (
                  <Card style={{ textAlign: 'center', padding: '60px' }}>
                    <div style={{ fontSize: '40px', marginBottom: '16px' }}>⏳</div>
                    <p style={{ color: '#94A3B8' }}>불러오는 중...</p>
                  </Card>
                ) : diaries.length === 0 ? (
                  <Card style={{ textAlign: 'center', padding: '80px 40px' }}>
                    <div style={{ fontSize: '64px', marginBottom: '20px' }}>📓</div>
                    <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0F172A', marginBottom: '8px' }}>
                      첫 경제 일기를 써보세요!
                    </h3>
                    <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '24px' }}>
                      오늘 배운 내용을 기록하면 AI가 다음 학습 주제를 추천해드려요
                    </p>
                    <Button onClick={() => setIsWriting(true)}>✏️ 첫 일기 쓰기</Button>
                  </Card>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {diaries.map((diary) => (
                      <Card
                        key={diary.id}
                        hoverable
                        onClick={() => { setSelectedDiary(diary); setIsWriting(false); }}
                        style={{
                          border: selectedDiary?.id === diary.id ? '2px solid #10B981' : '1.5px solid var(--border-light)',
                          background: selectedDiary?.id === diary.id ? '#ECFDF5' : '#fff',
                          cursor: 'pointer', position: 'relative',
                        }}
                      >
                        {/* 삭제 버튼 */}
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(diary.id); }}
                          style={{
                            position: 'absolute', top: '14px', right: '14px',
                            padding: '4px 10px', borderRadius: '8px',
                            background: '#FEF2F2', color: '#DC2626',
                            border: '1px solid #FECACA', fontSize: '11px',
                            fontWeight: '600', cursor: 'pointer',
                          }}
                        >
                          삭제
                        </button>

                        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                          <span style={{ fontSize: '32px', lineHeight: 1, marginTop: '2px' }}>{diary.mood}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0F172A', letterSpacing: '-0.5px' }}>
                                {diary.title}
                              </h3>
                              <span style={{ fontSize: '12px', color: '#94A3B8', flexShrink: 0, marginLeft: '48px' }}>
                                {diary.date}
                              </span>
                            </div>
                            <p style={{
                              fontSize: '14px', color: '#64748B', lineHeight: '1.6',
                              overflow: 'hidden', display: '-webkit-box',
                              WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                              marginBottom: '10px',
                            }}>
                              {diary.content}
                            </p>
                            {diary.learnedTerms?.length > 0 && (
                              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                {diary.learnedTerms.map((term) => (
                                  <span key={term} style={{ background: '#ECFDF5', color: '#059669', fontSize: '11px', fontWeight: '600', padding: '2px 8px', borderRadius: '100px' }}>
                                    #{term}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* ── 오른쪽: 글쓰기 패널 ── */}
              {isWriting && (
                <div className="anim-scale" style={{ position: 'sticky', top: '84px' }}>
                  <Card style={{ padding: '28px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                      <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.6px' }}>
                        오늘의 경제 일기
                      </h2>
                      <button onClick={() => setIsWriting(false)} style={{ color: '#94A3B8', background: '#F1F5F9', border: 'none', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', fontSize: '14px' }}>
                        ✕
                      </button>
                    </div>

                    {/* 기분 선택 */}
                    <p style={{ fontSize: '12px', fontWeight: '700', color: '#94A3B8', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '10px' }}>
                      오늘 공부는 어땠나요?
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '20px' }}>
                      {MOODS.map((m) => (
                        <button
                          key={m.emoji}
                          onClick={() => setNewMood(m.emoji)}
                          style={{
                            padding: '10px 6px', borderRadius: '12px',
                            border: newMood === m.emoji ? '2px solid #10B981' : '2px solid #E2E8F0',
                            background: newMood === m.emoji ? '#ECFDF5' : '#F8FAFC',
                            cursor: 'pointer', textAlign: 'center',
                          }}
                        >
                          <div style={{ fontSize: '22px', marginBottom: '3px' }}>{m.emoji}</div>
                          <div style={{ fontSize: '10px', fontWeight: '600', color: newMood === m.emoji ? '#059669' : '#94A3B8' }}>
                            {m.label}
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* 제목 */}
                    <input
                      type="text" placeholder="오늘 배운 것의 제목"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      style={{
                        width: '100%', border: 'none',
                        borderBottom: '2px solid #E2E8F0', padding: '10px 0',
                        fontSize: '18px', fontWeight: '700', color: '#0F172A',
                        letterSpacing: '-0.6px', background: 'transparent',
                        marginBottom: '16px', boxSizing: 'border-box',
                      }}
                    />

                    {/* 내용 */}
                    <textarea
                      placeholder="오늘 배운 경제 내용을 자유롭게 적어보세요..."
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      rows={8}
                      style={{
                        width: '100%', border: '2px solid #E2E8F0',
                        borderRadius: '12px', padding: '14px',
                        fontSize: '14px', color: '#374151', lineHeight: '1.8',
                        background: '#F8FAFC', resize: 'none',
                        marginBottom: '16px', boxSizing: 'border-box',
                      }}
                    />

                    {/* 에러 */}
                    {saveError && (
                      <p style={{ fontSize: '13px', color: '#DC2626', marginBottom: '12px' }}>⚠️ {saveError}</p>
                    )}

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <Button variant="secondary" onClick={() => setIsWriting(false)} style={{ flex: 1 }}>취소</Button>
                      <Button
                        disabled={!newTitle.trim() || !newContent.trim() || isSaving}
                        onClick={handleSubmit}
                        style={{ flex: 2 }}
                      >
                        {isSaving ? '저장 중...' : '📝 저장하기'}
                      </Button>
                    </div>
                  </Card>
                </div>
              )}

              {/* 일기 상세 */}
              {selectedDiary && !isWriting && (
                <div className="anim-scale" style={{ position: 'sticky', top: '84px' }}>
                  <Card style={{ padding: '28px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <span style={{ fontSize: '36px' }}>{selectedDiary.mood}</span>
                        <div>
                          <p style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '3px' }}>{selectedDiary.date}</p>
                          <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.6px' }}>
                            {selectedDiary.title}
                          </h3>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleDelete(selectedDiary.id)}
                          style={{ padding: '6px 12px', borderRadius: '8px', background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                        >
                          삭제
                        </button>
                        <button
                          onClick={() => setSelectedDiary(null)}
                          style={{ color: '#94A3B8', background: '#F1F5F9', border: 'none', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', fontSize: '14px' }}
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    <p style={{ fontSize: '15px', color: '#374151', lineHeight: '1.8', marginBottom: '20px', letterSpacing: '-0.3px' }}>
                      {selectedDiary.content}
                    </p>

                    {selectedDiary.learnedTerms?.length > 0 && (
                      <div style={{ marginBottom: '20px' }}>
                        <p style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', marginBottom: '8px', letterSpacing: '0.5px' }}>
                          오늘 배운 용어
                        </p>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {selectedDiary.learnedTerms.map((term) => (
                            <span key={term} style={{ background: '#ECFDF5', color: '#059669', fontSize: '13px', fontWeight: '600', padding: '4px 12px', borderRadius: '100px' }}>
                              #{term}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <Card style={{ background: 'linear-gradient(135deg, #EEF2FF, #F5F3FF)', border: '1px solid #C7D2FE' }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '28px' }}>🤖</span>
                        <div>
                          <p style={{ fontSize: '12px', fontWeight: '700', color: '#6366F1', marginBottom: '5px' }}>AI 다음 학습 추천</p>
                          <p style={{ fontSize: '13px', color: '#374151', lineHeight: '1.6' }}>
                            {selectedDiary.aiSuggestion || 'OpenAI 연결 후 AI가 다음 학습 주제를 추천해드릴게요!'}
                          </p>
                        </div>
                      </div>
                    </Card>
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
