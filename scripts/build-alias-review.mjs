#!/usr/bin/env node
/**
 * ALIAS 사람 검토용 리뷰 파일 생성
 *
 * scripts/.cache/classification.json에 이미 저장된 분류 결과(캐시)를 읽어서
 * ALIAS 38개를 사람이 O/X로 검토할 수 있는 표로 정리한다. AI를 다시 호출하지 않는다.
 *
 * 실행: node scripts/build-alias-review.mjs
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import economicBites from '../src/data/economicBites.js'
import indicatorsData from '../src/data/indicatorsData.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CLASSIFY_CACHE_PATH = path.join(__dirname, '.cache', 'classification.json')
const OUTPUT_PATH = path.join(__dirname, 'output', 'alias-review.md')

const ALL_CONTENT = [...economicBites, ...indicatorsData]

// 뉴스 개념어가 카테고리 이름 자체와 같으면 "너무 포괄적인 ALIAS" 위험 신호
const CATEGORY_NAMES = new Set(['투자', '기초', '거시경제', '실생활경제', '저축', '금리', '부동산'])

function categoryOf(title) {
  const item = ALL_CONTENT.find((i) => i.title === title)
  return item ? item.category : '(제목 불일치 — 확인 필요)'
}

if (!fs.existsSync(CLASSIFY_CACHE_PATH)) {
  console.error(`분류 캐시가 없어요: ${CLASSIFY_CACHE_PATH} — 먼저 analyze-content-gap.mjs를 실행해줘.`)
  process.exit(1)
}

const cache = JSON.parse(fs.readFileSync(CLASSIFY_CACHE_PATH, 'utf-8'))
const aliasList = cache.results.filter((r) => r.verdict === 'ALIAS').sort((a, b) => b.count - a.count)

const lines = []
lines.push('# ALIAS 사람 검토용 리뷰')
lines.push('')
lines.push(`생성 시각: ${new Date().toISOString()}`)
lines.push(`분류 캐시 생성 시각: ${cache.meta.generatedAt}`)
lines.push('')
lines.push('## 판단 기준')
lines.push('')
lines.push('1. 두 개념이 실제로 관련 있는가')
lines.push('2. 뉴스 개념어가 카테고리급으로 너무 넓지 않은가')
lines.push('3. 그 한잎만 읽고 이 뉴스가 이해되는가')
lines.push('4. 애매하면 X')
lines.push('')
lines.push('⚠ 표시 = 뉴스 개념어가 카테고리 이름(투자/기초/거시경제/실생활경제/저축/금리/부동산)과 정확히 일치 — 너무 포괄적일 위험이 큼')
lines.push('')
lines.push('| 검토 | 뉴스 개념어 | 등장 | 대응 한잎 | 그 한잎의 카테고리 | AI 판단 근거 |')
lines.push('|---|---|---|---|---|---|')

for (const r of aliasList) {
  const flag = CATEGORY_NAMES.has(r.term.trim()) ? '⚠ ' : ''
  const mapsTo = r.mapsTo ?? '(미지정)'
  const category = r.mapsTo ? categoryOf(r.mapsTo) : '-'
  lines.push(`|  | ${flag}${r.term} | ${r.count} | ${mapsTo} | ${category} | ${r.reason} |`)
}
lines.push('')

fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true })
fs.writeFileSync(OUTPUT_PATH, lines.join('\n'))

const flaggedCount = aliasList.filter((r) => CATEGORY_NAMES.has(r.term.trim())).length
console.log(`ALIAS ${aliasList.length}개 중 ⚠ 표시(카테고리명과 일치) ${flaggedCount}개`)
console.log(`저장 완료: ${OUTPUT_PATH}`)
