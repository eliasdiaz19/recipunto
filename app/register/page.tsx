import { RegisterForm } from "@/components/auth/register-form"
import Image from "next/image"
import Link from "next/link"

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Logo and branding */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Image src="/recipunto-logo.png" alt="Recipunto" width={200} height={60} className="h-12 w-auto" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Únete a Recipunto</h1>
          <p className="text-sm text-muted-foreground">Comienza tu aventura de reciclaje</p>
        </div>

        <RegisterForm />

        <div className="text-center">
          <Link href="/login" className="text-sm text-primary hover:underline">
            ¿Ya tienes cuenta? Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  )
}
