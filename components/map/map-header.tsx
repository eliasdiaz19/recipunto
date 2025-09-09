"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { User, LogIn, UserPlus, LogOut } from "lucide-react"
import { NotificationCenter } from "../notifications/notification-center"
import { useNotifications } from "../notifications/notification-provider"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"

export function MapHeader() {
  const { notifications, markAsRead, markAllAsRead, deleteNotification } = useNotifications()
  const router = useRouter()
  const { user, signOut } = useAuth()

  return (
    <header className="h-14 bg-card border-b border-border flex items-center justify-between px-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="p-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          {!user ? (
            <>
              <DropdownMenuItem onClick={() => router.push("/login")} className="cursor-pointer">
                <LogIn className="h-4 w-4 mr-2" />
                Iniciar Sesión
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/register")} className="cursor-pointer">
                <UserPlus className="h-4 w-4 mr-2" />
                Registrarse
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem onClick={() => router.push("/profile")} className="cursor-pointer">
                <User className="h-4 w-4 mr-2" />
                Mi Perfil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="text-center">
        <h1 className="text-lg font-semibold text-foreground">Recipunto</h1>
        <p className="text-xs text-muted-foreground">Mapa colaborativo</p>
      </div>

      <NotificationCenter
        notifications={notifications}
        onMarkAsRead={markAsRead}
        onMarkAllAsRead={markAllAsRead}
        onDeleteNotification={deleteNotification}
      />
    </header>
  )
}
