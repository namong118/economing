import { supabase } from './supabaseClient'

export async function fetchEconomyNews() {
  try {
    const { data, error } = await supabase.functions.invoke('news')
    if (error) throw error
    return data.items ?? []
  } catch (err) {
    console.error('뉴스 fetch 실패:', err)
    return []
  }
}
