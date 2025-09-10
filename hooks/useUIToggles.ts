'use client'

import { useCallback } from 'react'
import { useLocalStorageBoolean, useLocalStorageObject } from './useLocalStorage'

export interface UIToggleState {
  sidebarOpen: boolean
  notificationsOpen: boolean
  mapFullscreen: boolean
  darkMode: boolean
  compactView: boolean
  showStats: boolean
  showFilters: boolean
  showSearch: boolean
  autoRefresh: boolean
  soundEnabled: boolean
  animationsEnabled: boolean
}

const defaultToggleState: UIToggleState = {
  sidebarOpen: true,
  notificationsOpen: false,
  mapFullscreen: false,
  darkMode: false,
  compactView: false,
  showStats: true,
  showFilters: true,
  showSearch: true,
  autoRefresh: true,
  soundEnabled: true,
  animationsEnabled: true
}

export function useUIToggles() {
  const [toggleState, setToggleState] = useLocalStorageObject('ui-toggles', defaultToggleState)

  // Toggle individual
  const toggle = useCallback((key: keyof UIToggleState) => {
    setToggleState(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }, [setToggleState])

  // Set specific value
  const setToggle = useCallback((key: keyof UIToggleState, value: boolean) => {
    setToggleState(prev => ({
      ...prev,
      [key]: value
    }))
  }, [setToggleState])

  // Set multiple toggles at once
  const setToggles = useCallback((updates: Partial<UIToggleState>) => {
    setToggleState(prev => ({
      ...prev,
      ...updates
    }))
  }, [setToggleState])

  // Reset all toggles to default
  const resetToggles = useCallback(() => {
    setToggleState(defaultToggleState)
  }, [setToggleState])

  // Get specific toggle value
  const getToggle = useCallback((key: keyof UIToggleState) => {
    return toggleState[key]
  }, [toggleState])

  // Check if multiple toggles are enabled
  const areTogglesEnabled = useCallback((keys: (keyof UIToggleState)[]) => {
    return keys.every(key => toggleState[key])
  }, [toggleState])

  // Check if any toggle is enabled
  const isAnyToggleEnabled = useCallback((keys: (keyof UIToggleState)[]) => {
    return keys.some(key => toggleState[key])
  }, [toggleState])

  return {
    toggleState,
    toggle,
    setToggle,
    setToggles,
    resetToggles,
    getToggle,
    areTogglesEnabled,
    isAnyToggleEnabled
  }
}

// Hook específico para toggles del mapa
export function useMapToggles() {
  const { toggleState, toggle, setToggle, getToggle } = useUIToggles()

  return {
    isFullscreen: getToggle('mapFullscreen'),
    isCompactView: getToggle('compactView'),
    showStats: getToggle('showStats'),
    showFilters: getToggle('showFilters'),
    showSearch: getToggle('showSearch'),
    autoRefresh: getToggle('autoRefresh'),
    toggleFullscreen: () => toggle('mapFullscreen'),
    toggleCompactView: () => toggle('compactView'),
    toggleStats: () => toggle('showStats'),
    toggleFilters: () => toggle('showFilters'),
    toggleSearch: () => toggle('showSearch'),
    toggleAutoRefresh: () => toggle('autoRefresh'),
    setFullscreen: (value: boolean) => setToggle('mapFullscreen', value),
    setCompactView: (value: boolean) => setToggle('compactView', value),
    setStats: (value: boolean) => setToggle('showStats', value),
    setFilters: (value: boolean) => setToggle('showFilters', value),
    setSearch: (value: boolean) => setToggle('showSearch', value),
    setAutoRefresh: (value: boolean) => setToggle('autoRefresh', value)
  }
}

// Hook específico para toggles de notificaciones
export function useNotificationToggles() {
  const { toggleState, toggle, setToggle, getToggle } = useUIToggles()

  return {
    isOpen: getToggle('notificationsOpen'),
    soundEnabled: getToggle('soundEnabled'),
    toggleOpen: () => toggle('notificationsOpen'),
    toggleSound: () => toggle('soundEnabled'),
    setOpen: (value: boolean) => setToggle('notificationsOpen', value),
    setSound: (value: boolean) => setToggle('soundEnabled', value)
  }
}

// Hook específico para toggles de tema
export function useThemeToggles() {
  const { toggleState, toggle, setToggle, getToggle } = useUIToggles()

  return {
    isDarkMode: getToggle('darkMode'),
    animationsEnabled: getToggle('animationsEnabled'),
    toggleDarkMode: () => toggle('darkMode'),
    toggleAnimations: () => toggle('animationsEnabled'),
    setDarkMode: (value: boolean) => setToggle('darkMode', value),
    setAnimations: (value: boolean) => setToggle('animationsEnabled', value)
  }
}

// Hook específico para toggles de sidebar
export function useSidebarToggles() {
  const { toggleState, toggle, setToggle, getToggle } = useUIToggles()

  return {
    isOpen: getToggle('sidebarOpen'),
    toggleOpen: () => toggle('sidebarOpen'),
    setOpen: (value: boolean) => setToggle('sidebarOpen', value)
  }
}

