#!/usr/bin/env node
/**
 * economicBites.js 70개 각각의 "선행 개념"을 추출한다 (지표 11개는 제외).
 * relatedTerms는 상호 참조 링크일 뿐 선행 관계가 아니므로 쓰지 않는다 —
 * 대신 description/whyImportant 본문을 근거로 AI가 판단한다.
 *
 * 프로덕션 코드(economicBites.js 등)는 읽기만 하며 수정하지 않는다.
 *
 * 실행: node scripts/extract-prerequisites.mjs [--refresh]
 */

import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import economicBites from '../src/data/economicBites.js'

config({ path: '.env.local' })

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CACHE_PATH = path.join(__dirname, '.cache', 'prerequisites.json')
const OUTPUT_PATH = path.join(__dirname, 'output', 'curriculum-order.md')

const CACHE_SCHEMA_VERSION = 1
const BATCH_SIZE = 5
const REFRESH = process.argv.includes('--refresh')

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY가 .env.local에 없어요.')
  process.exit(1)
}
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const TITLE_SET = new Set(economicBites.map((b) => b.title))
const BY_TITLE = new Map(economicBites.map((b) => [b.title, b]))
const BY_ID = new Map(economicBites.map((b) => [b.id, b]))

function chunk(arr, size) {
  const out = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

// ── 1단계: AI로 선행 개념 추출 ─────────────────────────────────────

function buildSystemPrompt() {
  const refList = economicBites.map((b, i) => `[${i + 1}] ${b.title}`).join('\n')
  return `다음은 경제 학습 콘텐츠 70개의 전체 제목 목록이다 (선행 개념은 반드시 이 목록 안에서만 골라야 한다):

${refList}

지금부터 주어지는 각 대상 항목의 설명(description/왜 중요한지)을 읽고, 그 설명을 이해하려면
위 70개 목록 중 무엇을 먼저 알아야 하는지 찾아라.

판단 기준:
- 본문이 다른 개념을 "이미 아는 전제"로 쓰고 있으면 그 개념이 선행 개념이다
  (예: '실질임금'을 설명하며 '인플레이션'을 전제로 쓰면 → 선행)
- 단순히 언급되거나 비교 대상으로만 나온 것은 선행 개념이 아니다
- 위 70개 목록에 없는 개념은 절대 답하지 마라
- 자기 자신은 답하지 마라
- 선행 개념이 없으면 빈 배열로 응답해라
- 선행 개념 이름은 위 목록의 제목과 정확히 똑같은 문자열로 적어라

JSON 배열로만 응답, 다른 텍스트 금지: [{"index":1,"prerequisites":["기준금리","인플레이션"]}]`
}

function buildUserContent(batch) {
  return batch
    .map(
      (b, i) => `[${i + 1}] 제목: ${b.title}
설명: ${b.description}
왜 중요한지: ${b.whyImportant}`
    )
    .join('\n\n')
}

async function extractBatch(batch, systemPrompt) {
  const { data, error } = await supabase.functions.invoke('solar', {
    body: { system: systemPrompt, messages: [{ role: 'user', content: buildUserContent(batch) }] },
  })
  if (error) {
    console.warn(`  ⚠ Solar 호출 실패: ${error.message}`)
    return []
  }
  const raw = data?.content ?? '[]'
  try {
    const clean = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const match = clean.match(/\[[\s\S]*\]/)
    const parsed = JSON.parse(match ? match[0] : clean)
    if (!Array.isArray(parsed)) return []
    const results = []
    for (const item of parsed) {
      const idx = Number(item?.index)
      if (!Number.isInteger(idx) || idx < 1 || idx > batch.length) continue
      const prereqs = Array.isArray(item?.prerequisites) ? item.prerequisites : []
      results.push({ bite: batch[idx - 1], rawPrerequisites: prereqs })
    }
    return results
  } catch {
    console.warn(`  ⚠ 응답 파싱 실패, 원본 일부: ${raw.slice(0, 150)}`)
    return []
  }
}

async function extractAll() {
  if (!REFRESH && fs.existsSync(CACHE_PATH)) {
    const cached = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf-8'))
    if (cached.meta?.schemaVersion === CACHE_SCHEMA_VERSION) {
      console.log(`캐시된 선행 관계를 재사용해요 (${cached.meta.generatedAt} 생성, --refresh로 재추출 가능)`)
      return cached.results
    }
  }

  const systemPrompt = buildSystemPrompt()
  const batches = chunk(economicBites, BATCH_SIZE)
  const allResults = []
  for (let i = 0; i < batches.length; i++) {
    process.stdout.write(`\r  선행 관계 추출 중... ${i + 1}/${batches.length}`)
    const batchResults = await extractBatch(batches[i], systemPrompt)
    allResults.push(...batchResults)
  }
  console.log('')

  fs.mkdirSync(path.dirname(CACHE_PATH), { recursive: true })
  fs.writeFileSync(
    CACHE_PATH,
    JSON.stringify(
      {
        meta: { schemaVersion: CACHE_SCHEMA_VERSION, generatedAt: new Date().toISOString() },
        results: allResults.map((r) => ({ id: r.bite.id, title: r.bite.title, rawPrerequisites: r.rawPrerequisites })),
      },
      null,
      2
    )
  )
  console.log(`선행 관계 결과를 캐시에 저장했어요: ${CACHE_PATH}`)
  return allResults.map((r) => ({ id: r.bite.id, title: r.bite.title, rawPrerequisites: r.rawPrerequisites }))
}

// ── 검증: 존재하지 않는 개념/자기참조 걸러내기 ───────────────────────

function validatePrerequisites(rawResults) {
  const prereqMap = new Map() // id -> [prereq ids]
  const droppedHallucinations = [] // { id, title, badPrereq }
  const droppedSelfRefs = [] // { id, title }

  for (const r of rawResults) {
    const validIds = []
    for (const p of r.rawPrerequisites) {
      if (p === r.title) {
        droppedSelfRefs.push({ id: r.id, title: r.title })
        continue
      }
      if (!TITLE_SET.has(p)) {
        droppedHallucinations.push({ id: r.id, title: r.title, badPrereq: p })
        continue
      }
      validIds.push(BY_TITLE.get(p).id)
    }
    prereqMap.set(r.id, [...new Set(validIds)])
  }
  return { prereqMap, droppedHallucinations, droppedSelfRefs }
}

// ── 2단계: 사이클 탐지 + 위상 레벨 계산 ───────────────────────────

function detectCyclesAndLevels(prereqMap) {
  const WHITE = 0, GRAY = 1, BLACK = 2
  const color = new Map()
  const cycles = []
  const stack = []

  function dfsDetect(id) {
    color.set(id, GRAY)
    stack.push(id)
    for (const p of prereqMap.get(id) ?? []) {
      if (color.get(p) === GRAY) {
        const cycleStart = stack.indexOf(p)
        cycles.push([...stack.slice(cycleStart), p])
      } else if (color.get(p) !== BLACK) {
        dfsDetect(p)
      }
    }
    stack.pop()
    color.set(id, BLACK)
  }

  for (const id of prereqMap.keys()) {
    if (!color.has(id)) dfsDetect(id)
  }

  const cycleNodeIds = new Set(cycles.flat())

  // cycle에 연루되지 않은 노드만 정상 레벨 계산. cycle 노드에 의존하는
  // 노드도 레벨을 신뢰할 수 없으므로 함께 "영향받음"으로 표시한다.
  const levelCache = new Map()
  const blockedByCycle = new Set()

  function computeLevel(id, visiting = new Set()) {
    if (cycleNodeIds.has(id)) return null
    if (levelCache.has(id)) return levelCache.get(id)
    if (visiting.has(id)) return null // 안전장치 (여기 도달하면 안 되지만 방어적으로)
    visiting.add(id)

    const prereqs = prereqMap.get(id) ?? []
    if (prereqs.length === 0) {
      levelCache.set(id, 0)
      return 0
    }
    let maxLevel = -1
    for (const p of prereqs) {
      const pLevel = computeLevel(p, visiting)
      if (pLevel === null) {
        blockedByCycle.add(id)
        levelCache.set(id, null)
        return null
      }
      maxLevel = Math.max(maxLevel, pLevel)
    }
    const level = maxLevel + 1
    levelCache.set(id, level)
    return level
  }

  for (const id of prereqMap.keys()) computeLevel(id)

  return { cycles, cycleNodeIds, levels: levelCache, blockedByCycle }
}

// ── 메인 ─────────────────────────────────────────────────────────

async function main() {
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true })

  const rawResults = await extractAll()
  const { prereqMap, droppedHallucinations, droppedSelfRefs } = validatePrerequisites(rawResults)

  console.log(`\n검증: 환각(존재하지 않는 개념) ${droppedHallucinations.length}건 제거, 자기참조 ${droppedSelfRefs.length}건 제거`)
  if (droppedHallucinations.length > 0) {
    console.log('  환각 목록:')
    for (const h of droppedHallucinations) console.log(`    id ${h.id} (${h.title}) → "${h.badPrereq}" (존재하지 않음)`)
  }
  if (droppedSelfRefs.length > 0) {
    console.log('  자기참조 목록:')
    for (const s of droppedSelfRefs) console.log(`    id ${s.id} (${s.title})`)
  }

  const { cycles, cycleNodeIds, levels, blockedByCycle } = detectCyclesAndLevels(prereqMap)

  if (cycles.length > 0) {
    console.log(`\n⚠ 순환 발견: ${cycles.length}건`)
    for (const cyc of cycles) {
      console.log('  ' + cyc.map((id) => BY_ID.get(id).title).join(' → '))
    }
  } else {
    console.log('\n순환 없음')
  }

  // ── 리포트 데이터 구성 ──
  const rows = economicBites.map((b) => {
    const prereqIds = prereqMap.get(b.id) ?? []
    const prereqTitles = prereqIds.map((id) => BY_ID.get(id).title)
    let level
    if (cycleNodeIds.has(b.id)) level = '순환'
    else if (blockedByCycle.has(b.id)) level = '순환 영향'
    else level = levels.get(b.id)
    return { id: b.id, title: b.title, category: b.category, difficulty: b.difficulty, prereqTitles, level }
  })

  const validLevels = rows.filter((r) => typeof r.level === 'number').map((r) => r.level)
  const maxLevel = validLevels.length ? Math.max(...validLevels) : 0

  // 1. 레벨별 분포
  const levelDist = new Map()
  for (const r of rows) {
    const key = typeof r.level === 'number' ? `레벨 ${r.level}` : r.level
    levelDist.set(key, (levelDist.get(key) ?? 0) + 1)
  }

  // 3. difficulty vs level 불일치
  const DIFF_ORDER = { easy: 0, medium: 1, hard: 2 }
  const expectedLevelBand = (diff) => DIFF_ORDER[diff] // 대략 easy~레벨0-1, medium~레벨1-2 ...
  const mismatches = rows.filter((r) => typeof r.level === 'number').filter((r) => {
    const d = DIFF_ORDER[r.difficulty]
    // easy인데 레벨이 높거나(>=3), hard인데 레벨이 낮은(===0) 경우를 명확한 불일치로 본다
    if (r.difficulty === 'easy' && r.level >= 3) return true
    if (r.difficulty === 'hard' && r.level === 0) return true
    return false
  })

  // 4. 고립 노드 (선행도 없고, 다른 것의 선행도 아님)
  const isPrereqOfSomething = new Set()
  for (const [, prereqs] of prereqMap) for (const p of prereqs) isPrereqOfSomething.add(p)
  const isolated = rows.filter((r) => (prereqMap.get(r.id)?.length ?? 0) === 0 && !isPrereqOfSomething.has(r.id))

  // 5. 레벨별 카테고리 분포
  const levelCategoryDist = new Map() // level(string) -> Map(category -> count)
  for (const r of rows) {
    const key = typeof r.level === 'number' ? `레벨 ${r.level}` : r.level
    if (!levelCategoryDist.has(key)) levelCategoryDist.set(key, new Map())
    const catMap = levelCategoryDist.get(key)
    catMap.set(r.category, (catMap.get(r.category) ?? 0) + 1)
  }

  // ── 리포트 작성 ──
  const lines = []
  lines.push('# 경제 한잎 70개 — 선행 개념 기반 커리큘럼 순서 분석')
  lines.push('')
  lines.push(`생성 시각: ${new Date().toISOString()}`)
  lines.push('')
  lines.push('선행 관계는 description/whyImportant 본문 근거로 AI가 판단했으며, relatedTerms는 사용하지 않았다.')
  lines.push('')

  if (cycles.length > 0) {
    lines.push('## ⚠ 순환 발견 (반드시 확인 필요)')
    lines.push('')
    lines.push('아래 순환에 포함된 개념들은 위상 레벨을 신뢰할 수 없어 "순환" 또는 "순환 영향"으로 표시했다. 임의로 끊지 않았다.')
    lines.push('')
    for (const cyc of cycles) {
      lines.push(`- ${cyc.map((id) => `${BY_ID.get(id).title}(id ${id})`).join(' → ')}`)
    }
    lines.push('')
  } else {
    lines.push('## 순환 검사')
    lines.push('')
    lines.push('순환 없음 — 모든 선행 관계가 DAG(비순환 방향 그래프)를 이룬다.')
    lines.push('')
  }

  lines.push('## 1. 레벨별 분포')
  lines.push('')
  lines.push('| 레벨 | 개수 |')
  lines.push('|---|---|')
  const levelKeys = [...levelDist.keys()].sort((a, b) => {
    const na = a.startsWith('레벨 ') ? Number(a.split(' ')[1]) : 999
    const nb = b.startsWith('레벨 ') ? Number(b.split(' ')[1]) : 999
    return na - nb
  })
  for (const key of levelKeys) lines.push(`| ${key} | ${levelDist.get(key)} |`)
  lines.push('')

  lines.push('## 2. 레벨별 전체 목록')
  lines.push('')
  for (let lvl = 0; lvl <= maxLevel; lvl++) {
    const items = rows.filter((r) => r.level === lvl)
    if (items.length === 0) continue
    lines.push(`### 레벨 ${lvl}`)
    lines.push('')
    lines.push('| id | 제목 | 카테고리 | 난이도 | 선행 개념 |')
    lines.push('|---|---|---|---|---|')
    for (const r of items) {
      lines.push(`| ${r.id} | ${r.title} | ${r.category} | ${r.difficulty} | ${r.prereqTitles.join(', ') || '-'} |`)
    }
    lines.push('')
  }
  const specialItems = rows.filter((r) => typeof r.level !== 'number')
  if (specialItems.length > 0) {
    lines.push('### 순환 / 순환 영향 (레벨 미정)')
    lines.push('')
    lines.push('| id | 제목 | 카테고리 | 난이도 | 선행 개념 | 상태 |')
    lines.push('|---|---|---|---|---|---|')
    for (const r of specialItems) {
      lines.push(`| ${r.id} | ${r.title} | ${r.category} | ${r.difficulty} | ${r.prereqTitles.join(', ') || '-'} | ${r.level} |`)
    }
    lines.push('')
  }

  lines.push('## 3. 현재 difficulty와 레벨의 일치도')
  lines.push('')
  lines.push(`불일치 기준: easy인데 레벨 3 이상, 또는 hard인데 레벨 0. 총 ${mismatches.length}건.`)
  lines.push('')
  if (mismatches.length > 0) {
    lines.push('| id | 제목 | 난이도 | 레벨 | 선행 개념 |')
    lines.push('|---|---|---|---|---|')
    for (const r of mismatches) {
      lines.push(`| ${r.id} | ${r.title} | ${r.difficulty} | ${r.level} | ${r.prereqTitles.join(', ') || '-'} |`)
    }
    lines.push('')
  }

  lines.push('## 4. 고립 노드 (선행도 없고, 다른 개념의 선행도 아님)')
  lines.push('')
  lines.push(`총 ${isolated.length}개 — 커리큘럼에 끼워넣기 애매한 항목들.`)
  lines.push('')
  lines.push('| id | 제목 | 카테고리 | 난이도 |')
  lines.push('|---|---|---|---|')
  for (const r of isolated) lines.push(`| ${r.id} | ${r.title} | ${r.category} | ${r.difficulty} |`)
  lines.push('')

  lines.push('## 5. 레벨별 카테고리 분포')
  lines.push('')
  const allCategories = [...new Set(economicBites.map((b) => b.category))]
  lines.push(`| 레벨 | ${allCategories.join(' | ')} |`)
  lines.push(`|---|${allCategories.map(() => '---').join('|')}|`)
  for (const key of levelKeys) {
    const catMap = levelCategoryDist.get(key) ?? new Map()
    lines.push(`| ${key} | ${allCategories.map((c) => catMap.get(c) ?? 0).join(' | ')} |`)
  }
  lines.push('')

  fs.writeFileSync(OUTPUT_PATH, lines.join('\n'))
  console.log(`\n리포트 저장 완료: ${OUTPUT_PATH}`)

  // ── 콘솔 요약 ──
  console.log('\n========== 1. 레벨별 분포 ==========')
  console.table(levelKeys.map((k) => ({ 레벨: k, 개수: levelDist.get(k) })))

  console.log('\n========== 3. difficulty vs 레벨 불일치 ==========')
  console.table(mismatches.map((r) => ({ id: r.id, 제목: r.title, 난이도: r.difficulty, 레벨: r.level })))

  console.log('\n========== 4. 고립 노드 ==========')
  console.table(isolated.map((r) => ({ id: r.id, 제목: r.title, 카테고리: r.category, 난이도: r.difficulty })))

  console.log('\n========== 5. 레벨별 카테고리 분포 ==========')
  console.table(
    levelKeys.map((k) => {
      const catMap = levelCategoryDist.get(k) ?? new Map()
      const row = { 레벨: k }
      for (const c of allCategories) row[c] = catMap.get(c) ?? 0
      return row
    })
  )
}

main().catch((err) => {
  console.error('스크립트 실행 중 오류:', err)
  process.exit(1)
})
