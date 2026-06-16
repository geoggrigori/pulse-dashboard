import type { EventItem, EventLevel, MetricsPoint } from './protocol'

/** Bounds for each metric so the random walk stays realistic. */
const BOUNDS = {
  rps: [80, 1200],
  latency: [40, 900],
  errorRate: [0, 20],
  activeUsers: [200, 5000],
} as const

const INFO_MESSAGES = [
  'Deploy succeeded · v2.4.1',
  'Cache warmed',
  'Autoscaler added 1 instance',
  'New user signed up',
  'Background job completed',
  'Health check passed',
  'Feature flag toggled: beta_search',
]

const clamp = (v: number, [lo, hi]: readonly [number, number]) =>
  Math.max(lo, Math.min(hi, v))
const round1 = (v: number) => Math.round(v * 10) / 10

/**
 * Generates a believable stream of system metrics via bounded random walks,
 * with occasional latency/error spikes and correlated events. A custom RNG can
 * be injected for deterministic tests.
 */
export class Simulator {
  private rps = 420
  private latency = 120
  private errorRate = 0.8
  private activeUsers = 1300
  private seq = 0

  constructor(private readonly rng: () => number = Math.random) {}

  private rand(min: number, max: number): number {
    return min + this.rng() * (max - min)
  }

  next(now: number): { metric: MetricsPoint; events: EventItem[] } {
    // Random walk with mean reversion: each value drifts but is gently pulled
    // back toward a baseline, so metrics oscillate instead of pinning to a bound.
    this.rps = clamp(this.rps + this.rand(-40, 40) + 0.05 * (450 - this.rps), BOUNDS.rps)
    this.latency = clamp(this.latency + this.rand(-14, 14) + 0.06 * (130 - this.latency), BOUNDS.latency)
    this.errorRate = clamp(this.errorRate + this.rand(-0.4, 0.4) + 0.08 * (1.2 - this.errorRate), BOUNDS.errorRate)
    this.activeUsers = clamp(this.activeUsers + this.rand(-60, 60) + 0.04 * (1400 - this.activeUsers), BOUNDS.activeUsers)

    // Occasional incident: a latency + error spike (which then mean-reverts down).
    if (this.rng() < 0.05) {
      this.latency = clamp(this.latency + this.rand(120, 320), BOUNDS.latency)
      this.errorRate = clamp(this.errorRate + this.rand(2, 6), BOUNDS.errorRate)
    }

    const metric: MetricsPoint = {
      t: now,
      rps: Math.round(this.rps),
      latency: Math.round(this.latency),
      errorRate: round1(this.errorRate),
      activeUsers: Math.round(this.activeUsers),
    }

    return { metric, events: this.makeEvents(now, metric) }
  }

  private makeEvents(now: number, m: MetricsPoint): EventItem[] {
    const out: EventItem[] = []
    if (m.errorRate > 6 && this.rng() < 0.7) {
      out.push(this.event(now, 'error', `Error rate spike: ${m.errorRate}%`))
    } else if (m.latency > 420 && this.rng() < 0.6) {
      out.push(this.event(now, 'warn', `Elevated latency: ${m.latency}ms`))
    } else if (this.rng() < 0.25) {
      const msg = INFO_MESSAGES[Math.floor(this.rng() * INFO_MESSAGES.length)]
      out.push(this.event(now, 'info', msg))
    }
    return out
  }

  private event(t: number, level: EventLevel, message: string): EventItem {
    return { id: `evt_${++this.seq}`, t, level, message }
  }
}
