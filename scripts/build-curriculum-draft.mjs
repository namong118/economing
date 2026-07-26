#!/usr/bin/env node
/**
 * 초보자용 경제 단어 커리큘럼 초안 생성.
 * 기존 70개 한잎 + 갭 224개 개념 중 100개를 선정해 10챕터 x 10개로 배열한다.
 * 정렬: 1) difficulty(easy->medium->hard) 2) 뉴스 등장 빈도 내림차순 3) 생활밀착도
 * (difficulty를 최우선 그룹으로 둔 이유: 뒤 챕터로 갈수록 어려워져야 한다는 5번 출력
 *  요구사항을 만족시키려면 빈도만으로 정렬 시 hard 태그 고빈도 개념(달러 인덱스 33회,
 *  경상수지 32회)이 1챕터에 오는 모순이 생기기 때문. 빈도는 같은 난이도 안에서의 순서를 정한다.)
 * AI 호출 없음 — 순수 코드 정렬 + 수작업 큐레이션 데이터.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import economicBites from '../src/data/economicBites.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DIFF_RANK = { easy: 0, medium: 1, hard: 2 }

// ---------- 1. 기존 70개 중 제외 ----------
const EXCLUDED_HARD_IDS = [30, 39, 52, 54, 55]
const EXCLUSION_REASONS = {
  30: 'PER — 투자 분석 지표. 뉴스 등장 빈도 1회로 낮고, 손익/재무제표 이해가 선행되어야 해 초보자 100개 밖 심화로 분류.',
  39: '재무제표 — 회계 기초 지식이 선행되어야 하는 심화 개념. 빈도 1회.',
  52: '할인율 — 채권/현재가치 계산 개념으로 진입장벽이 높음. 빈도 2회.',
  54: '주가수익비율(PBR) — PER와 함께 봐야 의미가 있는 심화 투자지표. 빈도 1회.',
  55: '경제적 해자 — 기업 분석 개념으로 실질적 뉴스 등장 빈도가 거의 없음(1회).',
}

// ---------- 2. 신규 개념 35개 (docs/content-backlog.md 224개 중 큐레이션) ----------
// freq: 갭 목록 등장 횟수(중복 표현은 합산). life: 생활밀착도 1(이론)~3(직접 경험).
const NEW_CONCEPTS = [
  { title: '금리', freq: 41, difficulty: 'easy', life: 3, note: '기준금리보다 더 기초인 "이자율" 개념 자체. 현재 최상위 빈도.' },
  { title: '대출 규제', freq: 40, difficulty: 'easy', life: 3, note: 'LTV/DSR 등 6개 유사 표현(대출 규제 강화/예외/영향 등) 통합.' },
  { title: '가계부채', freq: 44, difficulty: 'easy', life: 3, note: '가계부채 관리/가계대출/가계신용 통합.' },
  { title: '세금', freq: 21, difficulty: 'easy', life: 3, note: '소득세·부가가치세 등 개별 세금 이전에 배우는 개관 개념.' },
  { title: '부동산', freq: 19, difficulty: 'easy', life: 3, note: '부동산 카테고리 개관 — 기존 청약/전세 2개뿐이라 보강 필요.' },
  { title: '투자', freq: 11, difficulty: 'easy', life: 2, note: 'ETF/주식 등 개별 투자 상품 이전의 개관 개념.' },
  { title: '보유세(재산세·종합부동산세)', freq: 12, difficulty: 'medium', life: 2, note: '보유세 10 + 종합부동산세 2 통합.' },
  { title: '국채 금리', freq: 6, difficulty: 'medium', life: 1, note: '기준금리(정책금리)와 다른 시장금리 개념 — 흔한 초보자 혼동 지점.' },
  { title: '거래세', freq: 5, difficulty: 'medium', life: 2 },
  { title: '유류세', freq: 4, difficulty: 'easy', life: 3, note: '기존 71(기름값)의 세금 구성 요소.' },
  { title: '관세', freq: 3, difficulty: 'medium', life: 1, note: '무역수지(32) 존재하지만 정책 수단인 관세 자체는 갭.' },
  { title: '대출금리', freq: 2, difficulty: 'easy', life: 3, note: '기준금리와 실제 내가 내는 금리가 다르다는 것.' },
  { title: '양도소득세', freq: 3, difficulty: 'medium', life: 2, note: '양도세 2 + 상속세 섹션 편법증여 일부 통합. 보유세와 달리 "팔 때" 내는 세금.' },
  { title: '주택담보대출(LTV)', freq: 3, difficulty: 'easy', life: 3, note: '주택담보대출 2 + LTV(주택담보인정비율) 1 통합.' },
  { title: '비트코인·암호화폐', freq: 5, difficulty: 'easy', life: 2, note: '암호화폐 투자 2 + 비트코인 1 + 비트코인 ETF 1 + 채굴 1 통합.' },
  { title: '금리인하요구권', freq: 1, difficulty: 'easy', life: 3, note: '빈도는 낮지만 실생활 활용도가 높아 포함(생활밀착도 우선).' },
  { title: '개인형퇴직연금(IRP)', freq: 1, difficulty: 'medium', life: 3, note: '기존 퇴직연금(31)/연금(16)의 실천형 상품.' },
  { title: '마이너스통장', freq: 1, difficulty: 'easy', life: 3 },
  { title: '가산금리', freq: 1, difficulty: 'medium', life: 2, note: '대출금리 = 기준금리 + 가산금리 구조 이해.' },
  { title: '파킹통장', freq: 1, difficulty: 'easy', life: 3 },
  { title: 'ESG 투자', freq: 2, difficulty: 'medium', life: 1, note: 'ESG 1 + ESG 경영 1 통합.' },
  { title: '서학개미', freq: 1, difficulty: 'easy', life: 2, note: '해외주식 투자 문화 — 구조적 트렌드로 판단, 유행어 아님.' },
  { title: '보험', freq: 1, difficulty: 'easy', life: 3, note: '기존 4대보험(56)의 상위 개념(위험 분산 원리).' },
  { title: '자산관리', freq: 1, difficulty: 'medium', life: 2, note: '실전 마무리용 개념 — 챕터 후반 배치.' },
  { title: '상속세·증여세', freq: 4, difficulty: 'medium', life: 1, note: '상속세 1 + 편법 증여 3 통합.' },
  { title: '탄력성', freq: 0, difficulty: 'medium', life: 1, note: 'relatedTerms 깨진 참조 정리 중 발견된 개념. 수요와 공급(26)의 확장.' },
  { title: '독점', freq: 0, difficulty: 'easy', life: 2, note: 'relatedTerms 발견분. 규모의 경제(42)의 확장, 통신사·배달앱 등 체감 사례 풍부.' },
  { title: '순자산', freq: 0, difficulty: 'easy', life: 3, note: 'relatedTerms 발견분. 자산(43)-부채(44)의 자연스러운 합.' },
  { title: '빅스텝', freq: 1, difficulty: 'medium', life: 1, note: '기준금리 인상 폭을 가리키는 관용어 — 뉴스 빈출.' },
  { title: '로보어드바이저', freq: 1, difficulty: 'medium', life: 1 },
  { title: '자사주 매입', freq: 1, difficulty: 'medium', life: 1 },
  { title: '원자재가격', freq: 1, difficulty: 'medium', life: 1, note: '유가/금 가격을 묶는 상위 개념.' },
  { title: '재개발·재건축', freq: 1, difficulty: 'medium', life: 2, note: '부동산 카테고리 보강.' },
  { title: '공급망', freq: 1, difficulty: 'medium', life: 1, note: '반도체/요소수 사태 등 지속적으로 재등장하는 구조적 개념.' },
  { title: '비과세 혜택', freq: 1, difficulty: 'easy', life: 3 },
]

if (NEW_CONCEPTS.length !== 35) throw new Error(`NEW_CONCEPTS 개수 오류: ${NEW_CONCEPTS.length}`)

// ---------- 3. 기존 70개 빈도 (compute-bite-frequency.mjs 결과, 하드코딩 대신 재계산) ----------
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
const keywordsCache = JSON.parse(fs.readFileSync(path.join(__dirname, '.cache', 'keywords.json'), 'utf-8'))
const agg = new Map()
for (const batch of keywordsCache.batches) {
  for (const { concept, articles } of batch.concepts) {
    const key = canonicalKey(concept)
    if (!key) continue
    if (!agg.has(key)) agg.set(key, 0)
    agg.set(key, agg.get(key) + (articles.length || 1))
  }
}
const titleIndex = new Map()
for (const b of economicBites) {
  for (const term of [b.title, ...(b.relatedTerms ?? [])]) {
    for (const v of variants(term)) {
      if (!titleIndex.has(v)) titleIndex.set(v, [])
      titleIndex.get(v).push(b.id)
    }
  }
}
const freqById = new Map()
for (const [key, count] of agg) {
  const ids = titleIndex.get(key)
  if (!ids) continue
  for (const id of ids) freqById.set(id, (freqById.get(id) ?? 0) + count)
}

// 생활밀착도 기본값 (카테고리 기반, 필요시 개별 보정)
const LIFE_BY_CATEGORY = { 실생활경제: 3, 저축: 3, 부동산: 3, 금리: 2, 거시경제: 2, 기초: 1, 투자: 1 }
const LIFE_OVERRIDE = { 47: 3, 46: 3, 53: 3, 44: 3, 56: 3, 51: 2, 24: 2, 25: 2 }

// ---------- 4. 후보 풀 구성 ----------
const existingKept = economicBites
  .filter((b) => !EXCLUDED_HARD_IDS.includes(b.id))
  .map((b) => ({
    kind: 'existing',
    id: b.id,
    title: b.title,
    category: b.category,
    difficulty: b.difficulty,
    freq: freqById.get(b.id) ?? 0,
    life: LIFE_OVERRIDE[b.id] ?? LIFE_BY_CATEGORY[b.category] ?? 1,
    body: `${b.description ?? ''} ${b.whyImportant ?? ''}`,
  }))

const newItems = NEW_CONCEPTS.map((c) => ({
  kind: 'new',
  id: null,
  title: c.title,
  category: null,
  difficulty: c.difficulty,
  freq: c.freq,
  life: c.life,
  body: '',
  note: c.note ?? '',
}))

if (existingKept.length !== 65) throw new Error(`existingKept 개수 오류: ${existingKept.length}`)

const pool = [...existingKept, ...newItems]
if (pool.length !== 100) throw new Error(`최종 후보 개수 오류: ${pool.length}`)

// ---------- 5. 정렬 ----------
pool.sort((a, b) => {
  const d = DIFF_RANK[a.difficulty] - DIFF_RANK[b.difficulty]
  if (d !== 0) return d
  if (b.freq !== a.freq) return b.freq - a.freq
  return b.life - a.life
})

// ---------- 6. 10챕터 분할 ----------
const CHAPTER_NAMES = [
  '1. 빚·세금·물가 — 뉴스에 가장 많이 나오는 말',
  '2. 저축과 투자를 시작하기 전에',
  '3. 통장과 투자 상품 이름',
  '4. 경제 기초 체력 다지기',
  '5. 값이 오르내리는 이유',
  '6. 집을 사고팔 때 알아야 할 것',
  '7. 자산을 굴리는 법',
  '8. 노후 준비와 자산 관리',
  '9. 시장을 흔드는 신호들',
  '10. 국제 경제와 고급 개념',
]

const chapters = []
for (let i = 0; i < 10; i++) {
  chapters.push({ name: CHAPTER_NAMES[i], items: pool.slice(i * 10, i * 10 + 10) })
}

// ---------- 7. 순서 위반 검사 (코드 전용, AI 없음) ----------
const chapterOfTitle = new Map()
chapters.forEach((ch, idx) => {
  for (const item of ch.items) chapterOfTitle.set(item.title, idx)
})

function titleAppearsIn(title, text) {
  if (!text) return false
  const shortTitleThreshold = 2
  // 괄호 안 별칭도 검사 대상에 포함 (예: "소비자물가지수(CPI)" -> "CPI")
  const forms = splitParenthetical(title).map(stripWhitespace).filter((s) => s.length > 0)
  for (const form of forms) {
    if (form.length <= shortTitleThreshold) {
      const escaped = form.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const boundaryBefore = '(^|[\\s,.·\\(\\)\\[\\]"\'!?])'
      const boundaryAfter = '($|[\\s,.·\\(\\)\\[\\]"\'!?이가은는을를의에도만과와로])'
      const re = new RegExp(boundaryBefore + escaped + boundaryAfter)
      if (re.test(text)) return true
    } else {
      if (text.includes(form)) return true
    }
  }
  return false
}

const violations = []
for (const item of existingKept) {
  const myChapter = chapterOfTitle.get(item.title)
  if (myChapter === undefined) continue
  for (const other of pool) {
    if (other.title === item.title) continue
    const otherChapter = chapterOfTitle.get(other.title)
    if (otherChapter === undefined || otherChapter <= myChapter) continue
    if (titleAppearsIn(other.title, item.body)) {
      violations.push({
        from: item.title, fromChapter: myChapter + 1,
        mentions: other.title, mentionsChapter: otherChapter + 1,
      })
    }
  }
}

// ---------- 8. 출력 ----------
const lines = []
lines.push('# 초보자용 경제 단어 커리큘럼 초안')
lines.push('')
lines.push(`생성 시각: ${new Date().toISOString()}`)
lines.push('')
lines.push('정렬 기준: ① 난이도(easy→medium→hard, 챕터가 뒤로 갈수록 어려워지도록) ② 같은 난이도 안에서 뉴스 등장 빈도 내림차순 ③ 생활밀착도')
lines.push('')
lines.push('> 참고: 난이도를 최우선으로 정렬했기 때문에 챕터 이름은 기존 7개 카테고리처럼 단일 주제로 깔끔하게 묶이지 않는다.')
lines.push('> (예: 1챕터는 "대출·세금·부동산·금리"가 섞여 있음 — 공통점은 "빈도가 높고 쉬운 말"이라는 것.)')
lines.push('> 빈도를 최우선으로 하면 챕터별 주제는 더 깔끔해지지만, 달러 인덱스(33회)·경상수지(32회) 같은 hard 개념이 1챕터에 오게 되어')
lines.push('> "뒤로 갈수록 어려워야 한다"는 요구와 충돌한다. 두 기준은 동시에 만족시킬 수 없어 난이도를 우선했다.')
lines.push('')
lines.push('## 1. 챕터 구성 (10챕터 × 10개, 100개)')
lines.push('')
chapters.forEach((ch) => {
  lines.push(`### ${ch.name}`)
  lines.push('')
  lines.push('| 제목 | 기존 한잎 | 뉴스 빈도 | 난이도 |')
  lines.push('|---|---|---|---|')
  for (const it of ch.items) {
    lines.push(`| ${it.title} | ${it.kind === 'existing' ? `있음(id ${it.id})` : '없음'} | ${it.freq} | ${it.difficulty} |`)
  }
  lines.push('')
})

const newContentNeeded = pool.filter((it) => it.kind === 'new')
lines.push('## 2. 신규 제작 필요 목록')
lines.push('')
lines.push(`총 ${newContentNeeded.length}개 — 기존 한잎이 없어 새로 만들어야 하는 콘텐츠.`)
lines.push('')
lines.push('| 제목 | 뉴스 빈도 | 난이도 | 비고 |')
lines.push('|---|---|---|---|')
for (const it of newContentNeeded) {
  const note = NEW_CONCEPTS.find((c) => c.title === it.title)?.note ?? ''
  lines.push(`| ${it.title} | ${it.freq} | ${it.difficulty} | ${note} |`)
}
lines.push('')

lines.push('## 3. 제외한 기존 한잎')
lines.push('')
lines.push(`총 ${EXCLUDED_HARD_IDS.length}개 — 70개 중 커리큘럼(100개)에 포함하지 않은 항목과 이유.`)
lines.push('')
lines.push('| id | 제목 | 이유 |')
lines.push('|---|---|---|')
for (const id of EXCLUDED_HARD_IDS) {
  const b = economicBites.find((x) => x.id === id)
  lines.push(`| ${id} | ${b.title} | ${EXCLUSION_REASONS[id]} |`)
}
lines.push('')

lines.push('## 4. 순서 위반 목록')
lines.push('')
lines.push('> 검사 방법: 기존 한잎(신규 개념 제외 — 본문이 없어 검사 불가)의 description+whyImportant 본문에서 뒤 챕터 항목의 제목이')
lines.push('> 문자열로 등장하는지 확인. 2글자 이하 제목은 공백/문장부호/조사 경계가 있을 때만 인정(오탐 방지).')
lines.push('> 주의: 이 검사는 "본문에 언급됨"을 찾는 것이지 "이해에 반드시 필요함"을 판별하는 것은 아니다.')
lines.push('> 예를 들어 "투자"·"예금"처럼 흔한 일반 명사가 뒤 챕터에 배치되면, 앞 항목 본문에 그 단어가 스쳐 지나가듯')
lines.push('> 등장하기만 해도 위반으로 잡힌다. 실제로 순서를 바꿔야 하는 건인지는 아래 목록을 사람이 검토해서 판단할 것.')
lines.push('')
if (violations.length === 0) {
  lines.push('위반 없음 — 앞 챕터의 어떤 항목도 뒤 챕터 항목을 본문에서 언급하지 않는다.')
} else {
  lines.push(`총 ${violations.length}건 — 자동으로 순서를 바꾸지 않았다. 검토 후 수동으로 조정할 것.`)
  lines.push('')
  lines.push('| 앞 항목(챕터) | → 본문에서 언급하는 뒤 항목(챕터) |')
  lines.push('|---|---|')
  for (const v of violations) {
    lines.push(`| ${v.from} (${v.fromChapter}챕터) | ${v.mentions} (${v.mentionsChapter}챕터) |`)
  }
}
lines.push('')

lines.push('## 5. 챕터별 난이도 분포')
lines.push('')
lines.push('| 챕터 | easy | medium | hard |')
lines.push('|---|---|---|---|')
chapters.forEach((ch) => {
  const c = { easy: 0, medium: 0, hard: 0 }
  for (const it of ch.items) c[it.difficulty]++
  lines.push(`| ${ch.name} | ${c.easy} | ${c.medium} | ${c.hard} |`)
})
lines.push('')

const outPath = path.join(__dirname, 'output', 'curriculum-draft.md')
fs.writeFileSync(outPath, lines.join('\n'))
console.log(`작성 완료: ${outPath}`)
console.log(`신규 제작 필요: ${newContentNeeded.length}개`)
console.log(`제외한 기존 한잎: ${EXCLUDED_HARD_IDS.length}개`)
console.log(`순서 위반: ${violations.length}건`)
