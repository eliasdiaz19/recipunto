"use client"

interface FillLevelBarProps {
  percentage: number
}

export function FillLevelBar({ percentage }: FillLevelBarProps) {
  const safe = isFinite(percentage) && percentage >= 0 ? Math.min(100, Math.max(0, Math.round(percentage))) : 0
  const colorClass = safe >= 90 ? "bg-destructive" : safe >= 70 ? "bg-yellow-500" : "bg-secondary"

  return (
    <div className="w-full bg-muted rounded-full h-2">
      <div className={`h-2 rounded-full transition-all ${colorClass}`} style={{ width: `${safe}%` }} />
    </div>
  )
}


