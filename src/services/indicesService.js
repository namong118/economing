import { supabase } from './supabaseClient'

export async function getMarketIndices() {
  try {
    const { data, error } = await supabase.functions.invoke('indices')
    if (error) throw error
    return { data, error: null }
  } catch (err) {
    console.error('지표 데이터 fetch 실패:', err)
    return { data: null, error: err }
  }
}
