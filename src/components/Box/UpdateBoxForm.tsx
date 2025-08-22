'use client'

import { Card, FormField, Button } from '@/components/UI'
import { useForm, useValidation, useLoading } from '@/hooks'
import { Box } from '@/lib/types'

interface UpdateBoxFormProps {
  box: Box
  onUpdate: (boxId: string, updates: Partial<Box>) => Promise<void>
  onDelete: (boxId: string) => Promise<void>
  onClose: () => void
}

export default function UpdateBoxForm({ box, onUpdate, onDelete, onClose }: UpdateBoxFormProps) {
  const { validateContainers } = useValidation()
  const { loading: isUpdating, withLoading: withUpdating } = useLoading()
  const { loading: isDeleting, withLoading: withDeleting } = useLoading()
  
  const { values, errors, handleChange, handleBlur, handleSubmit } = useForm({
    initialValues: {
      containersToAdd: ''
    },
    validationRules: {
      containersToAdd: {
        custom: (value) => {
          const numToAdd = Number(value)
          if (numToAdd <= 0) return 'Debe ser un número mayor a 0'
          
          const remaining = box.max_capacity - box.current_containers
          return validateContainers(numToAdd, remaining)
        }
      }
    },
    onSubmit: async (values) => {
      const numToAdd = Number(values.containersToAdd)
      const remaining = box.max_capacity - box.current_containers
      const addAmount = Math.min(numToAdd, remaining)
      const newCount = box.current_containers + addAmount
      const newStatus = newCount >= box.max_capacity ? 'full' : 'partial'
      
      await onUpdate(box.id, {
        current_containers: newCount,
        status: newStatus
      })
      
      // Resetear el campo después de agregar
      handleChange('containersToAdd', '')
    }
  })

  const handleMarkAsFull = () => {
    withUpdating(() => onUpdate(box.id, {
      current_containers: box.max_capacity,
      status: 'full'
    }))
  }

  const handleDelete = () => {
    if (confirm('¿Estás seguro de que quieres eliminar esta caja?')) {
      withDeleting(async () => {
        await onDelete(box.id)
        onClose()
      })
    }
  }

  const remainingCapacity = box.max_capacity - box.current_containers

  const header = (
    <h3 className="text-lg font-bold text-white flex items-center">
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
      Gestionar Caja
    </h3>
  )

  const actions = (
    <div className="space-y-3">
      <Button
        variant="success"
        onClick={handleMarkAsFull}
        disabled={box.status === 'full' || isUpdating}
        loading={isUpdating}
        fullWidth
      >
        Marcar como llena
      </Button>

      <Button
        variant="danger"
        onClick={handleDelete}
        disabled={isDeleting}
        loading={isDeleting}
        fullWidth
      >
        Eliminar caja
      </Button>

      <Button
        variant="secondary"
        onClick={onClose}
        fullWidth
      >
        Cerrar
      </Button>
    </div>
  )

  return (
    <Card 
      header={header}
      headerClassName="bg-gradient-to-r from-blue-500 to-blue-600"
      actions={actions}
    >
      {/* Estado actual */}
      <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-600 mb-1">Estado actual</p>
        <p className="text-2xl font-bold text-gray-900">
          {box.current_containers} / {box.max_capacity}
        </p>
        <p className="text-sm text-gray-500">
          {remainingCapacity} espacios disponibles
        </p>
      </div>

      {/* Agregar envases */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex space-x-2">
          <FormField
            name="containersToAdd"
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            min="1"
            max={remainingCapacity}
            value={values.containersToAdd}
            onChange={(e) => {
              const raw = e.target.value
              if (raw === '') {
                handleChange('containersToAdd', '')
                return
              }
              const parsed = Math.floor(Number(raw))
              handleChange('containersToAdd', isNaN(parsed) || parsed < 1 ? '' : parsed.toString())
            }}
            onFieldBlur={handleBlur}
            placeholder={`Máx: ${remainingCapacity}`}
            disabled={box.status === 'full'}
            error={errors.containersToAdd}
            fullWidth={false}
            className="flex-1"
          />
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!values.containersToAdd || Number(values.containersToAdd) <= 0 || box.status === 'full'}
            loading={isUpdating}
            size="md"
          >
            +
          </Button>
        </div>
      </form>
    </Card>
  )
}