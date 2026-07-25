#!/usr/bin/env node
/**
 * "콘텐츠를 몇 개 더 만들면 기사 단위 커버리지가 얼마나 오르는가" 한계 효용 곡선.
 * AI 호출 없이 캐시(keywords/classification/alias-verify)만으로 계산한다.
 *
 * 기준선(현재 21.6%) = Tier 1(제목 완전 일치) + 사람 검토를 통과한 ALIAS 5개.
 * 그 위에, Tier 1 미매칭이면서 아직 ALIAS로 해소되지 않은 개념을 빈도 내림차순으로
 * 정렬해 상위 N개를 "새로 콘텐츠를 만들었다"고 가정하고 기사 단위 커버리지를 다시 계산한다.
 *
 * 실행: node scripts/marginal-utility-curve.mjs
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
const N_STEPS = [1, 3, 5, 10, 15, 20, 30, 50, 100]

// ── analyze-content-gap.mjs와 동일한 정규화/집계 로직 (일관성을 위해 복제) ──

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
      if (!agg.has(key)) agg.set(key, { displayRaw: rawConcept, count: 0, articleTitleSet: new Set() })
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

function articleCoverage(concepts, coveredKeySet, totalArticles) {
  const articleSet = new Set()
  let freqCovered = 0
  for (const c of concepts) {
    if (!coveredKeySet.has(canonicalKey(c.concept))) continue
    freqCovered += c.count
    for (const t of c.articleTitleSet) articleSet.add(t)
  }
  return { articleCovered: articleSet.size, articlePct: totalArticles ? (articleSet.size / totalArticles) * 100 : 0, freqCovered }
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

const finalAliasKeys = new Set(
  verifyCache.results.filter((r) => r.verdict === 'O' && r.confidence === 'HIGH').map((r) => canonicalKey(r.term))
)

// 기준선 = Tier 1 + 검증된 ALIAS 5개
const baselineKeys = new Set()
for (const c of concepts) {
  const key = canonicalKey(c.concept)
  if (c.isTier1 || finalAliasKeys.has(key)) baselineKeys.add(key)
}
const baseline = articleCoverage(concepts, baselineKeys, totalArticles)

// 콘텐츠 제작 후보군: Tier1도 아니고 ALIAS로도 해소 안 된 것들 (진짜 "새 콘텐츠 필요" 대상)
const gapPool = concepts
  .filter((c) => !c.isTier1 && !finalAliasKeys.has(canonicalKey(c.concept)))
  .sort((a, b) => b.count - a.count)

console.log(`기준선(Tier 1 + 검증된 ALIAS 5개) 기사 단위 커버리지: ${baseline.articleCovered}/${totalArticles} (${baseline.articlePct.toFixed(1)}%)`)
console.log(`콘텐츠 제작 후보군(Tier1도 ALIAS도 아닌 진짜 갭): ${gapPool.length}개`)
console.log('')

const rows = []
for (const N of N_STEPS) {
  const topN = gapPool.slice(0, Math.min(N, gapPool.length))
  const keys = new Set([...baselineKeys, ...topN.map((c) => canonicalKey(c.concept))])
  const cov = articleCoverage(concepts, keys, totalArticles)
  rows.push({ N, articleCovered: cov.articleCovered, articlePct: cov.articlePct, lift: cov.articlePct - baseline.articlePct })
}

console.log('## N별 기사 단위 커버리지')
console.log('')
console.log('| N (상위 콘텐츠 개수) | 기사 단위 커버리지 | 기준선 대비 상승폭 |')
console.log('|---|---|---|')
console.log(`| 0 (기준선) | ${baseline.articleCovered}/${totalArticles} (${baseline.articlePct.toFixed(1)}%) | - |`)
for (const r of rows) {
  console.log(`| ${r.N} | ${r.articleCovered}/${totalArticles} (${r.articlePct.toFixed(1)}%) | +${r.lift.toFixed(1)}%p |`)
}
console.log('')

console.log('## 구간별 한계 비용 (커버리지 1%p 오르는 데 필요한 콘텐츠 개수)')
console.log('')
console.log('| 구간 | 콘텐츠 추가 개수 | 커버리지 상승폭 | 콘텐츠 1개당 상승 | 1%p당 필요 콘텐츠 개수 |')
console.log('|---|---|---|---|---|')

const allPoints = [{ N: 0, articlePct: baseline.articlePct }, ...rows.map((r) => ({ N: r.N, articlePct: r.articlePct }))]
const marginalRows = []
for (let i = 1; i < allPoints.length; i++) {
  const prev = allPoints[i - 1]
  const curr = allPoints[i]
  const deltaN = curr.N - prev.N
  const deltaPct = curr.articlePct - prev.articlePct
  const perContent = deltaN ? deltaPct / deltaN : 0
  const perPoint = deltaPct ? deltaN / deltaPct : Infinity
  marginalRows.push({ from: prev.N, to: curr.N, deltaN, deltaPct, perContent, perPoint })
  console.log(
    `| ${prev.N}→${curr.N} | ${deltaN}개 | +${deltaPct.toFixed(1)}%p | ${perContent.toFixed(2)}%p/개 | ${Number.isFinite(perPoint) ? perPoint.toFixed(1) : '∞'}개/%p |`
  )
}
console.log('')

// 완만해지기 시작하는 지점: 콘텐츠 1개당 상승폭(perContent)이 직전 구간보다 눈에 띄게(30% 이상) 떨어지는 첫 지점
let elbow = null
for (let i = 1; i < marginalRows.length; i++) {
  const prevRate = marginalRows[i - 1].perContent
  const currRate = marginalRows[i].perContent
  if (prevRate > 0 && currRate < prevRate * 0.7) {
    elbow = marginalRows[i]
    break
  }
}

console.log('## 곡선이 완만해지는 지점')
console.log('')
if (elbow) {
  console.log(`N=${elbow.from} 근처부터 한계 효용이 뚜렷하게 꺾여요 — 그 구간(${elbow.from}→${elbow.to})에서 콘텐츠 1개당 커버리지 상승폭이 직전 구간보다 30% 넘게 떨어졌어요 (${marginalRows[marginalRows.findIndex(m=>m===elbow)-1]?.perContent.toFixed(2)}%p/개 → ${elbow.perContent.toFixed(2)}%p/개).`)
} else {
  console.log('뚜렷한 꺾임 지점을 못 찾았어요 — 구간별 상승폭 표를 보고 직접 판단해줘.')
}
