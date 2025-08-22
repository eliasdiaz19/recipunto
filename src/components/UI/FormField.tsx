'use client'

import { InputHTMLAttributes, forwardRef } from 'react'
import Input from './Input'

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  label?: string
  error?: string
  helperText?: string
  fullWidth?: boolean
  onValueChange?: (name: string, value: any) => void
  onFieldBlur?: (name: string) => void
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ 
    name, 
    label, 
    error, 
    helperText, 
    fullWidth = true, 
    onValueChange, 
    onFieldBlur,
    onChange,
    onBlur: onInputBlur,
    ...props 
  }, ref) => {
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onValueChange?.(name, e.target.value)
      onChange?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      onFieldBlur?.(name)
      onInputBlur?.(e)
    }

    return (
      <Input
        ref={ref}
        name={name}
        label={label}
        error={error}
        helperText={helperText}
        fullWidth={fullWidth}
        onChange={handleChange}
        onBlur={handleBlur}
        {...props}
      />
    )
  }
)

FormField.displayName = 'FormField'

export default FormField
