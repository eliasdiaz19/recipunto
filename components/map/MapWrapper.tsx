"use client"

import dynamic from "next/dynamic"
import { ReactNode } from "react"

// Wrapper que renderiza los componentes de mapa solo en el cliente
// Evita el error "window is not defined" durante SSR
interface MapWrapperProps {
  children: ReactNode
}

export function MapWrapper({ children }: MapWrapperProps) {
  return <>{children}</>
}

// Componente dinámico que no se renderiza en el servidor
export const DynamicMapWrapper = dynamic(() => Promise.resolve(MapWrapper), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full min-h-[400px]">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-sm text-green-700">Cargando mapa...</p>
      </div>
    </div>
  ),
})

