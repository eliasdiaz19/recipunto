import { memo, useMemo } from 'react'

interface ContainerCounterProps {
  current: number
  max: number
}

const ContainerCounter = memo(function ContainerCounter({ current, max }: ContainerCounterProps) {
  const percentage = useMemo(() => (current / max) * 100, [current, max])
  
  const barColor = useMemo(() => {
    if (percentage === 0) return 'bg-gray-400'
    if (percentage < 50) return 'bg-blue-500'
    if (percentage < 80) return 'bg-amber-500'
    return 'bg-green-500'
  }, [percentage])

  const percentageText = useMemo(() => percentage.toFixed(0), [percentage])

  return (
    <div className="mt-3 space-y-2">
      {/* Barra de progreso */}
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
        <div 
          className={`h-3 rounded-full transition-all duration-300 ease-out ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {/* Información del contador */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600 font-medium">
          {current} / {max} envases
        </span>
        <span className="text-gray-500">
          {percentageText}%
        </span>
      </div>
    </div>
  )
})

export default ContainerCounter
