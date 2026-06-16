import { WebSocket, WebSocketServer } from 'ws'
import type { EventItem, MetricsPoint, ServerMessage } from './protocol'
import { RingBuffer } from './ringbuffer'
import { Simulator } from './simulator'

const PORT = Number(process.env.PORT ?? 8787)
const HISTORY = 120 // ~2 minutes of 1s points
const TICK_MS = 1000

const sim = new Simulator()
const metrics = new RingBuffer<MetricsPoint>(HISTORY)
const events = new RingBuffer<EventItem>(50)

// Seed history so charts render fully on the very first connection.
seedHistory(60)

const wss = new WebSocketServer({ port: PORT })

wss.on('connection', (ws) => {
  const snapshot: ServerMessage = {
    type: 'snapshot',
    metrics: metrics.toArray(),
    events: events.toArray(),
  }
  ws.send(JSON.stringify(snapshot))
})

setInterval(() => {
  const { metric, events: newEvents } = sim.next(Date.now())
  metrics.push(metric)
  newEvents.forEach((e) => events.push(e))
  broadcast({ type: 'tick', metric, events: newEvents })
}, TICK_MS)

console.log(`⚡ Pulse WebSocket server listening on ws://localhost:${PORT}`)

function broadcast(msg: ServerMessage): void {
  const data = JSON.stringify(msg)
  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) client.send(data)
  }
}

function seedHistory(count: number): void {
  const start = Date.now() - count * TICK_MS
  for (let i = 0; i < count; i++) {
    const { metric, events: evs } = sim.next(start + i * TICK_MS)
    metrics.push(metric)
    evs.forEach((e) => events.push(e))
  }
}
