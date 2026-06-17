// VIN decoder based on WMI (World Manufacturer Identifier) — first 3 chars
// + VDS positions 4-8 for model detection
// Focused on heavy trucks sold in Kazakhstan/CIS
import { lookupWMI } from './wmiDatabase'

export interface VinResult {
  brand: string        // e.g. "MAN"
  model: string        // e.g. "TGA"
  searchQuery: string  // what to search in catalog
  year?: number
  country?: string
  raw: {
    wmi: string
    vds: string
    vis: string
  }
}

// WMI → { brand, models }
// models: map VDS[0] or VDS[0-1] → model name
const WMI_MAP: Record<string, { brand: string; country: string; models?: Record<string, string>; default?: string }> = {
  // ── MAN ──
  'WMA': { brand: 'MAN', country: 'DE', models: { 'A': 'TGA', 'B': 'TGS', 'C': 'TGX', 'D': 'TGL', 'E': 'TGM', 'F': 'TGE', 'L': 'F2000', 'M': 'F90' }, default: 'TGA' },
  'WMK': { brand: 'MAN', country: 'DE', default: 'TGA' },
  'WM1': { brand: 'MAN', country: 'DE', default: 'TGS' },

  // ── DAF ──
  'XLR': { brand: 'DAF', country: 'NL', models: { 'A': 'XF105', 'B': 'XF106', 'C': 'CF85', 'D': 'CF75', 'E': 'LF', 'X': 'XF95' }, default: 'XF105' },
  'XL9': { brand: 'DAF', country: 'NL', default: 'XF95' },
  'XLA': { brand: 'DAF', country: 'NL', models: { 'F': 'XF106', 'E': 'XF105', 'C': 'CF85' }, default: 'XF106' },
  'XLB': { brand: 'DAF', country: 'NL', default: 'CF' },

  // ── Volvo Trucks ──
  'YV2': { brand: 'Volvo', country: 'SE', models: { 'A': 'FH12', 'B': 'FH16', 'C': 'FM', 'D': 'FH13', 'E': 'FMX', 'F': 'FH', 'G': 'FM9', 'R': 'FH16' }, default: 'FH' },
  'YV4': { brand: 'Volvo', country: 'SE', default: 'FM' },
  'YV1': { brand: 'Volvo', country: 'SE', default: 'FH12' },
  'LVV': { brand: 'Volvo', country: 'CN', default: 'FM' },

  // ── Scania ──
  'YS2': { brand: 'Scania', country: 'SE', models: { 'A': 'R', 'B': 'P', 'C': 'G', 'D': 'S', 'R': 'R420', 'P': 'P340', 'G': 'G400' }, default: 'R' },
  'XLE': { brand: 'Scania', country: 'NL', default: 'R' },
  'YS3': { brand: 'Scania', country: 'SE', default: 'P' },
  'YS4': { brand: 'Scania', country: 'SE', default: 'G' },
  'YSB': { brand: 'Scania', country: 'SE', default: 'S' },

  // ── Mercedes-Benz Trucks ──
  'WDB': { brand: 'Mercedes-Benz', country: 'DE', models: { '9': 'Actros', 'A': 'Actros', 'B': 'Axor', 'C': 'Atego', 'D': 'Arocs', 'E': 'Antos', '6': 'Actros' }, default: 'Actros' },
  'WDD': { brand: 'Mercedes-Benz', country: 'DE', default: 'Actros' },
  'WDC': { brand: 'Mercedes-Benz', country: 'DE', default: 'Atego' },
  'WEB': { brand: 'Mercedes-Benz', country: 'DE', default: 'Axor' },

  // ── IVECO ──
  'ZCF': { brand: 'IVECO', country: 'IT', models: { 'S': 'Stralis', 'C': 'Cursor', 'T': 'Trakker', 'E': 'Eurocargo', 'D': 'Daily' }, default: 'Stralis' },
  'ZFA': { brand: 'IVECO', country: 'IT', default: 'Daily' },
  'ZCG': { brand: 'IVECO', country: 'IT', default: 'Stralis' },

  // ── Renault Trucks ──
  'VF6': { brand: 'Renault Trucks', country: 'FR', models: { 'A': 'Premium', 'B': 'Magnum', 'C': 'Kerax', 'D': 'Midlum' }, default: 'Premium' },
  'VNK': { brand: 'Renault Trucks', country: 'FR', default: 'Magnum' },
  'VNA': { brand: 'Renault Trucks', country: 'FR', default: 'Premium' },

  // ── KAMAZ ──
  'X4W': { brand: 'КАМАЗ', country: 'RU', models: { '6': '6520', '5': '5490', '4': '43118', '3': '65115' }, default: '5490' },
  'XTC': { brand: 'КАМАЗ', country: 'RU', default: '6520' },

  // ── MAZ ──
  'Y3M': { brand: 'МАЗ', country: 'BY', default: '5440' },
  'XUM': { brand: 'МАЗ', country: 'BY', default: '6430' },

  // ── HOWO / Sinotruk ──
  'LZZ': { brand: 'HOWO', country: 'CN', models: { 'S': 'A7', 'T': 'T7H', 'G': 'Sitrak' }, default: 'A7' },
  'LBV': { brand: 'HOWO', country: 'CN', default: 'A7' },

  // ── Shacman ──
  'LE4': { brand: 'Shacman', country: 'CN', default: 'X3000' },
  'LXG': { brand: 'Shacman', country: 'CN', default: 'X3000' },

  // ── FAW ──
  'LVA': { brand: 'FAW', country: 'CN', default: 'J6' },
  'LFP': { brand: 'FAW', country: 'CN', default: 'J6' },

  // ── Foton ──
  'LFJ': { brand: 'Foton', country: 'CN', default: 'Auman' },
  'LF2': { brand: 'Foton', country: 'CN', default: 'Auman' },

  // ── DongFeng ──
  'LDC': { brand: 'DongFeng', country: 'CN', default: 'Tianlong' },
  'LS4': { brand: 'DongFeng', country: 'CN', default: 'KX' },
}

function extractYear(vis: string): number | undefined {
  const YR: Record<string, number> = {
    'A': 1980, 'B': 1981, 'C': 1982, 'D': 1983, 'E': 1984, 'F': 1985,
    'G': 1986, 'H': 1987, 'J': 1988, 'K': 1989, 'L': 1990, 'M': 1991,
    'N': 1992, 'P': 1993, 'R': 1994, 'S': 1995, 'T': 1996, 'V': 1997,
    'W': 1998, 'X': 1999, 'Y': 2000, '1': 2001, '2': 2002, '3': 2003,
    '4': 2004, '5': 2005, '6': 2006, '7': 2007, '8': 2008, '9': 2009,
    'A2': 2010, 'B2': 2011, 'C2': 2012, 'D2': 2013, 'E2': 2014, 'F2': 2015,
    'G2': 2016, 'H2': 2017, 'J2': 2018, 'K2': 2019, 'L2': 2020, 'M2': 2021,
    'N2': 2022, 'P2': 2023, 'R2': 2024, 'S2': 2025,
  }
  const ch = vis[0]?.toUpperCase()
  return YR[ch]
}

export function decodeVin(vin: string): VinResult | null {
  const v = vin.trim().toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, '')
  if (v.length < 11) return null

  const wmi = v.slice(0, 3)
  const vds = v.slice(3, 9)
  const vis = v.slice(9, 17)

  let entry = WMI_MAP[wmi]

  // Fallback: look up in full WMI database (436+ entries)
  if (!entry) {
    const mfrName = lookupWMI(wmi)
    if (mfrName) {
      // Extract clean brand name (remove country/detail suffixes)
      const brand = mfrName
        .replace(/\s*\([^)]*\)/g, '')  // remove "(trucks)", "(Germany)" etc
        .replace(/\s*(China|India|Brazil|Turkey|Russia|Spain|France|Netherlands|Australia|USA|Canada|UK|South Africa)$/i, '')
        .trim()
      entry = { brand, country: '', default: brand }
    }
  }

  if (!entry) return null

  // Try to find model from VDS first char
  let model = entry.default || ''
  if (entry.models) {
    const key = vds[0]
    if (key && entry.models[key]) {
      model = entry.models[key]
    } else {
      // Try two-char key
      const key2 = vds.slice(0, 2)
      if (entry.models[key2]) model = entry.models[key2]
    }
  }

  const year = extractYear(vis)

  // Build catalog search query
  const brandSearch = entry.brand === 'Mercedes-Benz' ? 'MB' : entry.brand
  const searchQuery = model ? `${brandSearch} ${model}` : brandSearch

  return {
    brand: entry.brand,
    model,
    searchQuery,
    year,
    country: entry.country,
    raw: { wmi, vds, vis },
  }
}

export function isValidVin(vin: string): boolean {
  const v = vin.trim().replace(/[^A-HJ-NPR-Z0-9]/gi, '')
  return v.length >= 11 && v.length <= 17
}
