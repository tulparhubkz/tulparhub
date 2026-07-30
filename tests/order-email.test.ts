import { describe, it, expect } from 'vitest'
import { renderOrderStatusEmail, renderOrderConfirmationEmail, trackUrl } from '@/lib/order-email'
import { fmtKZT } from '@/lib/utils'

describe('trackUrl', () => {
  it('builds an absolute track link from AUTH_URL with the invoice prefilled', () => {
    const prev = process.env.AUTH_URL
    process.env.AUTH_URL = 'https://tulparhub.example.com/'
    try {
      expect(trackUrl('ru', 'TH-2026-123456')).toBe(
        'https://tulparhub.example.com/ru/track?num=TH-2026-123456',
      )
    } finally {
      process.env.AUTH_URL = prev
    }
  })

  it('falls back to a relative link when AUTH_URL is unset', () => {
    const prev = process.env.AUTH_URL
    delete process.env.AUTH_URL
    try {
      expect(trackUrl('kz', 'TH-2026-000111')).toBe('/kz/track?num=TH-2026-000111')
    } finally {
      if (prev !== undefined) process.env.AUTH_URL = prev
    }
  })
})

describe('renderOrderStatusEmail — order status', () => {
  const link = 'https://tulparhub.example.com/ru/track?num=TH-2026-123456'

  it('puts the invoice number and localized status into the subject', () => {
    const { subject } = renderOrderStatusEmail('ru', {
      kind: 'order',
      status: 'shipped',
      invoiceNumber: 'TH-2026-123456',
      trackUrl: link,
    })
    expect(subject).toContain('TH-2026-123456')
    expect(subject).toContain('Отправлен')
  })

  it('renders html with the status label, invoice, track link and button', () => {
    const { html } = renderOrderStatusEmail('ru', {
      kind: 'order',
      status: 'confirmed',
      invoiceNumber: 'TH-2026-123456',
      trackUrl: link,
    })
    expect(html).toContain('Подтверждён')
    expect(html).toContain('TH-2026-123456')
    expect(html).toContain(`href="${link}"`)
    expect(html).toContain('Отследить заказ')
  })

  it('renders a plain-text part with the label, invoice and link', () => {
    const { text } = renderOrderStatusEmail('en', {
      kind: 'order',
      status: 'done',
      invoiceNumber: 'TH-2026-123456',
      trackUrl: link,
    })
    expect(text).toContain('Completed')
    expect(text).toContain('TH-2026-123456')
    expect(text).toContain(link)
  })

  it('localizes the status label per locale (kz)', () => {
    const { html } = renderOrderStatusEmail('kz', {
      kind: 'order',
      status: 'cancelled',
      invoiceNumber: 'TH-2026-123456',
      trackUrl: link,
    })
    expect(html).toContain('Бас тартылды')
  })
})

describe('renderOrderConfirmationEmail — order received (#125)', () => {
  const link = 'https://tulparhub.example.com/ru/track?num=TH-2026-123456'
  const params = {
    invoiceNumber: 'TH-2026-123456',
    items: [
      { name: 'Фильтр масляный', qty: 2, price: 50_000 },
      { name: 'Сцепление', qty: 1, price: 300_000 },
    ],
    total: 402_500,
    deliveryCost: 2_500,
    trackUrl: link,
  }

  it('puts the invoice number into the subject', () => {
    const { subject } = renderOrderConfirmationEmail('ru', params)
    expect(subject).toContain('TH-2026-123456')
    expect(subject).toContain('принят')
  })

  it('lists every line item with its quantity and line subtotal', () => {
    const { html } = renderOrderConfirmationEmail('ru', params)
    expect(html).toContain('Фильтр масляный')
    expect(html).toContain('× 2')
    expect(html).toContain(fmtKZT(100_000)) // 2 × 50 000, line subtotal
    expect(html).toContain('Сцепление')
    expect(html).toContain(fmtKZT(300_000))
  })

  it('renders the delivery line and grand total, with the track button and link', () => {
    const { html } = renderOrderConfirmationEmail('ru', params)
    expect(html).toContain('Доставка')
    expect(html).toContain(fmtKZT(2_500))
    expect(html).toContain(fmtKZT(402_500)) // grand total
    expect(html).toContain('Отследить заказ')
    expect(html).toContain(`href="${link}"`)
  })

  it('omits the delivery line when the cost is manager-calc (null)', () => {
    const { html } = renderOrderConfirmationEmail('ru', { ...params, deliveryCost: null })
    expect(html).not.toContain('Доставка')
  })

  it('localizes the confirmation copy per locale (kz / en)', () => {
    expect(renderOrderConfirmationEmail('kz', params).html).toContain('Тапсырысыңыз үшін рахмет!')
    const en = renderOrderConfirmationEmail('en', params)
    expect(en.subject).toContain('received')
    expect(en.html).toContain('Thank you for your order!')
    expect(en.html).toContain('Delivery')
  })

  it('renders a plain-text part with items, total and the link', () => {
    const { text } = renderOrderConfirmationEmail('en', params)
    expect(text).toContain('Фильтр масляный × 2')
    expect(text).toContain(fmtKZT(402_500))
    expect(text).toContain(link)
  })
})

describe('renderOrderStatusEmail — payment status', () => {
  const link = 'https://tulparhub.example.com/ru/track?num=TH-2026-999000'

  it('uses payment labels and a payment-flavored subject', () => {
    const { subject, html } = renderOrderStatusEmail('ru', {
      kind: 'payment',
      status: 'paid',
      invoiceNumber: 'TH-2026-999000',
      trackUrl: link,
    })
    expect(subject).toContain('TH-2026-999000')
    expect(subject).toContain('Оплачен')
    expect(html).toContain('Оплачен')
  })

  it('localizes payment labels in english', () => {
    const { html } = renderOrderStatusEmail('en', {
      kind: 'payment',
      status: 'refunded',
      invoiceNumber: 'TH-2026-999000',
      trackUrl: link,
    })
    expect(html).toContain('Refunded')
  })
})
