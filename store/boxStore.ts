import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { RecyclingBox } from '@/types/box'

interface BoxStoreState {
  selectedBox: RecyclingBox | null
  setSelectedBox: (box: RecyclingBox | null) => void
  clearSelectedBox: () => void
}

export const useBoxStore = create<BoxStoreState>()(
  persist(
    (set) => ({
      selectedBox: null,
      setSelectedBox: (box) => set({ selectedBox: box }),
      clearSelectedBox: () => set({ selectedBox: null }),
    }),
    {
      name: 'recipunto:selected-box',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ selectedBox: state.selectedBox }),
      version: 1,
    }
  )
)


