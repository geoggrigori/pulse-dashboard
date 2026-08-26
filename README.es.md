<!-- ══════════════════════ IDIOMAS / LANGUAGES ══════════════════════ -->
<div align="center">
<a href="README.md"><img src="https://img.shields.io/badge/Português-555555?style=for-the-badge" alt="Português"/></a>
<a href="README.en.md"><img src="https://img.shields.io/badge/English-555555?style=for-the-badge" alt="English"/></a>
<a href="README.es.md"><img src="https://img.shields.io/badge/Español-1987F0?style=for-the-badge" alt="Español"/></a>
</div>

<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:34D399,100:1987F0&height=200&section=header&text=Pulse&fontSize=54&fontColor=ffffff&animation=fadeIn&fontAlignY=35&desc=Dashboard%20de%20metricas%20en%20tiempo%20real%20via%20WebSocket&descAlignY=55&descSize=17" width="100%" alt="Pulse banner"/>
</div>

<br/>

<h1 align="center">Pulse — Dashboard de Métricas en Tiempo Real</h1>
<p align="center"><em>Métricas de operación en vivo vía WebSocket, con gráficos SVG hechos a mano — sin librería de gráficos</em></p>
<p align="center"><strong>Servidor WebSocket → stream de métricas → gráficos + KPIs en vivo, con reconexión automática</strong></p>

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
<a href="#acerca-de"><img src="https://img.shields.io/badge/▸_ACERCA_DE-1987F0?style=for-the-badge" alt="acerca"/></a>
<a href="#destacados"><img src="https://img.shields.io/badge/▸_DESTACADOS-000000?style=for-the-badge" alt="destacados"/></a>
<a href="#arquitectura"><img src="https://img.shields.io/badge/▸_ARQUITECTURA-1987F0?style=for-the-badge" alt="arquitectura"/></a>
<a href="#tecnologías"><img src="https://img.shields.io/badge/▸_TECNOLOGÍAS-000000?style=for-the-badge" alt="tech"/></a>
<a href="#uso"><img src="https://img.shields.io/badge/▸_USO-1987F0?style=for-the-badge" alt="uso"/></a>
</div>

<br/>

> 💡 **Monorepo con npm workspaces.** `npm install && npm run dev` levanta el servidor WebSocket y el frontend juntos — dashboard en `localhost:5173`.

![Pulse — dashboard de métricas en tiempo real](docs/screenshot.png)

## Acerca de

**Pulse** es un dashboard de operaciones en vivo que transmite métricas de sistema vía **WebSocket** y las renderiza con **gráficos SVG hechos a mano** — sin ninguna librería de gráficos. Tarjetas de KPI con variación porcentual, dos gráficos de serie temporal en vivo, feed de eventos en streaming, reconexión automática y una UI oscura y pulida.

Una demostración enfocada de ingeniería front-end en tiempo real: flujo de datos vía WebSocket, estado de serie temporal con ventana deslizante, visualización de datos construida desde cero y reconexión resiliente.

## Destacados

| Función | Qué hace |
|---|---|
| **Stream WebSocket en vivo** | Servidor Node (`ws`) envía una métrica por segundo; el cliente renderiza al instante |
| **Gráficos SVG desde cero** | Línea + área, responsivos, sin Recharts/Chart.js — trazo no escalable y degradados |
| **Estado de serie temporal** | Hook React custom mantiene una ventana de 120 puntos y un feed de 60 eventos |
| **Reconexión resiliente** | Backoff exponencial con indicador de conexión (Live / Conectando / Reconectando) |
| **Deltas de tendencia** | Cada KPI muestra variación % vs. el tick anterior, coloreado (invertido para métricas "menor es mejor") |
| **Simulador realista** | Random walk acotado con picos correlacionados; determinístico bajo RNG inyectado (testeable) |

## Arquitectura

**Monorepo con npm workspaces:**

| Paquete | Responsabilidad |
|---|---|
| `server/` | Servidor WebSocket, `Simulator` de métricas, historial `RingBuffer`, loop de broadcast |
| `web/` | Dashboard React — hook `useMetricsSocket`, `LineChart`, `KpiCard`, `EventFeed` |

```mermaid
flowchart LR
    S[Simulator genera métricas] --> R[RingBuffer — historial]
    R --> B[Broadcast loop — 1 tick/s]
    B -->|WebSocket| H[useMetricsSocket hook]
    H --> K[KpiCard — deltas]
    H --> L[LineChart — SVG hecho a mano]
    H --> E[EventFeed]
```

## Tecnologías

| Capa | Tecnología |
|---|---|
| Frontend | React 19, Vite 6, TypeScript, Tailwind CSS v4 |
| Backend | Node, `ws`, TypeScript (`tsx`) |
| Tooling | npm workspaces, `concurrently`, Vitest |

## Uso

```bash
npm install
npm run dev
```

- App: **http://localhost:5173**
- WebSocket: **ws://localhost:8787**

Detén el servidor (`Ctrl+C`) para ver el cliente cambiar a **Reconectando…**, y reinícialo para ver la recuperación automática.

**Pruebas:**
```bash
npm test
```
Cubren `RingBuffer` y `Simulator` — incluyendo que cada métrica generada se mantiene dentro de los límites en miles de ticks, determinístico bajo RNG fijo.

## Licencia

[MIT](LICENSE).

<div align="center">
  <img src="https://file.loading.io/color/feature/thumb/Blues-8.png?" width="100%" height="10px" alt="divider"/>
</div>

<p align="center"><sub>Desarrollado por <strong><a href="https://github.com/geoggrigori">Grigori</a></strong> · Proyecto de portafolio · 2026</sub></p>
