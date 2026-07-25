#!/usr/bin/env node
/**
 * alias-review.md의 '검토' 열을 채운 사본을 생성한다 (원본은 건드리지 않음).
 *
 * 1단계: 기계적 규칙(AI 미사용) — maps_to 실존 검증, 카테고리명 일치 검증
 * 2단계: 나머지만 AI에게 "이 매핑이 틀렸다고 가정하고 반박해봐" 식으로 재검토
 *
 * 실행: node scripts/fill-alias-review.mjs
 */

import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import economicBites from '../src/data/economicBites.js'
import indicatorsData from '../src/data/indicatorsData.js'

config({ path: '.env.local' })

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CLASSIFY_CACHE_PATH = path.join(__dirname, '.cache', 'classification.json')
const VERIFY_CACHE_PATH = path.join(__dirname, '.cache', 'alias-verify.json')
const OUTPUT_PATH = path.join(__dirname, 'output', 'alias-review-filled.md')

const VERIFY_SCHEMA_VERSION = 1
const VERIFY_BATCH_SIZE = 5

const ALL_CONTENT = [...economicBites, ...indicatorsData]
const CATEGORY_NAMES = new Set(['투자', '기초', '거시경제', '실생활경제', '저축', '금리', '부동산'])

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY가 .env.local에 없어요.')
  process.exit(1)
}
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

function normalizeForExistenceCheck(s) {
  return s.replace(/\s+/g, '').replace(/[()]/g, '')
}

const TITLE_SET = new Set(ALL_CONTENT.map((item) => normalizeForExistenceCheck(item.title)))

function findBite(mapsTo) {
  if (!mapsTo) return null
  const norm = normalizeForExistenceCheck(mapsTo)
  return ALL_CONTENT.find((item) => normalizeForExistenceCheck(item.title) === norm) ?? null
}

// ── 1단계: 기계적 규칙 ─────────────────────────────────────────────

function ruleAFails(mapsTo) {
  if (!mapsTo) return true
  return !TITLE_SET.has(normalizeForExistenceCheck(mapsTo))
}

function ruleBFails(term) {
  return CATEGORY_NAMES.has(term.trim())
}

// ── 2단계: AI 반박 검증 ───────────────────────────────────────────

const VERIFY_SYSTEM = `다음은 "뉴스 개념어 → 기존 콘텐츠 한잎" 매핑 후보 목록이다. 각 항목에 대해 이 매핑이 틀렸다고 가정하고 틀렸을 이유를 적극적으로 찾아라.

판단 기준: 아래 제공된 그 한잎의 본문(요약/설명/왜 중요한지)만 읽은 사람이, 해당 뉴스 개념어가 등장하는 기사를 이해할 수 있는가?
- 이해할 수 있으면 verdict "O"
- 이해할 수 없거나 설명이 부족하면 verdict "X"
- confidence는 확신이 설 때만 "HIGH"를 쓰고, 조금이라도 애매하면 반드시 "LOW"로 표시해라. 애매한데 임의로 HIGH를 주는 것은 금지한다.

JSON 배열로만 응답, 다른 텍스트 금지: [{"index":1,"verdict":"O","confidence":"HIGH","reason":"한 줄"}]`

function buildVerifyContent(batch) {
  return batch
    .map(
      (item, i) => `[${i + 1}] 뉴스 개념어: "${item.term}" (${item.count}회 등장)
대응 한잎: "${item.bite.title}"
요약: ${item.bite.summary}
설명: ${item.bite.description}
왜 중요한지: ${item.bite.whyImportant}`
    )
    .join('\n\n')
}

function chunk(arr, size) {
  const out = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

async function verifyBatch(batch) {
  const { data, error } = await supabase.functions.invoke('solar', {
    body: { system: VERIFY_SYSTEM, messages: [{ role: 'user', content: buildVerifyContent(batch) }] },
  })
  if (error) {
    console.warn(`  ⚠ 검증 Solar 호출 실패: ${error.message}`)
    return []
  }
  const raw = data?.content ?? '[]'
  try {
    const clean = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const match = clean.match(/\[[\s\S]*\]/)
    const parsed = JSON.parse(match ? match[0] : clean)
    if (!Array.isArray(parsed)) return []
    const results = []
    for (const it of parsed) {
      const idx = Number(it?.index)
      if (!Number.isInteger(idx) || idx < 1 || idx > batch.length) continue
      const verdict = ['O', 'X'].includes(it?.verdict) ? it.verdict : null
      const confidence = ['HIGH', 'LOW'].includes(it?.confidence) ? it.confidence : 'LOW'
      if (!verdict) continue
      results.push({ term: batch[idx - 1].term, verdict, confidence, reason: typeof it.reason === 'string' ? it.reason : '' })
    }
    return results
  } catch {
    console.warn(`  ⚠ 검증 응답 파싱 실패, 원본 일부: ${raw.slice(0, 150)}`)
    return []
  }
}

async function verifyAll(items) {
  if (fs.existsSync(VERIFY_CACHE_PATH)) {
    const cached = JSON.parse(fs.readFileSync(VERIFY_CACHE_PATH, 'utf-8'))
    const terms = items.map((i) => i.term)
    const sameInput =
      cached.meta?.schemaVersion === VERIFY_SCHEMA_VERSION &&
      cached.meta?.terms?.length === terms.length &&
      cached.meta.terms.every((t, i) => t === terms[i])
    if (sameInput) {
      console.log(`캐시된 AI 재검토 결과를 재사용해요 (${cached.meta.generatedAt} 생성)`)
      return cached.results
    }
    console.log('입력이 달라져서 캐시를 재사용할 수 없어요 — 재검토를 진행해요.')
  }

  const results = []
  const chunks = chunk(items, VERIFY_BATCH_SIZE)
  for (let i = 0; i < chunks.length; i++) {
    process.stdout.write(`\r  AI 재검토 중... ${i + 1}/${chunks.length}`)
    results.push(...(await verifyBatch(chunks[i])))
  }
  console.log('')

  fs.mkdirSync(path.dirname(VERIFY_CACHE_PATH), { recursive: true })
  fs.writeFileSync(
    VERIFY_CACHE_PATH,
    JSON.stringify(
      { meta: { schemaVersion: VERIFY_SCHEMA_VERSION, generatedAt: new Date().toISOString(), terms: items.map((i) => i.term) }, results },
      null,
      2
    )
  )
  return results
}

// ── 메인 ─────────────────────────────────────────────────────────

async function main() {
  if (!fs.existsSync(CLASSIFY_CACHE_PATH)) {
    console.error(`분류 캐시가 없어요: ${CLASSIFY_CACHE_PATH}`)
    process.exit(1)
  }
  const cache = JSON.parse(fs.readFileSync(CLASSIFY_CACHE_PATH, 'utf-8'))
  const aliasList = cache.results.filter((r) => r.verdict === 'ALIAS').sort((a, b) => b.count - a.count)

  // "전체 등장 횟수"는 이 리뷰 대상인 ALIAS 38개 기준 (NEW/OUT은 이 리뷰의 대상이 아니므로 제외)
  const totalOccurrences = aliasList.reduce((s, r) => s + r.count, 0)

  const rows = []
  const remaining = []

  let ruleACount = 0
  let ruleBCount = 0

  for (const r of aliasList) {
    if (ruleAFails(r.mapsTo)) {
      ruleACount += 1
      rows.push({
        review: 'X',
        confidence: '규칙A',
        term: r.term,
        count: r.count,
        mapsTo: r.mapsTo ?? '(미지정)',
        category: '-',
        reason: '환각(존재하지 않는 한잎)',
      })
      continue
    }
    if (ruleBFails(r.term)) {
      ruleBCount += 1
      const bite = findBite(r.mapsTo)
      rows.push({
        review: 'X',
        confidence: '규칙B',
        term: r.term,
        count: r.count,
        mapsTo: r.mapsTo,
        category: bite?.category ?? '-',
        reason: '카테고리급 광의어',
      })
      continue
    }
    const bite = findBite(r.mapsTo)
    remaining.push({ term: r.term, count: r.count, mapsTo: r.mapsTo, bite })
  }

  console.log(`1단계 기계적 판정: 규칙A(환각) ${ruleACount}건, 규칙B(카테고리급 광의어) ${ruleBCount}건`)
  console.log(`2단계 AI 재검토 대상: ${remaining.length}건`)

  const verifyResults = await verifyAll(remaining)
  const verifyByTerm = new Map(verifyResults.map((v) => [v.term, v]))

  let oCount = 0
  let xCount = 0
  let lowCount = 0
  let lowOccurrences = 0

  for (const item of remaining) {
    const v = verifyByTerm.get(item.term)
    if (!v) {
      // AI 호출/파싱 실패로 결과 없음 — 사람이 봐야 하므로 LOW로 취급
      lowCount += 1
      lowOccurrences += item.count
      rows.push({
        review: '',
        confidence: 'LOW',
        term: item.term,
        count: item.count,
        mapsTo: item.mapsTo,
        category: item.bite?.category ?? '-',
        reason: '(AI 응답 없음 — 직접 확인 필요)',
      })
      continue
    }
    if (v.confidence === 'LOW') {
      lowCount += 1
      lowOccurrences += item.count
      rows.push({ review: '', confidence: 'LOW', term: item.term, count: item.count, mapsTo: item.mapsTo, category: item.bite?.category ?? '-', reason: v.reason })
    } else {
      if (v.verdict === 'O') oCount += 1
      else xCount += 1
      rows.push({ review: v.verdict, confidence: 'HIGH', term: item.term, count: item.count, mapsTo: item.mapsTo, category: item.bite?.category ?? '-', reason: v.reason })
    }
  }

  // LOW 항목을 표 맨 위로, 각 그룹 내부는 등장 횟수 내림차순
  const lowRows = rows.filter((r) => r.confidence === 'LOW').sort((a, b) => b.count - a.count)
  const otherRows = rows.filter((r) => r.confidence !== 'LOW').sort((a, b) => b.count - a.count)
  const orderedRows = [...lowRows, ...otherRows]

  const lines = []
  lines.push('# ALIAS 사람 검토용 리뷰 (자동 채움본)')
  lines.push('')
  lines.push(`생성 시각: ${new Date().toISOString()}`)
  lines.push('')
  lines.push('원본(scripts/output/alias-review.md)은 수정하지 않았고, 이 파일은 별도로 생성됨.')
  lines.push('')
  lines.push('## 처리 방식')
  lines.push('')
  lines.push('1. 기계적 규칙(AI 미사용): maps_to 실존 검증(규칙A), 카테고리명 일치 검증(규칙B)')
  lines.push('2. 나머지만 AI에게 "이 매핑이 틀렸다고 가정하고 반박하라" 식으로 재검토')
  lines.push('3. confidence가 LOW인 항목은 검토 열을 비워둠 — 사람이 직접 판단 (표 맨 위로 정렬됨)')
  lines.push('')
  lines.push('| 검토 | 확신도 | 뉴스 개념어 | 등장 | 대응 한잎 | 카테고리 | 판정 사유 |')
  lines.push('|---|---|---|---|---|---|---|')
  for (const r of orderedRows) {
    lines.push(`| ${r.review} | ${r.confidence} | ${r.term} | ${r.count} | ${r.mapsTo} | ${r.category} | ${r.reason} |`)
  }
  lines.push('')

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true })
  fs.writeFileSync(OUTPUT_PATH, lines.join('\n'))

  console.log(`\n========== 요약 ==========`)
  console.log(`1단계 자동 X: 규칙A ${ruleACount}건, 규칙B ${ruleBCount}건`)
  console.log(`2단계 AI 재검토: O ${oCount}건, X ${xCount}건, LOW(사람 확인 필요) ${lowCount}건`)
  const lowPct = totalOccurrences ? (lowOccurrences / totalOccurrences) * 100 : 0
  console.log(`LOW 항목의 등장 횟수 합: ${lowOccurrences} / 전체 ${totalOccurrences} (${lowPct.toFixed(1)}%)`)
  console.log(`\n저장 완료: ${OUTPUT_PATH}`)
}

main().catch((err) => {
  console.error('스크립트 실행 중 오류:', err)
  process.exit(1)
})
