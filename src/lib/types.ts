export interface Box {
    id: string
    location: {
      lat: number
      lng: number
    }
    current_containers: number
    max_capacity: number
    status: 'empty' | 'partial' | 'full' | 'in_transit'
    created_at: string
    creator_id?: string
  }
  
  export type BoxStatus = Box['status']
