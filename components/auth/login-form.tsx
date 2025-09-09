"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const { signInWithPassword, signInWithMagicLink } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!email) throw new Error("Email requerido")
      if (!password) throw new Error("Contraseña requerida")

      await signInWithPassword(email, password)

      toast({
        title: "¡Bienvenido!",
        description: "Has iniciado sesión correctamente",
      })
      router.push("/map")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo iniciar sesión",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleMagicLink = async () => {
    try {
      if (!email) throw new Error("Introduce tu email para recibir el enlace")
      setIsLoading(true)
      await signInWithMagicLink(email)
      toast({
        title: "Revisa tu correo",
        description: "Te enviamos un enlace mágico para iniciar sesión",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo enviar el enlace",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Iniciando sesión..." : "Entrar"}
          </Button>
          <Button type="button" variant="outline" className="w-full" onClick={handleMagicLink} disabled={isLoading}>
            {isLoading ? "Enviando..." : "Entrar con Magic Link"}
          </Button>
          <Link href="/register" className="text-sm text-primary hover:underline">
            ¿No tienes cuenta? Regístrate
          </Link>
        </CardFooter>
      </form>
    </Card>
  )
}
