type Props = {
  data: number[]
  color?: string
  height?: number
  strokeWidth?: number
  fill?: boolean
}

/**
 * A dependency-free SVG line + area chart. Uses a fixed viewBox stretched to
 * the container width (`preserveAspectRatio="none"`) with a non-scaling stroke,
 * so it stays crisp and responsive at any size.
 */
export function LineChart({
  data,
  color = '#34d399',
  height = 56,
  strokeWidth = 1.75,
  fill = true,
}: Props) {
  const width = 300

  if (data.length < 2) {
    return <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height }} />
  }

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const stepX = width / (data.length - 1)
  const pad = 3
  const y = (v: number) => height - pad - ((v - min) / range) * (height - pad * 2)

  const line = data
    .map((v, i) => `${i ? 'L' : 'M'}${(i * stepX).toFixed(1)} ${y(v).toFixed(1)}`)
    .join(' ')
  const area = `${line} L${width} ${height} L0 ${height} Z`
  const gradientId = `grad-${color.replace('#', '')}-${height}`

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full"
      style={{ height }}
      preserveAspectRatio="none"
      role="img"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.25} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      {fill && <path d={area} fill={`url(#${gradientId})`} />}
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
