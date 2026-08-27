<!-- ══════════════════════════ TITLE ══════════════════════════ -->
<div align="center">
  <img src="docs/title-banner.svg" width="100%" alt="Pulse"/>
</div>

<br/>

<!-- ══════════════════════ IDIOMAS / LANGUAGES ══════════════════════ -->
<div align="center">
<a href="README.md"><img src="https://img.shields.io/badge/Português-555555?style=for-the-badge" alt="Português"/></a>
<a href="README.en.md"><img src="https://img.shields.io/badge/English-1987F0?style=for-the-badge" alt="English"/></a>
<a href="README.es.md"><img src="https://img.shields.io/badge/Español-555555?style=for-the-badge" alt="Español"/></a>
</div>

<br/>

<div align="center">
  <img src="docs/screenshot.png" width="100%" alt="Pulse — realtime metrics dashboard"/>
</div>

<br/>

<div align="center">
<img src="https://img.shields.io/badge/Realtime-WebSocket-34D399?style=for-the-badge" alt="realtime"/>
<img src="https://img.shields.io/badge/Zero_Chart_Libs-1987F0?style=for-the-badge" alt="zero libs"/>
<br/>
<img src="https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black" alt="react"/>
<img src="https://img.shields.io/badge/Vite_6-646CFF?style=flat-square&logo=vite&logoColor=white" alt="vite"/>
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="ts"/>
<img src="https://img.shields.io/badge/Node.js_ws-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="node"/>
<img src="https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="tailwind"/>
</div>

<div align="center">
<a href="#about"><img src="https://img.shields.io/badge/▸_ABOUT-1987F0?style=for-the-badge" alt="about"/></a>
<a href="#highlights"><img src="https://img.shields.io/badge/▸_HIGHLIGHTS-000000?style=for-the-badge" alt="highlights"/></a>
<a href="#architecture"><img src="https://img.shields.io/badge/▸_ARCHITECTURE-1987F0?style=for-the-badge" alt="architecture"/></a>
<a href="#tech-stack"><img src="https://img.shields.io/badge/▸_TECH_STACK-000000?style=for-the-badge" alt="tech"/></a>
<a href="#usage"><img src="https://img.shields.io/badge/▸_USAGE-1987F0?style=for-the-badge" alt="usage"/></a>
</div>

<br/>

> 💡 **npm workspaces monorepo.** `npm install && npm run dev` starts the WebSocket server and the front end together — dashboard at `localhost:5173`.

## About

**Pulse** is a live operations dashboard that streams system metrics over **WebSockets** and renders them with **hand-built SVG charts** — no charting library. KPI cards with trend deltas, two live time-series charts, a streaming event feed, automatic reconnection, and a polished dark UI.

A focused demo of real-time front-end engineering: WebSocket data flow, rolling time-series state, custom data-viz, and resilient reconnection.

## Highlights

| Feature | What it does |
|---|---|
| **Live WebSocket stream** | A Node `ws` server pushes a metrics tick every second; the client renders it instantly |
| **Hand-rolled SVG charts** | Responsive line + area charts from scratch (no Recharts/Chart.js), non-scaling strokes, gradient fills |
| **Rolling time-series state** | Custom React hook keeps a capped 120-point window and a 60-event feed |
| **Resilient reconnection** | Exponential backoff with a live connection indicator (Live / Connecting / Reconnecting) |
| **Trend deltas** | Each KPI shows % change vs the previous tick, color-coded (inverted for "lower is better" metrics) |
| **Realistic simulator** | Bounded random walks with correlated spikes; deterministic under an injected RNG (testable) |

## Architecture

**npm workspaces monorepo:**

| Package | Responsibility |
|---|---|
| `server/` | WebSocket server, metrics `Simulator`, `RingBuffer` history, broadcast loop |
| `web/` | React dashboard — `useMetricsSocket` hook, `LineChart`, `KpiCard`, `EventFeed` |

```mermaid
flowchart LR
    S[Simulator generates metrics] --> R[RingBuffer — history]
    R --> B[Broadcast loop — 1 tick/s]
    B -->|WebSocket| H[useMetricsSocket hook]
    H --> K[KpiCard — deltas]
    H --> L[LineChart — hand-built SVG]
    H --> E[EventFeed]
```

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 6, TypeScript, Tailwind CSS v4 |
| Backend | Node, `ws`, TypeScript (`tsx`) |
| Tooling | npm workspaces, `concurrently`, Vitest |

## Usage

```bash
npm install
npm run dev
```

- App: **http://localhost:5173**
- WebSocket: **ws://localhost:8787**

Stop the server (`Ctrl+C`) to see the client flip to **Reconnecting…**, then restart it to watch it recover automatically.

**Tests:**
```bash
npm test
```
Covers `RingBuffer` and `Simulator` — including that every generated metric stays within bounds over thousands of ticks, deterministic under a fixed RNG.

## License

[MIT](LICENSE).

<div align="center">
  <img src="https://file.loading.io/color/feature/thumb/Blues-8.png?" width="100%" height="10px" alt="divider"/>
</div>

<p align="center"><sub>Built by <strong><a href="https://github.com/geoggrigori">Grigori</a></strong> · 2026</sub></p>
