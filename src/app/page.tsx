// src/app/page.tsx
'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import AddBoxControl from '@/components/Map/AddBoxControl'
import Login from '@/components/Auth/Login'
import SignUp from '@/components/Auth/SignUp'

import { useBoxes } from '@/hooks/useBoxes'
import { useAuth } from '@/hooks/useAuth'
import { Box } from '@/lib/types'
import { supabase } from '@/lib/supabase'
import UpdateBoxForm from '@/components/Box/UpdateBoxForm'

// Importación dinámica para evitar SSR con Leaflet
const RecipuntoMap = dynamic(() => import('@/components/Map/MapContainer'), {
  ssr: false,
  loading: () => (
    <div className="h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="text-lg text-gray-600">Cargando mapa...</div>
    </div>
  )
})

export default function Home() {
  const { user, loading: authLoading } = useAuth()
  const { boxes, addBox, updateBox, deleteBox, moveBox } = useBoxes()
  const [showAddBox, setShowAddBox] = useState(false)
  const [newBoxLocation, setNewBoxLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [authView, setAuthView] = useState<'login' | 'signup'>('login')
  const [movingBoxId, setMovingBoxId] = useState<string | null>(null)
  const [tempLocation, setTempLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [showUpdateForm, setShowUpdateForm] = useState(false)
  const [selectedBox, setSelectedBox] = useState<Box | null>(null)

  const handleMapClick = (latlng: { lat: number; lng: number }) => {
    if (!user) {
      alert('Debes iniciar sesión para interactuar con el mapa.')
      return
    }
    
    if (movingBoxId) {
      // Si estamos en modo de movimiento, guardar la ubicación temporal
      setTempLocation(latlng)
      return
    }
    
    setNewBoxLocation(latlng)
    setShowAddBox(true)
  }

  const handleAddBox = async (maxCapacity: number, initialContainers: number) => {
    if (!newBoxLocation || !user) return

    const newBox: Omit<Box, 'id' | 'created_at'> = {
      location: newBoxLocation,
      current_containers: initialContainers,
      max_capacity: maxCapacity,
      status: initialContainers === 0 ? 'empty' : initialContainers >= maxCapacity ? 'full' : 'partial',
      creator_id: user.id
    }

    await addBox(newBox)
    setShowAddBox(false)
    setNewBoxLocation(null)
  }

  const handleUpdateBox = async (boxId: string, updates: Partial<Box>) => {
    await updateBox(boxId, updates)
  }

  const handleDeleteBox = async (boxId: string) => {
    try {
      const deleted = await deleteBox(boxId)
      if (!deleted) {
        alert('No se pudo eliminar la caja. Puede que no exista o no tengas permisos.')
      }
    } catch (error) {
      console.error('Error al eliminar caja:', error)
      alert('Error al eliminar la caja. Por favor, intenta nuevamente.')
    }
  }

  const handleMoveBox = async (boxId: string, newLocation: { lat: number; lng: number }) => {
    try {
      await moveBox(boxId, newLocation)
      setMovingBoxId(null)
      setTempLocation(null)
    } catch (error) {
      console.error('Error moving box:', error)
      alert('Error al mover la caja. Por favor, intenta nuevamente.')
    }
  }

  const handleStartMoving = (boxId: string) => {
    setMovingBoxId(boxId)
  }

  const handleCancelMoving = () => {
    setMovingBoxId(null)
    setTempLocation(null)
  }

  const handleShowUpdateForm = (box: Box) => {
    setSelectedBox(box)
    setShowUpdateForm(true)
  }

  const handleCloseUpdateForm = () => {
    setShowUpdateForm(false)
    setSelectedBox(null)
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-600">Cargando...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
          {authView === 'login' ? (
            <>
              <Login />
              <p className="mt-6 text-center text-gray-600">
                ¿No tienes cuenta?{' '}
                <button 
                  onClick={() => setAuthView('signup')} 
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Regístrate
                </button>
              </p>
            </>
          ) : (
            <>
              <SignUp />
              <p className="mt-6 text-center text-gray-600">
                ¿Ya tienes cuenta?{' '}
                <button 
                  onClick={() => setAuthView('login')} 
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Inicia sesión
                </button>
              </p>
            </>
          )}
          

        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Barra de navegación mejorada */}
      <nav className="sticky top-0 z-50 bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo y título */}
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Recipunto
              </h1>
            </div>
            
            {/* Información del usuario y botón de cerrar sesión */}
            <div className="flex items-center space-x-4">
              <span className="hidden sm:block text-gray-600 text-sm">
                Hola, <span className="font-medium text-gray-800">{user.email}</span>
              </span>
              <button 
                onClick={() => supabase.auth.signOut()}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Modal de mover caja mejorado */}
      {movingBoxId && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4 rounded-xl shadow-xl max-w-sm mx-4">
          <div className="text-center">
            <p className="font-medium mb-3">Modo mover: Haz clic en el mapa para colocar la caja</p>
            <button 
              onClick={handleCancelMoving}
              className="bg-white text-amber-600 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
      
      {/* Contenido principal */}
      <div className="pt-4">
        <RecipuntoMap 
          boxes={boxes} 
          onMapClick={handleMapClick}
          onUpdateBox={handleUpdateBox}
          onDeleteBox={handleDeleteBox}
          onMoveBox={handleMoveBox}
          movingBoxId={movingBoxId}
          tempLocation={tempLocation}
          onStartMoving={handleStartMoving}
          onCancelMoving={handleCancelMoving}
          onShowUpdateForm={handleShowUpdateForm}
        />
      </div>
      
      {/* Control de agregar caja */}
      {showAddBox && newBoxLocation && (
        <div className="fixed top-20 right-4 z-[9999] sm:top-24 sm:right-6">
          <AddBoxControl 
            onAdd={handleAddBox}
            onCancel={() => setShowAddBox(false)}
          />
        </div>
      )}

      {/* Modal de actualización de caja */}
      {showUpdateForm && selectedBox && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[9999]">
          <UpdateBoxForm
            box={selectedBox}
            onUpdate={handleUpdateBox}
            onDelete={handleDeleteBox}
            onClose={handleCloseUpdateForm}
          />
        </div>
      )}
    </div>
  )
}