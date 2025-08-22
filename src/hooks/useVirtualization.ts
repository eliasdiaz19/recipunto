'use client'

import { useState, useCallback, useMemo } from 'react'

interface UseVirtualizationOptions {
  itemHeight: number
  containerHeight: number
  overscan?: number
}

interface VirtualItem {
  index: number
  start: number
  end: number
  size: number
  offsetTop: number
}

export function useVirtualization<T>(
  items: T[],
  options: UseVirtualizationOptions
) {
  const { itemHeight, containerHeight, overscan = 3 } = options
  const [scrollTop, setScrollTop] = useState(0)

  const totalHeight = useMemo(() => items.length * itemHeight, [items.length, itemHeight])
  
  const visibleRange = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight)
    const end = Math.min(
      start + Math.ceil(containerHeight / itemHeight) + overscan,
      items.length
    )
    
    return {
      start: Math.max(0, start - overscan),
      end
    }
  }, [scrollTop, itemHeight, containerHeight, overscan, items.length])

  const virtualItems = useMemo(() => {
    const virtualItems: VirtualItem[] = []
    
    for (let i = visibleRange.start; i < visibleRange.end; i++) {
      virtualItems.push({
        index: i,
        start: i * itemHeight,
        end: (i + 1) * itemHeight,
        size: itemHeight,
        offsetTop: i * itemHeight
      })
    }
    
    return virtualItems
  }, [visibleRange.start, visibleRange.end, itemHeight])

  const handleScroll = useCallback((event: React.UIEvent<HTMLElement>) => {
    setScrollTop(event.currentTarget.scrollTop)
  }, [])

  const scrollToItem = useCallback((index: number) => {
    const newScrollTop = index * itemHeight
    setScrollTop(newScrollTop)
  }, [itemHeight])

  return {
    virtualItems,
    totalHeight,
    scrollTop,
    handleScroll,
    scrollToItem,
    visibleRange
  }
}
