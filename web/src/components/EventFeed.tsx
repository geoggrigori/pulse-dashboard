import type { EventItem, EventLevel } from '../types'
import { fmtTime } from '../lib/format'

const STYLES: Record<EventLevel, { dot: string; text: string }> = {
  info: { dot: 'bg-sky-400', text: 'text-slate-300' },
  warn: { dot: 'bg-amber-400', text: 'text-amber-200' },
  error: { dot: 'bg-rose-500', text: 'text-rose-200' },
}

export function EventFeed({ events }: { events: EventItem[] }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-900/50">
      <div className="flex items-center justify-between border-b border-slate-800 px-5 py-3">
        <h2 className="text-sm font-semibold text-slate-200">Live events</h2>
        <span className="font-mono text-[11px] text-slate-500">{events.length}</span>
      </div>
      <ul className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {events.length === 0 && (
          <li className="px-2 py-4 text-sm text-slate-500">Waiting for events…</li>
        )}
        {events.map((e) => {
          const s = STYLES[e.level]
          return (
            <li
              key={e.id}
              className="flex items-start gap-2.5 rounded-lg px-2 py-1.5 hover:bg-slate-800/40"
            >
              <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${s.dot}`} />
              <span className={`flex-1 text-sm leading-snug ${s.text}`}>{e.message}</span>
              <span className="shrink-0 font-mono text-[11px] text-slate-500">
                {fmtTime(e.t)}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
