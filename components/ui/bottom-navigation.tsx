"use client"

import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Map, Package, User, Bell } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

interface BottomNavigationProps {
  notificationCount?: number
}

export function BottomNavigation({ notificationCount = 0 }: BottomNavigationProps) {
  const pathname = usePathname()
  const router = useRouter()
  const isMobile = useIsMobile()

  if (!isMobile) return null

  const navItems = [
    {
      icon: Map,
      label: "Mapa",
      path: "/map",
      isActive: pathname === "/map" || pathname === "/",
    },
    {
      icon: Package,
      label: "Cajas",
      path: "/boxes",
      isActive: pathname === "/boxes",
    },
    {
      icon: Bell,
      label: "Notificaciones",
      path: "/notifications",
      isActive: pathname === "/notifications",
      badge: notificationCount,
    },
    {
      icon: User,
      label: "Perfil",
      path: "/profile",
      isActive: pathname === "/profile",
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
      <div className="flex items-center justify-around px-2 py-2 safe-area-pb">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.path}
              variant="ghost"
              size="lg"
              className={cn("flex-1 flex-col gap-1 h-16 relative", item.isActive && "text-primary")}
              onClick={() => router.push(item.path)}
            >
              <div className="relative">
                <Icon className={cn("h-6 w-6", item.isActive && "text-primary")} />
                {item.badge && item.badge > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-destructive text-destructive-foreground">
                    {item.badge > 99 ? "99+" : item.badge}
                  </Badge>
                )}
              </div>
              <span className={cn("text-xs", item.isActive && "text-primary font-medium")}>{item.label}</span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
