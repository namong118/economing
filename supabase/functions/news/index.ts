import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { query = '경제', display = 5 } = await req.json().catch(() => ({}))
    const clientId     = Deno.env.get('NAVER_CLIENT_ID')
    const clientSecret = Deno.env.get('NAVER_CLIENT_SECRET')

    const response = await fetch(
      `https://openapi.naver.com/v1/search/news.json?query=${encodeURIComponent(query)}&display=${display}&sort=date`,
      {
        headers: {
          'X-Naver-Client-Id':     clientId!,
          'X-Naver-Client-Secret': clientSecret!,
        },
      }
    )

    const data = await response.json()

    const clean = (str: string) =>
      str.replace(/<[^>]*>/g, '')
         .replace(/&quot;/g, '"')
         .replace(/&amp;/g, '&')
         .replace(/&#39;/g, "'")
         .replace(/&lt;/g, '<')
         .replace(/&gt;/g, '>')
         .trim()

    const items = data.items?.map((item: any) => ({
      title:       clean(item.title),
      description: clean(item.description),
      link:        item.originallink || item.link,
      pubDate:     item.pubDate,
    })) ?? []

    return new Response(JSON.stringify({ items }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
