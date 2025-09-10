"use client"

import React, { createContext, useContext, useCallback, useEffect } from "react"
import type { RecyclingBox } from "@/types/box"
import { useBoxStore } from "@/store/boxStore"

interface BoxContextType {
  selectedBox: RecyclingBox | null
  setSelectedBox: (box: RecyclingBox | null) => void
  clearSelectedBox: () => void
}

const BoxContext = createContext<BoxContextType | undefined>(undefined)

export function BoxProvider({ children }: { children: React.ReactNode }) {
  const selectedBox = useBoxStore((s) => s.selectedBox)
  const setSelectedBox = useBoxStore((s) => s.setSelectedBox)
  const clearSelectedBox = useBoxStore((s) => s.clearSelectedBox)

  const value = { selectedBox, setSelectedBox, clearSelectedBox }
  return <BoxContext.Provider value={value}>{children}</BoxContext.Provider>
}

export function useBoxContext() {
  const context = useContext(BoxContext)
  if (context === undefined) {
    throw new Error("useBoxContext must be used within a BoxProvider")
  }
  return context
}

// Hook para sincronizar selectedBox con datos en tiempo real
export function useSelectedBoxSync(boxes: RecyclingBox[]) {
  const { selectedBox, setSelectedBox } = useBoxContext()

  useEffect(() => {
    if (selectedBox) {
      const updatedBox = boxes.find(box => box.id === selectedBox.id)
      if (updatedBox && (
        updatedBox.currentAmount !== selectedBox.currentAmount ||
        updatedBox.isFull !== selectedBox.isFull ||
        updatedBox.capacity !== selectedBox.capacity ||
        updatedBox.lat !== selectedBox.lat ||
        updatedBox.lng !== selectedBox.lng
      )) {
        setSelectedBox(updatedBox)
      }
    }
  }, [boxes, selectedBox, setSelectedBox])
}
