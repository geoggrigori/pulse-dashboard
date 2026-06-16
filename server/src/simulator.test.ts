import { describe, expect, it } from 'vitest'
import { RingBuffer } from './ringbuffer'
import { Simulator } from './simulator'

describe('RingBuffer', () => {
  it('keeps only the most recent items up to capacity', () => {
    const rb = new RingBuffer<number>(3)
    ;[1, 2, 3, 4, 5].forEach((n) => rb.push(n))
    expect(rb.toArray()).toEqual([3, 4, 5])
    expect(rb.size).toBe(3)
    expect(rb.last).toBe(5)
  })

  it('rejects a non-positive capacity', () => {
    expect(() => new RingBuffer<number>(0)).toThrow()
  })
})

describe('Simulator', () => {
  it('keeps every metric within realistic bounds over many ticks', () => {
    const sim = new Simulator()
    let now = 0
    for (let i = 0; i < 2000; i++) {
      const { metric } = sim.next((now += 1000))
      expect(metric.rps).toBeGreaterThanOrEqual(80)
      expect(metric.rps).toBeLessThanOrEqual(1200)
      expect(metric.latency).toBeGreaterThanOrEqual(40)
      expect(metric.latency).toBeLessThanOrEqual(900)
      expect(metric.errorRate).toBeGreaterThanOrEqual(0)
      expect(metric.errorRate).toBeLessThanOrEqual(20)
      expect(metric.activeUsers).toBeGreaterThanOrEqual(200)
      expect(metric.activeUsers).toBeLessThanOrEqual(5000)
    }
  })

  it('is deterministic when given a fixed RNG', () => {
    const fixed = () => 0.42
    const a = new Simulator(fixed).next(1000)
    const b = new Simulator(fixed).next(1000)
    expect(a.metric).toEqual(b.metric)
  })

  it('stamps the provided timestamp on the metric', () => {
    const { metric } = new Simulator().next(12345)
    expect(metric.t).toBe(12345)
  })
})
