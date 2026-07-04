'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { syncGarage, addGarageVehicle, updateGarageVehicle, removeGarageVehicle } from '@/app/actions'

export interface GarageVehicle {
  id: string
  vin: string
  name: string
  note: string
  searchQuery: string
  addedAt: string
}

interface GarageStore {
  vehicles: GarageVehicle[]
  /** 'local' until a sync proves there is a session; then the DB is the truth. */
  mode: 'local' | 'server'
  addVehicle: (vin: string, name?: string, searchQuery?: string) => GarageVehicle
  updateVehicle: (id: string, data: Partial<Pick<GarageVehicle, 'name' | 'note' | 'searchQuery'>>) => void
  removeVehicle: (id: string) => void
  /** Push localStorage vehicles into the account and adopt the server list (#17). */
  syncWithServer: () => Promise<void>
}

// One sync per page load is enough; every client-side navigation keeps the store.
let syncStarted = false

export const useGarage = create<GarageStore>()(
  persist(
    (set, get) => ({
      vehicles: [],
      mode: 'local',

      addVehicle: (vin, name = '', searchQuery = '') => {
        const vehicle: GarageVehicle = {
          id: crypto.randomUUID(),
          vin: vin.trim().toUpperCase(),
          name: name || vin.trim().toUpperCase(),
          note: '',
          searchQuery: searchQuery || vin.trim().toUpperCase(),
          addedAt: new Date().toISOString(),
        }
        set((s) => ({ vehicles: [vehicle, ...s.vehicles] }))
        if (get().mode === 'server') {
          // Same client-generated id travels to the DB, so no reconciliation.
          void addGarageVehicle(vehicle).catch(() => {})
        }
        return vehicle
      },

      updateVehicle: (id, data) => {
        set((s) => ({
          vehicles: s.vehicles.map((v) => v.id === id ? { ...v, ...data } : v),
        }))
        if (get().mode === 'server') {
          void updateGarageVehicle(id, { name: data.name, note: data.note }).catch(() => {})
        }
      },

      removeVehicle: (id) => {
        set((s) => ({ vehicles: s.vehicles.filter((v) => v.id !== id) }))
        if (get().mode === 'server') {
          void removeGarageVehicle(id).catch(() => {})
        }
      },

      syncWithServer: async () => {
        if (syncStarted) return
        syncStarted = true
        try {
          const res = await syncGarage(get().vehicles)
          if (res.signedIn && res.vehicles) {
            set({ vehicles: res.vehicles, mode: 'server' })
          } else {
            set({ mode: 'local' }) // signed out — keep the localStorage garage
          }
        } catch {
          syncStarted = false // network hiccup — allow a retry on the next load
        }
      },
    }),
    {
      name: 'tulpar-garage',
      // `mode` is per-session (depends on the cookie) — never persist it.
      partialize: (s) => ({ vehicles: s.vehicles }),
    }
  )
)
