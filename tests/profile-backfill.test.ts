import { describe, it, expect } from 'vitest'
import { computeProfileBackfill, type ProfileSnapshot } from '@/lib/services/users'

const empty: ProfileSnapshot = {
  accountType: null,
  firstName: null,
  lastName: null,
  name: null,
  phone: null,
  company: null,
  bin: null,
}

describe('computeProfileBackfill', () => {
  it('completes an empty individual profile from checkout', () => {
    const set = computeProfileBackfill(empty, {
      b2b: false,
      name: 'Иван Петров',
      phone: '+77001234567',
    })
    expect(set).toEqual({
      name: 'Иван Петров',
      phone: '+77001234567',
      accountType: 'individual',
      role: 'retail',
      firstName: 'Иван',
      lastName: 'Петров',
    })
  })

  it('completes an empty company profile and grants b2b', () => {
    const set = computeProfileBackfill(empty, {
      b2b: true,
      name: 'Иван Петров',
      phone: '+77001234567',
      company: 'ТОО «Тест»',
      bin: '123456789012',
    })
    expect(set).toMatchObject({
      name: 'Иван Петров',
      phone: '+77001234567',
      company: 'ТОО «Тест»',
      bin: '123456789012',
      accountType: 'company',
      role: 'b2b',
    })
    // company completion must not populate физ-лицо name parts
    expect(set.firstName).toBeUndefined()
    expect(set.lastName).toBeUndefined()
  })

  it('does not overwrite fields that are already set', () => {
    const cur: ProfileSnapshot = {
      accountType: 'individual',
      firstName: 'Анна',
      lastName: 'Смирнова',
      name: 'Анна Смирнова',
      phone: '+77009999999',
      company: null,
      bin: null,
    }
    const set = computeProfileBackfill(cur, {
      b2b: false,
      name: 'Иван Петров',
      phone: '+77001234567',
    })
    expect(set).toEqual({}) // nothing to change
  })

  it('never flips the role of an already-onboarded individual buying as ЮЛ', () => {
    const cur: ProfileSnapshot = { ...empty, accountType: 'individual', name: 'Анна', phone: '+77009999999' }
    const set = computeProfileBackfill(cur, {
      b2b: true,
      name: 'Анна',
      phone: '+77009999999',
      company: 'ТОО «Новая»',
      bin: '123456789012',
    })
    // company/bin were empty, so they fill; but role/accountType stay untouched
    expect(set).toEqual({ company: 'ТОО «Новая»', bin: '123456789012' })
    expect(set.role).toBeUndefined()
    expect(set.accountType).toBeUndefined()
  })

  it('handles a single-word name without a last name', () => {
    const set = computeProfileBackfill(empty, { b2b: false, name: 'Иван', phone: '+77001234567' })
    expect(set.firstName).toBe('Иван')
    expect(set.lastName).toBeUndefined()
  })
})
