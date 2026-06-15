import { supabase } from './supabaseClient'

export async function callSolar({ system, messages }) {
  const { data, error } = await supabase.functions.invoke('solar', {
    body: { system, messages },
  })
  if (error) throw error
  return data.content
}
