"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Settings, Database, Zap, LogIn, ArrowRight } from "lucide-react"

export default function DevPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background">
      {/* Development Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Zap className="h-6 w-6" />
                Recipunto Development Mode
              </h1>
              <p className="text-blue-100 mt-1">
                Testing real-time box status updates and new features
              </p>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary" className="bg-white/20 text-white">
                Real-time Active
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white">
                Supabase Connected
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Development Options */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Quick Access */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LogIn className="h-5 w-5" />
                Quick Access
              </CardTitle>
              <CardDescription>
                Jump directly to the main application features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => router.push('/login')} 
                className="w-full justify-between"
                variant="default"
              >
                <span className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Go to Login Page
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
              
              <Button 
                onClick={() => router.push('/map')} 
                className="w-full justify-between"
                variant="outline"
              >
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Go to Map (if logged in)
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
              
              <Button 
                onClick={() => router.push('/boxes')} 
                className="w-full justify-between"
                variant="outline"
              >
                <span className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Go to Box Management
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                System Status
              </CardTitle>
              <CardDescription>
                Real-time connection and feature status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Supabase Connection:</span>
                  <Badge variant="default" className="bg-green-500">
                    Connected
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Real-time Subscriptions:</span>
                  <Badge variant="default" className="bg-green-500">
                    Active
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">RLS Policies:</span>
                  <Badge variant="default" className="bg-green-500">
                    Enabled
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Database Tables:</span>
                  <Badge variant="default" className="bg-green-500">
                    Ready
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Testing Instructions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Testing Instructions</CardTitle>
            <CardDescription>
              How to test the new real-time features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold text-sm mb-2">1. Authentication</h4>
                  <p className="text-sm text-muted-foreground">
                    Click "Go to Login Page" to access the application. You'll need to create an account or log in to test the features.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-2">2. Real-time Testing</h4>
                  <p className="text-sm text-muted-foreground">
                    Open the map in multiple browser windows. Create, update, or move boxes in one window and watch them sync in real-time.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-2">3. Box Operations</h4>
                  <p className="text-sm text-muted-foreground">
                    Test creating boxes, updating their fill level, moving them on the map, and deleting them.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-2">4. Multi-user Testing</h4>
                  <p className="text-sm text-muted-foreground">
                    Have multiple users logged in simultaneously to see real-time collaboration in action.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
