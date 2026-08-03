import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronDown, ChevronRight, Circle, Sparkles } from 'lucide-react';
import economicBites from '../data/economicBites';
import {
  CURRICULUM_CHAPTERS,
  getAllChaptersProgress,
  getChapterProgress,
  getCurriculumOrderedBiteIds,
} from '../data/curriculum';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabaseClient';
import PageWrapper from '../components/layout/PageWrapper';

const EXCLUDED_BITES = economicBites.filter((b) => !b.inCurriculum);
const TOTAL_PROGRESS = getAllChaptersProgress().reduce(
  (acc, c) => ({ total: acc.total + c.total, completed: acc.completed + c.completed }),
  { total: 0, completed: 0 }
);

function ProgressBar({ ratio, height = 6 }) {
  return (
    <div style={{ background: 'var(--c-line-soft)', borderRadius: 99, height, overflow: 'hidden' }}>
      <div style={{
        background: 'var(--c-green-500)', borderRadius: 99, height: '100%',
        width: `${Math.round(ratio * 100)}%`, transition: 'width 0.4s ease',
      }} />
    </div>
  );
}

/* 학습 완료 / 학습 가능 카드 — 실제 콘텐츠가 있는 항목 */
function BiteArchiveCard({ bite, done, navigate }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={() => navigate(`/bite/${bite.id}`)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: done ? 'var(--c-green-50)' : 'var(--c-surface)',
        border: `1px solid ${hov ? 'var(--c-green-500)' : done ? 'var(--c-green-100)' : 'var(--c-line)'}`,
        borderRadius: 12, padding: '12px 14px', cursor: 'pointer',
        transition: 'border-color 0.15s',
        display: 'flex', alignItems: 'center', gap: 10,
      }}
    >
      <div style={{
        width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: done ? 'var(--c-green-500)' : 'var(--c-green-100)',
      }}>
        {done
          ? <Check size={14} color="#fff" />
          : <Circle size={8} color="var(--c-forest-700)" fill="var(--c-forest-700)" />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--c-ink)', letterSpacing: '-0.3px' }}>
          {bite.title}
        </div>
        <p style={{
          fontSize: 12, color: 'var(--c-slate)', lineHeight: 1.5, marginTop: 2,
          display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {bite.summary}
        </p>
      </div>
      {done && (
        <span style={{
          fontSize: 10, fontWeight: 700, color: 'var(--c-forest-700)',
          background: 'var(--c-green-100)', borderRadius: 'var(--r-full)',
          padding: '2px 8px', flexShrink: 0,
        }}>
          완료
        </span>
      )}
    </div>
  );
}

/* 준비 중(pending) 카드 — 아직 콘텐츠가 없는 항목. 클릭 불가 */
function PendingCard({ title }) {
  return (
    <div style={{
      background: 'var(--c-canvas)', border: '1px dashed var(--c-line)',
      borderRadius: 12, padding: '12px 14px', cursor: 'default',
      display: 'flex', alignItems: 'center', gap: 10, opacity: 0.65,
    }}>
      <div style={{
        width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--c-line-soft)',
      }}>
        <Circle size={8} color="var(--c-muted)" fill="var(--c-muted)" />
      </div>
      <div style={{ flex: 1, minWidth: 0, fontSize: 14, fontWeight: 600, color: 'var(--c-muted)' }}>
        {title}
      </div>
      <span style={{
        fontSize: 10, fontWeight: 700, color: 'var(--c-muted)',
        background: 'var(--c-line-soft)', borderRadius: 'var(--r-full)',
        padding: '2px 8px', flexShrink: 0,
      }}>
        준비 중
      </span>
    </div>
  );
}

/* 챕터 하나의 학습 진도. built/pending은 curriculum.js의 getChapterProgress를 그대로 쓰고(제작 진도),
   learned(=user_bite_history 기준 본 카드 수)만 페이지에서 계산한다 — curriculum.js는 "본 카드"라는
   사용자별 개념을 모르기 때문. 진도 바는 항상 learned/built(학습 진도) 기준으로 채운다 — 제작 진도가 아님. */
function getChapterLearningStats(chapter, viewedIds) {
  const { total, completed: built } = getChapterProgress(chapter.number);
  const learned = chapter.items.filter((it) => !it.pending && viewedIds.has(it.id)).length;
  return { learned, built, pending: total - built };
}

function ChapterSection({ chapter, viewedIds, expanded, onToggle, navigate }) {
  const { learned, built, pending } = getChapterLearningStats(chapter, viewedIds);
  const ratio = built > 0 ? learned / built : 0;

  return (
    <div style={{
      background: 'var(--c-surface)', border: '0.5px solid var(--c-line)',
      borderRadius: 14, marginBottom: 10, overflow: 'hidden', boxShadow: 'var(--shadow-card)',
    }}>
      <div
        onClick={onToggle}
        style={{
          padding: '14px 16px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 10,
        }}
      >
        {expanded
          ? <ChevronDown size={16} color="var(--c-slate)" style={{ flexShrink: 0 }} />
          : <ChevronRight size={16} color="var(--c-slate)" style={{ flexShrink: 0 }} />}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--c-forest-700)', letterSpacing: '-0.3px' }}>
              {chapter.number}장 · {chapter.name}
            </span>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--c-muted)', flexShrink: 0 }}>
              학습 {learned}/{built}{pending > 0 && ` · 준비 중 ${pending}`}
            </span>
          </div>
          {chapter.subtitle && (
            <div style={{ fontSize: 11, color: 'var(--c-muted)', marginTop: 2 }}>
              {chapter.subtitle}
            </div>
          )}
          <div style={{ marginTop: 8 }}>
            <ProgressBar ratio={ratio} height={4} />
          </div>
        </div>
      </div>

      {expanded && (
        <div style={{ padding: '0 16px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {chapter.items.map((item, idx) => {
            if (item.pending) {
              return <PendingCard key={`pending-${idx}`} title={item.title} />;
            }
            const bite = economicBites.find((b) => b.id === item.id);
            if (!bite) return null;
            return (
              <BiteArchiveCard
                key={bite.id}
                bite={bite}
                done={viewedIds.has(bite.id)}
                navigate={navigate}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function EconomicBiteArchivePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [viewedIds, setViewedIds] = useState(new Set());
  const [expandedChapters, setExpandedChapters] = useState(new Set());
  const hasAutoExpanded = useRef(false);

  useEffect(() => {
    let cancelled = false;
    async function loadHistory() {
      if (!user?.id) return;
      const { data } = await supabase
        .from('user_bite_history')
        .select('bite_id')
        .eq('user_id', user.id);
      if (cancelled) return;
      setViewedIds(new Set((data ?? []).map((r) => r.bite_id)));
    }
    loadHistory();
    return () => { cancelled = true; };
  }, [user?.id]);

  /* 현재 학습 중인 챕터(= 커리큘럼 순서상 첫 미완료 카드가 속한 챕터)만 기본으로 펼침 — 한 번만 초기화 */
  useEffect(() => {
    if (hasAutoExpanded.current) return;
    const orderedIds = getCurriculumOrderedBiteIds();
    const nextId = orderedIds.find((id) => !viewedIds.has(id));
    if (nextId == null) return;
    const nextBite = economicBites.find((b) => b.id === nextId);
    if (!nextBite) return;
    setExpandedChapters(new Set([nextBite.chapter]));
    hasAutoExpanded.current = true;
  }, [viewedIds]);

  function toggleChapter(chapterNumber) {
    setExpandedChapters((prev) => {
      const next = new Set(prev);
      if (next.has(chapterNumber)) next.delete(chapterNumber);
      else next.add(chapterNumber);
      return next;
    });
  }

  const curriculumIds = getCurriculumOrderedBiteIds();
  const learnedCount = curriculumIds.filter((id) => viewedIds.has(id)).length;
  const overallLearningRatio = TOTAL_PROGRESS.completed > 0 ? learnedCount / TOTAL_PROGRESS.completed : 0;

  return (
    <PageWrapper>
      <div style={{ background: 'var(--c-canvas)', minHeight: 'calc(100vh - 64px)', padding: '20px 0 80px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 20px' }}>

          {/* ── 전체 진도 ── */}
          <div style={{
            background: 'var(--c-surface)', border: '0.5px solid var(--c-line)',
            borderRadius: 16, padding: '18px 18px', marginBottom: 20,
            boxShadow: 'var(--shadow-card)',
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--c-forest-700)', letterSpacing: '-0.2px' }}>
                학습 진도
              </span>
              <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--c-forest-700)' }}>
                {learnedCount} / {TOTAL_PROGRESS.completed} <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--c-muted)' }}>완료</span>
              </span>
            </div>
            <ProgressBar ratio={overallLearningRatio} height={8} />
            <p style={{ fontSize: 11, color: 'var(--c-muted)', marginTop: 10, lineHeight: 1.5 }}>
              13개 챕터, 112개 단어로 이루어진 초보자 경제 용어 커리큘럼이에요. 아직 준비 중인 카드도
              전체 구조를 볼 수 있도록 함께 표시했어요.
            </p>
            <p style={{ fontSize: 11, color: 'var(--c-muted)', fontWeight: 600, marginTop: 4 }}>
              콘텐츠 준비 {TOTAL_PROGRESS.completed} / {TOTAL_PROGRESS.total}
            </p>
          </div>

          {/* ── 13챕터 ── */}
          {CURRICULUM_CHAPTERS.map((chapter) => (
            <ChapterSection
              key={chapter.number}
              chapter={chapter}
              viewedIds={viewedIds}
              expanded={expandedChapters.has(chapter.number)}
              onToggle={() => toggleChapter(chapter.number)}
              navigate={navigate}
            />
          ))}

          {/* ── 심화: 커리큘럼 밖 ── */}
          <div style={{ marginTop: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <Sparkles size={14} color="var(--c-slate)" />
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--c-slate)' }}>
                심화 — 커리큘럼 밖
              </span>
            </div>
            <p style={{ fontSize: 11, color: 'var(--c-muted)', marginBottom: 10, lineHeight: 1.5 }}>
              투자 분석 심화 개념이에요. 순서 없이 필요할 때 찾아보세요.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {EXCLUDED_BITES.map((bite) => (
                <BiteArchiveCard
                  key={bite.id}
                  bite={bite}
                  done={viewedIds.has(bite.id)}
                  navigate={navigate}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </PageWrapper>
  );
}
