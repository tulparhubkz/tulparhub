import { and, desc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { garage } from '@/lib/db/schema'

export function listGarage(userId: string) {
  return db.select().from(garage).where(eq(garage.userId, userId)).orderBy(desc(garage.createdAt))
}

export async function addGarage(input: { userId: string; vin: string; name?: string; note?: string }) {
  const vin = input.vin.toUpperCase()
  const [row] = await db
    .insert(garage)
    .values({ userId: input.userId, vin, name: input.name || vin, note: input.note || '' })
    .returning()
  return row
}

export async function updateGarage(input: { id: string; name?: string; note?: string }) {
  const [row] = await db
    .update(garage)
    .set({ name: input.name, note: input.note })
    .where(eq(garage.id, input.id))
    .returning()
  return row
}

export async function removeGarage(id: string) {
  await db.delete(garage).where(eq(garage.id, id))
}
