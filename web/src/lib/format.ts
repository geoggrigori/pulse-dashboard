export const fmtInt = (n: number) => n.toLocaleString('en-US')
export const fmtMs = (n: number) => `${n} ms`
export const fmtPct = (n: number) => `${n.toFixed(1)}%`
export const fmtTime = (t: number) =>
  new Date(t).toLocaleTimeString('en-US', { hour12: false })

/** Percent change of `curr` vs `prev`, or null when there's no baseline. */
export function delta(curr: number | undefined, prev: number | undefined): number | null {
  if (curr === undefined || prev === undefined || prev === 0) return null
  return ((curr - prev) / prev) * 100
}
