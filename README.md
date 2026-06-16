# Pulse ⚡ — Realtime Metrics Dashboard

A live operations dashboard that streams system metrics over **WebSockets** and renders them with **hand-built SVG charts** — no charting library. KPI cards with trend deltas, two live time-series charts, a streaming event feed, automatic reconnection, and a polished dark UI.

> A focused demo of real-time front-end engineering: WebSocket data flow, rolling time-series state, custom data-viz, and resilient reconnection.

![status](https://img.shields.io/badge/realtime-WebSocket-34d399) ![stack](https://img.shields.io/badge/React-19-38bdf8) ![stack](https://img.shields.io/badge/Vite-6-646cff)

---

![Pulse — realtime metrics dashboard](docs/screenshot.png)

## ✨ Highlights

- **Live WebSocket stream** — a Node `ws` server pushes a metrics tick every second; the client renders it instantly.
- **Hand-rolled SVG charts** — responsive line + area charts built from scratch (no Recharts/Chart.js), with non-scaling strokes and gradient fills.
- **Rolling time-series state** — a custom React hook keeps a capped 120-point window and a 60-event feed, appending each tick efficiently.
- **Resilient reconnection** — exponential backoff with a live connection indicator (Live / Connecting / Reconnecting).
- **Trend deltas** — each KPI shows % change vs the previous tick, color-coded (and inverted for "lower is better" metrics like latency and error rate).
- **Realistic simulator** — bounded random walks with correlated latency/error spikes and matching events; deterministic under an injected RNG (so it's testable).
- **Dark, responsive UI** — Tailwind CSS v4, adapts from mobile to wide screens.

## 🏗️ Architecture

```
  ┌─────────────────────────────┐         ws://localhost:8787        ┌──────────────────────────┐
  │  server/  (Node + ws + TS)  │  ───────────────────────────────▶ │  web/  (React + Vite)    │
  │                             │   snapshot (history) on connect    │                          │
  │  Simulator → RingBuffer     │   tick { metric, events } / 1s     │  useMetricsSocket()      │
  │  broadcast() to all clients │ ◀───────── reconnect (backoff) ─── │   → KPI cards            │
  └─────────────────────────────┘                                    │   → SVG line charts      │
                                                                      │   → live event feed      │
                                                                      └──────────────────────────┘
```

This is an **npm workspaces monorepo**:

| Package | Responsibility |
|---------|----------------|
| `server/` | WebSocket server, metrics `Simulator`, `RingBuffer` history, broadcast loop |
| `web/`    | React dashboard — `useMetricsSocket` hook, `LineChart`, `KpiCard`, `EventFeed` |

## 🚀 Getting started

```bash
# install both workspaces
npm install

# run the WebSocket server and the web app together
npm run dev
```

- Web app: **http://localhost:5173**
- WebSocket server: **ws://localhost:8787**

Open the app and watch the metrics update live. Stop the server (`Ctrl+C`) to see the client flip to **Reconnecting…**, then restart it to watch it recover automatically.

## 🧪 Tests

```bash
npm test
```

Unit tests (Vitest) cover the `RingBuffer` and the `Simulator` — including that every generated metric stays within bounds over thousands of ticks and that output is deterministic under a fixed RNG.

## 🛠️ Tech stack

- **Frontend:** React 19, Vite 6, TypeScript, Tailwind CSS v4
- **Backend:** Node, `ws`, TypeScript (run with `tsx`)
- **Tooling:** npm workspaces, `concurrently`, Vitest

## 📝 Notes

- The metrics are **simulated** server-side — the point is the realtime pipeline and visualization, which would work identically against a real data source.
- The charts are intentionally dependency-free to show the underlying math (scaling, path generation) rather than hide it behind a library.

---

Built as a portfolio project to demonstrate realtime front-end engineering end to end.
