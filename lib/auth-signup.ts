import { z } from 'zod'

// Shared shape + validation for the complete-profile form (/api/auth/complete).
// After a user authenticates (Google or email link), any account whose
// accountType is still null is sent to /auth/complete to fill these in.

export type AccountType = 'individual' | 'company'

// The signup wizard no longer asks company users for their должность, but the
// column and the schema below still require one. New signups get this value.
export const DEFAULT_POSITION = 'Менеджер'

const phone = z
  .string()
  .trim()
  .min(1)
  .refine((v) => v.replace(/\D/g, '').length >= 10, 'bad_phone')

// БИН/ИИН — Kazakhstan business/individual identification number: 12 digits.
const bin = z
  .string()
  .trim()
  .refine((v) => /^\d{12}$/.test(v), 'bad_bin')

const individual = z.object({
  accountType: z.literal('individual'),
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  phone,
  terms: z.literal(true),
})

const company = z.object({
  accountType: z.literal('company'),
  bin,
  name: z.string().trim().min(1), // контактное лицо
  position: z.string().trim().min(1), // должность
  company: z.string().trim().min(1), // организация
  phone,
  terms: z.literal(true),
})

// The email/identity comes from the session, so the form only supplies the
// account-type fields.
export const profileSchema = z.discriminatedUnion('accountType', [individual, company])

export type ProfileInput = z.infer<typeof profileSchema>

// Map a validated profile onto the columns of `users` / `pending_signups`.
// физ. лицо → retail, юр. лицо → b2b.
export function profileToColumns(p: ProfileInput) {
  if (p.accountType === 'individual') {
    return {
      accountType: 'individual' as const,
      role: 'retail',
      firstName: p.firstName,
      lastName: p.lastName,
      name: `${p.firstName} ${p.lastName}`.trim(),
      phone: p.phone,
      company: null,
      bin: null,
      position: null,
    }
  }
  return {
    accountType: 'company' as const,
    role: 'b2b',
    firstName: null,
    lastName: null,
    name: p.name,
    phone: p.phone,
    company: p.company,
    bin: p.bin,
    position: p.position,
  }
}
