"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Building2, Mail, Home, UserPlus, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { validateTenantLogin, setTenantProfile } from "@/lib/storage"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [unitNo, setUnitNo] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const registered = searchParams.get("registered")

  useEffect(() => {
    if (registered === "true") {
      toast({
        title: "Registration Successful!",
        description: "Your account has been created. Please sign in with your credentials.",
        variant: "default",
      })
    }
  }, [registered, toast])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !unitNo) {
      setError("Please fill in all required fields.")
      return
    }

    setIsLoading(true)

    // Simulate login delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const registeredTenant = validateTenantLogin(email, unitNo)

    if (!registeredTenant) {
      setError(
        "Invalid credentials or account not found. Please check your email and unit number, or register for a new account.",
      )
      setIsLoading(false)
      return
    }

    const tenantProfile = {
      email: registeredTenant.email,
      firstName: registeredTenant.firstName,
      lastName: registeredTenant.lastName,
      unitNo: registeredTenant.unitNumber,
      loginTime: new Date().toISOString(),
      building: registeredTenant.building,
      floor: registeredTenant.unitNumber.charAt(0) || "1", // Extract floor from unit number
      property: "Property 1", // Default property
    }

    setTenantProfile(tenantProfile)

    toast({
      title: "Welcome back!",
      description: `Signed in as ${registeredTenant.firstName} ${registeredTenant.lastName}, Unit ${registeredTenant.unitNumber}`,
    })

    router.push("/tenant")
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Tenant Portal</CardTitle>
          <CardDescription>Sign in to access your maintenance dashboard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {registered === "true" && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Registration successful! Please sign in with your credentials.
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unitNo" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Unit Number
              </Label>
              <Input
                id="unitNo"
                type="text"
                placeholder="e.g., 305, 12A, B-204"
                value={unitNo}
                onChange={(e) => setUnitNo(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full h-11" disabled={isLoading}>
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="space-y-4 pt-4 border-t">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-3">Don't have an account yet?</p>
              <Link href="/signup">
                <Button variant="outline" className="w-full h-11 bg-transparent">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create New Account
                </Button>
              </Link>
            </div>
          </div>

          <div className="text-center text-xs text-muted-foreground">
            <p>Secure tenant portal with registration validation</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
