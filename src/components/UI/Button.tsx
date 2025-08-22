'use client'

import { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
  loading?: boolean
  fullWidth?: boolean
}

const buttonVariants = {
  primary: 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white',
  secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
  danger: 'bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white',
  success: 'bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white',
  warning: 'bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white'
}

const buttonSizes = {
  sm: 'py-2 px-3 text-sm',
  md: 'py-2.5 px-4 text-base',
  lg: 'py-3 px-6 text-lg'
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  loading = false,
  fullWidth = false,
  disabled,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'font-medium rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed btn-mobile',
        buttonVariants[variant],
        buttonSizes[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Cargando...
        </div>
      ) : (
        children
      )}
    </button>
  )
}
