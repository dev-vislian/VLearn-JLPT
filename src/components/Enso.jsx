const RADIUS = 26
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function Enso({
  percent,
  size = 64,
  strokeWidth = 4,
  label,
  labelClassName = 'text-xs font-bold',
  showDoneMark = true,
  trackColor = 'var(--zen-border)',
  progressColor = 'var(--zen-seal)',
}) {
  const clamped = Math.min(100, Math.max(0, Number(percent) || 0))
  const dash = (clamped / 100) * CIRCUMFERENCE
  const isDone = clamped >= 100

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
        <circle
          cx="32" cy="32" r={RADIUS}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <circle
          cx="32" cy="32" r={RADIUS}
          fill="none"
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${CIRCUMFERENCE}`}
          style={{ transition: 'stroke-dasharray 0.8s ease-out' }}
        />
      </svg>
      <span className={`absolute inset-0 flex items-center justify-center text-zen-text-dark ${labelClassName}`}>
        {label ?? `${Math.round(clamped)}%`}
      </span>
      {showDoneMark && isDone && (
        <span className="absolute -bottom-1 -right-1 text-sm" title="全部完了">✦</span>
      )}
    </div>
  )
}