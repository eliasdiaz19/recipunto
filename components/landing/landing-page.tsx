"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Leaf, MapPin, Trophy, Users, Zap } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

export default function LandingPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [honeypot, setHoneypot] = useState("")
  const [isAlreadySubmitted, setIsAlreadySubmitted] = useState(false)

  const formEndpoint = process.env.NEXT_PUBLIC_FORM_ENDPOINT || ""

  // Verificar si el email actual ya fue enviado cuando el componente se monta
  useEffect(() => {
    if (email && checkEmailAlreadySubmitted(email)) {
      setIsAlreadySubmitted(true)
    } else {
      setIsAlreadySubmitted(false)
    }
  }, [email])

  // Verificar si el email ya fue enviado
  const checkEmailAlreadySubmitted = (email: string) => {
    if (typeof window === 'undefined') return false
    const submittedEmails = JSON.parse(localStorage.getItem('recipunto-submitted-emails') || '[]')
    return submittedEmails.includes(email.toLowerCase())
  }

  // Marcar email como enviado
  const markEmailAsSubmitted = (email: string) => {
    if (typeof window === 'undefined') return
    const submittedEmails = JSON.parse(localStorage.getItem('recipunto-submitted-emails') || '[]')
    if (!submittedEmails.includes(email.toLowerCase())) {
      submittedEmails.push(email.toLowerCase())
      localStorage.setItem('recipunto-submitted-emails', JSON.stringify(submittedEmails))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast.error("Por favor ingresa tu email")
      return
    }

    // Verificar si el email ya fue enviado
    if (checkEmailAlreadySubmitted(email)) {
      setIsAlreadySubmitted(true)
      toast.info("¡Ya estás registrado! Te notificaremos cuando Recipunto esté disponible")
      return
    }

    // Honeypot: si está lleno, no enviar
    if (honeypot.trim() !== "") {
      return
    }

    // Si no hay endpoint configurado, solo loguear y mostrar ok
    if (!formEndpoint) {
      console.log("[Landing] Captura de email (sin endpoint):", { email })
      markEmailAsSubmitted(email)
      toast.success("¡Gracias! Te notificaremos cuando Recipunto esté disponible")
      setEmail("")
      setIsSuccess(true)
      return
    }

    setIsLoading(true)
    try {
      // Formspree espera datos en formato form-urlencoded
      const formData = new URLSearchParams()
      formData.append('email', email)
      formData.append('source', 'landing_page')
      formData.append('timestamp', new Date().toISOString())
      
      console.log('[Landing] Enviando a Formspree:', {
        endpoint: formEndpoint,
        email: email,
        formData: formData.toString()
      })
      
      const res = await fetch(formEndpoint, {
        method: "POST",
        headers: {
          "Accept": "application/json",
        },
        body: formData,
      })

      if (!res.ok) {
        throw new Error(`Error de envío: ${res.status}`)
      }

      markEmailAsSubmitted(email)
      toast.success("¡Gracias! Te notificaremos cuando Recipunto esté disponible")
      setEmail("")
      setIsSuccess(true)
    } catch (error) {
      toast.error("No pudimos registrar tu email. Intenta nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--brand-green-50)] to-[var(--brand-blue-50)]">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl font-bold" style={{ color: "var(--brand-green-800)" }}>recipunto</span>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200 transition-colors">
            Próximamente
          </Badge>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
            Recicla Tetra Pak en minutos, <span style={{ color: "var(--brand-green-600)" }}>junto a tu barrio</span>
          </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Encuentra el punto más cercano, suma a cajas comunitarias y ve en tiempo real cómo
              tu aporte acelera las recolecciones. Menos fricción, más impacto ✨
            </p>
          
          {/* Email Capture Form */}
          <Card className="max-w-md mx-auto mb-12">
            <CardHeader>
              <CardTitle className="text-2xl">Recibe acceso anticipado 📮</CardTitle>
              <CardDescription>
                Te avisamos cuando lancemos en tu zona. Sin spam, puedes darte de baja cuando quieras.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot para bots */}
                <input
                  type="text"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />
                <Input
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-center"
                  required
                />
                <Button 
                  type="submit" 
                  className="w-full"
                  style={{ backgroundColor: "var(--brand-green-600)" }}
                  disabled={isLoading || isAlreadySubmitted}
                >
                  {isLoading ? "Enviando..." : 
                   isSuccess ? "¡Registrado!" : 
                   isAlreadySubmitted ? "¡Ya registrado!" : 
                   "Notificarme 📩"}
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  Al enviar aceptas recibir novedades sobre recipunto. Nunca compartiremos tu email.
                </p>
              </form>
            </CardContent>
          </Card>

          {/* App Preview */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm mx-auto">
              <div className="bg-gray-100 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Puntos Acumulados</span>
                  <Trophy className="h-5 w-5" style={{ color: "var(--brand-blue-600)" }} />
                </div>
                <div className="text-3xl font-bold" style={{ color: "var(--brand-green-600)" }}>1,250</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">3 envases reciclados hoy</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Punto más cercano: 200m</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Qué es Recipunto */}
      <section className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center gap-3 mb-6">
            <span className="inline-flex items-center rounded-full bg-green-100 text-green-800 px-3 py-1 text-xs font-medium">
              Plataforma comunitaria
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              ¿Qué es <span className="italic text-gray-800">recipunto</span>? 🌱
            </h2>
          </div>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed text-center max-w-3xl mx-auto">
            recipunto es una plataforma comunitaria que permite a ciudadanos y comercios registrar en un
            mapa de la ciudad envases reciclables, para que municipios o recicladores creen y optimicen
            rutas de recolección. Hacemos visible el esfuerzo colectivo y facilitamos decisiones eficientes.
          </p>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">¿Cómo funciona? 🧭</h2>
          <p className="text-lg text-gray-600">Tres pasos para convertir tu intención en acción</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 text-center">
            <h3 className="font-semibold mb-2">1) Encuentra un punto cercano 🗺️</h3>
            <p className="text-gray-600">Mapa colaborativo con ubicaciones precisas y tiempos estimados.</p>
          </Card>
          <Card className="p-6 text-center">
            <h3 className="font-semibold mb-2">2) Deja o transporta 🚲</h3>
            <p className="text-gray-600">Suma envases a una caja comunitaria o ayuda a llevarla a un punto oficial.</p>
          </Card>
          <Card className="p-6 text-center">
            <h3 className="font-semibold mb-2">3) Ve el impacto 📈</h3>
            <p className="text-gray-600">Cuando una caja se llena, avisamos para retiro eficiente. Todos ven el progreso.</p>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¿Por qué elegir recipunto? 💚
          </h2>
          <p className="text-lg text-gray-600">
            Atacamos la causa raíz: falta de datos y coordinación en la cadena de reciclaje
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center p-6">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "var(--brand-green-100)" }}>
              <MapPin className="h-8 w-8" style={{ color: "var(--brand-green-600)" }} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Accesible</h3>
            <p className="text-gray-600">Mapa colaborativo siempre actualizado: entrega tus envases sin dar mil vueltas.</p>
          </Card>

          <Card className="text-center p-6">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "var(--brand-blue-50)" }}>
              <Trophy className="h-8 w-8" style={{ color: "var(--brand-blue-600)" }} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Motivador</h3>
            <p className="text-gray-600">Misiones compartidas y puntos por barrio: tu aporte visible y contagioso.</p>
          </Card>

          <Card className="text-center p-6">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "var(--brand-green-50)" }}>
              <Leaf className="h-8 w-8" style={{ color: "var(--brand-green-700)" }} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Eficiente</h3>
            <p className="text-gray-600">Alertas de cajas listas para retiro: menos viajes vacíos, más material reciclado.</p>
          </Card>
        </div>
      </section>

      {/* Transparency Section (datos reales) */}
      <section
        className="py-16"
        style={{ backgroundColor: "var(--brand-green-600)" }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3 text-white">Transparencia 🔍</h2>
            <p className="text-lg text-white/90">
              recipunto está en fase de validación. Aún no reportamos métricas públicas.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div
              className="brand-card p-6"
            >
              <div className="text-2xl font-semibold mb-1 text-gray-900">Estado</div>
              <div className="text-gray-700">MVP en desarrollo con lista de espera</div>
            </div>
            <div
              className="brand-card p-6"
            >
              <div className="text-2xl font-semibold mb-1 text-gray-900">Objetivo inicial</div>
              <div className="text-gray-700">Piloto local en La Rioja</div>
            </div>
            <div
              className="brand-card p-6"
            >
              <div className="text-2xl font-semibold mb-1 text-gray-900">Siguiente paso</div>
              <div className="text-gray-700">Notificar a la lista y lanzar beta</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¿Listo para empezar a reciclar? ♻️
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Sé parte de la revolución del reciclaje. Regístrate para recibir notificaciones 
            cuando recipunto esté disponible y obtén acceso anticipado.
          </p>
          
          <Card className="max-w-md mx-auto">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot para bots */}
                <input
                  type="text"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />
                <Input
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-center"
                  required
                />
                <Button 
                  type="submit" 
                  className="w-full hover:opacity-90"
                  style={{ backgroundColor: "var(--brand-green-600)" }}
                  disabled={isLoading || isAlreadySubmitted}
                >
                  {isLoading ? "Enviando..." : 
                   isSuccess ? "¡Registrado!" : 
                   isAlreadySubmitted ? "¡Ya registrado!" : 
                   "Notificarme"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-white py-12" style={{ backgroundColor: "var(--brand-green-600)" }}>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="mb-4">
                <span className="text-xl font-bold">recipunto</span>
              </div>
              <p className="text-white/90">
                Haciendo del reciclaje una experiencia divertida y recompensante.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Producto</h3>
                <ul className="space-y-2 text-white/80">
                  <li className="hover:text-white transition-colors cursor-pointer">Características</li>
                  <li className="hover:text-white transition-colors cursor-pointer">Precios</li>
                  <li className="hover:text-white transition-colors cursor-pointer">Preguntas Frecuentes</li>
                </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Compañía</h3>
              <ul className="space-y-2 text-white/80">
                <li className="hover:text-white transition-colors cursor-pointer">Sobre nosotros</li>
                <li className="hover:text-white transition-colors cursor-pointer">Blog</li>
                <li className="hover:text-white transition-colors cursor-pointer">Carreras</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Contacto</h3>
              <ul className="space-y-2 text-white/80">
                <li className="hover:text-white transition-colors cursor-pointer">hola@recipunto.com</li>
                <li className="hover:text-white transition-colors cursor-pointer">+1 (555) 123-4567</li>
                <li className="hover:text-white transition-colors cursor-pointer">Redes sociales</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/80">
            <p>&copy; 2024 recipunto. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
