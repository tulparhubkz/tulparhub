import { describe, it, expect } from 'vitest'
import { detectCategory, detectFits, num, priceWarning, CATEGORIES } from '@/lib/import/mapping'

describe('detectCategory', () => {
  it('classifies by keyword in the part name', () => {
    expect(detectCategory('Фильтр масляный ЕВРО')).toBe('filters')
    expect(detectCategory('Поршень СМД-31')).toBe('engine')
    expect(detectCategory('Колодка тормозная передняя')).toBe('brakes')
    expect(detectCategory('Амортизатор кабины')).toBe('suspension')
    expect(detectCategory('Генератор 28В')).toBe('electrical')
  })

  it('falls back to "other" when nothing matches', () => {
    expect(detectCategory('Совершенно неизвестная запчасть')).toBe('other')
  })

  it('is case-insensitive', () => {
    expect(detectCategory('ФИЛЬТР ВОЗДУШНЫЙ')).toBe('filters')
  })

  it('resolves keyword collisions by CATEGORIES order (documented quirk)', () => {
    // "клапан" (engine) is checked before "тормоз" (brakes), so a brake valve
    // lands in engine. If this test breaks because the ordering was fixed on
    // purpose, update it — it documents behavior, not intent.
    expect(detectCategory('Клапан тормозной')).toBe('engine')
  })

  it('has unique category ids', () => {
    const ids = CATEGORIES.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('detectFits', () => {
  it('detects specific KAMAZ models', () => {
    expect(detectFits('Диск сцепления КАМАЗ 65115')).toEqual(['KAMAZ 65115'])
  })

  it('falls back to the popular KAMAZ trio when only the brand is named', () => {
    expect(detectFits('Фильтр КАМАЗ ЕВРО')).toEqual(['KAMAZ 6520', 'KAMAZ 65115', 'KAMAZ 5490'])
  })

  it('detects European brands via aliases', () => {
    expect(detectFits('Фара Actros MP4')).toEqual(['Mercedes Actros'])
    expect(detectFits('Втулка Volvo FH13')).toContain('Volvo FH13')
  })

  it('deduplicates and returns [] when nothing matches', () => {
    expect(detectFits('Вкладыш коренной')).toEqual([])
  })

  it('does not tag KAMAZ parts as MAZ (regression: "камаз" contains "маз ")', () => {
    expect(detectFits('Диск сцепления КАМАЗ 65115')).not.toContain('MAZ')
    expect(detectFits('Фара МАЗ 5336')).toEqual(['MAZ']) // real MAZ still detected
  })
})

describe('priceWarning — mangled feed prices', () => {
  it('flags retail more than 10x the wholesale price', () => {
    expect(priceWarning(5_302_182, 77_616)).toMatch(/68×/) // the real DAF piston case
    expect(priceWarning(14_945, 17)).toMatch(/879×/)
  })
  it('flags wholesale above retail', () => {
    expect(priceWarning(1_575, 1_728)).toMatch(/выше розницы/)
  })
  it('accepts ordinary markups and missing wholesale', () => {
    expect(priceWarning(2_135_695, 1_708_527)).toBeNull() // ~1.25x
    expect(priceWarning(38, 9)).toBeNull() // 4.2x on a cheap part — plausible
    expect(priceWarning(5_000, null)).toBeNull()
    expect(priceWarning(5_000, 0)).toBeNull()
  })
})

describe('num — vendor price/qty parsing', () => {
  it('parses comma decimals and floors', () => {
    expect(num('1234,56')).toBe(1234)
    expect(num('12.9')).toBe(12)
  })
  it('returns 0 for blank/garbage/undefined', () => {
    expect(num('')).toBe(0)
    expect(num('n/a')).toBe(0)
    expect(num(undefined)).toBe(0)
  })
})
