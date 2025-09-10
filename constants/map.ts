// Constantes relacionadas con el mapa

export const MAP_CONFIG = {
  // Configuración por defecto del mapa
  DEFAULT_ZOOM: 13,
  MIN_ZOOM: 8,
  MAX_ZOOM: 18,
  
  // Coordenadas por defecto (Madrid, España)
  DEFAULT_CENTER: {
    lat: 40.4168,
    lng: -3.7038,
  },
  
  // Límites del mapa
  BOUNDS: {
    north: 40.8,
    south: 40.0,
    east: -3.3,
    west: -4.0,
  },
  
  // Estilos del mapa
  MAP_STYLE: 'mapbox://styles/mapbox/streets-v11',
  
  // Configuración de marcadores
  MARKER_SIZE: 32,
  SELECTED_MARKER_SIZE: 40,
  
  // Distancias
  MAX_DISTANCE_KM: 50,
  SEARCH_RADIUS_KM: 10,
} as const

export const MAP_ICONS = {
  BOX: '📦',
  BOX_FULL: '📦',
  BOX_EMPTY: '📦',
  USER: '👤',
  DESTINATION: '🎯',
  SEARCH: '🔍',
} as const

export const MAP_COLORS = {
  PRIMARY: '#3B82F6',
  SECONDARY: '#6B7280',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  ERROR: '#EF4444',
  INFO: '#3B82F6',
} as const
