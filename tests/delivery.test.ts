import { describe, it, expect } from 'vitest'
import { deliveryCost, FREE_COURIER_THRESHOLD } from '@/lib/services/delivery'

describe('deliveryCost', () => {
  it('pickup is always free', () => {
    expect(deliveryCost('pickup', 0)).toBe(0)
    expect(deliveryCost('pickup', 999_999)).toBe(0)
  })

  it('courier is 2500 below the threshold and free at/above it', () => {
    expect(deliveryCost('courier', FREE_COURIER_THRESHOLD - 1)).toBe(2500)
    expect(deliveryCost('courier', FREE_COURIER_THRESHOLD)).toBe(0)
    expect(deliveryCost('courier', FREE_COURIER_THRESHOLD + 1)).toBe(0)
  })

  it('sdek is a flat 4800', () => {
    expect(deliveryCost('sdek', 0)).toBe(4800)
    expect(deliveryCost('sdek', 1_000_000)).toBe(4800)
  })

  it('freight is manager-calc (null)', () => {
    expect(deliveryCost('freight', 50_000)).toBeNull()
  })

  it('unknown/empty method never invents a charge', () => {
    expect(deliveryCost('', 10_000)).toBeNull()
    expect(deliveryCost(null, 10_000)).toBeNull()
    expect(deliveryCost(undefined, 10_000)).toBeNull()
    expect(deliveryCost('teleport', 10_000)).toBeNull()
  })
})
