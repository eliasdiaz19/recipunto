'use client'

import { FormField, Button } from '@/components/UI'
import { useForm, useValidation } from '@/hooks'
import { supabase } from '@/lib/supabase'

export default function SignUp() {
  const { validateEmail, validatePassword, validateUsername } = useValidation()
  
  const { values, errors, isSubmitting, handleChange, handleBlur, handleSubmit } = useForm({
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
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
        })

        if (authError) throw authError

        if (authData.user) {
          await new Promise(resolve => setTimeout(resolve, 1000));

          const { error: profileError } = await supabase
            .from('users')
            .insert([{ 
              id: authData.user.id, 
              username: values.username
            }])

          if (profileError) {
            // No es posible borrar el usuario desde el cliente (requiere key de servicio)
            // Informamos el error para que se resuelva manualmente o vía backend
            console.error('Error creando perfil de usuario:', profileError)
            throw profileError
          }
        }

        alert('Registro exitoso. Por favor, revisa tu email para confirmar la cuenta.');
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