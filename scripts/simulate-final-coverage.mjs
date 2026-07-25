#!/usr/bin/env node
/**
 * ALIAS 사람 검토(alias-verify.json)까지 반영한 최종 커버리지 시뮬레이션.
 * AI를 다시 호출하지 않고, 이미 저장된 캐시들만 읽어서 계산한다.
 *
 * 비교 3종:
 *   - 현재값            : Tier 1(제목 완전 일치)만
 *   - 1차 시뮬레이션      : Tier 1 + ALIAS 38개 전부 유효하다고 가정
 *   - 최종(정제 후)       : Tier 1 + 사람 검토를 통과한 ALIAS 5개만 반영
 *
 * 실행: node scripts/simulate-final-coverage.mjs
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

const ALL_CONTENT = [...economicBites, ...indicatorsData]

// ── analyze-content-gap.mjs와 동일한 정규화/집계 로직 (일관성을 위해 그대로 복제) ──

const TRAILING_PARTICLES = ['으로', '이', '가', '은', '는', '을', '를', '의', '에', '도', '만', '과', '와', '로'].sort(
  (a, b) => b.length - a.length
)

function stripWhitespace(s) {
  return s.replace(/\s+/g, '')
}

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

function aggregateConcepts(batches) {
  const agg = new Map()
  for (const batch of batches) {
    for (const { concept: rawConcept, articles: positions } of batch.concepts) {
      const key = canonicalKey(rawConcept)
      if (!key) continue
      if (!agg.has(key)) {
        agg.set(key, { displayRaw: rawConcept, count: 0, articleTitleSet: new Set() })
      }
      const entry = agg.get(key)
      const occurrences = positions.length || 1
      entry.count += occurrences
      for (const pos of positions) {
        const title = batch.articleTitles[pos - 1]
        if (title) entry.articleTitleSet.add(title)
      }
    }
  }
  return agg
}

function tier1Match(concept, tier1Index) {
  for (const v of primaryVariants(concept)) if (tier1Index.has(v)) return true
  for (const v of particleStrippedVariants(concept)) if (tier1Index.has(v)) return true
  return false
}

function computeCoverage(concepts, predicate, totalArticles, totalFreq) {
  const covered = concepts.filter(predicate)
  const freqCovered = covered.reduce((s, c) => s + c.count, 0)
  const articleSet = new Set()
  for (const c of covered) for (const t of c.articleTitleSet) articleSet.add(t)
  const total = concepts.length
  return {
    uniqueCovered: covered.length,
    uniqueTotal: total,
    uniquePct: total ? (covered.length / total) * 100 : 0,
    freqCovered,
    freqTotal: totalFreq,
    freqPct: totalFreq ? (freqCovered / totalFreq) * 100 : 0,
    articleCovered: articleSet.size,
    articleTotal: totalArticles,
    articlePct: totalArticles ? (articleSet.size / totalArticles) * 100 : 0,
  }
}

function fmt(cov) {
  return `${cov.uniqueCovered}/${cov.uniqueTotal} (${cov.uniquePct.toFixed(1)}%) | ${cov.freqCovered}/${cov.freqTotal} (${cov.freqPct.toFixed(1)}%) | ${cov.articleCovered}/${cov.articleTotal} (${cov.articlePct.toFixed(1)}%)`
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

const concepts = [...agg.values()].map((entry) => ({
  concept: entry.displayRaw,
  count: entry.count,
  articleTitleSet: entry.articleTitleSet,
  isTier1: tier1Match(entry.displayRaw, tier1Index),
}))

const totalArticles = new Set(keywordsCache.batches.flatMap((b) => b.articleTitles)).size
const totalFreq = concepts.reduce((s, c) => s + c.count, 0)

const all38AliasKeys = new Set(
  classifyCache.results.filter((r) => r.verdict === 'ALIAS').map((r) => canonicalKey(r.term))
)
const finalAliasTerms = verifyCache.results.filter((r) => r.verdict === 'O' && r.confidence === 'HIGH').map((r) => r.term)
const finalAliasKeys = new Set(finalAliasTerms.map((t) => canonicalKey(t)))

const currentCov = computeCoverage(concepts, (c) => c.isTier1, totalArticles, totalFreq)
const firstSimCov = computeCoverage(concepts, (c) => c.isTier1 || all38AliasKeys.has(canonicalKey(c.concept)), totalArticles, totalFreq)
const finalCov = computeCoverage(concepts, (c) => c.isTier1 || finalAliasKeys.has(canonicalKey(c.concept)), totalArticles, totalFreq)

console.log(`최종 반영 ALIAS(사람 검토 통과, ${finalAliasTerms.length}개): ${finalAliasTerms.join(', ')}`)
console.log('')
console.log('| 구분 | 고유 개념 커버리지 | 빈도 가중 커버리지 | 기사 단위 커버리지 |')
console.log('|---|---|---|---|')
console.log(`| 현재값 (Tier 1) | ${fmt(currentCov)} |`)
console.log(`| 1차 시뮬레이션 (ALIAS 38건 전부) | ${fmt(firstSimCov)} |`)
console.log(`| 최종 (정제 후 ALIAS ${finalAliasTerms.length}건) | ${fmt(finalCov)} |`)
