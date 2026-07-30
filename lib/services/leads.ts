import { db } from '@/lib/db'
import { leads } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'

export const LEAD_STATUSES = ['new', 'done'] as const
export type LeadStatus = (typeof LEAD_STATUSES)[number]

export interface LeadInput {
  kind: string
  name: string
  phone: string
  email?: string | null
  city?: string | null
  comment?: string | null
  company?: string
  bin?: string
  payment?: string
  delivery?: string
  unit_id?: string
  date_from?: string
  date_to?: string
  address?: string
  items?: unknown
  // VIN / parts help-me-choose requests (#123)
  source?: string
  vin?: string
  brand?: string
  model?: string
  year?: string
  engine?: string
  gearbox?: string
  search_query?: string
}

/** Most-recent leads for the admin panel. */
export async function listLeads(limit = 200) {
  return db.select().from(leads).orderBy(desc(leads.createdAt)).limit(limit)
}

export async function updateLeadStatus(id: string, status: LeadStatus) {
  if (!LEAD_STATUSES.includes(status)) throw new Error(`updateLeadStatus: invalid status "${status}"`)
  await db.update(leads).set({ status }).where(eq(leads.id, id))
}

export async function createLead(input: LeadInput) {
  await db.insert(leads).values({
    kind: input.kind,
    name: input.name,
    phone: input.phone,
    email: input.email ?? null,
    city: input.city ?? null,
    comment: input.comment ?? null,
    meta: {
      company: input.company,
      bin: input.bin,
      payment: input.payment,
      delivery: input.delivery,
      unit_id: input.unit_id,
      date_from: input.date_from,
      date_to: input.date_to,
      address: input.address,
      items: input.items,
      source: input.source,
      vin: input.vin,
      brand: input.brand,
      model: input.model,
      year: input.year,
      engine: input.engine,
      gearbox: input.gearbox,
      search_query: input.search_query,
    },
  })
}
