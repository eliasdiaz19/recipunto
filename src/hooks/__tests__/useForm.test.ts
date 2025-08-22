import { renderHook, act } from '@testing-library/react'
import { useForm } from '../useForm'

describe('useForm Hook', () => {
  const initialValues = {
    email: '',
    password: '',
    name: '',
  }

  const validationRules = {
    email: (value: string) => {
      if (!value) return 'Email es requerido'
      if (!value.includes('@')) return 'Email debe ser válido'
      return null
    },
    password: (value: string) => {
      if (!value) return 'Contraseña es requerida'
      if (value.length < 6) return 'Contraseña debe tener al menos 6 caracteres'
      return null
    },
    name: (value: string) => {
      if (!value) return 'Nombre es requerido'
      if (value.length < 2) return 'Nombre debe tener al menos 2 caracteres'
      return null
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('initializes with default values', () => {
    const { result } = renderHook(() => useForm(initialValues))
    
    expect(result.current.values).toEqual(initialValues)
    expect(result.current.errors).toEqual({})
    expect(result.current.isSubmitting).toBe(false)
    expect(result.current.touched).toEqual({})
  })

  it('updates field value correctly', () => {
    const { result } = renderHook(() => useForm(initialValues))
    
    act(() => {
      result.current.setFieldValue('email', 'test@example.com')
    })
    
    expect(result.current.values.email).toBe('test@example.com')
  })

  it('updates multiple field values', () => {
    const { result } = renderHook(() => useForm(initialValues))
    
    act(() => {
      result.current.setFieldValues({
        email: 'test@example.com',
        name: 'John Doe',
      })
    })
    
    expect(result.current.values.email).toBe('test@example.com')
    expect(result.current.values.name).toBe('John Doe')
    expect(result.current.values.password).toBe('')
  })

  it('handles field change correctly', () => {
    const { result } = renderHook(() => useForm(initialValues))
    
    act(() => {
      result.current.handleChange('email', 'test@example.com')
    })
    
    expect(result.current.values.email).toBe('test@example.com')
  })

  it('handles field blur correctly', () => {
    const { result } = renderHook(() => useForm(initialValues))
    
    act(() => {
      result.current.handleBlur('email')
    })
    
    expect(result.current.touched.email).toBe(true)
  })

  it('validates single field correctly', () => {
    const { result } = renderHook(() => useForm(initialValues, validationRules))
    
    act(() => {
      result.current.validateField('email', '')
    })
    
    expect(result.current.errors.email).toBe('Email es requerido')
  })

  it('validates all fields correctly', () => {
    const { result } = renderHook(() => useForm(initialValues, validationRules))
    
    act(() => {
      result.current.validateAll()
    })
    
    expect(result.current.errors.email).toBe('Email es requerido')
    expect(result.current.errors.password).toBe('Contraseña es requerida')
    expect(result.current.errors.name).toBe('Nombre es requerido')
  })

  it('clears field error when field becomes valid', () => {
    const { result } = renderHook(() => useForm(initialValues, validationRules))
    
    // First, set an error
    act(() => {
      result.current.validateField('email', '')
    })
    expect(result.current.errors.email).toBe('Email es requerido')
    
    // Then, fix the error
    act(() => {
      result.current.validateField('email', 'test@example.com')
    })
    expect(result.current.errors.email).toBeUndefined()
  })

  it('handles form submission correctly', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined)
    const { result } = renderHook(() => useForm(initialValues, validationRules))
    
    // Set valid values
    act(() => {
      result.current.setFieldValues({
        email: 'test@example.com',
        password: 'password123',
        name: 'John Doe',
      })
    })
    
    await act(async () => {
      await result.current.handleSubmit(onSubmit)()
    })
    
    expect(onSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
      name: 'John Doe',
    })
    expect(result.current.isSubmitting).toBe(false)
  })

  it('prevents submission when validation fails', async () => {
    const onSubmit = jest.fn()
    const { result } = renderHook(() => useForm(initialValues, validationRules))
    
    await act(async () => {
      await result.current.handleSubmit(onSubmit)()
    })
    
    expect(onSubmit).not.toHaveBeenCalled()
    expect(result.current.errors.email).toBe('Email es requerido')
  })

  it('resets form to initial values', () => {
    const { result } = renderHook(() => useForm(initialValues))
    
    // Change some values
    act(() => {
      result.current.setFieldValue('email', 'changed@example.com')
      result.current.setFieldValue('name', 'Changed Name')
    })
    
    expect(result.current.values.email).toBe('changed@example.com')
    expect(result.current.values.name).toBe('Changed Name')
    
    // Reset form
    act(() => {
      result.current.reset()
    })
    
    expect(result.current.values).toEqual(initialValues)
    expect(result.current.errors).toEqual({})
    expect(result.current.touched).toEqual({})
    expect(result.current.isSubmitting).toBe(false)
  })

  it('resets form to custom values', () => {
    const { result } = renderHook(() => useForm(initialValues))
    const customValues = {
      email: 'custom@example.com',
      password: 'custompass',
      name: 'Custom Name',
    }
    
    act(() => {
      result.current.reset(customValues)
    })
    
    expect(result.current.values).toEqual(customValues)
  })

  it('tracks touched state correctly', () => {
    const { result } = renderHook(() => useForm(initialValues))
    
    act(() => {
      result.current.handleBlur('email')
      result.current.handleBlur('password')
    })
    
    expect(result.current.touched.email).toBe(true)
    expect(result.current.touched.password).toBe(true)
    expect(result.current.touched.name).toBe(false)
  })

  it('provides form state correctly', () => {
    const { result } = renderHook(() => useForm(initialValues))
    
    expect(result.current.isValid).toBe(true)
    expect(result.current.hasErrors).toBe(false)
    expect(result.current.isDirty).toBe(false)
    
    // Make form dirty
    act(() => {
      result.current.setFieldValue('email', 'changed@example.com')
    })
    
    expect(result.current.isDirty).toBe(true)
  })

  it('handles async validation correctly', async () => {
    const asyncValidationRules = {
      email: async (value: string) => {
        if (!value) return 'Email es requerido'
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 100))
        if (value === 'taken@example.com') return 'Email ya está en uso'
        return null
      },
    }
    
    const { result } = renderHook(() => useForm(initialValues, asyncValidationRules))
    
    await act(async () => {
      await result.current.validateField('email', 'taken@example.com')
    })
    
    expect(result.current.errors.email).toBe('Email ya está en uso')
  })

  it('handles field array correctly', () => {
    const arrayInitialValues = {
      tags: ['tag1', 'tag2'],
      items: [{ name: 'item1' }, { name: 'item2' }],
    }
    
    const { result } = renderHook(() => useForm(arrayInitialValues))
    
    act(() => {
      result.current.setFieldValue('tags', ['newtag1', 'newtag2', 'newtag3'])
    })
    
    expect(result.current.values.tags).toEqual(['newtag1', 'newtag2', 'newtag3'])
  })

  it('provides correct error count', () => {
    const { result } = renderHook(() => useForm(initialValues, validationRules))
    
    expect(result.current.errorCount).toBe(0)
    
    act(() => {
      result.current.validateAll()
    })
    
    expect(result.current.errorCount).toBe(3)
  })
})
