import { supabase } from './supabaseClient'

export async function getEconomicStats() {
  try {
    const { data, error } = await supabase.functions.invoke('economic-stats')
    if (error) throw error
    return { data, error: null }
  } catch (err) {
    console.error('경제 통계 fetch 실패:', err)
    return { data: null, error: err }
  }
}
