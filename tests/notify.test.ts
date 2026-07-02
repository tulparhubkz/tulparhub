import { describe, it, expect } from 'vitest'
import { formatOrderMessage, formatLeadMessage } from '@/lib/notify'

const baseOrder = {
  invoiceNumber: 'TH-2026-123456',
  total: 100_000,
  name: 'Иван',
  phone: '+77001234567',
  items: [{ name: 'Фильтр', qty: 2 }],
}

describe('formatOrderMessage', () => {
  it('escapes HTML in customer-controlled fields (Telegram parse_mode: HTML)', () => {
    const msg = formatOrderMessage({
      ...baseOrder,
      name: '<b>Иван</b> & Co',
      comment: '<script>alert(1)</script>',
      items: [{ name: '<i>Деталь</i>', qty: 1 }],
    })
    expect(msg).toContain('&lt;b&gt;Иван&lt;/b&gt; &amp; Co')
    expect(msg).toContain('&lt;script&gt;alert(1)&lt;/script&gt;')
    expect(msg).toContain('&lt;i&gt;Деталь&lt;/i&gt;')
    expect(msg).not.toContain('<script>')
  })

  it('shows at most 10 items and summarizes the rest', () => {
    const items = Array.from({ length: 13 }, (_, i) => ({ name: `Позиция ${i + 1}`, qty: 1 }))
    const msg = formatOrderMessage({ ...baseOrder, items })
    expect(msg).toContain('Позиция 10')
    expect(msg).not.toContain('Позиция 11')
    expect(msg).toContain('… и ещё 3 поз.')
  })

  it('includes company/BIN line only for B2B orders', () => {
    const b2c = formatOrderMessage(baseOrder)
    expect(b2c).not.toContain('🏢')
    const b2b = formatOrderMessage({ ...baseOrder, company: 'ТОО Рога', bin: '123456789012' })
    expect(b2b).toContain('ТОО Рога')
    expect(b2b).toContain('БИН 123456789012')
  })
})

describe('formatLeadMessage', () => {
  it('maps known lead kinds to Russian labels and passes unknown kinds through', () => {
    expect(formatLeadMessage({ kind: 'callback', name: 'А', phone: '7' })).toContain('Обратный звонок')
    expect(formatLeadMessage({ kind: 'booking', name: 'А', phone: '7' })).toContain('Бронь аренды')
    expect(formatLeadMessage({ kind: 'custom-kind', name: 'А', phone: '7' })).toContain('custom-kind')
  })

  it('escapes HTML in name and comment', () => {
    const msg = formatLeadMessage({ kind: 'callback', name: '<x>', phone: '7', comment: '<y>' })
    expect(msg).toContain('&lt;x&gt;')
    expect(msg).toContain('&lt;y&gt;')
  })
})
