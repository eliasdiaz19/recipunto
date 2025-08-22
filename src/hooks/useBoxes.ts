// src/hooks/useBoxes.ts
'use client'

import { useState, useEffect } from 'react'
import { Box } from '@/lib/types'
import { supabase } from '@/lib/supabase'

export function useBoxes() {
  const [boxes, setBoxes] = useState<Box[]>([])

  useEffect(() => {
    fetchBoxes()
  }, [])

  const fetchBoxes = async () => {
    const { data, error } = await supabase
      .from('boxes')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching boxes:', error)
      return
    }

    const boxesData: Box[] = data.map((box: any) => {
      let lat = -29.4135
      let lng = -66.8568
      
      if (box.location && box.location.coordinates && box.location.coordinates.length >= 2) {
        lat = box.location.coordinates[1]
        lng = box.location.coordinates[0]
      }

      return {
        ...box,
        location: { lat, lng }
      }
    })

    setBoxes(boxesData)
  }

  const addBox = async (box: Omit<Box, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('boxes')
      .insert([
        {
          location: `POINT(${box.location.lng} ${box.location.lat})`,
          current_containers: box.current_containers,
          max_capacity: box.max_capacity,
          status: box.status,
          creator_id: box.creator_id
        }
      ])
      .select()

    if (error) {
      console.error('Error adding box:', error)
      return null
    }

    const newBox: Box = {
      ...data[0],
      location: box.location
    }

    setBoxes(prev => [newBox, ...prev])
    return newBox
  }

  const updateBox = async (boxId: string, updates: Partial<Box>) => {
    const supabaseUpdates: any = { ...updates }
    
    // Si se está actualizando la ubicación, convertir a formato PostGIS
    if (updates.location) {
      supabaseUpdates.location = `POINT(${updates.location.lng} ${updates.location.lat})`
    }

    const { data, error } = await supabase
      .from('boxes')
      .update(supabaseUpdates)
      .eq('id', boxId)
      .select()

    if (error) {
      console.error('Error updating box:', error)
      throw error
    }

    if (!data || data.length === 0) {
      throw new Error('No data returned from update')
    }

    const updatedRow = data[0]
    
    let lat = -29.4135
    let lng = -66.8568
    
    // Si estamos actualizando la ubicación, usar la nueva ubicación directamente
    if (updates.location) {
      lat = updates.location.lat
      lng = updates.location.lng
    } else {
      // Si no estamos actualizando la ubicación, buscar la caja actual en el estado
      const currentBox = boxes.find(box => box.id === boxId)
      if (currentBox) {
        // Mantener la ubicación actual
        lat = currentBox.location.lat
        lng = currentBox.location.lng
      } else if (updatedRow.location && updatedRow.location.coordinates && updatedRow.location.coordinates.length >= 2) {
        // Solo parsear la respuesta de Supabase si no encontramos la caja actual
        lat = updatedRow.location.coordinates[1]
        lng = updatedRow.location.coordinates[0]
      }
    }

    const updatedBox: Box = {
      ...updatedRow,
      location: { lat, lng }
    }

    setBoxes(prev => prev.map(box => box.id === boxId ? updatedBox : box))
    return updatedBox
  }

  const deleteBox = async (boxId: string) => {
    const { data, error } = await supabase
      .from('boxes')
      .delete()
      .eq('id', boxId)
      .select()

    if (error) {
      console.error('Error deleting box:', error)
      throw error
    }

    if (!data || data.length === 0) {
      console.warn('No se eliminó ninguna fila para id:', boxId)
      return false
    }

    setBoxes(prev => prev.filter(box => box.id !== boxId))
    return true
  }

  const moveBox = async (boxId: string, newLocation: { lat: number; lng: number }) => {
    return updateBox(boxId, { location: newLocation })
  }

  return {
    boxes,
    addBox,
    updateBox,
    deleteBox,
    moveBox,
    refresh: fetchBoxes
  }
}