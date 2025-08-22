const CACHE_NAME = 'recipunto-v1'
const STATIC_CACHE = 'recipunto-static-v1'
const DYNAMIC_CACHE = 'recipunto-dynamic-v1'

// Archivos estáticos para cache inmediato
const STATIC_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
]

// Estrategias de cache
const cacheStrategies = {
  // Cache First para assets estáticos
  cacheFirst: async (request) => {
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    try {
      const networkResponse = await fetch(request)
      if (networkResponse.ok) {
        const cache = await caches.open(STATIC_CACHE)
        cache.put(request, networkResponse.clone())
      }
      return networkResponse
    } catch (error) {
      return new Response('Error de red', { status: 503 })
    }
  },

  // Network First para datos dinámicos
  networkFirst: async (request) => {
    try {
      const networkResponse = await fetch(request)
      if (networkResponse.ok) {
        const cache = await caches.open(DYNAMIC_CACHE)
        cache.put(request, networkResponse.clone())
      }
      return networkResponse
    } catch (error) {
      const cachedResponse = await caches.match(request)
      if (cachedResponse) {
        return cachedResponse
      }
      return new Response('Error de red', { status: 503 })
    }
  },

  // Stale While Revalidate para recursos que pueden ser obsoletos
  staleWhileRevalidate: async (request) => {
    const cachedResponse = await caches.match(request)
    
    const fetchPromise = fetch(request).then(async (networkResponse) => {
      if (networkResponse.ok) {
        const cache = await caches.open(DYNAMIC_CACHE)
        cache.put(request, networkResponse.clone())
      }
      return networkResponse
    }).catch(() => cachedResponse)

    return cachedResponse || fetchPromise
  }
}

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker instalando...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Cacheando assets estáticos...')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        console.log('Service Worker instalado correctamente')
        return self.skipWaiting()
      })
  )
})

// Activación del Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker activando...')
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Eliminando cache obsoleto:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => {
      console.log('Service Worker activado correctamente')
      return self.clients.claim()
    })
  )
})

// Interceptación de requests
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Ignorar requests no-GET
  if (request.method !== 'GET') {
    return
  }

  // Estrategia específica para diferentes tipos de recursos
  if (url.pathname.startsWith('/api/')) {
    // API calls: Network First
    event.respondWith(cacheStrategies.networkFirst(request))
  } else if (url.pathname.startsWith('/_next/') || url.pathname.includes('.')) {
    // Assets estáticos: Cache First
    event.respondWith(cacheStrategies.cacheFirst(request))
  } else {
    // Páginas: Stale While Revalidate
    event.respondWith(cacheStrategies.staleWhileRevalidate(request))
  }
})

// Manejo de mensajes del cliente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME })
  }
})

// Sincronización en background
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

// Función de sincronización en background
async function doBackgroundSync() {
  try {
    // Aquí puedes implementar lógica de sincronización
    // Por ejemplo, sincronizar datos offline con el servidor
    console.log('Sincronización en background ejecutándose...')
    
    // Ejemplo: sincronizar cajas offline
    const offlineData = await getOfflineData()
    if (offlineData.length > 0) {
      await syncOfflineData(offlineData)
    }
  } catch (error) {
    console.error('Error en sincronización background:', error)
  }
}

// Función para obtener datos offline (ejemplo)
async function getOfflineData() {
  // Implementar lógica para obtener datos almacenados offline
  return []
}

// Función para sincronizar datos offline (ejemplo)
async function syncOfflineData(data) {
  // Implementar lógica para sincronizar con el servidor
  console.log('Sincronizando datos offline:', data)
}
