import { describe, it, expect } from 'vitest'
import { parseImageRow, MAX_IMAGES } from '@/lib/import/images'

const BASE = 'https://digital-assets.tecalliance.services/images'
const H1 = '0984b0fb3daf777921fe7ce71e6b4d04f5cf9388'
const H2 = 'f3e5ea5023ca770a802b847e697f0db7d9fe7ab6'

/** Build the 7 size URLs for a hash, in CSV column order (50…3200). */
function urls(hash: string) {
  return [50, 100, 200, 400, 800, 1600, 3200].map((s) => `${BASE}/${s}/${hash}.jpg`)
}

/** Assemble a tab-separated row the way price_images.csv lays it out. */
function row(opts: {
  article?: string
  brand?: string
  status?: string
  images?: { fileName: string; hash: string }[]
  trailingEmpties?: number
}) {
  const imgs = opts.images ?? []
  const head = [
    opts.article ?? '8GJ002525251',
    'Лампа H4 H. DUTY 24v70/75',
    opts.brand ?? 'HELLA',
    opts.status ?? 'ok',
    'articleNumber',
    'true',
    '8GJ 002 525-251',
    'HELLA',
    String(imgs.length),
  ]
  const body = imgs.flatMap((i) => [i.fileName, ...urls(i.hash)])
  const tail = Array(8 * (opts.trailingEmpties ?? 0)).fill('')
  return [...head, ...body, ...tail].join('\t')
}

describe('parseImageRow', () => {
  it('pulls the article, brand and the three sizes we keep', () => {
    const parsed = parseImageRow(row({ images: [{ fileName: 'A.JPG', hash: H1 }] }))

    expect(parsed).toEqual({
      article: '8GJ002525251',
      brand: 'HELLA',
      images: [
        {
          fileName: 'A.JPG',
          url200: `${BASE}/200/${H1}.jpg`,
          url800: `${BASE}/800/${H1}.jpg`,
          url1600: `${BASE}/1600/${H1}.jpg`,
        },
      ],
    })
  })

  it('keeps every image in CSV column order', () => {
    const parsed = parseImageRow(
      row({ images: [{ fileName: 'A.JPG', hash: H1 }, { fileName: 'B.JPG', hash: H2 }] }),
    )

    expect(parsed!.images.map((i) => i.fileName)).toEqual(['A.JPG', 'B.JPG'])
    expect(parsed!.images[1].url800).toBe(`${BASE}/800/${H2}.jpg`)
  })

  it('ignores the empty image slots that pad every row', () => {
    const parsed = parseImageRow(row({ images: [{ fileName: 'A.JPG', hash: H1 }], trailingEmpties: 6 }))
    expect(parsed!.images).toHaveLength(1)
  })

  it('returns null for a row with no images (no_match / no_image)', () => {
    expect(parseImageRow(row({ status: 'no_match', images: [] }))).toBeNull()
  })

  it('returns null when the article is missing — nothing to join on', () => {
    expect(parseImageRow(row({ article: '  ', images: [{ fileName: 'A.JPG', hash: H1 }] }))).toBeNull()
  })

  it('returns null for the header line', () => {
    expect(parseImageRow('Артикул\tНаименование\tБренд\tstatus')).toBeNull()
  })

  it('skips an image slot whose URLs are missing but keeps the rest', () => {
    const cols = row({
      images: [{ fileName: 'A.JPG', hash: H1 }, { fileName: 'B.JPG', hash: H2 }],
    }).split('\t')
    cols[9 + 8 + 3] = '' // img2_url200 blank
    const parsed = parseImageRow(cols.join('\t'))

    expect(parsed!.images.map((i) => i.fileName)).toEqual(['A.JPG'])
  })

  it('trims surrounding whitespace on the join keys', () => {
    const parsed = parseImageRow(row({ article: ' 8GJ1 ', brand: ' HELLA ', images: [{ fileName: 'A.JPG', hash: H1 }] }))
    expect(parsed).toMatchObject({ article: '8GJ1', brand: 'HELLA' })
  })

  it('treats a blank brand as null so it never joins on empty string', () => {
    const parsed = parseImageRow(row({ brand: '', images: [{ fileName: 'A.JPG', hash: H1 }] }))
    expect(parsed!.brand).toBeNull()
  })

  it(`reads at most ${MAX_IMAGES} images — the CSV has no columns beyond that`, () => {
    const images = Array.from({ length: MAX_IMAGES + 2 }, (_, i) => ({ fileName: `${i}.JPG`, hash: H1 }))
    const parsed = parseImageRow(row({ images }))
    expect(parsed!.images).toHaveLength(MAX_IMAGES)
  })
})
