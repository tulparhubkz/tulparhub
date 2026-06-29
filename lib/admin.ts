import { auth } from '@/lib/auth'

export interface AdminSession {
  id: string
  email: string | null
  role: string
}

/** Returns the session user if they are an admin, otherwise null. */
export async function getAdmin(): Promise<AdminSession | null> {
  let session
  try {
    session = await auth()
  } catch {
    return null // auth not configured / no session
  }
  const user = session?.user as { id?: string; email?: string | null; role?: string } | undefined
  if (!user || user.role !== 'admin') return null
  return { id: user.id ?? '', email: user.email ?? null, role: user.role }
}
