# Pulse ⚡ — Panel de Métricas en Tiempo Real

[English](README.md) · [Português](README.pt.md) · **Español**

Un panel operativo en vivo que transmite métricas del sistema mediante **WebSockets** y las representa con **gráficos SVG hechos a mano** — sin ninguna biblioteca de gráficos. Tarjetas de KPI con variaciones de tendencia, dos gráficos de series temporales en vivo, un feed de eventos en streaming, reconexión automática y una interfaz oscura cuidada.

> Una demostración centrada en la ingeniería front-end en tiempo real: flujo de datos por WebSocket, estado de series temporales continuas, visualización de datos a medida y reconexión resiliente.

![status](https://img.shields.io/badge/realtime-WebSocket-34d399) ![stack](https://img.shields.io/badge/React-19-38bdf8) ![stack](https://img.shields.io/badge/Vite-6-646cff)

---

![Pulse — panel de métricas en tiempo real](docs/screenshot.png)

## ✨ Aspectos destacados

- **Stream en vivo por WebSocket** — un servidor Node `ws` envía un tick de métricas cada segundo; el cliente lo representa al instante.
- **Gráficos SVG hechos a mano** — gráficos de línea + área responsivos construidos desde cero (sin Recharts/Chart.js), con trazos de grosor constante y rellenos con degradado.
- **Estado de series temporales continuas** — un hook de React personalizado mantiene una ventana acotada de 120 puntos y un feed de 60 eventos, añadiendo cada tick de forma eficiente.
- **Reconexión resiliente** — backoff exponencial con un indicador de conexión en vivo (En vivo / Conectando / Reconectando).
- **Variaciones de tendencia** — cada KPI muestra el cambio porcentual respecto al tick anterior, con colores indicativos (e invertidos para métricas en las que "menos es mejor", como la latencia y la tasa de error).
- **Simulador realista** — paseos aleatorios acotados con picos correlacionados de latencia/error y eventos correspondientes; determinista bajo un RNG inyectado (y, por tanto, comprobable).
- **Interfaz oscura y responsiva** — Tailwind CSS v4, se adapta desde pantallas móviles hasta pantallas anchas.

## 🏗️ Arquitectura

![Architecture](docs/architecture.svg)

Es un **monorepo con npm workspaces**:

| Paquete | Responsabilidad |
|---------|----------------|
| `server/` | Servidor WebSocket, `Simulator` de métricas, historial `RingBuffer`, bucle de broadcast |
| `web/`    | Panel React — hook `useMetricsSocket`, `LineChart`, `KpiCard`, `EventFeed` |

## 🚀 Primeros pasos

```bash
# install both workspaces
npm install

# run the WebSocket server and the web app together
npm run dev
```

- Aplicación web: **http://localhost:5173**
- Servidor WebSocket: **ws://localhost:8787**

Abre la aplicación y observa cómo las métricas se actualizan en vivo. Detén el servidor (`Ctrl+C`) para ver que el cliente cambia a **Reconectando…** y reinícialo para verlo recuperarse automáticamente.

## 🧪 Pruebas

```bash
npm test
```

Las pruebas unitarias (Vitest) cubren el `RingBuffer` y el `Simulator` — incluyendo que cada métrica generada se mantiene dentro de los límites a lo largo de miles de ticks y que la salida es determinista bajo un RNG fijo.

## 🛠️ Stack tecnológico

- **Frontend:** React 19, Vite 6, TypeScript, Tailwind CSS v4
- **Backend:** Node, `ws`, TypeScript (ejecutado con `tsx`)
- **Herramientas:** npm workspaces, `concurrently`, Vitest

## 📝 Notas

- Las métricas están **simuladas** en el servidor — el objetivo es el pipeline en tiempo real y la visualización, que funcionarían de forma idéntica con una fuente de datos real.
- Los gráficos son intencionadamente libres de dependencias para mostrar la matemática subyacente (escalado, generación de paths) en lugar de ocultarla tras una biblioteca.

---

Desarrollado como proyecto de portafolio para demostrar la ingeniería front-end en tiempo real de principio a fin.
