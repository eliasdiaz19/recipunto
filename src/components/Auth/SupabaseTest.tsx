'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/UI'

export default function SupabaseTest() {
  const [status, setStatus] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    setStatus('Probando conexión...')
    
    try {
      // Probar conexión básica
      const { data, error } = await supabase.from('boxes').select('count')
      
      if (error) {
        setStatus(`Error de conexión: ${error.message}`)
        return
      }
      
      setStatus(`✅ Conexión exitosa. Datos: ${JSON.stringify(data)}`)
    } catch (err: any) {
      setStatus(`❌ Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const testAuth = async () => {
    setLoading(true)
    setStatus('Probando autenticación...')
    
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        setStatus(`Error de sesión: ${error.message}`)
        return
      }
      
      if (session) {
        setStatus(`✅ Sesión activa: ${session.user.email}`)
      } else {
        setStatus('ℹ️ No hay sesión activa')
      }
    } catch (err: any) {
      setStatus(`❌ Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const testSignUp = async () => {
    setLoading(true)
    setStatus('Probando registro...')
    
    try {
      const testEmail = `test-${Date.now()}@example.com`
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: 'test123456',
        options: {
          data: {
            username: 'testuser'
          }
        }
      })
      
      if (error) {
        setStatus(`Error de registro: ${error.message}`)
        return
      }
      
      if (data.user) {
        setStatus(`✅ Usuario creado: ${data.user.id}`)
        
        // Limpiar el usuario de prueba
        await supabase.auth.signOut()
      }
    } catch (err: any) {
      setStatus(`❌ Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">Pruebas de Supabase</h3>
      
      <div className="space-y-3">
        <Button 
          onClick={testConnection} 
          disabled={loading}
          variant="primary"
          size="sm"
        >
          Probar Conexión
        </Button>
        
        <Button 
          onClick={testAuth} 
          disabled={loading}
          variant="secondary"
          size="sm"
        >
          Probar Autenticación
        </Button>
        
        <Button 
          onClick={testSignUp} 
          disabled={loading}
          variant="success"
          size="sm"
        >
          Probar Registro
        </Button>
      </div>
      
      {status && (
        <div className="mt-4 p-3 bg-white border rounded text-sm">
          <strong>Estado:</strong> {status}
        </div>
      )}
    </div>
  )
}
