/** Wire protocol shared between the WebSocket server and the web client. */

export interface MetricsPoint {
  /** epoch milliseconds */
  t: number
  /** requests per second */
  rps: number
  /** p50 latency in ms */
  latency: number
  /** error rate as a percentage */
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
  /** Sent once on connection: recent history so charts render immediately. */
  | { type: 'snapshot'; metrics: MetricsPoint[]; events: EventItem[] }
  /** Sent every tick with the newest point and any events it generated. */
  | { type: 'tick'; metric: MetricsPoint; events: EventItem[] }
