import { describe, it, expect } from 'vitest'
import { sanitizeVehicle, pickImportable, MAX_VEHICLES } from '@/lib/services/garage'

describe('sanitizeVehicle', () => {
  it('normalizes VIN and fills defaults', () => {
    const v = sanitizeVehicle({ vin: '  xtc651150  ' })
    expect(v).not.toBeNull()
    expect(v!.vin).toBe('XTC651150')
    expect(v!.name).toBe('XTC651150') // defaults to the VIN
    expect(v!.searchQuery).toBe('XTC651150')
    expect(v!.id).toMatch(/^[\w-]{10,40}$/) // generated when the client sent none
  })

  it('keeps a sane client-generated id, replaces junk ones', () => {
    const good = '11111111-2222-3333-4444-555555555555'
    expect(sanitizeVehicle({ vin: 'ABC123', id: good })!.id).toBe(good)
    expect(sanitizeVehicle({ vin: 'ABC123', id: '<script>' })!.id).not.toBe('<script>')
  })

  it('caps field lengths and rejects junk VINs', () => {
    const v = sanitizeVehicle({ vin: 'A'.repeat(99), name: 'n'.repeat(500), note: 'x'.repeat(999) })
    expect(v!.vin).toHaveLength(24)
    expect(v!.name).toHaveLength(100)
    expect(v!.note).toHaveLength(300)
    expect(sanitizeVehicle({ vin: 'AB' })).toBeNull() // too short
    expect(sanitizeVehicle({ vin: '   ' })).toBeNull()
  })
})

describe('pickImportable — localStorage → account merge', () => {
  it('skips VINs the account already has (case-insensitive)', () => {
    const picked = pickImportable(['XTC651150'], [
      { vin: 'xtc651150' }, // duplicate of existing
      { vin: 'WDB9634031L123456' },
    ])
    expect(picked.map((v) => v.vin)).toEqual(['WDB9634031L123456'])
  })

  it('dedupes within the incoming batch itself', () => {
    const picked = pickImportable([], [{ vin: 'AAA111' }, { vin: 'aaa111' }, { vin: 'BBB222' }])
    expect(picked.map((v) => v.vin)).toEqual(['AAA111', 'BBB222'])
  })

  it('respects the per-user cap', () => {
    const existing = Array.from({ length: MAX_VEHICLES - 1 }, (_, i) => `VIN${i}00`)
    const picked = pickImportable(existing, [{ vin: 'NEW0001' }, { vin: 'NEW0002' }])
    expect(picked).toHaveLength(1) // only one slot left
  })

  it('drops junk entries without consuming slots', () => {
    const picked = pickImportable([], [{ vin: ' ' }, { vin: 'OK1234' }])
    expect(picked.map((v) => v.vin)).toEqual(['OK1234'])
  })
})
