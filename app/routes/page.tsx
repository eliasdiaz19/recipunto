import { RouteOptimizer } from "@/components/boxes/route-optimizer"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

// Mock data - in a real app this would come from a database
const mockBoxes = [
  {
    id: "1",
    lat: 40.4168,
    lng: -3.7038,
    currentAmount: 15,
    capacity: 50,
    isFull: false,
    createdBy: "user1",
    createdAt: new Date("2024-01-15"),
    lastUpdated: new Date("2024-01-20"),
  },
  {
    id: "2",
    lat: 40.4178,
    lng: -3.7048,
    currentAmount: 48,
    capacity: 50,
    isFull: true,
    createdBy: "user2",
    createdAt: new Date("2024-01-10"),
    lastUpdated: new Date("2024-01-22"),
  },
  {
    id: "3",
    lat: 40.4158,
    lng: -3.7028,
    currentAmount: 35,
    capacity: 40,
    isFull: false,
    createdBy: "current-user",
    createdAt: new Date("2024-01-18"),
    lastUpdated: new Date("2024-01-21"),
  },
]

export default function RoutesPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border p-4">
        <div className="flex items-center gap-4">
          <Link href="/boxes">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-semibold">Optimización de Rutas</h1>
            <p className="text-sm text-muted-foreground">Planifica rutas eficientes de recogida</p>
          </div>
        </div>
      </header>

      <div className="p-4">
        <RouteOptimizer boxes={mockBoxes} />
      </div>
    </div>
  )
}
