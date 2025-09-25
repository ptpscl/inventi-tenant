"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Building2, Home, Plus, FileText, Users, Bell, Menu, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import Chatbot from "@/components/chatbot"

interface TenantProfile {
  email: string
  unitNo: string
  building: string
  floor: string
}

const navigation = [
  { name: "Dashboard", href: "/tenant", icon: Home },
  { name: "New Request", href: "/tenant/request", icon: Plus },
  { name: "My Requests", href: "/tenant/requests", icon: FileText },
  { name: "Contacts", href: "/tenant/contacts", icon: Users },
  { name: "Announcements", href: "/tenant/announcements", icon: Bell },
]

export default function TenantLayout({ children }: { children: React.ReactNode }) {
  const [tenantProfile, setTenantProfile] = useState<TenantProfile | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  useEffect(() => {
    const profile = localStorage.getItem("tenantProfile")
    if (!profile) {
      router.push("/login")
      return
    }

    try {
      setTenantProfile(JSON.parse(profile))
    } catch {
      router.push("/login")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("tenantProfile")
    localStorage.removeItem("tenantTickets")
    localStorage.removeItem("requestDraft")
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
    router.push("/login")
  }

  if (!tenantProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <MobileNavigation />
              </SheetContent>
            </Sheet>

            <div className="flex items-center gap-2">
              <Building2 className="w-6 h-6 text-blue-600" />
              <span className="font-semibold text-lg">Tenant Portal</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-sm text-gray-600">
              Unit {tenantProfile.unitNo} • {tenantProfile.building}
            </div>

            <Link href="/tenant/request">
              <Button size="sm" className="hidden sm:flex">
                <Plus className="w-4 h-4 mr-1" />
                New Request
              </Button>
            </Link>

            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:pt-16">
          <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                        isActive
                          ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                      )}
                    >
                      <item.icon
                        className={cn(
                          "mr-3 flex-shrink-0 h-5 w-5",
                          isActive ? "text-blue-500" : "text-gray-400 group-hover:text-gray-500",
                        )}
                      />
                      {item.name}
                    </Link>
                  )
                })}
              </nav>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="md:pl-64 flex-1">
          <div className="py-6">{children}</div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="grid grid-cols-5 py-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center py-2 px-1 text-xs",
                  isActive ? "text-blue-600" : "text-gray-500",
                )}
              >
                <item.icon className="w-5 h-5 mb-1" />
                <span className="truncate">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </div>

      <Chatbot />
    </div>
  )
}

function MobileNavigation() {
  const pathname = usePathname()

  return (
    <nav className="mt-5 flex-1 px-2 space-y-1">
      {navigation.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors",
              isActive ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
            )}
          >
            <item.icon
              className={cn(
                "mr-4 flex-shrink-0 h-6 w-6",
                isActive ? "text-blue-500" : "text-gray-400 group-hover:text-gray-500",
              )}
            />
            {item.name}
          </Link>
        )
      })}
    </nav>
  )
}
