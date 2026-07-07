import { and, asc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { garage } from '@/lib/db/schema'

// Server-side "My Garage" (#17). Every query is scoped by userId — the
// previous incarnation of this service trusted a client-supplied user_id and
// bare row ids, which is exactly what got it deleted in the security review.

export const MAX_VEHICLES = 20

export interface GarageVehicleDTO {
  id: string
  vin: string
  name: string
  note: string
  searchQuery: string
  addedAt: string // ISO — serializable across the server-action boundary
}

export interface GarageVehicleInput {
  id?: string // client-generated UUID so optimistic updates keep their ids
  vin: string
  name?: string
  note?: string
  searchQuery?: string
}

/** Normalize/cap client-supplied vehicle fields. Returns null for junk. */
export function sanitizeVehicle(input: GarageVehicleInput): Required<GarageVehicleInput> | null {
  const vin = (input.vin ?? '').trim().toUpperCase().slice(0, 24)
  if (vin.length < 3) return null
  const id = (input.id ?? '').trim().slice(0, 40)
  return {
    id: /^[\w-]{10,40}$/.test(id) ? id : crypto.randomUUID(),
    vin,
    name: (input.name ?? '').trim().slice(0, 100) || vin,
    note: (input.note ?? '').trim().slice(0, 300),
    searchQuery: (input.searchQuery ?? '').trim().slice(0, 120) || vin,
  }
}

/**
 * Which of `incoming` should be inserted given the user's existing VINs and
 * the per-user cap. Pure — the localStorage import logic lives here so it can
 * be unit-tested without a database.
 */
export function pickImportable(
  existingVins: string[],
  incoming: GarageVehicleInput[],
): Required<GarageVehicleInput>[] {
  const seen = new Set(existingVins.map((v) => v.trim().toUpperCase()))
  const out: Required<GarageVehicleInput>[] = []
  for (const raw of incoming) {
    if (existingVins.length + out.length >= MAX_VEHICLES) break
    const v = sanitizeVehicle(raw)
    if (!v || seen.has(v.vin)) continue
    seen.add(v.vin)
    out.push(v)
  }
  return out
}

function toDTO(r: typeof garage.$inferSelect): GarageVehicleDTO {
  return {
    id: r.id,
    vin: r.vin,
    name: r.name,
    note: r.note ?? '',
    searchQuery: r.searchQuery ?? r.vin,
    addedAt: r.createdAt.toISOString(),
  }
}

export async function listVehicles(userId: string): Promise<GarageVehicleDTO[]> {
  const rows = await db.select().from(garage).where(eq(garage.userId, userId)).orderBy(asc(garage.createdAt))
  return rows.map(toDTO)
}

/** Insert the vehicles from `incoming` this user doesn't have yet; return the full list. */
export async function importVehicles(userId: string, incoming: GarageVehicleInput[]): Promise<GarageVehicleDTO[]> {
  const existing = await listVehicles(userId)
  const toInsert = pickImportable(existing.map((v) => v.vin), incoming.slice(0, MAX_VEHICLES))
  if (toInsert.length > 0) {
    await db.insert(garage).values(
      toInsert.map((v) => ({ id: v.id, userId, vin: v.vin, name: v.name, note: v.note, searchQuery: v.searchQuery })),
    )
    return listVehicles(userId)
  }
  return existing
}

export async function addVehicle(userId: string, input: GarageVehicleInput): Promise<GarageVehicleDTO | null> {
  const list = await importVehicles(userId, [input])
  const v = sanitizeVehicle(input)
  return list.find((x) => v && x.vin === v.vin) ?? null
}

export async function updateVehicle(
  userId: string,
  id: string,
  data: { name?: string; note?: string },
): Promise<boolean> {
  const set: { name?: string; note?: string } = {}
  if (data.name !== undefined) set.name = data.name.trim().slice(0, 100)
  if (data.note !== undefined) set.note = data.note.trim().slice(0, 300)
  if (Object.keys(set).length === 0) return false
  const rows = await db
    .update(garage)
    .set(set)
    .where(and(eq(garage.id, id), eq(garage.userId, userId)))
    .returning({ id: garage.id })
  return rows.length > 0
}

export async function removeVehicle(userId: string, id: string): Promise<void> {
  await db.delete(garage).where(and(eq(garage.id, id), eq(garage.userId, userId)))
}
