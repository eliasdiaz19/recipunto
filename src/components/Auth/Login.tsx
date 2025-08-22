'use client'

import { FormField, Button } from '@/components/UI'
import { useForm, useValidation } from '@/hooks'
import { supabase } from '@/lib/supabase'

export default function Login() {
  const { validateEmail, validatePassword } = useValidation()
  
  const { values, errors, isSubmitting, handleChange, handleBlur, handleSubmit, clearErrors } = useForm({
    initialValues: {
      email: '',
      password: ''
    },
    validationRules: {
      email: {
        required: true,
        custom: validateEmail
      },
      password: {
        required: true,
        custom: validatePassword
      }
    },
    onSubmit: async (values) => {
      try {
        clearErrors() // Limpiar errores previos
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        })

        if (error) {
          throw new Error(error.message)
        }

        // Crear o actualizar el perfil del usuario después de login
        const user = data.user
        if (user) {
          const username = (user.user_metadata as any)?.username || user.email?.split('@')[0] || 'usuario'

          const { error: profileError } = await supabase
            .from('users')
            .upsert(
              {
                id: user.id,
                username,
              },
              { onConflict: 'id' }
            )
          
          if (profileError) {
            console.warn('Error creando perfil de usuario:', profileError)
            // No lanzar error aquí, solo log para debugging
          }
        }
      } catch (error: any) {
        throw new Error(error.message)
      }
    }
  })

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Iniciar sesión</h2>
        <p className="text-gray-600">Accede a tu cuenta de Recipunto</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Mostrar error general si existe */}
        {errors._general && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {errors._general}
          </div>
        )}
        
        <FormField
          name="email"
          label="Correo electrónico"
          type="email"
          inputMode="email"
          value={values.email}
          onChange={(e) => handleChange('email', e.target.value)}
          onFieldBlur={handleBlur}
          placeholder="tu@email.com"
          required
          error={errors.email}
        />
        
        <FormField
          name="password"
          label="Contraseña"
          type="password"
          inputMode="text"
          value={values.password}
          onChange={(e) => handleChange('password', e.target.value)}
          onFieldBlur={handleBlur}
          placeholder="••••••••"
          required
          error={errors.password}
        />
        
        <Button 
          type="submit" 
          variant="primary" 
          disabled={isSubmitting}
          loading={isSubmitting}
          fullWidth
        >
          Iniciar sesión
        </Button>
      </form>
    </div>
  )
}