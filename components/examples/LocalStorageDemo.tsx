'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  useLocalStorage, 
  useLocalStorageArray, 
  useLocalStorageBoolean,
  useLocalStorageNumber,
  useLocalStorageObject
} from '@/hooks/useLocalStorage'
import { useFormPersistence, useBoxFormPersistence } from '@/hooks/useFormPersistence'
import { useLocalTasks, useRecyclingTasks } from '@/hooks/useLocalTasks'
import { useUIToggles, useMapToggles, useThemeToggles } from '@/hooks/useUIToggles'
import { useStorageEvents, useStorageListener } from '@/hooks/useStorageEvents'
import { useSmartCache } from '@/hooks/useSmartCache'
import { 
  Save, 
  Trash2, 
  Plus, 
  Check, 
  X, 
  Settings, 
  List, 
  ToggleLeft, 
  ToggleRight,
  Database,
  Zap
} from 'lucide-react'

export function LocalStorageDemo() {
  const [activeTab, setActiveTab] = useState('basic')

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Demo de Local Storage</h1>
        <p className="text-muted-foreground">
          Demostración completa del sistema de Local Storage con CRUD, formularios persistentes, 
          toggles de UI y eventos en tiempo real.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic">Básico</TabsTrigger>
          <TabsTrigger value="forms">Formularios</TabsTrigger>
          <TabsTrigger value="tasks">Tareas</TabsTrigger>
          <TabsTrigger value="toggles">UI Toggles</TabsTrigger>
          <TabsTrigger value="events">Eventos</TabsTrigger>
          <TabsTrigger value="cache">Caché</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <BasicStorageDemo />
        </TabsContent>

        <TabsContent value="forms" className="space-y-6">
          <FormPersistenceDemo />
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          <TasksDemo />
        </TabsContent>

        <TabsContent value="toggles" className="space-y-6">
          <TogglesDemo />
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <EventsDemo />
        </TabsContent>

        <TabsContent value="cache" className="space-y-6">
          <CacheDemo />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Demo básico de Local Storage
function BasicStorageDemo() {
  const [text, setText] = useLocalStorage('demo-text', '')
  const [number, setNumber] = useLocalStorageNumber('demo-number', 0)
  const [isEnabled, setIsEnabled] = useLocalStorageBoolean('demo-enabled', false)
  const [items, setItems] = useLocalStorageArray('demo-items', [])

  const addItem = () => {
    const newItem = `Item ${Date.now()}`
    setItems(prev => [...prev, newItem])
  }

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Almacenamiento Básico
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="text-input">Texto persistente</Label>
            <Input
              id="text-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Escribe algo que se guardará automáticamente..."
            />
          </div>

          <div>
            <Label htmlFor="number-input">Número persistente</Label>
            <Input
              id="number-input"
              type="number"
              value={number}
              onChange={(e) => setNumber(Number(e.target.value))}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="enabled-switch"
              checked={isEnabled}
              onCheckedChange={setIsEnabled}
            />
            <Label htmlFor="enabled-switch">Habilitado</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={addItem} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Item
            </Button>
          </div>

          <div className="space-y-2 max-h-40 overflow-y-auto">
            {items.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                <span className="text-sm">{item}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Demo de formularios persistentes
function FormPersistenceDemo() {
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
  } = useBoxFormPersistence({
    lat: 40.4168,
    lng: -3.7038,
    currentAmount: 0,
    capacity: 50,
    isFull: false,
    notes: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await save()
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Save className="h-5 w-5" />
            Formulario Persistente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="lat">Latitud</Label>
                <Input
                  id="lat"
                  type="number"
                  step="0.0001"
                  value={formData.lat}
                  onChange={(e) => updateField('lat', Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="lng">Longitud</Label>
                <Input
                  id="lng"
                  type="number"
                  step="0.0001"
                  value={formData.lng}
                  onChange={(e) => updateField('lng', Number(e.target.value))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="currentAmount">Cantidad Actual</Label>
                <Input
                  id="currentAmount"
                  type="number"
                  value={formData.currentAmount}
                  onChange={(e) => updateField('currentAmount', Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="capacity">Capacidad</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => updateField('capacity', Number(e.target.value))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notas</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => updateField('notes', e.target.value)}
                placeholder="Notas adicionales..."
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isFull"
                checked={formData.isFull}
                onCheckedChange={(checked) => updateField('isFull', checked)}
              />
              <Label htmlFor="isFull">Caja llena</Label>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Guardando...' : 'Guardar'}
              </Button>
              <Button type="button" variant="outline" onClick={reset}>
                Reset
              </Button>
              <Button type="button" variant="destructive" onClick={clear}>
                Limpiar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Estado del Formulario</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant={isDirty ? 'destructive' : 'secondary'}>
                {isDirty ? 'Modificado' : 'Sin cambios'}
              </Badge>
              {isSaving && <Badge variant="outline">Guardando...</Badge>}
            </div>

            {lastSaved && (
              <p className="text-sm text-muted-foreground">
                Última guardado: {new Date(lastSaved).toLocaleString()}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Datos actuales:</h4>
            <pre className="bg-muted p-3 rounded text-xs overflow-auto">
              {JSON.stringify(formData, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Demo de tareas
function TasksDemo() {
  const {
    tasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
    clearCompleted,
    stats,
    categories
  } = useRecyclingTasks()

  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskCategory, setNewTaskCategory] = useState('Reciclaje')

  const handleCreateTask = () => {
    if (newTaskTitle.trim()) {
      createTask({
        title: newTaskTitle,
        category: newTaskCategory,
        priority: 'medium'
      })
      setNewTaskTitle('')
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <List className="h-5 w-5" />
            Tareas Locales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Nueva tarea..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateTask()}
            />
            <Select value={newTaskCategory} onValueChange={setNewTaskCategory}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleCreateTask}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar
            </Button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {tasks.map(task => (
              <div key={task.id} className="flex items-center gap-2 p-2 bg-muted rounded">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleTask(task.id)}
                >
                  {task.completed ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                </Button>
                <div className="flex-1">
                  <p className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {task.title}
                  </p>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs">
                      {task.priority}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {task.category}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteTask(task.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={clearCompleted}>
              Limpiar completadas
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Estadísticas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <div className="text-sm text-muted-foreground">Completadas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
              <div className="text-sm text-muted-foreground">Pendientes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.completionRate}%</div>
              <div className="text-sm text-muted-foreground">Progreso</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Demo de toggles de UI
function TogglesDemo() {
  const { toggleState, toggle, resetToggles } = useUIToggles()
  const mapToggles = useMapToggles()
  const themeToggles = useThemeToggles()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Toggles Generales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(toggleState).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <Label htmlFor={key} className="capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </Label>
              <Switch
                id={key}
                checked={value}
                onCheckedChange={() => toggle(key as keyof typeof toggleState)}
              />
            </div>
          ))}
          <Button variant="outline" onClick={resetToggles} className="w-full">
            Reset Toggles
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mapa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Pantalla completa</Label>
            <Switch
              checked={mapToggles.isFullscreen}
              onCheckedChange={mapToggles.setFullscreen}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>Vista compacta</Label>
            <Switch
              checked={mapToggles.isCompactView}
              onCheckedChange={mapToggles.setCompactView}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>Mostrar estadísticas</Label>
            <Switch
              checked={mapToggles.showStats}
              onCheckedChange={mapToggles.setStats}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>Auto actualizar</Label>
            <Switch
              checked={mapToggles.autoRefresh}
              onCheckedChange={mapToggles.setAutoRefresh}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tema</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Modo oscuro</Label>
            <Switch
              checked={themeToggles.isDarkMode}
              onCheckedChange={themeToggles.setDarkMode}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>Animaciones</Label>
            <Switch
              checked={themeToggles.animationsEnabled}
              onCheckedChange={themeToggles.setAnimations}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Demo de eventos
function EventsDemo() {
  const [events, setEvents] = useState<Array<{ id: number; message: string; timestamp: Date }>>([])
  const [counter, setCounter] = useState(0)
  const { addListener, removeListener } = useStorageEvents()

  // Escuchar cambios en localStorage
  useStorageListener('demo-counter', (data) => {
    setEvents(prev => [...prev, {
      id: Date.now(),
      message: `Counter changed: ${data.value}`,
      timestamp: new Date()
    }])
  })

  const incrementCounter = () => {
    setCounter(prev => {
      const newValue = prev + 1
      localStorage.setItem('demo-counter', newValue.toString())
      return newValue
    })
  }

  const clearEvents = () => {
    setEvents([])
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Eventos en Tiempo Real
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">{counter}</div>
            <Button onClick={incrementCounter}>
              Incrementar Contador
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Eventos recientes:</h4>
              <Button variant="outline" size="sm" onClick={clearEvents}>
                Limpiar
              </Button>
            </div>
            <div className="max-h-40 overflow-y-auto space-y-1">
              {events.slice(-10).reverse().map(event => (
                <div key={event.id} className="text-xs p-2 bg-muted rounded">
                  <div className="font-mono">{event.message}</div>
                  <div className="text-muted-foreground">
                    {event.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Instrucciones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-sm">
            <p>1. Haz clic en "Incrementar Contador" para ver eventos en tiempo real</p>
            <p>2. Abre otra pestaña y cambia el contador para ver sincronización</p>
            <p>3. Los eventos se muestran automáticamente cuando cambia localStorage</p>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Características:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Sincronización entre pestañas</li>
              <li>• Eventos en tiempo real</li>
              <li>• Historial de cambios</li>
              <li>• Manejo de errores</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Demo de caché
function CacheDemo() {
  const [cacheKey, setCacheKey] = useState('demo-data')
  const [fetchCount, setFetchCount] = useState(0)
  
  const cache = useSmartCache(cacheKey, {
    config: {
      ttl: 5000, // 5 segundos para demo
      maxSize: 10,
      strategy: 'lru'
    }
  })

  const mockFetch = async () => {
    setFetchCount(prev => prev + 1)
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simular delay
    return {
      id: Date.now(),
      data: `Datos simulados ${fetchCount + 1}`,
      timestamp: new Date().toISOString()
    }
  }

  const handleGetData = async () => {
    try {
      cache.registerFetcher(cacheKey, mockFetch)
      const data = await cache.get(cacheKey)
      console.log('Data retrieved:', data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const stats = cache.stats()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Caché Inteligente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cache-key">Clave del caché</Label>
            <Input
              id="cache-key"
              value={cacheKey}
              onChange={(e) => setCacheKey(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleGetData} disabled={cache.isLoading}>
              {cache.isLoading ? 'Cargando...' : 'Obtener Datos'}
            </Button>
            <Button variant="outline" onClick={() => cache.invalidate()}>
              Limpiar Caché
            </Button>
            <Button variant="outline" onClick={() => cache.cleanup()}>
              Limpiar Expirados
            </Button>
          </div>

          {cache.error && (
            <div className="p-3 bg-red-50 text-red-800 rounded">
              Error: {cache.error}
            </div>
          )}

          <div className="space-y-2">
            <h4 className="font-medium">Estadísticas del caché:</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>Total items: {stats.totalItems}</div>
              <div>Items expirados: {stats.expiredItems}</div>
              <div>Total accesos: {stats.totalAccesses}</div>
              <div>Promedio accesos: {stats.averageAccessCount.toFixed(2)}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Información del Caché</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">Configuración:</h4>
            <ul className="text-sm space-y-1">
              <li>• TTL: 5 segundos</li>
              <li>• Tamaño máximo: 10 items</li>
              <li>• Estrategia: LRU</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Contador de fetch:</h4>
            <div className="text-2xl font-bold">{fetchCount}</div>
            <p className="text-sm text-muted-foreground">
              Este número solo aumenta cuando se hace fetch real, no cuando se usa caché
            </p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">Beneficios:</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Reduce llamadas a la API</li>
              <li>• Mejora la experiencia del usuario</li>
              <li>• Gestión automática de memoria</li>
              <li>• Invalidación inteligente</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
