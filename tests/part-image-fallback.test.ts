import { describe, it, expect } from 'vitest'
import { fallbackImage } from '@/lib/partImage'
import oemMap from '@/lib/oemImageMap.json'

describe('fallbackImage', () => {
  it('prefers the per-OEM photo — the most accurate match we have', () => {
    const [oem, url] = Object.entries(oemMap as Record<string, string>)[0]
    expect(fallbackImage(oem, 'какое угодно название')).toBe(url)
  })

  it('falls back to a category photo when the OEM is unknown', () => {
    const url = fallbackImage('НЕТ-ТАКОГО-АРТИКУЛА', 'Фильтр масляный ЕВРО')
    expect(url).toMatch(/^https?:\/\//)
  })

  it('is deterministic — the same part always gets the same photo', () => {
    const a = fallbackImage('X-1', 'Колодка тормозная передняя')
    const b = fallbackImage('X-1', 'Колодка тормозная передняя')
    expect(a).toBe(b)
    expect(a).not.toBeNull()
  })

  it('picks by keyword, so different categories get different photos', () => {
    const pad = fallbackImage('', 'Колодка тормозная')
    const filter = fallbackImage('', 'Фильтр воздушный')
    expect(pad).not.toBe(filter)
  })

  it('returns null when nothing classifies — the caller renders a placeholder', () => {
    expect(fallbackImage('', 'Совершенно неизвестная запчасть')).toBeNull()
  })

  it('tolerates an empty name and OEM', () => {
    expect(fallbackImage('', '')).toBeNull()
  })
})
