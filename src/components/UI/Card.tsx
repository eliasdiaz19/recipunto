'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
  children: ReactNode
  className?: string
  header?: ReactNode
  headerClassName?: string
  contentClassName?: string
  actions?: ReactNode
  actionsClassName?: string
}

export default function Card({
  children,
  className,
  header,
  headerClassName,
  contentClassName,
  actions,
  actionsClassName
}: CardProps) {
  return (
    <div className={cn(
      'bg-white rounded-xl shadow-2xl border border-gray-200 w-80 max-w-[90vw]',
      className
    )}>
      {header && (
        <div className={cn(
          'px-6 py-4 rounded-t-xl',
          headerClassName
        )}>
          {header}
        </div>
      )}
      
      <div className={cn(
        'p-6 space-y-5 bg-white',
        contentClassName
      )}>
        {children}
      </div>
      
      {actions && (
        <div className={cn(
          'px-6 pb-6 space-y-3',
          actionsClassName
        )}>
          {actions}
        </div>
      )}
    </div>
  )
}
