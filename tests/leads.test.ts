import { describe, it, expect, beforeEach } from 'vitest'
import { vi } from 'vitest'

// In-memory stand-in for the Drizzle client: capture every insert so we can
// assert on what createLead persists.
const h = vi.hoisted(() => ({ inserted: [] as Array<{ table: unknown; values: unknown }> }))

vi.mock('@/lib/db', () => ({
  db: {
    insert: (table: unknown) => ({
      values: (values: unknown) => {
        h.inserted.push({ table, values })
        return Promise.resolve()
      },
    }),
  },
}))

import { createLead } from '@/lib/services/leads'

beforeEach(() => {
  h.inserted.length = 0
})

describe('createLead — VIN / parts request', () => {
  it('persists the decoded vehicle and VIN into meta so /admin/leads can show it', async () => {
    await createLead({
      kind: 'quote',
      name: 'Асхат',
      phone: '+7 (700) 123-45-67',
      comment: 'Масляный фильтр, тормозные колодки',
      source: 'vin',
      vin: 'JTMCV02J604235676',
      brand: 'Toyota',
      model: 'Land Cruiser',
      year: '2015',
      search_query: 'Toyota Land Cruiser',
    })

    expect(h.inserted).toHaveLength(1)
    const values = h.inserted[0].values as { kind: string; comment: string; meta: Record<string, unknown> }
    expect(values.kind).toBe('quote')
    expect(values.comment).toBe('Масляный фильтр, тормозные колодки')
    expect(values.meta).toMatchObject({
      source: 'vin',
      vin: 'JTMCV02J604235676',
      brand: 'Toyota',
      model: 'Land Cruiser',
      year: '2015',
      search_query: 'Toyota Land Cruiser',
    })
  })

  it('persists params-search fields (engine, gearbox) into meta', async () => {
    await createLead({
      kind: 'quote',
      name: 'Ivan',
      phone: '+7 (701) 000-00-00',
      comment: 'brake pads',
      source: 'params',
      brand: 'Volvo',
      model: 'FH12',
      year: '2018',
      engine: '12.0',
      gearbox: 'manual',
    })

    const values = h.inserted[0].values as { meta: Record<string, unknown> }
    expect(values.meta).toMatchObject({
      source: 'params',
      brand: 'Volvo',
      model: 'FH12',
      engine: '12.0',
      gearbox: 'manual',
    })
  })
})
