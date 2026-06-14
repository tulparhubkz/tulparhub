import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function getParts(filters?: { system?: string; brand?: string }) {
  let query = supabase.from('parts').select('*, part_stock(*)')
  if (filters?.system) query = query.eq('category', filters.system)
  const { data } = await query
  return data ?? []
}

export async function getPartById(id: string) {
  const { data } = await supabase.from('parts').select('*, part_stock(*)').eq('id', id).single()
  return data
}

export async function getRentalUnits(type?: string) {
  let query = supabase.from('rental_units').select('*')
  if (type && type !== 'all') query = query.eq('type', type)
  const { data } = await query
  return data ?? []
}

export async function submitLead(payload: {
  kind: string
  name: string
  phone: string
  email?: string
  city?: string
  comment?: string
  items?: unknown
}) {
  const { error } = await supabase.from('leads').insert(payload)
  return { error }
}
