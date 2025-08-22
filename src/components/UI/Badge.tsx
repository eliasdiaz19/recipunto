'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const badgeVariants = {
  default: 'bg-gray-100 text-gray-800 border-gray-300',
  success: 'bg-green-100 text-green-800 border-green-300',
  warning: 'bg-amber-100 text-amber-800 border-amber-300',
  danger: 'bg-red-100 text-red-800 border-red-300',
  info: 'bg-blue-100 text-blue-800 border-blue-300'
}

const badgeSizes = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base'
}

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  className
}: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center font-medium rounded-full border',
      badgeVariants[variant],
      badgeSizes[size],
      className
    )}>
      {children}
    </span>
  )
}
