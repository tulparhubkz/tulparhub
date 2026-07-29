'use client'
import { useEffect, useState } from 'react'
import type { FacetCounts } from '@/lib/services/parts'

// Fetches real per-category / per-brand part counts once (see /api/facets).
// Returns null until loaded so callers can hide count chips rather than flash a 0.
export function useFacetCounts(): FacetCounts | null {
  const [counts, setCounts] = useState<FacetCounts | null>(null)
  useEffect(() => {
    let alive = true
    fetch('/api/facets')
      .then((r) => (r.ok ? r.json() : null))
      .then((d: FacetCounts | null) => { if (alive) setCounts(d) })
      .catch(() => {})
    return () => { alive = false }
  }, [])
  return counts
}
