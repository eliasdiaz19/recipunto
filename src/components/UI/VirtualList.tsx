'use client'

import { memo, forwardRef, type ForwardedRef } from 'react'
import { useVirtualization } from '@/hooks'

interface VirtualListProps<T> {
  items: T[]
  itemHeight: number
  containerHeight: number
  renderItem: (item: T, index: number) => React.ReactNode
  overscan?: number
  className?: string
}

const VirtualList = memo(forwardRef<HTMLDivElement, VirtualListProps<any>>(
  function VirtualList<T>(
    props: VirtualListProps<T>,
    ref: ForwardedRef<HTMLDivElement>
  ) {
    const { 
      items, 
      itemHeight, 
      containerHeight, 
      renderItem, 
      overscan = 3,
      className = ''
    } = props
    const {
      virtualItems,
      totalHeight,
      handleScroll
    } = useVirtualization(items, { itemHeight, containerHeight, overscan })

    return (
      <div
        ref={ref}
        className={`overflow-auto ${className}`}
        style={{ height: containerHeight }}
        onScroll={handleScroll}
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          {virtualItems.map(virtualItem => (
            <div
              key={virtualItem.index}
              style={{
                position: 'absolute',
                top: virtualItem.offsetTop,
                height: virtualItem.size,
                width: '100%'
              }}
            >
              {renderItem(items[virtualItem.index], virtualItem.index)}
            </div>
          ))}
        </div>
      </div>
    )
  }
))

export default VirtualList
