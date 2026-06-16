/** Mirror of the server's wire protocol (server/src/protocol.ts). */

export interface MetricsPoint {
  t: number
  rps: number
  latency: number
  errorRate: number
  activeUsers: number
}

export type EventLevel = 'info' | 'warn' | 'error'

export interface EventItem {
  id: string
  t: number
  level: EventLevel
  message: string
}

export type ServerMessage =
  | { type: 'snapshot'; metrics: MetricsPoint[]; events: EventItem[] }
  | { type: 'tick'; metric: MetricsPoint; events: EventItem[] }
