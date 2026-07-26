#!/usr/bin/env node
/**
 * 콘텐츠 3종(한잎/퀴즈/인포그래픽) 정합성 검사.
 *
 * 계기: 실생활경제(id 71~80) 추가 시 퀴즈를 안 붙인 걸 뒤늦게 발견 —
 * 에러 없이 조용히 "한잎 퀴즈 풀기" 할일이 완료 불가 상태가 됐었음.
 * 콘텐츠를 200개까지 늘릴 계획이라 이런 누락을 자동으로 잡는다.
 *
 * 프로덕션 코드는 읽기만 한다.
 *
 * 실행: node scripts/check-content.mjs (또는 npm run check:content)
 * 종료 코드: 1~6번 항목에 문제가 있으면 1, 7번(정답 위치 경고)은 exit code에 반영 안 함
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import economicBites from '../src/data/economicBites.js'
import indicatorsData from '../src/data/indicatorsData.js'
import BITE_QUIZZES from '../src/data/biteQuizzes.js'
import { getCurriculumSequence } from '../src/data/curriculum.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const INFOGRAPHICS_PATH = path.join(__dirname, '..', 'src', 'data', 'biteInfographics.jsx')

const EXPECTED_BITE_COUNT = 86
const EXPECTED_INDICATOR_COUNT = 11
const EXPECTED_QUIZ_COUNT = 86
const ANSWER_POSITION_WARN_RATIO = 0.4

let hasFailure = false
const issues = [] // { category, items: [{id, title, detail}] }

function report(category, items) {
  if (items.length === 0) return
  hasFailure = true
  issues.push({ category, items })
}

// ── 파싱 ─────────────────────────────────────────────────────────

const biteIds = economicBites.map((b) => b.id)
const indicatorIds = indicatorsData.map((i) => i.id)
const quizIds = Object.keys(BITE_QUIZZES).map(Number)

// biteInfographics.jsx는 JSX 문법이라 plain Node import가 불가능 —
// 정규식으로 최상위 숫자 키만 추출한다 (`  71: () => (` 형태)
const infographicsSource = fs.readFileSync(INFOGRAPHICS_PATH, 'utf-8')
const infographicIds = [...infographicsSource.matchAll(/^\s{2}(\d+):\s*\(\)\s*=>/gm)].map((m) => Number(m[1]))
const infographicIdSet = new Set(infographicIds)

console.log('[파싱된 개수]')
console.log(`  한잎(economicBites): ${biteIds.length}개`)
console.log(`  지표(indicatorsData): ${indicatorIds.length}개`)
console.log(`  퀴즈(biteQuizzes): ${quizIds.length}개`)
console.log(`  인포그래픽(biteInfographics, 정규식 파싱): ${infographicIds.length}개`)
console.log('')

if (biteIds.length !== EXPECTED_BITE_COUNT || indicatorIds.length !== EXPECTED_INDICATOR_COUNT || quizIds.length !== EXPECTED_QUIZ_COUNT) {
  console.error(
    `✗ 파싱된 개수가 예상과 달라요 (한잎 ${EXPECTED_BITE_COUNT}개 / 지표 ${EXPECTED_INDICATOR_COUNT}개 / 퀴즈 ${EXPECTED_QUIZ_COUNT}개가 나와야 정상). 검사를 중단합니다.`
  )
  process.exit(1)
}
if (infographicIds.length !== infographicIdSet.size) {
  console.error('✗ 인포그래픽 정규식 파싱에서 중복 키가 발견됐어요. 검사를 중단합니다.')
  process.exit(1)
}

const biteById = new Map(economicBites.map((b) => [b.id, b]))
const indicatorById = new Map(indicatorsData.map((i) => [i.id, i]))
const biteIdSet = new Set(biteIds)
const indicatorIdSet = new Set(indicatorIds)

// ── 1. 한잎 → 퀴즈/인포그래픽 존재 여부 ─────────────────────────────

report(
  '1a. 퀴즈가 없는 한잎',
  economicBites.filter((b) => !(b.id in BITE_QUIZZES)).map((b) => ({ id: b.id, title: b.title }))
)
report(
  '1b. 인포그래픽이 없는 한잎',
  economicBites.filter((b) => !infographicIdSet.has(b.id)).map((b) => ({ id: b.id, title: b.title }))
)

// ── 2. 지표 → 인포그래픽 존재 여부 ─────────────────────────────────

report(
  '2. 인포그래픽이 없는 지표',
  indicatorsData.filter((i) => !infographicIdSet.has(i.id)).map((i) => ({ id: i.id, title: i.title }))
)

// ── 3. 역방향 — 대응하는 한잎/지표가 없는 고아 id ────────────────────

report(
  '3a. 대응하는 한잎/지표가 없는 고아 퀴즈',
  quizIds.filter((id) => !biteIdSet.has(id) && !indicatorIdSet.has(id)).map((id) => ({ id, title: '(참조 불가)' }))
)
report(
  '3b. 대응하는 한잎/지표가 없는 고아 인포그래픽',
  infographicIds.filter((id) => !biteIdSet.has(id) && !indicatorIdSet.has(id)).map((id) => ({ id, title: '(참조 불가)' }))
)

// ── 4. id 중복 — 한잎과 지표가 같은 id ────────────────────────────

report(
  '4. 한잎과 지표가 같은 id를 사용',
  biteIds.filter((id) => indicatorIdSet.has(id)).map((id) => ({ id, title: `${biteById.get(id)?.title} / ${indicatorById.get(id)?.title}` }))
)

// ── 5. relatedTerms 중 실제 한잎/지표 제목에 없는 것 ─────────────────

function stripWhitespace(s) { return s.replace(/\s+/g, '') }
function splitParenthetical(s) {
  const m = s.match(/^(.*?)\(([^)]*)\)(.*)$/)
  if (!m) return [s]
  const [, before, inside, after] = m
  return [(before + after).trim(), inside.trim()].filter(Boolean)
}
function titleVariants(raw) {
  const variants = new Set()
  for (const part of splitParenthetical(raw)) {
    const cleaned = stripWhitespace(part).toUpperCase()
    if (cleaned) variants.add(cleaned)
  }
  return variants
}

const validTitleForms = new Set()
for (const item of [...economicBites, ...indicatorsData]) {
  for (const v of titleVariants(item.title)) validTitleForms.add(v)
}

const brokenRelatedTerms = []
for (const bite of economicBites) {
  for (const term of bite.relatedTerms ?? []) {
    const variants = titleVariants(term)
    const matched = [...variants].some((v) => validTitleForms.has(v))
    if (!matched) {
      brokenRelatedTerms.push({ id: bite.id, title: bite.title, detail: `relatedTerms: "${term}"` })
    }
  }
}
report('5. relatedTerms 중 실제 한잎/지표 제목에 없는 용어', brokenRelatedTerms)

// ── 6. 퀴즈 구조 검사 ─────────────────────────────────────────────

const structuralIssues = []
for (const idStr of Object.keys(BITE_QUIZZES)) {
  const id = Number(idStr)
  const entry = BITE_QUIZZES[idStr]
  const title = biteById.get(id)?.title ?? indicatorById.get(id)?.title ?? '(제목 없음)'
  const q = entry?.quiz
  if (!q) {
    structuralIssues.push({ id, title, detail: 'quiz 객체 자체가 없음' })
    continue
  }
  if (!Array.isArray(q.options) || q.options.length !== 4) {
    structuralIssues.push({ id, title, detail: `options 개수가 4개가 아님 (${q.options?.length ?? '없음'}개)` })
  }
  if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= (q.options?.length ?? 0)) {
    structuralIssues.push({ id, title, detail: `answer 인덱스가 유효하지 않음 (answer=${q.answer})` })
  }
  if (typeof q.question !== 'string' || q.question.trim() === '') {
    structuralIssues.push({ id, title, detail: 'question이 빈 문자열' })
  }
  if (Array.isArray(q.options)) {
    q.options.forEach((opt, i) => {
      if (typeof opt !== 'string' || opt.trim() === '') {
        structuralIssues.push({ id, title, detail: `options[${i}]가 빈 문자열` })
      }
    })
  }
}
report('6. 퀴즈 구조 이상', structuralIssues)

// ── 8. 커리큘럼(chapter/order/curriculum.js) 정합성 ─────────────────

const EXPECTED_CURRICULUM_TOTAL = 96
const EXPECTED_CURRICULUM_PENDING = 15

report(
  '8a. inCurriculum=true인데 chapter/order가 없는 한잎',
  economicBites
    .filter((b) => b.inCurriculum && (b.chapter == null || b.order == null))
    .map((b) => ({ id: b.id, title: b.title }))
)

const orderDupIssues = []
const seenOrderKeys = new Map()
for (const b of economicBites) {
  if (!b.inCurriculum) continue
  const key = `${b.chapter}-${b.order}`
  if (seenOrderKeys.has(key)) {
    orderDupIssues.push({ id: b.id, title: b.title, detail: `챕터 ${b.chapter}의 order ${b.order}가 "${seenOrderKeys.get(key)}"와 중복` })
  } else {
    seenOrderKeys.set(key, b.title)
  }
}
report('8b. 같은 챕터 안에서 order 중복', orderDupIssues)

const curriculumSequence = getCurriculumSequence()

if (curriculumSequence.length !== EXPECTED_CURRICULUM_TOTAL) {
  report('8c. curriculum.js 총 항목 수가 96이 아님', [
    { id: '-', title: '-', detail: `실제 ${curriculumSequence.length}개` },
  ])
}

report(
  '8d. curriculum.js가 참조하는 id 중 economicBites에 없는 것',
  curriculumSequence
    .filter((item) => !item.pending && item.id != null && !biteIdSet.has(item.id))
    .map((item) => ({ id: item.id, title: item.title ?? '(제목 없음)', detail: `${item.chapterName}(${item.chapter}챕터)에서 참조` }))
)

const pendingCount = curriculumSequence.filter((item) => item.pending).length
if (pendingCount !== EXPECTED_CURRICULUM_PENDING) {
  report('8e. curriculum.js pending 개수가 31이 아님', [
    { id: '-', title: '-', detail: `실제 ${pendingCount}개` },
  ])
}

// ── 문제 출력 ─────────────────────────────────────────────────────

for (const { category, items } of issues) {
  console.log(`✗ ${category} (${items.length}건)`)
  for (const item of items) {
    const detail = item.detail ? ` — ${item.detail}` : ''
    console.log(`    id ${item.id}: ${item.title}${detail}`)
  }
  console.log('')
}

// ── 7. 퀴즈 정답 위치 분포 (경고 전용, exit code 미반영) ──────────────

const positionCounts = [0, 0, 0, 0]
for (const idStr of Object.keys(BITE_QUIZZES)) {
  const answer = BITE_QUIZZES[idStr]?.quiz?.answer
  if (Number.isInteger(answer) && answer >= 0 && answer < 4) positionCounts[answer]++
}
const totalQuizzes = quizIds.length
console.log('[퀴즈 정답 위치 분포]')
console.log(`  1번: ${positionCounts[0]}개 (${((positionCounts[0] / totalQuizzes) * 100).toFixed(1)}%)`)
console.log(`  2번: ${positionCounts[1]}개 (${((positionCounts[1] / totalQuizzes) * 100).toFixed(1)}%)`)
console.log(`  3번: ${positionCounts[2]}개 (${((positionCounts[2] / totalQuizzes) * 100).toFixed(1)}%)`)
console.log(`  4번: ${positionCounts[3]}개 (${((positionCounts[3] / totalQuizzes) * 100).toFixed(1)}%)`)

positionCounts.forEach((count, i) => {
  const ratio = count / totalQuizzes
  if (ratio > ANSWER_POSITION_WARN_RATIO) {
    console.log(`  ⚠ ${i + 1}번 자리가 ${(ratio * 100).toFixed(1)}%로 40%를 넘었어요 — 쏠림이 다시 생기고 있어요.`)
  }
})
console.log('')

// ── 최종 결과 ─────────────────────────────────────────────────────

if (!hasFailure) {
  console.log(`✅ 콘텐츠 정합성 이상 없음 (한잎 ${biteIds.length}개 / 지표 ${indicatorIds.length}개 / 퀴즈 ${quizIds.length}개)`)
  process.exit(0)
} else {
  const totalIssues = issues.reduce((s, c) => s + c.items.length, 0)
  console.error(`✗ 콘텐츠 정합성 문제 ${totalIssues}건 발견`)
  process.exit(1)
}
