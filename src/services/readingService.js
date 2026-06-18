import { supabase } from './supabaseClient'
import { callSolar } from './solarService'
import { addXp } from './profileService'

// 네이버 뉴스 HTML 엔티티 및 태그 제거
function cleanHtml(str = '') {
  return str
    .replace(/<[^>]+>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#039;/g, "'")
    .trim()
}

// Supabase news_cache 조회
async function getCachedNews(category) {
  try {
    const today = new Date().toISOString().slice(0, 10)
    const { data } = await supabase
      .from('news_cache')
      .select('data')
      .eq('category', category)
      .eq('date', today)
      .limit(1)
      .maybeSingle()
    return data?.data ?? null
  } catch {
    return null
  }
}

// Supabase news_cache 저장
async function saveCachedNews(category, articles) {
  try {
    const today = new Date().toISOString().slice(0, 10)
    await supabase.from('news_cache').insert({ category, date: today, data: articles })
  } catch (err) {
    console.warn('[news_cache] 저장 실패:', err.message)
  }
}

// 네이버 뉴스 가져오기
export async function fetchNews(query = '경제', display = 5) {
  const { data, error } = await supabase.functions.invoke('news', {
    body: { query, display },
  })
  if (error) throw error
  return data.items ?? []
}

// Solar AI로 뉴스 요약
export async function summarizeNews(article) {
  const system = `당신은 ECONOMING의 AI 코치 노밍입니다.
경제 뉴스를 경제 초보자도 이해할 수 있게 쉽게 요약합니다.

반드시 아래 JSON 형식으로만 응답하세요 (마크다운 코드블록 없이):
{
  "summary": "3문장 이내 쉬운 요약",
  "keyPoints": ["핵심 포인트 1", "핵심 포인트 2", "핵심 포인트 3"],
  "nomingComment": "노밍의 한마디 — 초보자 관점에서 이 뉴스가 왜 중요한지",
  "keywords": [{"term": "경제 용어", "explanation": "한 줄 쉬운 설명"}]
}`

  const content = await callSolar({
    system,
    messages: [{
      role: 'user',
      content: `제목: ${cleanHtml(article.title)}\n내용: ${cleanHtml(article.description)}`,
    }],
  })

  try {
    const clean = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const match = clean.match(/\{[\s\S]*\}/)
    return JSON.parse(match ? match[0] : clean)
  } catch {
    // JSON 파싱 실패 시 regex로 핵심 필드 개별 추출
    const extractStr = (key) => {
      const m = content.match(new RegExp(`"${key}"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*?)"`))
      return m?.[1] ?? null
    }
    const extractArr = (key) => {
      const m = content.match(new RegExp(`"${key}"\\s*:\\s*\\[([\\s\\S]*?)\\]`))
      if (!m) return []
      return [...m[1].matchAll(/"((?:[^"\\\\]|\\\\.)*)"/g)].map(x => x[1]).filter(Boolean)
    }

    const summary       = extractStr('summary')
    const nomingComment = extractStr('nomingComment')
    const keyPoints     = extractArr('keyPoints')

    if (summary || nomingComment) {
      return {
        summary:       summary || cleanHtml(article.description),
        keyPoints:     keyPoints.length ? keyPoints : [],
        keywords:      [],
        nomingComment: nomingComment || '이 뉴스를 꼭 읽어보세요!',
      }
    }

    console.warn('[summarizeNews] 완전 파싱 실패. Solar 응답:', content?.slice(0, 300))
    return {
      summary:       cleanHtml(article.description),
      keyPoints:     [],
      keywords:      [],
      nomingComment: '이 뉴스를 꼭 읽어보세요!',
    }
  }
}

// 뉴스 5개 가져와서 병렬 요약 (Supabase 캐시 우선)
export async function fetchAndSummarizeNews(query = '경제') {
  const cached = await getCachedNews(query)
  if (cached) return cached

  const articles = await fetchNews(query, 5)

  const results = await Promise.all(
    articles.map(article =>
      summarizeNews(article)
        .then(ai => ({ ...article, ...ai }))
        .catch(() => ({
          ...article,
          summary:       article.description,
          keyPoints:     [],
          keywords:      [],
          nomingComment: '',
        }))
    )
  )

  saveCachedNews(query, results)  // 비동기, 결과 대기 안 함
  return results
}

// 읽기 완료 처리 (XP 지급)
export async function markAsRead(userId) {
  if (!userId) return { success: false }
  try {
    await addXp(userId, 5)
    return { success: true, xpGranted: 5 }
  } catch {
    return { success: false }
  }
}
