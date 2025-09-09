"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { Camera, Bell, Shield, Trash2 } from "lucide-react"
import type { UserData } from "./user-profile"

interface ProfileSettingsProps {
  userData: UserData
}

export function ProfileSettings({ userData }: ProfileSettingsProps) {
  const [formData, setFormData] = useState({
    name: userData.name,
    email: userData.email,
    userType: userData.userType,
  })
  const [notifications, setNotifications] = useState({
    boxFull: true,
    newBoxes: true,
    achievements: true,
    weeklyReport: false,
  })
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showStats: true,
    showHistory: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSaveProfile = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Perfil actualizado",
        description: "Tus cambios han sido guardados correctamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el perfil",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = () => {
    if (window.confirm("¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.")) {
      toast({
        title: "Cuenta eliminada",
        description: "Tu cuenta ha sido eliminada correctamente",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle>Información del Perfil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={userData.avatar || "/placeholder.svg"} />
              <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                {userData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" size="sm">
                <Camera className="h-4 w-4 mr-2" />
                Cambiar foto
              </Button>
              <p className="text-sm text-muted-foreground mt-1">JPG, PNG o GIF. Máximo 2MB.</p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="userType">Tipo de usuario</Label>
            <Select
              value={formData.userType}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, userType: value as "citizen" | "recycler" }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="citizen">Ciudadano</SelectItem>
                <SelectItem value="recycler">Reciclador</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleSaveProfile} disabled={isLoading}>
            {isLoading ? "Guardando..." : "Guardar cambios"}
          </Button>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificaciones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="boxFull">Cajas llenas</Label>
              <p className="text-sm text-muted-foreground">Recibe notificaciones cuando una caja esté llena</p>
            </div>
            <Switch
              id="boxFull"
              checked={notifications.boxFull}
              onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, boxFull: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="newBoxes">Nuevas cajas</Label>
              <p className="text-sm text-muted-foreground">Notificaciones sobre nuevas cajas en tu área</p>
            </div>
            <Switch
              id="newBoxes"
              checked={notifications.newBoxes}
              onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, newBoxes: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="achievements">Logros</Label>
              <p className="text-sm text-muted-foreground">Notificaciones cuando desbloquees logros</p>
            </div>
            <Switch
              id="achievements"
              checked={notifications.achievements}
              onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, achievements: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="weeklyReport">Reporte semanal</Label>
              <p className="text-sm text-muted-foreground">Resumen semanal de tu actividad</p>
            </div>
            <Switch
              id="weeklyReport"
              checked={notifications.weeklyReport}
              onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, weeklyReport: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacidad
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="profileVisible">Perfil público</Label>
              <p className="text-sm text-muted-foreground">Permite que otros usuarios vean tu perfil</p>
            </div>
            <Switch
              id="profileVisible"
              checked={privacy.profileVisible}
              onCheckedChange={(checked) => setPrivacy((prev) => ({ ...prev, profileVisible: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="showStats">Mostrar estadísticas</Label>
              <p className="text-sm text-muted-foreground">Comparte tus estadísticas de reciclaje</p>
            </div>
            <Switch
              id="showStats"
              checked={privacy.showStats}
              onCheckedChange={(checked) => setPrivacy((prev) => ({ ...prev, showStats: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="showHistory">Mostrar historial</Label>
              <p className="text-sm text-muted-foreground">Permite ver tu historial de actividades</p>
            </div>
            <Switch
              id="showHistory"
              checked={privacy.showHistory}
              onCheckedChange={(checked) => setPrivacy((prev) => ({ ...prev, showHistory: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Zona de Peligro
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Eliminar cuenta</h3>
              <p className="text-sm text-muted-foreground">
                Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, ten cuidado.
              </p>
            </div>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar mi cuenta
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
