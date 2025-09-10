import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { NotificationProvider } from "@/components/notifications/notification-provider"
import { BoxProvider } from "@/contexts/BoxContext"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Recipunto - Reciclaje Gamificado",
  description: "App móvil para facilitar y gamificar el reciclaje de envases Tetra Pak",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`font-sans ${inter.variable} antialiased`}>
        <BoxProvider>
          <NotificationProvider>{children}</NotificationProvider>
        </BoxProvider>
      </body>
    </html>
  )
}
