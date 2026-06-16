import { createServer } from 'node:http'
import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { extname, join, normalize, resolve } from 'node:path'
import { WebSocket, WebSocketServer } from 'ws'
import type { EventItem, MetricsPoint, ServerMessage } from './protocol'
import { RingBuffer } from './ringbuffer'
import { Simulator } from './simulator'

const PORT = Number(process.env.PORT ?? 8787)
const HISTORY = 120 // ~2 minutes of 1s points
const TICK_MS = 1000

// Built web app (served in production so one process = static site + WebSocket).
const DIST = resolve(process.cwd(), '../web/dist')
const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
}

const sim = new Simulator()
const metrics = new RingBuffer<MetricsPoint>(HISTORY)
const events = new RingBuffer<EventItem>(50)

// Seed history so charts render fully on the very first connection.
seedHistory(60)

const httpServer = createServer(async (req, res) => {
  if (!existsSync(DIST)) {
    res.writeHead(200, { 'content-type': 'text/plain' })
    res.end('Pulse WebSocket server is running.')
    return
  }
  let urlPath = decodeURIComponent((req.url ?? '/').split('?')[0])
  if (urlPath === '/') urlPath = '/index.html'
  const filePath = normalize(join(DIST, urlPath))
  if (!filePath.startsWith(DIST)) {
    res.writeHead(403)
    res.end('Forbidden')
    return
  }
  try {
    const data = await readFile(filePath)
    res.writeHead(200, { 'content-type': MIME[extname(filePath)] ?? 'application/octet-stream' })
    res.end(data)
  } catch {
    // SPA fallback — serve index.html for unknown routes.
    try {
      const html = await readFile(join(DIST, 'index.html'))
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' })
      res.end(html)
    } catch {
      res.writeHead(404)
      res.end('Not found')
    }
  }
})

const wss = new WebSocketServer({ server: httpServer })

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

httpServer.listen(PORT, () => {
  console.log(`⚡ Pulse server (HTTP + WebSocket) listening on port ${PORT}`)
})

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
