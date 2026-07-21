/**
 * Minimal XLSX reader — enough to read a vendor price list, nothing more.
 *
 * An .xlsx is a ZIP of XML parts. We inflate the entries we need with Node's
 * built-in zlib and pull the cell values out of the sheet XML, which keeps a
 * spreadsheet parser out of package.json for a feed whose shape we control.
 *
 * Supported: inline strings, shared strings, numbers, formula-result strings.
 * Not supported (and not needed here): dates as serial numbers, multiple
 * sheets, styles, formulas themselves.
 */
import { inflateRawSync } from 'zlib'

// ── ZIP ──────────────────────────────────────────────────────────────────────

const EOCD_SIG = 0x06054b50
const CEN_SIG = 0x02014b50
const LOC_SIG = 0x04034b50

/** Inflate every file in a ZIP archive, keyed by its path inside the archive. */
export function unzip(buf: Buffer): Map<string, Buffer> {
  const eocd = findEocd(buf)
  const count = buf.readUInt16LE(eocd + 10)
  let ptr = buf.readUInt32LE(eocd + 16) // central directory offset

  const out = new Map<string, Buffer>()
  for (let i = 0; i < count; i++) {
    if (buf.readUInt32LE(ptr) !== CEN_SIG) throw new Error('xlsx: bad central directory entry')

    const method = buf.readUInt16LE(ptr + 10)
    const compressedSize = buf.readUInt32LE(ptr + 20)
    const nameLen = buf.readUInt16LE(ptr + 28)
    const extraLen = buf.readUInt16LE(ptr + 30)
    const commentLen = buf.readUInt16LE(ptr + 32)
    const localOffset = buf.readUInt32LE(ptr + 42)
    const name = buf.subarray(ptr + 46, ptr + 46 + nameLen).toString('utf8')

    out.set(name, readLocalEntry(buf, localOffset, method, compressedSize))
    ptr += 46 + nameLen + extraLen + commentLen
  }
  return out
}

/**
 * The End Of Central Directory record sits at the tail, after a variable-length
 * comment, so it has to be found by scanning backwards for its signature.
 */
function findEocd(buf: Buffer): number {
  const min = Math.max(0, buf.length - 0xffff - 22)
  for (let i = buf.length - 22; i >= min; i--) {
    if (buf.readUInt32LE(i) === EOCD_SIG) return i
  }
  throw new Error('xlsx: not a ZIP archive (no EOCD record)')
}

/**
 * The local header repeats the name/extra lengths — and they can differ from
 * the central directory's — so the data offset must be computed here. Sizes we
 * take from the central directory, which is authoritative even when the local
 * header defers them to a data descriptor.
 */
function readLocalEntry(buf: Buffer, offset: number, method: number, size: number): Buffer {
  if (buf.readUInt32LE(offset) !== LOC_SIG) throw new Error('xlsx: bad local file header')

  const nameLen = buf.readUInt16LE(offset + 26)
  const extraLen = buf.readUInt16LE(offset + 28)
  const start = offset + 30 + nameLen + extraLen
  const data = buf.subarray(start, start + size)

  if (method === 0) return data // stored
  if (method === 8) return inflateRawSync(data) // deflate
  throw new Error(`xlsx: unsupported compression method ${method}`)
}

// ── Sheet XML ────────────────────────────────────────────────────────────────

const ENTITIES: Record<string, string> = { lt: '<', gt: '>', amp: '&', quot: '"', apos: "'" }

/** Resolve XML entities, including the numeric ones Cyrillic text arrives as. */
export function decodeXml(s: string): string {
  return s.replace(/&(#x?[0-9a-fA-F]+|\w+);/g, (m, ent: string) => {
    if (ent[0] === '#') {
      const code = ent[1] === 'x' ? parseInt(ent.slice(2), 16) : parseInt(ent.slice(1), 10)
      return Number.isFinite(code) ? String.fromCodePoint(code) : m
    }
    return ENTITIES[ent] ?? m
  })
}

/** Column letters in a cell reference ("BC12") to a zero-based index. */
export function colIndex(ref: string): number {
  let n = 0
  for (const ch of ref) {
    const c = ch.charCodeAt(0)
    if (c < 65 || c > 90) break // stop at the row digits
    n = n * 26 + (c - 64)
  }
  return n - 1
}

/**
 * Run a global regex over a string, yielding each match.
 *
 * `matchAll` would read better, but the project compiles to ES5, where
 * iterating its result needs --downlevelIteration.
 */
function eachMatch(re: RegExp, s: string, fn: (m: RegExpExecArray) => void): void {
  re.lastIndex = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(s)) !== null) {
    fn(m)
    if (m[0] === '') re.lastIndex++ // guard against a zero-width match looping
  }
}

/** Concatenate the <t> runs of a shared/inline string element. */
function textRuns(xml: string): string {
  let s = ''
  eachMatch(/<t[^>]*>([\s\S]*?)<\/t>/g, xml, (m) => {
    s += decodeXml(m[1])
  })
  return s
}

function sharedStrings(files: Map<string, Buffer>): string[] {
  const xml = files.get('xl/sharedStrings.xml')?.toString('utf8')
  if (!xml) return []
  const out: string[] = []
  eachMatch(/<si>([\s\S]*?)<\/si>/g, xml, (m) => out.push(textRuns(m[1])))
  return out
}

/**
 * Read the first worksheet as a dense grid of strings. Rows and columns are
 * placed at their true positions, so gaps in the sheet stay gaps in the array
 * and column indices remain stable regardless of which cells the file omits.
 */
export function readSheet(buf: Buffer): string[][] {
  const files = unzip(buf)

  const sheetNames: string[] = []
  files.forEach((_, p) => {
    if (/^xl\/worksheets\/sheet\d+\.xml$/.test(p)) sheetNames.push(p)
  })
  const sheetPath = sheetNames.sort()[0]
  if (!sheetPath) throw new Error('xlsx: no worksheet found')

  const xml = files.get(sheetPath)!.toString('utf8')
  const shared = sharedStrings(files)
  const grid: string[][] = []

  // Self-closing tags are a separate alternative rather than an optional `/`:
  // sharing one branch lets `<row r="2"/>` swallow the following row as body.
  eachMatch(/<row([^>]*)\/>|<row([^>]*)>([\s\S]*?)<\/row>/g, xml, (rowM) => {
    const attrsRow = rowM[1] ?? rowM[2]
    const rowNum = /(?:^|\s)r="(\d+)"/.exec(attrsRow)?.[1]
    if (!rowNum) return

    const rowIdx = Number(rowNum) - 1
    const body = rowM[3]
    const cells: string[] = []

    if (body) {
      eachMatch(/<c([^>]*)\/>|<c([^>]*)>([\s\S]*?)<\/c>/g, body, (cM) => {
        const attrs = cM[1] ?? cM[2]
        const inner = cM[3] ?? ''
        // Attributes may be in any order, so each can start the string.
        const ref = /(?:^|\s)r="([A-Z]+)\d+"/.exec(attrs)?.[1]
        if (!ref) return

        const type = /(?:^|\s)t="(\w+)"/.exec(attrs)?.[1]
        let value: string
        if (type === 'inlineStr') value = textRuns(inner)
        else if (type === 's') {
          const raw = /<v>([\s\S]*?)<\/v>/.exec(inner)?.[1]
          value = shared[Number(raw)] ?? ''
        } else {
          value = decodeXml(/<v>([\s\S]*?)<\/v>/.exec(inner)?.[1] ?? '')
        }

        const idx = colIndex(ref)
        while (cells.length < idx) cells.push('')
        cells[idx] = value
      })
    }

    while (grid.length < rowIdx) grid.push([])
    grid[rowIdx] = cells
  })

  return grid
}
