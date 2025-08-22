'use client'

import { useState, useCallback } from 'react'

interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => string | null
}

interface ValidationRules {
  [key: string]: ValidationRule
}

interface FormData {
  [key: string]: any
}

interface FormErrors {
  [key: string]: string
}

interface UseFormOptions {
  initialValues: FormData
  validationRules?: ValidationRules
  onSubmit: (values: FormData) => Promise<void> | void
}

export function useForm({ initialValues, validationRules = {}, onSubmit }: UseFormOptions) {
  const [values, setValues] = useState<FormData>(initialValues)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({})

  // Función para validar un campo específico
  const validateField = useCallback((name: string, value: any): string | null => {
    const rules = validationRules[name]
    if (!rules) return null

    // Validación required
    if (rules.required && (!value || value.toString().trim() === '')) {
      return 'Este campo es requerido'
    }

    if (value && value.toString().trim() !== '') {
      // Validación minLength
      if (rules.minLength && value.toString().length < rules.minLength) {
        return `Mínimo ${rules.minLength} caracteres`
      }

      // Validación maxLength
      if (rules.maxLength && value.toString().length > rules.maxLength) {
        return `Máximo ${rules.maxLength} caracteres`
      }

      // Validación pattern
      if (rules.pattern && !rules.pattern.test(value.toString())) {
        return 'Formato inválido'
      }

      // Validación custom
      if (rules.custom) {
        return rules.custom(value)
      }
    }

    return null
  }, [validationRules])

  // Función para validar todo el formulario
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {}
    let isValid = true

    Object.keys(validationRules).forEach(fieldName => {
      const error = validateField(fieldName, values[fieldName])
      if (error) {
        newErrors[fieldName] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }, [values, validationRules, validateField])

  // Función para manejar cambios en los campos
  const handleChange = useCallback((name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }))
    
    // Validar en tiempo real si el campo ya fue tocado
    if (touched[name]) {
      const error = validateField(name, value)
      setErrors(prev => ({
        ...prev,
        [name]: error || ''
      }))
    }
  }, [touched, validateField])

  // Función para manejar blur (cuando el campo pierde el foco)
  const handleBlur = useCallback((name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }))
    
    const error = validateField(name, values[name])
    setErrors(prev => ({
      ...prev,
      [name]: error || ''
    }))
  }, [values, validateField])

  // Función para manejar el submit del formulario
  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
    }

    // Marcar todos los campos como tocados
    const allTouched = Object.keys(validationRules).reduce((acc, key) => {
      acc[key] = true
      return acc
    }, {} as { [key: string]: boolean })
    setTouched(allTouched)

    // Validar formulario
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(values)
    } catch (error) {
      console.error('Error en submit:', error)
    } finally {
      setIsSubmitting(false)
    }
  }, [values, validationRules, validateForm, onSubmit])

  // Función para resetear el formulario
  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
  }, [initialValues])

  // Función para establecer un valor específico
  const setValue = useCallback((name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }))
  }, [])

  // Función para establecer un error específico
  const setError = useCallback((name: string, error: string) => {
    setErrors(prev => ({ ...prev, [name]: error }))
  }, [])

  return {
    values,
    errors,
    isSubmitting,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setValue,
    setError,
    validateField
  }
}
