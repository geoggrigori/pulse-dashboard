import { useEffect, useRef, useState } from 'react'
import type { EventItem, MetricsPoint, ServerMessage } from '../types'

const MAX_POINTS = 120
const MAX_EVENTS = 60

export type Status = 'connecting' | 'open' | 'closed'

function defaultWsUrl(): string {
  if (typeof location === 'undefined') return 'ws://localhost:8787'
  // In production the server serves the app and the WebSocket on the same
  // origin (https → wss). In dev, Vite serves the app separately, so connect
  // to the standalone server on :8787.
  if (location.protocol === 'https:') return `wss://${location.host}`
  return `ws://${location.hostname || 'localhost'}:8787`
}

const WS_URL: string = import.meta.env.VITE_WS_URL ?? defaultWsUrl()

/**
 * Subscribes to the metrics WebSocket. Renders the initial snapshot, appends
 * each tick (capped to a rolling window), and reconnects with exponential
 * backoff if the connection drops.
 */
export function useMetricsSocket() {
  const [status, setStatus] = useState<Status>('connecting')
  const [metrics, setMetrics] = useState<MetricsPoint[]>([])
  const [events, setEvents] = useState<EventItem[]>([])

  const retry = useRef(0)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    let disposed = false

    const connect = () => {
      setStatus('connecting')
      const ws = new WebSocket(WS_URL)

      ws.onopen = () => {
        retry.current = 0
        setStatus('open')
      }

      ws.onmessage = (e) => {
        const msg = JSON.parse(e.data) as ServerMessage
        if (msg.type === 'snapshot') {
          setMetrics(msg.metrics.slice(-MAX_POINTS))
          setEvents(msg.events.slice(-MAX_EVENTS).reverse())
        } else {
          setMetrics((prev) => [...prev, msg.metric].slice(-MAX_POINTS))
          if (msg.events.length) {
            setEvents((prev) =>
              [...msg.events.slice().reverse(), ...prev].slice(0, MAX_EVENTS),
            )
          }
        }
      }

      ws.onclose = () => {
        if (disposed) return
        setStatus('closed')
        const wait = Math.min(1000 * 2 ** retry.current, 8000)
        retry.current += 1
        timer.current = window.setTimeout(connect, wait)
      }

      ws.onerror = () => ws.close()

      return ws
    }

    const ws = connect()

    return () => {
      disposed = true
      if (timer.current) clearTimeout(timer.current)
      ws.close()
    }
  }, [])

  return { status, metrics, events, latest: metrics[metrics.length - 1] }
}
