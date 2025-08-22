'use client'

import { FormField, Button } from '@/components/UI'
import { useForm, useValidation } from '@/hooks'
import { supabase } from '@/lib/supabase'

export default function SignUp() {
  const { validateEmail, validatePassword, validateUsername } = useValidation()
  
  const { values, errors, isSubmitting, handleChange, handleBlur, handleSubmit, clearErrors } = useForm({
    initialValues: {
      username: '',
      email: '',
      password: ''
    },
    validationRules: {
      username: {
        required: true,
        custom: validateUsername
      },
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
        
        // Verificar si el email ya está registrado
        const { data: existingUser } = await supabase.auth.admin.getUserByEmail(values.email)
        if (existingUser) {
          throw new Error('Este email ya está registrado. Por favor, inicia sesión o usa otro email.')
        }

        // Guardamos el username en metadata para recuperarlo al iniciar sesión
        const { data, error: authError } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            data: {
              username: values.username,
            },
          },
        })

        if (authError) throw authError

        if (data.user) {
          alert('Registro exitoso. Por favor, revisa tu email para confirmar la cuenta.');
          // Limpiar el formulario
          clearErrors()
        }
      } catch (error: any) {
        throw new Error(error.message)
      }
    }
  })

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Crear cuenta</h2>
        <p className="text-gray-600">Únete a Recipunto y comienza a reciclar</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Mostrar error general si existe */}
        {errors._general && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {errors._general}
          </div>
        )}
        
        <FormField
          name="username"
          label="Nombre de usuario"
          type="text"
          inputMode="text"
          value={values.username}
          onChange={(e) => handleChange('username', e.target.value)}
          onFieldBlur={handleBlur}
          placeholder="Tu nombre de usuario"
          required
          error={errors.username}
        />
        
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
          variant="success" 
          disabled={isSubmitting}
          loading={isSubmitting}
          fullWidth
        >
          Crear cuenta
        </Button>
      </form>
    </div>
  )
}