<!-- ══════════════════════════ TÍTULO ══════════════════════════ -->
<div align="center">
  <img src="docs/title-banner.svg" width="100%" alt="Pulse"/>
</div>

<!-- ══════════════════════ IDIOMAS / LANGUAGES ══════════════════════ -->
<div align="center">
<a href="README.md"><img src="https://img.shields.io/badge/Português-1987F0?style=for-the-badge" alt="Português"/></a>
<a href="README.en.md"><img src="https://img.shields.io/badge/English-555555?style=for-the-badge" alt="English"/></a>
<a href="README.es.md"><img src="https://img.shields.io/badge/Español-555555?style=for-the-badge" alt="Español"/></a>
</div>

<div align="center">
  <img src="docs/screenshot.png" width="100%" alt="Pulse — dashboard de métricas em tempo real"/>
</div>

<br/>

<h1 align="center">Pulse — Dashboard de Métricas em Tempo Real</h1>
<p align="center"><em>Métricas de operação ao vivo, via WebSocket, com gráficos SVG feitos à mão — sem lib de gráficos</em></p>
<p align="center"><strong>Servidor WebSocket → stream de métricas → gráficos + KPIs ao vivo, com reconexão automática</strong></p>

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
<a href="#sobre"><img src="https://img.shields.io/badge/▸_SOBRE-1987F0?style=for-the-badge" alt="sobre"/></a>
<a href="#destaques"><img src="https://img.shields.io/badge/▸_DESTAQUES-000000?style=for-the-badge" alt="destaques"/></a>
<a href="#arquitetura"><img src="https://img.shields.io/badge/▸_ARQUITETURA-1987F0?style=for-the-badge" alt="arquitetura"/></a>
<a href="#tecnologias"><img src="https://img.shields.io/badge/▸_TECNOLOGIAS-000000?style=for-the-badge" alt="tech"/></a>
<a href="#uso"><img src="https://img.shields.io/badge/▸_USO-1987F0?style=for-the-badge" alt="uso"/></a>
</div>

<br/>

> 💡 **Monorepo com npm workspaces.** `npm install && npm run dev` sobe o servidor WebSocket e o front juntos — dashboard em `localhost:5173`.

## Sobre

**Pulse** é um dashboard de operações ao vivo que transmite métricas de sistema via **WebSocket** e renderiza tudo com **gráficos SVG feitos à mão** — sem nenhuma lib de charts. Cards de KPI com variação percentual, dois gráficos de série temporal ao vivo, feed de eventos em streaming, reconexão automática e UI escura e polida.

Uma demonstração focada de engenharia front-end em tempo real: fluxo de dados via WebSocket, estado de série temporal com janela deslizante, visualização de dados construída do zero e reconexão resiliente.

## Destaques

| Recurso | O que faz |
|---|---|
| **Stream WebSocket ao vivo** | Servidor Node (`ws`) envia uma métrica por segundo; o cliente renderiza instantaneamente |
| **Gráficos SVG do zero** | Linha + área, responsivos, sem Recharts/Chart.js — stroke não-escalável e gradientes |
| **Estado de série temporal** | Hook React custom mantém janela de 120 pontos e feed de 60 eventos, com append eficiente |
| **Reconexão resiliente** | Backoff exponencial com indicador de conexão (Live / Conectando / Reconectando) |
| **Deltas de tendência** | Cada KPI mostra variação % vs. o tick anterior, colorido (invertido para métricas "menor é melhor") |
| **Simulador realista** | Random walk limitado com picos correlacionados de latência/erro; determinístico sob RNG injetado (testável) |

## Arquitetura

**Monorepo com npm workspaces:**

| Pacote | Responsabilidade |
|---|---|
| `server/` | Servidor WebSocket, `Simulator` de métricas, histórico `RingBuffer`, loop de broadcast |
| `web/` | Dashboard React — hook `useMetricsSocket`, `LineChart`, `KpiCard`, `EventFeed` |

```mermaid
flowchart LR
    S[Simulator gera métricas] --> R[RingBuffer — histórico]
    R --> B[Broadcast loop — 1 tick/s]
    B -->|WebSocket| H[useMetricsSocket hook]
    H --> K[KpiCard — deltas]
    H --> L[LineChart — SVG feito à mão]
    H --> E[EventFeed]
```

## Tecnologias

| Camada | Tecnologia |
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

Pare o servidor (`Ctrl+C`) para ver o cliente mudar para **Reconectando…**, e reinicie para ver a recuperação automática.

**Testes:**
```bash
npm test
```
Cobrem `RingBuffer` e `Simulator` — inclusive que toda métrica gerada fica dentro dos limites em milhares de ticks, com saída determinística sob RNG fixo.

## Licença

[MIT](LICENSE).

<div align="center">
  <img src="https://file.loading.io/color/feature/thumb/Blues-8.png?" width="100%" height="10px" alt="divider"/>
</div>

<p align="center"><sub>Desenvolvido por <strong><a href="https://github.com/geoggrigori">Grigori</a></strong> · 2026</sub></p>
