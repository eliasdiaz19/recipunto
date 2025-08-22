'use client'

interface MapControlsProps {
  onCenterMap?: (center: { lat: number; lng: number }) => void
}

export default function MapControls({ onCenterMap }: MapControlsProps) {
  const handleCenterMap = () => {
    if (onCenterMap) {
      // Coordenadas por defecto de La Rioja, Argentina
      onCenterMap({ lat: -29.4135, lng: -66.8568 })
    }
  }

  return (
    <div className="absolute top-20 right-4 z-[1000] space-y-2">
      <button
        onClick={handleCenterMap}
        className="bg-white p-3 rounded-lg shadow-md hover:bg-gray-50 transition-colors duration-200"
        title="Centrar mapa"
      >
        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
    </div>
  )
}
