"use client"

import { LoginForm } from "@/components/auth/login-form"
import Image from "next/image"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function LoginPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) router.replace("/map")
  }, [user, router])
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Logo and branding */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Image src="/recipunto-logo.png" alt="Recipunto" width={200} height={60} className="h-12 w-auto" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Bienvenido a Recipunto</h1>
          <p className="text-sm text-muted-foreground">Gamifica tu reciclaje de envases Tetra Pak</p>
        </div>

        <LoginForm />
      </div>
    </div>
  )
}
