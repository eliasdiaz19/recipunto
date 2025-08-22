import { memo, useMemo } from 'react'
import { BoxStatus } from '@/lib/types'
import { Badge } from '@/components/UI'

const statusVariants: Record<BoxStatus, 'default' | 'warning' | 'success' | 'info'> = {
  empty: 'default',
  partial: 'warning',
  full: 'success',
  in_transit: 'info'
}

const statusLabels: Record<BoxStatus, string> = {
  empty: 'Vacía',
  partial: 'Parcialmente llena',
  full: 'Llena',
  in_transit: 'En tránsito'
}

interface StatusBadgeProps {
  status: BoxStatus
}

const StatusBadge = memo(function StatusBadge({ status }: StatusBadgeProps) {
  const variant = useMemo(() => statusVariants[status], [status])
  const label = useMemo(() => statusLabels[status], [status])

  return (
    <Badge variant={variant} size="md">
      {label}
    </Badge>
  )
})

export default StatusBadge