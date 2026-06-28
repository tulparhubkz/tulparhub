import { db } from '@/lib/db'
import { leads } from '@/lib/db/schema'

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
    },
  })
}
