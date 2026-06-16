import type { ReactNode } from 'react'
import { EventFeed } from './components/EventFeed'
import { KpiCard } from './components/KpiCard'
import { LineChart } from './components/LineChart'
import { useMetricsSocket, type Status } from './hooks/useMetricsSocket'
import { fmtInt, fmtMs, fmtPct } from './lib/format'

const STATUS_META: Record<Status, { label: string; dot: string; ring: string }> = {
  open: { label: 'Live', dot: 'bg-emerald-400', ring: 'bg-emerald-400/30' },
  connecting: { label: 'Connecting…', dot: 'bg-amber-400', ring: 'bg-amber-400/30' },
  closed: { label: 'Reconnecting…', dot: 'bg-rose-500', ring: 'bg-rose-500/30' },
}

export function App() {
  const { status, metrics, events, latest } = useMetricsSocket()

  const rps = metrics.map((m) => m.rps)
  const latency = metrics.map((m) => m.latency)
  const errorRate = metrics.map((m) => m.errorRate)
  const users = metrics.map((m) => m.activeUsers)
  const meta = STATUS_META[status]

  return (
    <div className="min-h-full text-slate-200">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/40 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="text-lg">⚡</span>
            <h1 className="text-lg font-bold tracking-tight">Pulse</h1>
            <span className="hidden text-xs text-slate-500 sm:inline">· realtime metrics</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              {status === 'open' && (
                <span
                  className={`absolute inline-flex h-full w-full animate-ping rounded-full ${meta.ring}`}
                />
              )}
              <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${meta.dot}`} />
            </span>
            <span className="text-xs font-medium text-slate-300">{meta.label}</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-5 py-6">
        {/* KPI row */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KpiCard label="Requests/s" value={latest ? fmtInt(latest.rps) : '—'} series={rps} color="#34d399" />
          <KpiCard label="Latency p50" value={latest ? fmtMs(latest.latency) : '—'} series={latency} color="#fbbf24" invertDelta />
          <KpiCard label="Error rate" value={latest ? fmtPct(latest.errorRate) : '—'} series={errorRate} color="#fb7185" invertDelta />
          <KpiCard label="Active users" value={latest ? fmtInt(latest.activeUsers) : '—'} series={users} color="#38bdf8" />
        </div>

        {/* Charts + event feed */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <ChartCard title="Requests per second" value={latest ? fmtInt(latest.rps) : '—'}>
              <LineChart data={rps} color="#34d399" height={180} />
            </ChartCard>
            <ChartCard title="Latency (p50, ms)" value={latest ? fmtMs(latest.latency) : '—'}>
              <LineChart data={latency} color="#fbbf24" height={180} />
            </ChartCard>
          </div>
          <div className="min-h-[24rem] lg:col-span-1 lg:min-h-0">
            <EventFeed events={events} />
          </div>
        </div>
      </main>

      <footer className="mx-auto max-w-6xl px-5 py-6 text-center text-xs text-slate-600">
        Simulated data streamed over WebSocket · built with React + Vite + a hand-rolled SVG chart
      </footer>
    </div>
  )
}

function ChartCard({
  title,
  value,
  children,
}: {
  title: string
  value: string
  children: ReactNode
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-sm font-semibold text-slate-200">{title}</h2>
        <span className="font-mono text-sm tabular-nums text-slate-400">{value}</span>
      </div>
      {children}
    </div>
  )
}
