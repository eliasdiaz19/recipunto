"use client"

import { useAuth } from "@/hooks/useAuth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export function ProfileBadge() {
  const { user, signOut } = useAuth()

  if (!user) {
    return null
  }

  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-8 w-8">
        <AvatarImage src="" />
        <AvatarFallback>{user.email?.[0]?.toUpperCase() ?? "U"}</AvatarFallback>
      </Avatar>
      <span className="text-sm">{user.email}</span>
      <Button size="sm" variant="outline" onClick={() => signOut()}>Salir</Button>
    </div>
  )
}
