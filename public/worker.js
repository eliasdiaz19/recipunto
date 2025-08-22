// Web Worker para operaciones pesadas en background

// Función para procesar datos de cajas en background
function processBoxData(boxes) {
  const startTime = performance.now()
  
  // Simular procesamiento pesado
  const processedBoxes = boxes.map(box => {
    // Cálculos complejos simulados
    const efficiency = calculateEfficiency(box)
    const optimalCapacity = calculateOptimalCapacity(box)
    const routeOptimization = calculateRouteOptimization(box)
    
    return {
      ...box,
      efficiency,
      optimalCapacity,
      routeOptimization,
      processedAt: new Date().toISOString()
    }
  })
  
  const endTime = performance.now()
  const processingTime = endTime - startTime
  
  return {
    processedBoxes,
    processingTime,
    totalBoxes: boxes.length
  }
}

// Función para calcular eficiencia de una caja
function calculateEfficiency(box) {
  const utilization = box.current_containers / box.max_capacity
  const daysSinceCreation = (Date.now() - new Date(box.created_at).getTime()) / (1000 * 60 * 60 * 24)
  
  // Algoritmo complejo de eficiencia
  let efficiency = 0
  
  if (utilization > 0.8) {
    efficiency += 40 // Alta utilización
  } else if (utilization > 0.5) {
    efficiency += 25 // Media utilización
  } else {
    efficiency += 10 // Baja utilización
  }
  
  if (daysSinceCreation < 30) {
    efficiency += 30 // Caja nueva
  } else if (daysSinceCreation < 90) {
    efficiency += 20 // Caja reciente
  } else {
    efficiency += 10 // Caja antigua
  }
  
  // Factor de ubicación (simulado)
  const locationFactor = Math.random() * 20
  efficiency += locationFactor
  
  return Math.min(100, Math.round(efficiency))
}

// Función para calcular capacidad óptima
function calculateOptimalCapacity(box) {
  const currentUtilization = box.current_containers / box.max_capacity
  const historicalData = generateHistoricalData(box)
  
  // Análisis de tendencias
  const trend = analyzeTrend(historicalData)
  const seasonalFactor = calculateSeasonalFactor()
  
  let optimalCapacity = box.max_capacity
  
  if (trend === 'increasing' && currentUtilization > 0.7) {
    optimalCapacity = Math.round(box.max_capacity * 1.2)
  } else if (trend === 'decreasing' && currentUtilization < 0.3) {
    optimalCapacity = Math.round(box.max_capacity * 0.8)
  }
  
  // Aplicar factor estacional
  optimalCapacity = Math.round(optimalCapacity * seasonalFactor)
  
  return Math.max(10, Math.min(1000, optimalCapacity))
}

// Función para optimización de rutas
function calculateRouteOptimization(box) {
  // Simular cálculo de ruta óptima
  const baseRoute = generateBaseRoute(box)
  const trafficConditions = simulateTrafficConditions()
  const weatherConditions = simulateWeatherConditions()
  
  return {
    baseRoute,
    optimizedRoute: optimizeRoute(baseRoute, trafficConditions, weatherConditions),
    estimatedTime: calculateEstimatedTime(baseRoute, trafficConditions),
    fuelEfficiency: calculateFuelEfficiency(baseRoute)
  }
}

// Funciones auxiliares simuladas
function generateHistoricalData(box) {
  const days = 30
  const data = []
  
  for (let i = 0; i < days; i++) {
    data.push({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
      containers: Math.floor(Math.random() * box.max_capacity),
      dayOfWeek: new Date(Date.now() - i * 24 * 60 * 60 * 1000).getDay()
    })
  }
  
  return data.reverse()
}

function analyzeTrend(data) {
  const recent = data.slice(-7)
  const older = data.slice(-14, -7)
  
  const recentAvg = recent.reduce((sum, item) => sum + item.containers, 0) / recent.length
  const olderAvg = older.reduce((sum, item) => sum + item.containers, 0) / older.length
  
  if (recentAvg > olderAvg * 1.1) return 'increasing'
  if (recentAvg < olderAvg * 0.9) return 'decreasing'
  return 'stable'
}

function calculateSeasonalFactor() {
  const month = new Date().getMonth()
  
  // Factores estacionales simulados
  if (month >= 11 || month <= 1) return 1.1 // Verano
  if (month >= 2 && month <= 4) return 0.9 // Otoño
  if (month >= 5 && month <= 7) return 0.95 // Invierno
  return 1.0 // Primavera
}

function generateBaseRoute(box) {
  // Simular generación de ruta base
  return {
    waypoints: [
      { lat: box.location.lat, lng: box.location.lng },
      { lat: box.location.lat + 0.001, lng: box.location.lng + 0.001 }
    ],
    distance: Math.random() * 10 + 1,
    complexity: Math.random() * 5 + 1
  }
}

function simulateTrafficConditions() {
  const hour = new Date().getHours()
  
  if (hour >= 7 && hour <= 9) return 'heavy' // Hora pico mañana
  if (hour >= 17 && hour <= 19) return 'heavy' // Hora pico tarde
  if (hour >= 22 || hour <= 6) return 'light' // Noche
  return 'moderate'
}

function simulateWeatherConditions() {
  const conditions = ['clear', 'rainy', 'cloudy', 'windy']
  return conditions[Math.floor(Math.random() * conditions.length)]
}

function optimizeRoute(baseRoute, traffic, weather) {
  // Simular optimización de ruta
  let optimizationFactor = 1.0
  
  if (traffic === 'heavy') optimizationFactor *= 1.3
  if (weather === 'rainy') optimizationFactor *= 1.2
  if (weather === 'windy') optimizationFactor *= 1.1
  
  return {
    ...baseRoute,
    optimizedDistance: baseRoute.distance * optimizationFactor,
    trafficConditions: traffic,
    weatherConditions: weather
  }
}

function calculateEstimatedTime(route, traffic) {
  const baseTime = route.distance * 2 // 2 minutos por km
  let timeMultiplier = 1.0
  
  switch (traffic) {
    case 'heavy': timeMultiplier = 1.5; break
    case 'moderate': timeMultiplier = 1.2; break
    case 'light': timeMultiplier = 0.8; break
  }
  
  return Math.round(baseTime * timeMultiplier)
}

function calculateFuelEfficiency(route) {
  // Simular cálculo de eficiencia de combustible
  const baseEfficiency = 15 // km/l
  const routeEfficiency = baseEfficiency * (1 - route.complexity * 0.1)
  
  return Math.max(8, Math.round(routeEfficiency))
}

// Escuchar mensajes del hilo principal
self.addEventListener('message', (event) => {
  const { type, data, id } = event.data
  
  try {
    let result
    
    switch (type) {
      case 'PROCESS_BOX_DATA':
        result = processBoxData(data.boxes)
        break
        
      case 'CALCULATE_EFFICIENCY':
        result = calculateEfficiency(data.box)
        break
        
      case 'OPTIMIZE_ROUTES':
        result = data.boxes.map(box => calculateRouteOptimization(box))
        break
        
      default:
        throw new Error(`Tipo de operación no reconocido: ${type}`)
    }
    
    // Enviar resultado de vuelta al hilo principal
    self.postMessage({
      id,
      type: 'SUCCESS',
      result
    })
    
  } catch (error) {
    // Enviar error de vuelta al hilo principal
    self.postMessage({
      id,
      type: 'ERROR',
      error: error.message
    })
  }
})

// Notificar que el worker está listo
self.postMessage({
  type: 'WORKER_READY',
  timestamp: Date.now()
})
