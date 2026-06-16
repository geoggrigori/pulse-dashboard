import { delta as calcDelta } from '../lib/format'
import { LineChart } from './LineChart'

type Props = {
  label: string
  value: string
  series: number[]
  color: string
  /** For metrics where lower is better (latency, error rate). */
  invertDelta?: boolean
}

export function KpiCard({ label, value, series, color, invertDelta }: Props) {
  const curr = series[series.length - 1]
  const prev = series[series.length - 2]
  const d = calcDelta(curr, prev)
  const up = d !== null && d > 0
  const good = d === null ? null : invertDelta ? !up : up

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
          {label}
        </span>
        {d !== null && (
          <span
            className={`text-xs font-semibold tabular-nums ${
              good ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {up ? '▲' : '▼'} {Math.abs(d).toFixed(1)}%
          </span>
        )}
      </div>
      <div className="mt-1 text-2xl font-bold tabular-nums text-slate-50">{value}</div>
      <div className="mt-3">
        <LineChart data={series} color={color} height={44} />
      </div>
    </div>
  )
}
