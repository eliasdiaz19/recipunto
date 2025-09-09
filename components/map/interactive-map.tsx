"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, MapPin } from "lucide-react"
import type { RecyclingBox } from "./map-interface"

interface InteractiveMapProps {
  boxes: RecyclingBox[]
  onBoxClick: (box: RecyclingBox) => void
  onMapClick: (lat: number, lng: number) => void
  onDeleteBox: (boxId: string) => void
  isMovingBox?: boolean
  boxToMove?: RecyclingBox | null
}

export function InteractiveMap({
  boxes,
  onBoxClick,
  onMapClick,
  onDeleteBox,
  isMovingBox = false,
  boxToMove = null,
}: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const leafletRef = useRef<any>(null)
  const onMapClickRef = useRef(onMapClick)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)

  useEffect(() => {
    onMapClickRef.current = onMapClick
  }, [onMapClick])

  useEffect(() => {
    if (!mapRef.current || isMapLoaded) return

    const initializeMap = async () => {
      try {
        const L = (await import("leaflet")).default
        leafletRef.current = L

        if (typeof window !== "undefined") {
          const link = document.createElement("link")
          link.rel = "stylesheet"
          link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          document.head.appendChild(link)
        }

        const location = await new Promise<{ lat: number; lng: number }>((resolve) => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                resolve({
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                })
              },
              () => {
                resolve({ lat: 40.4168, lng: -3.7038 })
              },
            )
          } else {
            resolve({ lat: 40.4168, lng: -3.7038 })
          }
        })

        setUserLocation(location)

        // Protección contra re-inicialización (HMR / navegación):
        // - elimina instancia previa si existe
        // - borra el _leaflet_id que Leaflet añade al contenedor
        if (mapInstanceRef.current) {
          try {
            mapInstanceRef.current.remove()
          } catch {}
          mapInstanceRef.current = null
        }
        if (mapRef.current && (mapRef.current as any)._leaflet_id) {
          try {
            delete (mapRef.current as any)._leaflet_id
          } catch {
            (mapRef.current as any)._leaflet_id = undefined
          }
        }

        const map = L.map(mapRef.current).setView([location.lat, location.lng], 13)

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
        }).addTo(map)

        const userIcon = L.divIcon({
          html: `
            <div class="relative">
              <div class="w-4 h-4 bg-green-600 rounded-full border-2 border-white shadow-lg"></div>
              <div class="absolute inset-0 w-4 h-4 bg-green-600 rounded-full animate-ping opacity-75"></div>
            </div>
          `,
          className: "user-location-marker",
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        })

        L.marker([location.lat, location.lng], { icon: userIcon }).addTo(map)

        const handleMapClick = (e: any) => {
          console.log("[v0] Map clicked at coordinates:", e.latlng.lat, e.latlng.lng)
          onMapClickRef.current(e.latlng.lat, e.latlng.lng)
        }

        map.on("click", handleMapClick)

        mapInstanceRef.current = map
        setIsMapLoaded(true)

        console.log("[v0] Leaflet map initialized successfully")
      } catch (error) {
        console.error("[v0] Error initializing map:", error)
      }
    }

    initializeMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
        setIsMapLoaded(false)
      }
    }
  }, [])

  useEffect(() => {
    if (!mapInstanceRef.current || !isMapLoaded || !userLocation || !leafletRef.current) return

    const L = leafletRef.current

    markersRef.current.forEach((marker) => {
      mapInstanceRef.current.removeLayer(marker)
    })
    markersRef.current = []

    boxes.forEach((box, index) => {
      const lat = box.lat || userLocation.lat + (index === 0 ? 0.005 : -0.005)
      const lng = box.lng || userLocation.lng + (index === 0 ? 0.005 : -0.005)

      console.log("[v0] Placing box", box.id, "at coordinates:", lat, lng)

      const isBeingMoved = isMovingBox && boxToMove?.id === box.id
      const boxIcon = L.divIcon({
        html: `
          <div class="relative group cursor-pointer ${isBeingMoved ? "animate-pulse" : ""}">
            <div class="w-8 h-8 rounded-full border-2 ${isBeingMoved ? "border-yellow-400 border-4" : "border-white"} shadow-lg flex items-center justify-center ${
              box.isFull ? "bg-red-500" : "bg-green-600"
            } ${isBeingMoved ? "ring-2 ring-yellow-300" : ""}">
              <svg class="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 10 9 11 1.09-.21 2.28-.71 3.33-1.36C16.67 25.64 18.09 24.64 19 23.36 21.16 21.64 22 18.55 22 17V7l-10-5zm0 2.18L19.82 8 12 11.82 4.18 8 12 4.18zM4 9.18l8 3.82v8.91C7.84 20.82 4 17.09 4 12.09V9.18zm16 2.91c0 4.91-3.84 8.73-8 9.82V13l8-3.82v2.91z"/>
              </svg>
            </div>
            ${isBeingMoved ? '<div class="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-bounce"></div>' : ""}
          </div>
        `,
        className: "recycling-box-marker",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      })

      const marker = L.marker([lat, lng], { icon: boxIcon }).addTo(mapInstanceRef.current)

      const isOwner = box.createdBy === "current-user" || box.createdBy === "usuario-anonimo"
      const popupContent = `
        <div class="p-3 min-w-[220px]">
          <h3 class="font-semibold text-sm mb-2">Caja de Reciclaje #${box.id}</h3>
          <p class="text-xs text-gray-600 mb-1">${box.currentAmount}/${box.capacity} envases</p>
          <p class="text-xs ${box.isFull ? "text-red-600 font-medium" : "text-green-600"} mb-3">
            ${box.isFull ? "¡Caja llena!" : "Disponible"}
          </p>
          ${isBeingMoved ? '<p class="text-xs text-yellow-600 font-medium mb-2">Esta caja se está moviendo...</p>' : ""}
          <div class="flex gap-2">
            <button class="flex-1 px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors" onclick="window.openBoxDetails('${box.id}')">
              Ver detalles
            </button>
            ${
              isOwner && !isBeingMoved
                ? `
              <button class="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors" onclick="window.deleteBox('${box.id}')" title="Eliminar caja">
                <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
              </button>
            `
                : ""
            }
          </div>
          ${isOwner ? '<p class="text-xs text-gray-500 mt-2">Esta es tu caja</p>' : ""}
        </div>
      `

      marker.bindPopup(popupContent)

      if (!isMovingBox) {
        marker.on("click", () => {
          onBoxClick(box)
        })
      }

      markersRef.current.push(marker)
    })

    if (typeof window !== "undefined") {
      ;(window as any).openBoxDetails = (boxId: string) => {
        const box = boxes.find((b) => b.id === boxId)
        if (box && !isMovingBox) {
          onBoxClick(box)
        }
      }
      ;(window as any).deleteBox = (boxId: string) => {
        if (!isMovingBox) {
          onDeleteBox(boxId)
        }
      }
    }

    console.log("[v0] Added", boxes.length, "recycling box markers to map")
  }, [boxes, isMapLoaded, userLocation, isMovingBox, boxToMove]) // Removed onBoxClick and onDeleteBox from dependencies

  useEffect(() => {
    if (mapInstanceRef.current) {
      const mapContainer = mapInstanceRef.current.getContainer()
      if (isMovingBox) {
        mapContainer.style.cursor = "crosshair"
        console.log("[v0] Set cursor to crosshair - moving box mode active")
      } else {
        mapContainer.style.cursor = ""
        console.log("[v0] Reset cursor - normal mode")
      }
    }
  }, [isMovingBox])

  const centerOnUser = () => {
    if (mapInstanceRef.current && userLocation) {
      mapInstanceRef.current.setView([userLocation.lat, userLocation.lng], 15)
    }
  }

  const zoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn()
    }
  }

  return (
    <div className="relative h-full w-full">
      <div ref={mapRef} className="h-full w-full z-10" style={{ minHeight: "400px" }} />

      <div className="absolute top-4 right-4 z-30 space-y-2">
        <Button size="sm" variant="secondary" className="w-10 h-10 p-0 shadow-md" onClick={zoomIn} title="Acercar">
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="secondary"
          className="w-10 h-10 p-0 shadow-md"
          onClick={centerOnUser}
          title="Mi ubicación"
        >
          <MapPin className="h-4 w-4" />
        </Button>
      </div>

      {!isMapLoaded && (
        <div className="absolute inset-0 bg-green-50 flex items-center justify-center z-20">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm text-green-700">Cargando mapa...</p>
          </div>
        </div>
      )}
    </div>
  )
}
