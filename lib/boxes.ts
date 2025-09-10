import { supabase } from './supabaseClient'

export interface SupabaseBox {
  id: string
  lat: number
  lng: number
  current_amount: number
  capacity: number
  is_full: boolean
  created_by: string
  created_at: string
  updated_at: string
}

export interface CreateBoxData {
  lat: number
  lng: number
  current_amount?: number
  capacity: number
}

export interface UpdateBoxData {
  lat?: number
  lng?: number
  current_amount?: number
  capacity?: number
}

export interface UpdateBoxStatusData {
  current_amount: number
  is_full?: boolean
}

export class BoxService {
  /**
   * Fetch all recycling boxes
   */
  static async getAllBoxes(): Promise<SupabaseBox[]> {
    const { data, error } = await supabase
      .from('recycling_boxes')
      .select('*')
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Error fetching boxes:', error)
      throw new Error(`Failed to fetch boxes: ${error.message}`)
    }

    return data || []
  }

  /**
   * Fetch a single box by ID
   */
  static async getBoxById(id: string): Promise<SupabaseBox | null> {
    const { data, error } = await supabase
      .from('recycling_boxes')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Box not found
      }
      console.error('Error fetching box:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      })
      throw new Error(`Failed to fetch box: ${error.message}`)
    }

    return data
  }

  /**
   * Create a new recycling box
   */
  static async createBox(boxData: CreateBoxData): Promise<SupabaseBox> {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User must be authenticated to create boxes')
    }

    const { data, error } = await supabase
      .from('recycling_boxes')
      .insert({
        ...boxData,
        current_amount: boxData.current_amount || 0,
        created_by: user.id,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating box:', error)
      throw new Error(`Failed to create box: ${error.message}`)
    }

    return data
  }

  /**
   * Update an existing recycling box
   */
  static async updateBox(id: string, updates: UpdateBoxData): Promise<SupabaseBox> {
    const { data, error } = await supabase
      .from('recycling_boxes')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating box:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      })
      
      // Handle specific error cases
      if (error.code === 'PGRST301') {
        throw new Error('No tienes permisos para actualizar esta caja. Solo puedes modificar las cajas que has creado.')
      } else if (error.code === 'PGRST116') {
        throw new Error('La caja no existe o ha sido eliminada.')
      } else if (error.message) {
        throw new Error(`Error al actualizar la caja: ${error.message}`)
      } else {
        throw new Error('Error al actualizar la caja. Verifica que tengas permisos para modificarla.')
      }
    }

    return data
  }

  /**
   * Update box status (collaborative - any authenticated user can update)
   * Only allows updating current_amount and is_full
   */
  static async updateBoxStatus(id: string, statusData: UpdateBoxStatusData): Promise<SupabaseBox> {
    const { data, error } = await supabase
      .from('recycling_boxes')
      .update({
        current_amount: statusData.current_amount,
        is_full: statusData.is_full
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating box status:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      })
      
      // Handle specific error cases
      if (error.code === 'PGRST301') {
        throw new Error('No tienes permisos para actualizar el estado de esta caja.')
      } else if (error.code === 'PGRST116') {
        throw new Error('La caja no existe o ha sido eliminada.')
      } else if (error.message) {
        throw new Error(`Error al actualizar el estado de la caja: ${error.message}`)
      } else {
        throw new Error('Error al actualizar el estado de la caja. Verifica que tengas permisos para modificarla.')
      }
    }

    return data
  }

  /**
   * Delete a recycling box
   */
  static async deleteBox(id: string): Promise<void> {
    const { error } = await supabase
      .from('recycling_boxes')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting box:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      })
      
      // Handle specific error cases
      if (error.code === 'PGRST301') {
        throw new Error('No tienes permisos para eliminar esta caja. Solo puedes eliminar las cajas que has creado.')
      } else if (error.code === 'PGRST116') {
        throw new Error('La caja no existe o ya ha sido eliminada.')
      } else if (error.message) {
        throw new Error(`Error al eliminar la caja: ${error.message}`)
      } else {
        throw new Error('Error al eliminar la caja. Verifica que tengas permisos para eliminarla.')
      }
    }
  }

  /**
   * Get boxes by creator
   */
  static async getBoxesByCreator(creatorId: string): Promise<SupabaseBox[]> {
    const { data, error } = await supabase
      .from('recycling_boxes')
      .select('*')
      .eq('created_by', creatorId)
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Error fetching boxes by creator:', error)
      throw new Error(`Failed to fetch boxes: ${error.message}`)
    }

    return data || []
  }

  /**
   * Get boxes within a geographic area
   */
  static async getBoxesInArea(
    minLat: number,
    maxLat: number,
    minLng: number,
    maxLng: number
  ): Promise<SupabaseBox[]> {
    const { data, error } = await supabase
      .from('recycling_boxes')
      .select('*')
      .gte('lat', minLat)
      .lte('lat', maxLat)
      .gte('lng', minLng)
      .lte('lng', maxLng)
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Error fetching boxes in area:', error)
      throw new Error(`Failed to fetch boxes: ${error.message}`)
    }

    return data || []
  }

  /**
   * Get only full boxes
   */
  static async getFullBoxes(): Promise<SupabaseBox[]> {
    const { data, error } = await supabase
      .from('recycling_boxes')
      .select('*')
      .eq('is_full', true)
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Error fetching full boxes:', error)
      throw new Error(`Failed to fetch full boxes: ${error.message}`)
    }

    return data || []
  }

  /**
   * Get only available (not full) boxes
   */
  static async getAvailableBoxes(): Promise<SupabaseBox[]> {
    const { data, error } = await supabase
      .from('recycling_boxes')
      .select('*')
      .eq('is_full', false)
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Error fetching available boxes:', error)
      throw new Error(`Failed to fetch available boxes: ${error.message}`)
    }

    return data || []
  }
}
