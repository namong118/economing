import { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import { useAuth } from '../context/AuthContext';
import { getJournals, createJournal, updateJournal, deleteJournal } from '../services/diaryService';

/* ── 섹션 정의 ──────────────────────────────────────────────── */
const SECTIONS = [
  { key: 'learned_today',    icon: '📚', title: '오늘 배운 것',         desc: '오늘 새롭게 알게 된 경제 개념이나 내용을 적어보세요.',             placeholder: 'ETF는 여러 종목을 담은 투자 바구니와 비슷하다.', type: 'textarea', color: '#3B82F6' },
  { key: 'news_title',       icon: '📰', title: '오늘의 금융 뉴스',      desc: '오늘 가장 인상 깊게 본 경제 또는 금융 뉴스를 기록해보세요.',       placeholder: '한국은행 기준금리 동결',                           type: 'input',    color: '#8B5CF6' },
  { key: 'news_thought',     icon: '💡', title: '뉴스를 보고 든 생각',   desc: '뉴스를 보고 어떤 생각이 들었나요?',                               placeholder: '금리가 유지되면 예금 금리도 크게 변하지 않을 것 같다.', type: 'textarea', color: '#F59E0B' },
  { key: 'questions',        icon: '🤔', title: '아직 궁금한 것',        desc: '아직 잘 이해되지 않는 부분이나 더 공부하고 싶은 내용을 적어보세요.', placeholder: '기준금리가 왜 물가에 영향을 줄까?',                   type: 'textarea', color: '#EF4444' },
  { key: 'consumption_note', icon: '💸', title: '오늘의 소비 돌아보기',  desc: '오늘 가장 기억에 남는 소비를 적어보세요.',                         placeholder: '배달음식 20,000원',                               type: 'textarea', color: '#06B6D4' },
  { key: 'next_topic',       icon: '🎯', title: '다음에 공부할 것',      desc: '다음에 더 알아보고 싶은 경제 주제를 적어보세요.',                  placeholder: '비상금, ETF, 인플레이션',                          type: 'textarea', color: '#21C58E' },
];

const EMPTY_FORM = {
  learned_today: '', news_title: '', news_thought: '',
  questions: '', consumption_note: '', next_topic: '',
  journal_date: '',
};

const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토'];

/* ── 날짜 헬퍼 ──────────────────────────────────────────────── */
function getTodayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getJournalDateStr(journal) {
  return journal.journal_date || journal.created_at?.split('T')[0] || getTodayStr();
}

function parseDate(dateStr) {
  const parts = (dateStr || getTodayStr()).split('T')[0].split('-');
  return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
}

function formatDateStr(dateStr) {
  const d = parseDate(dateStr);
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, '0'), day = String(d.getDate()).padStart(2, '0');
  return { date: `${y}.${m}.${day}`, dayName: days[d.getDay()] + '요일', dayOfWeek: d.getDay() };
}

function getCalendarCells(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevDays = new Date(year, month, 0).getDate();
  const cells = [];
  for (let i = firstDay - 1; i >= 0; i--) cells.push({ day: prevDays - i, current: false });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, current: true });
  const tail = cells.length % 7;
  if (tail > 0) for (let d = 1; d <= 7 - tail; d++) cells.push({ day: d, current: false });
  return cells;
}

function truncate(text, len = 36) {
  if (!text) return '';
  return text.length > len ? text.slice(0, len) + '...' : text;
}

function getPreviewItems(journal) {
  return SECTIONS.filter(s => journal[s.key]?.trim()).slice(0, 3).map(s => ({ icon: s.icon, text: truncate(journal[s.key]) }));
}

/* ── 섹션 카드 (폼/상세 공용) ───────────────────────────────── */
function SectionCard({ section, value, onChange, readOnly }) {
  const [focused, setFocused] = useState(false);
  if (readOnly && !value?.trim()) return null;

  return (
    <div style={{
      background: '#fff',
      border: `1.5px solid ${focused ? section.color + '55' : section.color + '22'}`,
      borderRadius: '16px', padding: '16px', transition: 'border-color 0.15s',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
          background: section.color + '15', border: `1.5px solid ${section.color}33`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px',
        }}>
          {section.icon}
        </div>
        <div>
          <p style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.3px' }}>
            {section.title}
          </p>
          {!readOnly && (
            <p style={{ fontSize: '11px', color: '#94A3B8', marginTop: '1px', fontWeight: '500' }}>{section.desc}</p>
          )}
        </div>
      </div>
      {readOnly ? (
        <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.75', whiteSpace: 'pre-wrap', paddingLeft: '46px' }}>
          {value}
        </p>
      ) : section.type === 'input' ? (
        <input
          value={value || ''} onChange={e => onChange(section.key, e.target.value)}
          placeholder={section.placeholder} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            width: '100%', padding: '10px 14px', borderRadius: '10px', boxSizing: 'border-box',
            border: `1.5px solid ${focused ? section.color + '66' : '#E2E8F0'}`,
            fontSize: '14px', color: '#0F172A', background: '#F8FAFC',
            outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.15s',
          }}
        />
      ) : (
        <textarea
          value={value || ''} onChange={e => onChange(section.key, e.target.value)}
          placeholder={section.placeholder} rows={3}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            width: '100%', padding: '10px 14px', borderRadius: '10px', boxSizing: 'border-box',
            border: `1.5px solid ${focused ? section.color + '66' : '#E2E8F0'}`,
            fontSize: '14px', color: '#0F172A', background: '#F8FAFC',
            outline: 'none', resize: 'vertical', lineHeight: '1.65',
            fontFamily: 'inherit', transition: 'border-color 0.15s',
          }}
        />
      )}
    </div>
  );
}

/* ── 목록 카드 ──────────────────────────────────────────────── */
function JournalCard({ journal, onClick }) {
  const dateStr = getJournalDateStr(journal);
  const { date, dayName } = formatDateStr(dateStr);
  const previews = getPreviewItems(journal);
  const [hov, setHov] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: 'block', width: '100%', textAlign: 'left',
        background: hov ? '#FAFFFE' : '#fff',
        border: `1.5px solid ${hov ? '#A7F3D0' : '#E8F5EF'}`,
        borderRadius: '14px', padding: '16px 18px',
        cursor: 'pointer', transition: 'all 0.15s',
        boxShadow: hov ? '0 4px 14px rgba(33,197,142,0.1)' : '0 1px 3px rgba(0,0,0,0.04)',
        transform: hov ? 'translateY(-1px)' : 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '7px' }}>
          <span style={{ fontSize: '14px', fontWeight: '900', color: '#0F172A', letterSpacing: '-0.4px' }}>{date}</span>
          <span style={{ fontSize: '11px', fontWeight: '600', color: '#94A3B8' }}>{dayName}</span>
        </div>
        <span style={{ fontSize: '12px', color: '#21C58E', fontWeight: '700', opacity: hov ? 1 : 0.5 }}>보기 →</span>
      </div>
      {previews.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {previews.map((p, i) => (
            <div key={i} style={{ display: 'flex', gap: '7px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '12px', flexShrink: 0, lineHeight: 1.7 }}>{p.icon}</span>
              <p style={{ fontSize: '12px', color: '#475569', lineHeight: '1.7', fontWeight: '500' }}>{p.text}</p>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ fontSize: '12px', color: '#CBD5E1', fontStyle: 'italic' }}>작성된 내용이 없어요.</p>
      )}
    </button>
  );
}

/* ── 월간 캘린더 ────────────────────────────────────────────── */
function MonthCalendar({ year, month, journalMap, onDateClick }) {
  const todayStr = getTodayStr();
  const cells = getCalendarCells(year, month);

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '4px' }}>
        {WEEK_DAYS.map((d, i) => (
          <div key={d} style={{
            textAlign: 'center', fontSize: '11px', fontWeight: '700', padding: '4px 0',
            color: i === 0 ? '#F87171' : i === 6 ? '#60A5FA' : '#94A3B8',
          }}>
            {d}
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
        {cells.map((cell, idx) => {
          if (!cell.current) return <div key={idx} style={{ height: '44px' }} />;

          const mm = String(month + 1).padStart(2, '0');
          const dd = String(cell.day).padStart(2, '0');
          const dateStr = `${year}-${mm}-${dd}`;
          const isToday  = dateStr === todayStr;
          const hasEntry = !!journalMap[dateStr];
          const dow = idx % 7;

          return (
            <button
              key={idx}
              onClick={() => onDateClick(dateStr, journalMap[dateStr] || null)}
              style={{
                height: '44px', borderRadius: '10px', border: 'none',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: '2px',
                cursor: 'pointer', transition: 'background 0.1s',
                background: isToday ? '#21C58E' : 'transparent',
              }}
              onMouseEnter={e => { if (!isToday) e.currentTarget.style.background = '#F0FDF9'; }}
              onMouseLeave={e => { if (!isToday) e.currentTarget.style.background = 'transparent'; }}
            >
              <span style={{
                fontSize: '13px', lineHeight: 1,
                fontWeight: isToday ? '900' : hasEntry ? '700' : '400',
                color: isToday ? '#fff'
                  : dow === 0 ? '#F87171'
                  : dow === 6 ? '#60A5FA'
                  : '#0F172A',
              }}>
                {cell.day}
              </span>
              {hasEntry && (
                <span style={{
                  width: '5px', height: '5px', borderRadius: '50%', display: 'block',
                  background: isToday ? 'rgba(255,255,255,0.85)' : '#21C58E',
                }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── 목록 뷰 ────────────────────────────────────────────────── */
function ListView({ journals, calYear, calMonth, onPrevMonth, onNextMonth, onDateClick, onCreateToday, onSelect, loading }) {
  const journalMap = {};
  journals.forEach(j => {
    const key = getJournalDateStr(j);
    if (key && !journalMap[key]) journalMap[key] = j;
  });

  const monthStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}`;
  const monthJournals = journals.filter(j => getJournalDateStr(j).startsWith(monthStr));
  const today = new Date();
  const isCurrentMonth = calYear === today.getFullYear() && calMonth === today.getMonth();
  const streakCount = monthJournals.length;

  return (
    <div className="anim-fade">
      {/* 노밍 인사 */}
      <div style={{
        background: 'linear-gradient(145deg, #FFFBEA, #FFF4CC)',
        border: '1px solid #FFE08A', borderRadius: '14px',
        padding: '12px 16px', marginBottom: '14px',
        display: 'flex', alignItems: 'center', gap: '10px',
      }}>
        <span style={{ fontSize: '20px', flexShrink: 0 }}>☀️</span>
        <p style={{ fontSize: '14px', fontWeight: '700', color: '#78350F', letterSpacing: '-0.3px' }}>
          오늘의 경제를 기록해볼까요? ✍️
        </p>
      </div>

      {/* 캘린더 카드 */}
      <div style={{
        background: '#fff', border: '1.5px solid #E8F5EF',
        borderRadius: '20px', padding: '20px', marginBottom: '14px',
      }}>
        {/* 월 네비게이션 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <button
            onClick={onPrevMonth}
            style={{
              width: '34px', height: '34px', borderRadius: '10px',
              background: '#F8FAFC', border: '1.5px solid #E2E8F0',
              cursor: 'pointer', fontSize: '14px', color: '#64748B',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            ‹
          </button>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '16px', fontWeight: '900', color: '#0F172A', letterSpacing: '-0.5px' }}>
              {calYear}년 {calMonth + 1}월
            </p>
            {streakCount > 0 && (
              <p style={{ fontSize: '11px', color: '#21C58E', fontWeight: '700', marginTop: '1px' }}>
                이 달 {streakCount}개 작성 🌱
              </p>
            )}
          </div>
          <button
            onClick={onNextMonth}
            style={{
              width: '34px', height: '34px', borderRadius: '10px',
              background: '#F8FAFC', border: '1.5px solid #E2E8F0',
              cursor: 'pointer', fontSize: '14px', color: '#64748B',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            ›
          </button>
        </div>

        {/* 캘린더 그리드 */}
        <MonthCalendar
          year={calYear} month={calMonth}
          journalMap={journalMap} onDateClick={onDateClick}
        />

        {/* 범례 */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '14px',
          marginTop: '14px', padding: '10px 14px',
          background: '#F8FAFC', borderRadius: '10px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#21C58E', display: 'inline-block' }} />
            <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '500' }}>작성 완료</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '20px', height: '20px', borderRadius: '8px', background: '#21C58E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '10px', color: '#fff', fontWeight: '900' }}>오</span>
            </span>
            <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '500' }}>오늘</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ fontSize: '11px', color: '#94A3B8', fontStyle: 'italic' }}>날짜 클릭 → 작성/조회</span>
          </div>
        </div>
      </div>

      {/* 오늘 쓰기 버튼 */}
      {isCurrentMonth && (
        <button
          onClick={onCreateToday}
          style={{
            width: '100%', padding: '14px', borderRadius: '14px', marginBottom: '24px',
            background: 'linear-gradient(135deg, #21C58E, #1AAD7D)',
            color: '#fff', border: 'none', fontSize: '15px', fontWeight: '800',
            cursor: 'pointer', letterSpacing: '-0.4px',
            boxShadow: '0 4px 16px rgba(33,197,142,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          }}
        >
          <span>✏️</span> 오늘의 경제일기 쓰기
        </button>
      )}

      {/* 이 달의 기록 */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '32px 0', color: '#94A3B8', fontSize: '13px' }}>
          불러오는 중...
        </div>
      ) : monthJournals.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '40px 20px',
          background: '#fff', borderRadius: '16px', border: '1.5px solid #E8F5EF',
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
            <BookOpen size={32} color="#888780" />
          </div>
          <p style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A', marginBottom: '6px', letterSpacing: '-0.3px' }}>
            이번 달 경제일기가 없어요
          </p>
          <p style={{ fontSize: '12px', color: '#94A3B8', lineHeight: '1.7' }}>
            캘린더에서 날짜를 클릭하거나<br />
            위 버튼으로 오늘 일기를 시작해보세요.
          </p>
        </div>
      ) : (
        <div>
          <p style={{ fontSize: '12px', fontWeight: '700', color: '#94A3B8', letterSpacing: '0.5px', marginBottom: '10px' }}>
            {calYear}년 {calMonth + 1}월 경제일기 · {monthJournals.length}개
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {monthJournals.map(j => (
              <JournalCard key={j.id} journal={j} onClick={() => onSelect(j)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── 작성/수정 폼 뷰 ────────────────────────────────────────── */
function FormView({ form, onFieldChange, onSave, onCancel, saving, editMode, error }) {
  const dateStr  = form.journal_date || getTodayStr();
  const { date, dayName } = formatDateStr(dateStr);

  return (
    <div className="anim-fade">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <button
          onClick={onCancel}
          style={{
            padding: '8px 14px', borderRadius: '10px',
            background: '#F8FAFC', border: '1.5px solid #E2E8F0',
            fontSize: '13px', fontWeight: '600', color: '#64748B', cursor: 'pointer',
          }}
        >
          ← 뒤로
        </button>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '16px', fontWeight: '900', color: '#0F172A', letterSpacing: '-0.5px' }}>
            {editMode ? '경제일기 수정' : '경제일기 작성'}
          </p>
          <p style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '500' }}>
            {date} · {dayName}
          </p>
        </div>
      </div>

      <div style={{
        background: '#F0FDF9', border: '1px solid #A7F3D0',
        borderRadius: '12px', padding: '11px 15px', marginBottom: '18px',
        display: 'flex', gap: '9px', alignItems: 'center',
      }}>
        <span style={{ fontSize: '15px' }}>💬</span>
        <p style={{ fontSize: '12px', color: '#065F46', fontWeight: '500', lineHeight: '1.6' }}>
          모든 항목을 채울 필요는 없어요. 기억에 남는 것만 적어도 충분해요.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
        {SECTIONS.map(section => (
          <SectionCard
            key={section.key} section={section}
            value={form[section.key]} onChange={onFieldChange} readOnly={false}
          />
        ))}
      </div>

      {error && (
        <p style={{ fontSize: '13px', color: '#EF4444', fontWeight: '600', marginBottom: '10px', textAlign: 'center' }}>
          {error}
        </p>
      )}

      <button
        onClick={onSave} disabled={saving}
        style={{
          width: '100%', padding: '15px', borderRadius: '14px', marginBottom: '40px',
          background: saving ? '#E2E8F0' : 'linear-gradient(135deg, #21C58E, #1AAD7D)',
          color: saving ? '#94A3B8' : '#fff', border: 'none',
          fontSize: '15px', fontWeight: '800', cursor: saving ? 'not-allowed' : 'pointer',
          letterSpacing: '-0.4px', transition: 'all 0.15s',
          boxShadow: saving ? 'none' : '0 4px 16px rgba(33,197,142,0.3)',
        }}
      >
        {saving ? '저장 중...' : <><BookOpen size={15} color="#fff" /> 경제일기 저장하기</>}
      </button>
    </div>
  );
}

/* ── 상세 뷰 ────────────────────────────────────────────────── */
function DetailView({ journal, onBack, onEdit, onDelete, deleting }) {
  const dateStr = getJournalDateStr(journal);
  const { date, dayName } = formatDateStr(dateStr);
  const [confirmDel, setConfirmDel] = useState(false);
  const hasContent = SECTIONS.some(s => journal[s.key]?.trim());

  return (
    <div className="anim-fade">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <button
          onClick={onBack}
          style={{
            padding: '8px 14px', borderRadius: '10px',
            background: '#F8FAFC', border: '1.5px solid #E2E8F0',
            fontSize: '13px', fontWeight: '600', color: '#64748B', cursor: 'pointer',
          }}
        >
          ← 목록
        </button>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '16px', fontWeight: '900', color: '#0F172A', letterSpacing: '-0.5px' }}>{date}</p>
          <p style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '500' }}>{dayName}</p>
        </div>
        <button
          onClick={onEdit}
          style={{
            padding: '7px 16px', borderRadius: '10px',
            background: '#F0FDF9', border: '1.5px solid #A7F3D0',
            fontSize: '13px', fontWeight: '700', color: '#065F46', cursor: 'pointer',
          }}
        >
          수정
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
        {hasContent ? (
          SECTIONS.map(section => (
            <SectionCard key={section.key} section={section} value={journal[section.key]} onChange={() => {}} readOnly />
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', background: '#fff', borderRadius: '16px', border: '1.5px solid #E8F5EF' }}>
            <p style={{ fontSize: '13px', color: '#94A3B8' }}>작성된 내용이 없어요.</p>
          </div>
        )}
      </div>

      {confirmDel ? (
        <div style={{
          padding: '18px', borderRadius: '14px', marginBottom: '40px',
          background: '#FEF2F2', border: '1.5px solid #FECACA',
        }}>
          <p style={{ fontSize: '14px', fontWeight: '700', color: '#DC2626', marginBottom: '14px', textAlign: 'center' }}>
            정말 삭제할까요? 복구할 수 없어요.
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setConfirmDel(false)}
              style={{ flex: 1, padding: '11px', borderRadius: '10px', background: '#fff', border: '1.5px solid #E2E8F0', fontSize: '13px', fontWeight: '700', color: '#374151', cursor: 'pointer' }}
            >
              취소
            </button>
            <button
              onClick={onDelete} disabled={deleting}
              style={{ flex: 1, padding: '11px', borderRadius: '10px', background: '#DC2626', border: 'none', fontSize: '13px', fontWeight: '700', color: '#fff', cursor: deleting ? 'not-allowed' : 'pointer' }}
            >
              {deleting ? '삭제 중...' : '삭제'}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setConfirmDel(true)}
          style={{
            width: '100%', padding: '12px', borderRadius: '12px', marginBottom: '40px',
            background: 'none', border: '1.5px solid #FECACA',
            fontSize: '13px', fontWeight: '600', color: '#EF4444', cursor: 'pointer',
          }}
        >
          일기 삭제하기
        </button>
      )}
    </div>
  );
}

/* ── 경제일기 콘텐츠 (탭 재사용 가능) ─────────────────────── */
export function DiaryContent() {
  const { user } = useAuth();
  const today = new Date();

  const [view,      setView]      = useState('list');
  const [journals,  setJournals]  = useState([]);
  const [selected,  setSelected]  = useState(null);
  const [editMode,  setEditMode]  = useState(false);
  const [form,      setForm]      = useState({ ...EMPTY_FORM });
  const [loading,   setLoading]   = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [deleting,  setDeleting]  = useState(false);
  const [formError, setFormError] = useState('');
  const [calYear,   setCalYear]   = useState(today.getFullYear());
  const [calMonth,  setCalMonth]  = useState(today.getMonth());

  useEffect(() => { if (user) loadJournals(); }, [user]);
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [view]);

  async function loadJournals() {
    setLoading(true);
    const data = await getJournals(user.id);
    setJournals(data);
    setLoading(false);
  }

  function prevMonth() {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); }
    else setCalMonth(m => m - 1);
  }
  function nextMonth() {
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); }
    else setCalMonth(m => m + 1);
  }

  function openCreate(date) {
    const d = date || getTodayStr();
    setForm({ ...EMPTY_FORM, journal_date: d });
    setEditMode(false);
    setFormError('');
    setView('form');
  }

  function openEdit(journal) {
    setForm({
      learned_today:    journal.learned_today    || '',
      news_title:       journal.news_title       || '',
      news_thought:     journal.news_thought     || '',
      questions:        journal.questions        || '',
      consumption_note: journal.consumption_note || '',
      next_topic:       journal.next_topic       || '',
      journal_date:     getJournalDateStr(journal),
    });
    setEditMode(true);
    setFormError('');
    setView('form');
  }

  function handleDateClick(dateStr, existingJournal) {
    if (existingJournal) {
      setSelected(existingJournal);
      setView('detail');
    } else {
      openCreate(dateStr);
    }
  }

  function handleFieldChange(key, value) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    const isEmpty = SECTIONS.every(s => !form[s.key]?.trim());
    if (isEmpty) { setFormError('최소 하나의 항목을 입력해주세요.'); return; }
    setSaving(true);
    setFormError('');
    if (editMode && selected) {
      const { success, journal } = await updateJournal(selected.id, form);
      if (success) { setSelected(journal); await loadJournals(); setView('detail'); }
    } else {
      const { success, journal } = await createJournal(user.id, form);
      if (success) { setSelected(journal); await loadJournals(); setView('detail'); }
    }
    setSaving(false);
  }

  async function handleDelete() {
    setDeleting(true);
    const { success } = await deleteJournal(selected.id);
    if (success) { await loadJournals(); setSelected(null); setView('list'); }
    setDeleting(false);
  }

  return (
    <div>

      {view === 'list' && (
        <ListView
          journals={journals}
          calYear={calYear} calMonth={calMonth}
          onPrevMonth={prevMonth} onNextMonth={nextMonth}
          onDateClick={handleDateClick}
          onCreateToday={() => openCreate(getTodayStr())}
          onSelect={j => { setSelected(j); setView('detail'); }}
          loading={loading}
        />
      )}

      {view === 'form' && (
        <FormView
          form={form} onFieldChange={handleFieldChange}
          onSave={handleSave} onCancel={() => setView(editMode && selected ? 'detail' : 'list')}
          saving={saving} editMode={editMode} error={formError}
        />
      )}

      {view === 'detail' && selected && (
        <DetailView
          journal={selected}
          onBack={() => setView('list')}
          onEdit={() => openEdit(selected)}
          onDelete={handleDelete}
          deleting={deleting}
        />
      )}
    </div>
  );
}

/* ── 전체 페이지 ─────────────────────────────────────────────── */
export default function DiaryPage() {
  return (
    <PageWrapper>
      <div style={{ background: '#F4FAF6', minHeight: 'calc(100vh - 64px)', padding: '28px 0 64px' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto', padding: '0 20px' }}>
          <DiaryContent />
        </div>
      </div>
    </PageWrapper>
  );
}
