import { describe, it, expect } from 'vitest'
import { profileEditSchema, profileSchema, profileToColumns } from '@/lib/auth-signup'

describe('profileEditSchema (used by /account/profile)', () => {
  it('accepts a valid individual without a terms field', () => {
    const r = profileEditSchema.safeParse({
      accountType: 'individual',
      firstName: 'Иван',
      lastName: 'Петров',
      phone: '+77001234567',
    })
    expect(r.success).toBe(true)
  })

  it('accepts a valid company without a terms field', () => {
    const r = profileEditSchema.safeParse({
      accountType: 'company',
      bin: '123456789012',
      name: 'Иван Петров',
      position: 'Менеджер',
      company: 'ТОО «Тест»',
      phone: '+77001234567',
    })
    expect(r.success).toBe(true)
  })

  it('rejects a company with a malformed БИН', () => {
    const r = profileEditSchema.safeParse({
      accountType: 'company',
      bin: '123',
      name: 'Иван',
      position: 'Менеджер',
      company: 'ТОО «Тест»',
      phone: '+77001234567',
    })
    expect(r.success).toBe(false)
  })

  it('rejects a too-short phone', () => {
    const r = profileEditSchema.safeParse({
      accountType: 'individual',
      firstName: 'Иван',
      lastName: 'Петров',
      phone: '+7700',
    })
    expect(r.success).toBe(false)
  })
})

describe('profileSchema (signup, still requires consent)', () => {
  it('rejects an individual without terms', () => {
    const r = profileSchema.safeParse({
      accountType: 'individual',
      firstName: 'Иван',
      lastName: 'Петров',
      phone: '+77001234567',
    })
    expect(r.success).toBe(false)
  })
})

describe('profileToColumns maps edit input onto user columns', () => {
  it('composes the full name and retail role for an individual', () => {
    const cols = profileToColumns({
      accountType: 'individual',
      firstName: 'Иван',
      lastName: 'Петров',
      phone: '+77001234567',
    })
    expect(cols).toMatchObject({ role: 'retail', name: 'Иван Петров', company: null, bin: null })
  })

  it('keeps company fields and b2b role for a company', () => {
    const cols = profileToColumns({
      accountType: 'company',
      bin: '123456789012',
      name: 'Иван Петров',
      position: 'Менеджер',
      company: 'ТОО «Тест»',
      phone: '+77001234567',
    })
    expect(cols).toMatchObject({ role: 'b2b', company: 'ТОО «Тест»', bin: '123456789012', firstName: null })
  })
})
