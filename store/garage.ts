'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface GarageVehicle {
  id: string
  vin: string
  name: string
  note: string
  addedAt: string
}

interface GarageStore {
  vehicles: GarageVehicle[]
  addVehicle: (vin: string, name?: string, note?: string) => GarageVehicle
  updateVehicle: (id: string, data: Partial<Pick<GarageVehicle, 'name' | 'note'>>) => void
  removeVehicle: (id: string) => void
}

export const useGarage = create<GarageStore>()(
  persist(
    (set) => ({
      vehicles: [],

      addVehicle: (vin, name = '', note = '') => {
        const vehicle: GarageVehicle = {
          id: crypto.randomUUID(),
          vin: vin.trim().toUpperCase(),
          name: name || vin.trim().toUpperCase(),
          note,
          addedAt: new Date().toISOString(),
        }
        set((s) => ({ vehicles: [vehicle, ...s.vehicles] }))
        return vehicle
      },

      updateVehicle: (id, data) =>
        set((s) => ({
          vehicles: s.vehicles.map((v) => v.id === id ? { ...v, ...data } : v),
        })),

      removeVehicle: (id) =>
        set((s) => ({ vehicles: s.vehicles.filter((v) => v.id !== id) })),
    }),
    { name: 'tulpar-garage' }
  )
)
