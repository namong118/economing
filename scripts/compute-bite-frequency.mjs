#!/usr/bin/env node
/**
 * 기존 70개 한잎 각각의 뉴스 매칭 빈도(Tier 2: 제목+relatedTerms)를 계산한다.
 * keywords.json 캐시만 사용, AI 재호출 없음.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import economicBites from '../src/data/economicBites.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const KEYWORDS_CACHE_PATH = path.join(__dirname, '.cache', 'keywords.json')

const TRAILING_PARTICLES = ['으로', '이', '가', '은', '는', '을', '를', '의', '에', '도', '만', '과', '와', '로'].sort((a, b) => b.length - a.length)
function stripWhitespace(s) { return s.replace(/\s+/g, '') }
function splitParenthetical(s) {
  const m = s.match(/^(.*?)\(([^)]*)\)(.*)$/)
  if (!m) return [s]
  const [, before, inside, after] = m
  return [(before + after).trim(), inside.trim()].filter(Boolean)
}
function stripTrailingParticle(s) {
  for (const p of TRAILING_PARTICLES) if (s.length > p.length + 1 && s.endsWith(p)) return s.slice(0, -p.length)
  return null
}
function variants(raw) {
  const out = new Set()
  for (const part of splitParenthetical(raw)) {
    const cleaned = stripWhitespace(part).toUpperCase()
    if (cleaned) { out.add(cleaned); const s = stripTrailingParticle(cleaned); if (s) out.add(s) }
  }
  return out
}
function canonicalKey(raw) {
  const outer = splitParenthetical(raw)[0] ?? raw
  const cleaned = stripWhitespace(outer).toUpperCase()
  return stripTrailingParticle(cleaned) ?? cleaned
}

const keywordsCache = JSON.parse(fs.readFileSync(KEYWORDS_CACHE_PATH, 'utf-8'))
const agg = new Map()
for (const batch of keywordsCache.batches) {
  for (const { concept, articles } of batch.concepts) {
    const key = canonicalKey(concept)
    if (!key) continue
    if (!agg.has(key)) agg.set(key, { count: 0 })
    agg.get(key).count += articles.length || 1
  }
}

// Tier2 인덱스: title + relatedTerms 전부
const index = new Map()
for (const b of economicBites) {
  for (const term of [b.title, ...(b.relatedTerms ?? [])]) {
    for (const v of variants(term)) {
      if (!index.has(v)) index.set(v, [])
      index.get(v).push(b.id)
    }
  }
}

const freqById = new Map()
for (const [key, entry] of agg) {
  const matchedIds = index.get(key)
  if (!matchedIds) continue
  for (const id of matchedIds) freqById.set(id, (freqById.get(id) ?? 0) + entry.count)
}

const rows = economicBites.map((b) => ({
  id: b.id, title: b.title, category: b.category, difficulty: b.difficulty, freq: freqById.get(b.id) ?? 0,
}))
rows.sort((a, b) => b.freq - a.freq)
console.log(JSON.stringify(rows, null, 2))

console.log('\n--- difficulty distribution ---')
const diffCount = {}
for (const b of economicBites) diffCount[b.difficulty] = (diffCount[b.difficulty] ?? 0) + 1
console.log(diffCount)

console.log('\n--- hard-tagged bites (all) ---')
for (const b of economicBites.filter((b) => b.difficulty === 'hard')) {
  console.log(b.id, b.title, b.category, 'freq=', freqById.get(b.id) ?? 0)
}
