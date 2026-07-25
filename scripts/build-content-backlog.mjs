#!/usr/bin/env node
/**
 * 갭 분석 캐시(keywords/classification/alias-verify)로부터 콘텐츠 제작 백로그를
 * docs/content-backlog.md로 뽑아낸다. scripts/output/은 .gitignore 대상이라
 * 유실될 수 있으므로, 콘텐츠 제작 우선순위 원천 목록만 docs/에 영구 보존한다.
 *
 * 대상 = Tier 1 미매칭이면서 사람 검토를 통과한 ALIAS(5개)로도 해소되지 않은
 * "진짜 갭" 224개. AI 재호출 없음.
 *
 * 실행: node scripts/build-content-backlog.mjs
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import economicBites from '../src/data/economicBites.js'
import indicatorsData from '../src/data/indicatorsData.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const KEYWORDS_CACHE_PATH = path.join(__dirname, '.cache', 'keywords.json')
const CLASSIFY_CACHE_PATH = path.join(__dirname, '.cache', 'classification.json')
const VERIFY_CACHE_PATH = path.join(__dirname, '.cache', 'alias-verify.json')
const OUTPUT_PATH = path.join(__dirname, '..', 'docs', 'content-backlog.md')

const ALL_CONTENT = [...economicBites, ...indicatorsData]

const QUERY_TO_CONTENT_CATEGORY = {
  '금리': '금리', '증시': '투자', '주식': '투자', '투자': '투자', '부동산': '부동산',
  '환율': '거시경제', '물가': '거시경제', '글로벌경제': '거시경제', '세금': '실생활경제',
  '수출': '거시경제', '가계부채': '실생활경제', '경제': null, '미국경제': null,
}

// ── analyze-content-gap.mjs와 동일한 정규화/집계 로직 (일관성을 위해 복제) ──

const TRAILING_PARTICLES = ['으로', '이', '가', '은', '는', '을', '를', '의', '에', '도', '만', '과', '와', '로'].sort((a, b) => b.length - a.length)

function stripWhitespace(s) { return s.replace(/\s+/g, '') }

function splitParenthetical(s) {
  const m = s.match(/^(.*?)\(([^)]*)\)(.*)$/)
  if (!m) return [s]
  const [, before, inside, after] = m
  return [(before + after).trim(), inside.trim()].filter(Boolean)
}

function stripTrailingParticle(s) {
  for (const p of TRAILING_PARTICLES) {
    if (s.length > p.length + 1 && s.endsWith(p)) return s.slice(0, -p.length)
  }
  return null
}

function primaryVariants(raw) {
  const variants = new Set()
  for (const part of splitParenthetical(raw)) {
    const cleaned = stripWhitespace(part).toUpperCase()
    if (cleaned) variants.add(cleaned)
  }
  return [...variants]
}

function particleStrippedVariants(raw) {
  const variants = new Set()
  for (const part of splitParenthetical(raw)) {
    const cleaned = stripWhitespace(part).toUpperCase()
    const stripped = stripTrailingParticle(cleaned)
    if (stripped) variants.add(stripped)
  }
  return [...variants]
}

function canonicalKey(raw) {
  const outer = splitParenthetical(raw)[0] ?? raw
  const cleaned = stripWhitespace(outer).toUpperCase()
  return stripTrailingParticle(cleaned) ?? cleaned
}

function buildTitleOnlyIndex(items) {
  const index = new Map()
  for (const item of items) {
    for (const variant of [...primaryVariants(item.title), ...particleStrippedVariants(item.title)]) {
      if (!index.has(variant)) index.set(variant, [])
      index.get(variant).push(item)
    }
  }
  return index
}

function tier1Match(concept, tier1Index) {
  for (const v of primaryVariants(concept)) if (tier1Index.has(v)) return true
  for (const v of particleStrippedVariants(concept)) if (tier1Index.has(v)) return true
  return false
}

function aggregateConcepts(batches) {
  const agg = new Map()
  for (const batch of batches) {
    for (const { concept: rawConcept, articles: positions } of batch.concepts) {
      const key = canonicalKey(rawConcept)
      if (!key) continue
      if (!agg.has(key)) agg.set(key, { displayRaw: rawConcept, count: 0, categories: new Map() })
      const entry = agg.get(key)
      const occurrences = positions.length || 1
      entry.count += occurrences
      entry.categories.set(batch.category, (entry.categories.get(batch.category) ?? 0) + occurrences)
    }
  }
  return agg
}

function dominantCategory(categoryCounts) {
  return [...categoryCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null
}

// ── 메인 ─────────────────────────────────────────────────────────

for (const p of [KEYWORDS_CACHE_PATH, CLASSIFY_CACHE_PATH, VERIFY_CACHE_PATH]) {
  if (!fs.existsSync(p)) {
    console.error(`필요한 캐시가 없어요: ${p}`)
    process.exit(1)
  }
}

const keywordsCache = JSON.parse(fs.readFileSync(KEYWORDS_CACHE_PATH, 'utf-8'))
const classifyCache = JSON.parse(fs.readFileSync(CLASSIFY_CACHE_PATH, 'utf-8'))
const verifyCache = JSON.parse(fs.readFileSync(VERIFY_CACHE_PATH, 'utf-8'))

const agg = aggregateConcepts(keywordsCache.batches)
const tier1Index = buildTitleOnlyIndex(ALL_CONTENT)

const finalAliasKeys = new Set(
  verifyCache.results.filter((r) => r.verdict === 'O' && r.confidence === 'HIGH').map((r) => canonicalKey(r.term))
)

const concepts = [...agg.values()].map((entry) => ({
  concept: entry.displayRaw,
  count: entry.count,
  dominantCategory: dominantCategory(entry.categories),
  isTier1: tier1Match(entry.displayRaw, tier1Index),
}))

const backlog = concepts
  .filter((c) => !c.isTier1 && !finalAliasKeys.has(canonicalKey(c.concept)))
  .sort((a, b) => b.count - a.count)

console.log(`백로그 항목 수: ${backlog.length}`)

const lines = []
lines.push('# 콘텐츠 제작 백로그')
lines.push('')
lines.push(
  `이 목록은 네이버 뉴스 기사 ${keywordsCache.meta.totalArticleCount}건(2026-07 기준)에서 Solar AI로 독립 추출한 경제 개념어 중, 기존 한잎/지표 콘텐츠(Tier 1 제목 일치)와 사람 검토를 통과한 ALIAS 5건으로도 해소되지 않는 "진짜 갭" ${backlog.length}개를 등장 빈도 내림차순으로 정리한 것이다.`
)
lines.push('')
lines.push('생성 스크립트: `scripts/build-content-backlog.mjs` (원본 분석: `scripts/analyze-content-gap.mjs`)')
lines.push('')
lines.push('| 개념어 | 등장 횟수 | 추정 카테고리 | 상태 |')
lines.push('|---|---|---|---|')
for (const c of backlog) {
  const estCategory = QUERY_TO_CONTENT_CATEGORY[c.dominantCategory] ?? c.dominantCategory ?? '미분류'
  lines.push(`| ${c.concept} | ${c.count} | ${estCategory} |  |`)
}
lines.push('')

fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true })
fs.writeFileSync(OUTPUT_PATH, lines.join('\n'))
console.log(`저장 완료: ${OUTPUT_PATH}`)
