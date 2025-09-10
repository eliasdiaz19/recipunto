'use client'

import { useState, useCallback, useMemo } from 'react'
import { useLocalStorageArray } from './useLocalStorage'

export interface LocalTask {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  category: string
  dueDate?: string
  createdAt: string
  updatedAt: string
  tags: string[]
}

export interface CreateTaskData {
  title: string
  description?: string
  priority?: 'low' | 'medium' | 'high'
  category?: string
  dueDate?: string
  tags?: string[]
}

export interface UpdateTaskData {
  title?: string
  description?: string
  completed?: boolean
  priority?: 'low' | 'medium' | 'high'
  category?: string
  dueDate?: string
  tags?: string[]
}

export function useLocalTasks() {
  const [tasks, setTasks] = useLocalStorageArray<LocalTask>('local-tasks', [])
  const [filter, setFilter] = useState<{
    completed?: boolean
    priority?: string
    category?: string
    search?: string
  }>({})

  // Generar ID único
  const generateId = useCallback(() => {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }, [])

  // Crear nueva tarea
  const createTask = useCallback((taskData: CreateTaskData): LocalTask => {
    const now = new Date().toISOString()
    const newTask: LocalTask = {
      id: generateId(),
      title: taskData.title,
      description: taskData.description || '',
      completed: false,
      priority: taskData.priority || 'medium',
      category: taskData.category || 'General',
      dueDate: taskData.dueDate,
      createdAt: now,
      updatedAt: now,
      tags: taskData.tags || []
    }

    setTasks(prev => [newTask, ...prev])
    return newTask
  }, [generateId, setTasks])

  // Actualizar tarea
  const updateTask = useCallback((id: string, updates: UpdateTaskData): LocalTask | null => {
    let updatedTask: LocalTask | null = null

    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        updatedTask = {
          ...task,
          ...updates,
          updatedAt: new Date().toISOString()
        }
        return updatedTask
      }
      return task
    }))

    return updatedTask
  }, [setTasks])

  // Eliminar tarea
  const deleteTask = useCallback((id: string): boolean => {
    let deleted = false
    setTasks(prev => {
      const newTasks = prev.filter(task => task.id !== id)
      deleted = prev.length !== newTasks.length
      return newTasks
    })
    return deleted
  }, [setTasks])

  // Obtener tarea por ID
  const getTaskById = useCallback((id: string): LocalTask | null => {
    return tasks.find(task => task.id === id) || null
  }, [tasks])

  // Marcar tarea como completada
  const toggleTask = useCallback((id: string): boolean => {
    const task = getTaskById(id)
    if (task) {
      updateTask(id, { completed: !task.completed })
      return true
    }
    return false
  }, [getTaskById, updateTask])

  // Eliminar tareas completadas
  const clearCompleted = useCallback((): number => {
    let deletedCount = 0
    setTasks(prev => {
      const newTasks = prev.filter(task => {
        if (task.completed) {
          deletedCount++
          return false
        }
        return true
      })
      return newTasks
    })
    return deletedCount
  }, [setTasks])

  // Filtrar tareas
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (filter.completed !== undefined && task.completed !== filter.completed) {
        return false
      }
      if (filter.priority && task.priority !== filter.priority) {
        return false
      }
      if (filter.category && task.category !== filter.category) {
        return false
      }
      if (filter.search) {
        const searchLower = filter.search.toLowerCase()
        const matchesTitle = task.title.toLowerCase().includes(searchLower)
        const matchesDescription = task.description?.toLowerCase().includes(searchLower) || false
        const matchesTags = task.tags.some(tag => tag.toLowerCase().includes(searchLower))
        if (!matchesTitle && !matchesDescription && !matchesTags) {
          return false
        }
      }
      return true
    })
  }, [tasks, filter])

  // Estadísticas
  const stats = useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter(task => task.completed).length
    const pending = total - completed
    const overdue = tasks.filter(task => 
      !task.completed && 
      task.dueDate && 
      new Date(task.dueDate) < new Date()
    ).length

    const byPriority = {
      high: tasks.filter(task => task.priority === 'high').length,
      medium: tasks.filter(task => task.priority === 'medium').length,
      low: tasks.filter(task => task.priority === 'low').length
    }

    const byCategory = tasks.reduce((acc, task) => {
      acc[task.category] = (acc[task.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      total,
      completed,
      pending,
      overdue,
      byPriority,
      byCategory,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    }
  }, [tasks])

  // Obtener categorías únicas
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(tasks.map(task => task.category))]
    return uniqueCategories.sort()
  }, [tasks])

  // Obtener tags únicos
  const allTags = useMemo(() => {
    const uniqueTags = [...new Set(tasks.flatMap(task => task.tags))]
    return uniqueTags.sort()
  }, [tasks])

  return {
    tasks: filteredTasks,
    allTasks: tasks,
    createTask,
    updateTask,
    deleteTask,
    getTaskById,
    toggleTask,
    clearCompleted,
    setFilter,
    filter,
    stats,
    categories,
    allTags
  }
}

// Hook para tareas específicas de reciclaje
export function useRecyclingTasks() {
  const {
    tasks,
    allTasks,
    createTask,
    updateTask,
    deleteTask,
    getTaskById,
    toggleTask,
    clearCompleted,
    setFilter,
    filter,
    stats,
    categories,
    allTags
  } = useLocalTasks()

  // Crear tarea de reciclaje específica
  const createRecyclingTask = useCallback((taskData: Omit<CreateTaskData, 'category'>) => {
    return createTask({
      ...taskData,
      category: 'Reciclaje',
      tags: [...(taskData.tags || []), 'reciclaje', 'medio-ambiente']
    })
  }, [createTask])

  // Crear tarea de mantenimiento de caja
  const createBoxMaintenanceTask = useCallback((boxId: string, taskData: Omit<CreateTaskData, 'category' | 'tags'>) => {
    return createTask({
      ...taskData,
      category: 'Mantenimiento',
      tags: ['caja', 'mantenimiento', `box-${boxId}`]
    })
  }, [createTask])

  // Crear tarea de recolección
  const createCollectionTask = useCallback((boxId: string, taskData: Omit<CreateTaskData, 'category' | 'tags'>) => {
    return createTask({
      ...taskData,
      category: 'Recolección',
      tags: ['recolección', 'caja', `box-${boxId}`]
    })
  }, [createTask])

  // Filtrar por tipo de tarea de reciclaje
  const getTasksByType = useCallback((type: 'reciclaje' | 'mantenimiento' | 'recolección') => {
    return tasks.filter(task => task.category.toLowerCase() === type)
  }, [tasks])

  return {
    tasks,
    allTasks,
    createTask,
    createRecyclingTask,
    createBoxMaintenanceTask,
    createCollectionTask,
    updateTask,
    deleteTask,
    getTaskById,
    toggleTask,
    clearCompleted,
    setFilter,
    filter,
    stats,
    categories,
    allTags,
    getTasksByType
  }
}

