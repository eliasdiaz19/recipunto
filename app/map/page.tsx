"use client"

import { MapInterface } from "@/components/map/map-interface"
import { DynamicMapWrapper } from "@/components/map/MapWrapper"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function MapPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login")
    }
  }, [loading, user, router])

  if (loading) return null
  if (!user) return null

  return (
    <DynamicMapWrapper>
      <MapInterface />
    </DynamicMapWrapper>
  )
}
