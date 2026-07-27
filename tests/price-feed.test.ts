import { describe, it, expect } from 'vitest'
import { deflateRawSync } from 'zlib'
import { readSheet, colIndex, decodeXml, unzip } from '@/lib/import/xlsx'
import {
  parsePriceFeed,
  findColumns,
  findPricedOn,
  detectCity,
} from '@/lib/import/priceFeed'

// ── Fixture builders ─────────────────────────────────────────────────────────

/** Build a ZIP archive the way an .xlsx is laid out (deflated entries). */
function zip(entries: Record<string, string>): Buffer {
  const locals: Buffer[] = []
  const centrals: Buffer[] = []
  let offset = 0

  for (const [name, content] of Object.entries(entries)) {
    const nameBuf = Buffer.from(name, 'utf8')
    const raw = Buffer.from(content, 'utf8')
    const data = deflateRawSync(raw)

    const local = Buffer.alloc(30)
    local.writeUInt32LE(0x04034b50, 0)
    local.writeUInt16LE(8, 8) // deflate
    local.writeUInt32LE(data.length, 18)
    local.writeUInt32LE(raw.length, 22)
    local.writeUInt16LE(nameBuf.length, 26)
    locals.push(local, nameBuf, data)

    const central = Buffer.alloc(46)
    central.writeUInt32LE(0x02014b50, 0)
    central.writeUInt16LE(8, 10)
    central.writeUInt32LE(data.length, 20)
    central.writeUInt32LE(raw.length, 24)
    central.writeUInt16LE(nameBuf.length, 28)
    central.writeUInt32LE(offset, 42)
    centrals.push(central, nameBuf)

    offset += local.length + nameBuf.length + data.length
  }

  const cd = Buffer.concat(centrals)
  const eocd = Buffer.alloc(22)
  eocd.writeUInt32LE(0x06054b50, 0)
  eocd.writeUInt16LE(Object.keys(entries).length, 8)
  eocd.writeUInt16LE(Object.keys(entries).length, 10)
  eocd.writeUInt32LE(cd.length, 12)
  eocd.writeUInt32LE(offset, 16)

  return Buffer.concat([...locals, cd, eocd])
}

/** A worksheet whose rows are given as arrays of cell values (from column B). */
function sheet(rows: Array<Array<string | number> | null>, startCol = 'B'): string {
  const base = startCol.charCodeAt(0) - 65
  const body = rows
    .map((cells, i) => {
      const r = i + 1
      if (!cells) return `<row r="${r}"/>`
      const cs = cells
        .map((v, c) => {
          const ref = String.fromCharCode(65 + base + c) + r
          return typeof v === 'number'
            ? `<c r="${ref}"><v>${v}</v></c>`
            : `<c r="${ref}" t="inlineStr"><is><t>${v}</t></is></c>`
        })
        .join('')
      return `<row r="${r}">${cs}</row>`
    })
    .join('')
  return `<worksheet><sheetData>${body}</sheetData></worksheet>`
}

const HEADER = ['Номенклатура', 'Остаток', 'Номенклатура.Бренд', 'Номенклатура.Артикул', 'Оптовая KZT']

/** The real file's preamble: title, section, currency note, price date. */
function priceList(dataRows: Array<Array<string | number>>) {
  return zip({
    'xl/worksheets/sheet1.xml': sheet([
      ['Прайс-лист'],
      null,
      ['Автозапчасти'],
      null,
      ['В валютах цен.'],
      ['Цены указаны на 17.07.2026'],
      null,
      HEADER,
      ['', '', '', '', ''],
      ...dataRows,
    ]),
  })
}

// ── XLSX reader ──────────────────────────────────────────────────────────────

describe('xlsx reader', () => {
  it('inflates archive entries', () => {
    const files = unzip(zip({ 'a.txt': 'hello', 'b/c.txt': 'world' }))
    expect(files.get('a.txt')?.toString()).toBe('hello')
    expect(files.get('b/c.txt')?.toString()).toBe('world')
  })

  it('maps cell references to column indices', () => {
    expect(colIndex('A1')).toBe(0)
    expect(colIndex('B12')).toBe(1)
    expect(colIndex('Z9')).toBe(25)
    expect(colIndex('AA1')).toBe(26)
    expect(colIndex('BC100')).toBe(54)
  })

  it('decodes named and numeric entities', () => {
    expect(decodeXml('&#1055;&#1088;&#1072;&#1081;&#1089;')).toBe('Прайс')
    expect(decodeXml('a &amp; b &lt;c&gt;')).toBe('a & b <c>')
  })

  it('places cells at their true column, leaving gaps intact', () => {
    // Data starting at column B must land at index 1, not 0.
    const grid = readSheet(zip({ 'xl/worksheets/sheet1.xml': sheet([['x', 'y']]) }))
    expect(grid[0]).toEqual(['', 'x', 'y'])
  })

  it('resolves shared strings', () => {
    const buf = zip({
      'xl/sharedStrings.xml': '<sst><si><t>Фильтр</t></si><si><t>ELRING</t></si></sst>',
      'xl/worksheets/sheet1.xml':
        '<worksheet><sheetData><row r="1">' +
        '<c r="A1" t="s"><v>0</v></c><c r="B1" t="s"><v>1</v></c>' +
        '</row></sheetData></worksheet>',
    })
    expect(readSheet(buf)[0]).toEqual(['Фильтр', 'ELRING'])
  })

  it('rejects a non-zip buffer', () => {
    expect(() => readSheet(Buffer.from('not a zip'))).toThrow(/not a ZIP/)
  })
})

// ── Feed mapping ─────────────────────────────────────────────────────────────

describe('price feed', () => {
  const rows = [
    ['Прокладка Г/Б MB Actros', 2, 'VICTOR REINZ', '61-34190-10', 14383],
    ['Набор прокладок MAN TGA', 5, 'VICTOR REINZ', '01-25275-17', 292167],
  ]

  it('finds the header row below the title block', () => {
    const grid = readSheet(priceList(rows))
    const found = findColumns(grid)
    expect(found?.headerRow).toBe(7)
    // Sheet starts at column B, so name sits at index 1.
    expect(found?.cols).toEqual({ name: 1, qty: 2, brand: 3, article: 4, price: 5 })
  })

  it('does not let the name column claim "Номенклатура.Бренд"', () => {
    const { cols } = findColumns(readSheet(priceList(rows)))!
    expect(cols.name).not.toBe(cols.brand)
    expect(cols.name).not.toBe(cols.article)
  })

  it('parses rows, the price date and the city', () => {
    const feed = parsePriceFeed(readSheet(priceList(rows)), {
      fileName: 'Прайс TM Алматы.xlsx',
    })
    expect(feed.city).toBe('Алматы')
    expect(feed.pricedOn).toBe('2026-07-17')
    expect(feed.rows).toHaveLength(2)
    expect(feed.rows[0]).toEqual({
      name: 'Прокладка Г/Б MB Actros',
      brand: 'VICTOR REINZ',
      article: '61-34190-10',
      qty: 2,
      priceB2b: 14383,
    })
  })

  it('skips rows without an identity or a usable price', () => {
    const feed = parsePriceFeed(
      readSheet(
        priceList([
          ['Без бренда', 1, '', '123', 500],
          ['Без цены', 1, 'ELRING', '456', 0],
          ['Хороший', 1, 'ELRING', '789', 100],
        ]),
      ),
    )
    expect(feed.rows.map((r) => r.article)).toEqual(['789'])
    expect(feed.skipped).toEqual([
      { row: 10, reason: 'missing brand or article' },
      { row: 11, reason: 'unusable price "0"' },
    ])
  })

  it('treats a blank or negative stock figure as zero', () => {
    const feed = parsePriceFeed(
      readSheet(priceList([['Нет остатка', '', 'ELRING', '111', 100]])),
    )
    expect(feed.rows[0].qty).toBe(0)
  })

  it('throws when the header is missing rather than importing garbage', () => {
    const buf = zip({ 'xl/worksheets/sheet1.xml': sheet([['a', 'b'], ['c', 'd']]) })
    expect(() => parsePriceFeed(readSheet(buf))).toThrow(/header row not found/)
  })

  it('reads the city from the subject when the filename lacks it', () => {
    expect(detectCity('export.xlsx', 'Прайс TM Астана на 17.07')).toBe('Астана')
    expect(detectCity('export.xlsx', 'Прайс-лист')).toBeNull()
  })

  it('finds no price date when none is stamped', () => {
    const buf = zip({ 'xl/worksheets/sheet1.xml': sheet([HEADER]) })
    expect(findPricedOn(readSheet(buf))).toBeNull()
  })
})
