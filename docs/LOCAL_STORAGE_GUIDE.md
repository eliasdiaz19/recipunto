# Guía de Local Storage - Recipunto

Esta guía explica cómo usar el sistema completo de Local Storage implementado en Recipunto para gestionar datos locales, formularios persistentes, tareas CRUD y toggles de UI.

## 📚 Índice

1. [Hooks Básicos](#hooks-básicos)
2. [Formularios Persistentes](#formularios-persistentes)
3. [Sistema de Tareas CRUD](#sistema-de-tareas-crud)
4. [Toggles de UI](#toggles-de-ui)
5. [Eventos de Storage](#eventos-de-storage)
6. [Caché Inteligente](#caché-inteligente)
7. [Ejemplos Prácticos](#ejemplos-prácticos)

## 🔧 Hooks Básicos

### useLocalStorage

Hook principal para manejar cualquier tipo de dato en localStorage con validación y sincronización.

```typescript
import { useLocalStorage } from '@/hooks/useLocalStorage'

function MyComponent() {
  const [value, setValue, removeValue] = useLocalStorage('my-key', 'default-value')
  
  return (
    <div>
      <input 
        value={value} 
        onChange={(e) => setValue(e.target.value)} 
      />
      <button onClick={removeValue}>Limpiar</button>
    </div>
  )
}
```

### Hooks Especializados

```typescript
// Para arrays
const [items, setItems] = useLocalStorageArray('items', [])

// Para objetos
const [config, setConfig] = useLocalStorageObject('config', { theme: 'light' })

// Para booleanos
const [isEnabled, setIsEnabled] = useLocalStorageBoolean('enabled', false)

// Para números
const [count, setCount] = useLocalStorageNumber('count', 0)
```

## 📝 Formularios Persistentes

### useFormPersistence

Guarda automáticamente los datos del formulario mientras el usuario escribe.

```typescript
import { useFormPersistence } from '@/hooks/useFormPersistence'

function MyForm() {
  const {
    formData,
    updateField,
    updateFields,
    save,
    reset,
    clear,
    isDirty,
    isSaving,
    lastSaved
  } = useFormPersistence('my-form', {
    name: '',
    email: '',
    age: 0
  }, {
    debounceMs: 1000,
    autoSave: true,
    validateBeforeSave: (data) => data.name.length > 0
  })

  return (
    <form>
      <input
        value={formData.name}
        onChange={(e) => updateField('name', e.target.value)}
        placeholder="Nombre"
      />
      
      {isDirty && (
        <div className="text-blue-600">
          💾 Guardado automáticamente
          {lastSaved && ` - ${new Date(lastSaved).toLocaleTimeString()}`}
        </div>
      )}
      
      <button type="button" onClick={save} disabled={isSaving}>
        {isSaving ? 'Guardando...' : 'Guardar'}
      </button>
    </form>
  )
}
```

### useBoxFormPersistence

Hook específico para formularios de cajas de reciclaje con validación integrada.

```typescript
import { useBoxFormPersistence } from '@/hooks/useFormPersistence'

function BoxForm() {
  const {
    formData,
    updateField,
    reset,
    isDirty
  } = useBoxFormPersistence({
    lat: 40.4168,
    lng: -3.7038,
    currentAmount: 0,
    capacity: 50,
    isFull: false,
    notes: ''
  })

  // El formulario se guarda automáticamente con validación
  return (
    <form>
      <input
        type="number"
        value={formData.capacity}
        onChange={(e) => updateField('capacity', Number(e.target.value))}
      />
    </form>
  )
}
```

## ✅ Sistema de Tareas CRUD

### useLocalTasks

Sistema completo de gestión de tareas con operaciones CRUD.

```typescript
import { useLocalTasks } from '@/hooks/useLocalTasks'

function TaskManager() {
  const {
    tasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
    clearCompleted,
    stats,
    categories
  } = useLocalTasks()

  const handleCreateTask = () => {
    createTask({
      title: 'Nueva tarea',
      description: 'Descripción de la tarea',
      priority: 'high',
      category: 'Trabajo',
      tags: ['importante', 'urgente']
    })
  }

  return (
    <div>
      <button onClick={handleCreateTask}>Crear Tarea</button>
      
      {tasks.map(task => (
        <div key={task.id}>
          <h3>{task.title}</h3>
          <button onClick={() => toggleTask(task.id)}>
            {task.completed ? 'Completada' : 'Pendiente'}
          </button>
          <button onClick={() => deleteTask(task.id)}>
            Eliminar
          </button>
        </div>
      ))}
      
      <div>
        <p>Total: {stats.total}</p>
        <p>Completadas: {stats.completed}</p>
        <p>Progreso: {stats.completionRate}%</p>
      </div>
    </div>
  )
}
```

### useRecyclingTasks

Hook especializado para tareas relacionadas con reciclaje.

```typescript
import { useRecyclingTasks } from '@/hooks/useLocalTasks'

function RecyclingTaskManager() {
  const {
    createRecyclingTask,
    createBoxMaintenanceTask,
    createCollectionTask,
    getTasksByType
  } = useRecyclingTasks()

  const handleCreateMaintenance = () => {
    createBoxMaintenanceTask('box-123', {
      title: 'Limpiar caja',
      description: 'Limpiar y desinfectar la caja',
      priority: 'medium'
    })
  }

  return (
    <div>
      <button onClick={handleCreateMaintenance}>
        Crear Tarea de Mantenimiento
      </button>
    </div>
  )
}
```

## 🎛️ Toggles de UI

### useUIToggles

Sistema centralizado para manejar todos los toggles de la interfaz.

```typescript
import { useUIToggles, useMapToggles, useThemeToggles } from '@/hooks/useUIToggles'

function SettingsPanel() {
  const { toggleState, toggle, resetToggles } = useUIToggles()
  const mapToggles = useMapToggles()
  const themeToggles = useThemeToggles()

  return (
    <div>
      <h3>Configuración General</h3>
      <label>
        <input
          type="checkbox"
          checked={toggleState.sidebarOpen}
          onChange={() => toggle('sidebarOpen')}
        />
        Sidebar abierto
      </label>

      <h3>Configuración del Mapa</h3>
      <label>
        <input
          type="checkbox"
          checked={mapToggles.isFullscreen}
          onChange={(e) => mapToggles.setFullscreen(e.target.checked)}
        />
        Pantalla completa
      </label>

      <h3>Tema</h3>
      <label>
        <input
          type="checkbox"
          checked={themeToggles.isDarkMode}
          onChange={(e) => themeToggles.setDarkMode(e.target.checked)}
        />
        Modo oscuro
      </label>
    </div>
  )
}
```

## 📡 Eventos de Storage

### useStorageEvents

Sistema de eventos para escuchar cambios en localStorage en tiempo real.

```typescript
import { useStorageEvents, useStorageListener } from '@/hooks/useStorageEvents'

function EventListener() {
  const { addListener, removeListener } = useStorageEvents()
  const [events, setEvents] = useState([])

  useEffect(() => {
    const listener = (data) => {
      setEvents(prev => [...prev, {
        key: data.key,
        value: data.value,
        timestamp: new Date(data.timestamp)
      }])
    }

    addListener('my-key', listener)
    return () => removeListener('my-key')
  }, [])

  return (
    <div>
      <h3>Eventos recientes:</h3>
      {events.map((event, index) => (
        <div key={index}>
          {event.key}: {event.value} - {event.timestamp.toLocaleTimeString()}
        </div>
      ))}
    </div>
  )
}
```

### useStorageListener

Hook simplificado para escuchar una clave específica.

```typescript
import { useStorageListener } from '@/hooks/useStorageEvents'

function MyComponent() {
  useStorageListener('counter', (data) => {
    console.log('Counter changed:', data.value)
  }, { immediate: true })

  return <div>Escuchando cambios en 'counter'</div>
}
```

## 🚀 Caché Inteligente

### useSmartCache

Sistema de caché que combina localStorage con funciones de fetch.

```typescript
import { useSmartCache } from '@/hooks/useSmartCache'

function DataComponent() {
  const cache = useSmartCache('my-data', {
    config: {
      ttl: 5 * 60 * 1000, // 5 minutos
      maxSize: 100,
      strategy: 'lru'
    }
  })

  const fetchData = async () => {
    // Registrar función de fetch
    cache.registerFetcher('my-data', async () => {
      const response = await fetch('/api/data')
      return response.json()
    })

    // Obtener datos (del caché o fetch)
    const data = await cache.get('my-data')
    console.log('Data:', data)
  }

  return (
    <div>
      <button onClick={fetchData} disabled={cache.isLoading}>
        {cache.isLoading ? 'Cargando...' : 'Cargar Datos'}
      </button>
      
      <div>
        <p>Items en caché: {cache.stats().totalItems}</p>
        <p>Total accesos: {cache.stats().totalAccesses}</p>
      </div>
    </div>
  )
}
```

## 🎯 Ejemplos Prácticos

### 1. Formulario de Configuración Persistente

```typescript
function SettingsForm() {
  const {
    formData,
    updateField,
    save,
    isDirty,
    lastSaved
  } = useFormPersistence('user-settings', {
    theme: 'light',
    language: 'es',
    notifications: true,
    autoSave: true
  })

  return (
    <form>
      <select
        value={formData.theme}
        onChange={(e) => updateField('theme', e.target.value)}
      >
        <option value="light">Claro</option>
        <option value="dark">Oscuro</option>
      </select>

      {isDirty && (
        <div className="text-green-600">
          ✅ Configuración guardada automáticamente
        </div>
      )}
    </form>
  )
}
```

### 2. Lista de Tareas con Filtros

```typescript
function TaskList() {
  const {
    tasks,
    createTask,
    toggleTask,
    deleteTask,
    setFilter,
    filter,
    stats
  } = useLocalTasks()

  return (
    <div>
      <div>
        <input
          placeholder="Buscar tareas..."
          onChange={(e) => setFilter({ search: e.target.value })}
        />
        <select
          onChange={(e) => setFilter({ completed: e.target.value === 'completed' })}
        >
          <option value="">Todas</option>
          <option value="completed">Completadas</option>
          <option value="pending">Pendientes</option>
        </select>
      </div>

      {tasks.map(task => (
        <div key={task.id} className={task.completed ? 'line-through' : ''}>
          <span>{task.title}</span>
          <button onClick={() => toggleTask(task.id)}>
            {task.completed ? '✓' : '○'}
          </button>
          <button onClick={() => deleteTask(task.id)}>🗑️</button>
        </div>
      ))}

      <div>
        <p>Progreso: {stats.completed}/{stats.total} ({stats.completionRate}%)</p>
      </div>
    </div>
  )
}
```

### 3. Panel de Control con Toggles

```typescript
function ControlPanel() {
  const mapToggles = useMapToggles()
  const themeToggles = useThemeToggles()

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h3>Mapa</h3>
        <label>
          <input
            type="checkbox"
            checked={mapToggles.isFullscreen}
            onChange={(e) => mapToggles.setFullscreen(e.target.checked)}
          />
          Pantalla completa
        </label>
        <label>
          <input
            type="checkbox"
            checked={mapToggles.showStats}
            onChange={(e) => mapToggles.setStats(e.target.checked)}
          />
          Mostrar estadísticas
        </label>
      </div>

      <div>
        <h3>Tema</h3>
        <label>
          <input
            type="checkbox"
            checked={themeToggles.isDarkMode}
            onChange={(e) => themeToggles.setDarkMode(e.target.checked)}
          />
          Modo oscuro
        </label>
        <label>
          <input
            type="checkbox"
            checked={themeToggles.animationsEnabled}
            onChange={(e) => themeToggles.setAnimations(e.target.checked)}
          />
          Animaciones
        </label>
      </div>
    </div>
  )
}
```

## 🔍 Demo Interactivo

Para ver todos estos hooks en acción, visita la página de demo:

```
http://localhost:3000/demo-local-storage
```

Esta página incluye ejemplos interactivos de todos los hooks y funcionalidades implementadas.

## 🚀 Beneficios del Sistema

1. **Persistencia Automática**: Los datos se guardan automáticamente sin intervención del usuario
2. **Sincronización**: Los cambios se sincronizan entre pestañas del navegador
3. **Validación**: Validación automática antes de guardar datos
4. **Rendimiento**: Caché inteligente reduce llamadas innecesarias a la API
5. **Experiencia de Usuario**: Los formularios no se pierden al recargar la página
6. **Flexibilidad**: Hooks especializados para diferentes casos de uso
7. **Eventos en Tiempo Real**: Escucha cambios en localStorage instantáneamente

## 🛠️ Configuración Avanzada

### Personalizar Serialización

```typescript
const [data, setData] = useLocalStorage('my-data', initialValue, {
  serialize: (value) => JSON.stringify(value, null, 2),
  deserialize: (value) => JSON.parse(value),
  syncAcrossTabs: true
})
```

### Configurar Caché

```typescript
const cache = useSmartCache('data', {
  config: {
    ttl: 10 * 60 * 1000, // 10 minutos
    maxSize: 50,
    strategy: 'lru' // 'lru' | 'fifo' | 'ttl'
  },
  onCacheHit: (key) => console.log(`Cache hit: ${key}`),
  onCacheMiss: (key) => console.log(`Cache miss: ${key}`),
  onCacheEvict: (key) => console.log(`Cache evicted: ${key}`)
})
```

Este sistema de Local Storage proporciona una base sólida para crear aplicaciones web modernas con excelente experiencia de usuario y rendimiento optimizado.

