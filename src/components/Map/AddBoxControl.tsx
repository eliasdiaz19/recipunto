'use client'

import { Card, FormField, Button } from '@/components/UI'
import { useForm, useValidation } from '@/hooks'

interface AddBoxControlProps {
  onAdd: (maxCapacity: number, initialContainers: number) => void
  onCancel: () => void
}

export default function AddBoxControl({ onAdd, onCancel }: AddBoxControlProps) {
  const { validateBoxCapacity, validateContainers } = useValidation()
  
  const { values, errors, isSubmitting, handleChange, handleBlur, handleSubmit } = useForm({
    initialValues: {
      maxCapacity: '',
      initialContainers: ''
    },
    validationRules: {
      maxCapacity: {
        required: true,
        custom: (value) => validateBoxCapacity(parseInt(value) || 0)
      },
      initialContainers: {
        custom: (value) => {
          const maxCap = parseInt(values.maxCapacity) || 0
          const initial = parseInt(value) || 0
          return validateContainers(initial, maxCap)
        }
      }
    },
    onSubmit: async (values) => {
      const maxCapacityNum = parseInt(values.maxCapacity)
      const initialContainersNum = parseInt(values.initialContainers) || 0
      await onAdd(maxCapacityNum, initialContainersNum)
    }
  })

  const header = (
    <h3 className="text-lg font-bold text-white flex items-center drop-shadow-sm">
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
      Nueva caja de reciclaje
    </h3>
  )

  const actions = (
    <div className="flex space-x-3">
      <Button variant="secondary" onClick={onCancel} fullWidth>
        Cancelar
      </Button>
      <Button 
        variant="success" 
        onClick={handleSubmit} 
        disabled={!values.maxCapacity || isSubmitting}
        loading={isSubmitting}
        fullWidth
      >
        Agregar caja
      </Button>
    </div>
  )

  return (
    <Card 
      header={header}
      headerClassName="bg-gradient-to-r from-green-500 to-emerald-600"
      actions={actions}
    >
      <FormField
        name="maxCapacity"
        label="Capacidad máxima"
        type="number"
        inputMode="numeric"
        pattern="[0-9]*"
        value={values.maxCapacity}
        onChange={(e) => handleChange('maxCapacity', e.target.value.replace(/[^0-9]/g, ''))}
        onFieldBlur={handleBlur}
        placeholder="Ej: 20"
        min="1"
        required
        error={errors.maxCapacity}
      />
      
      <FormField
        name="initialContainers"
        label="Envases iniciales"
        type="number"
        inputMode="numeric"
        pattern="[0-9]*"
        value={values.initialContainers}
        onChange={(e) => handleChange('initialContainers', e.target.value.replace(/[^0-9]/g, ''))}
        onFieldBlur={handleBlur}
        placeholder="Ej: 0"
        min="0"
        error={errors.initialContainers}
      />
    </Card>
  )
}
