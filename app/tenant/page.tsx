"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import TenantLayout from "@/components/tenant-layout"
import { Plus, FileText, Clock, CheckCircle, AlertTriangle, Phone, Mail } from "lucide-react"
import { getTenantTickets, getTenantProfile, type MaintenanceTicket } from "@/lib/storage"
import { initializeSampleData, sampleAnnouncements } from "@/lib/sampleData"
import { formatDistanceToNow } from "date-fns"

const priorityConfig = {
  Low: { color: "bg-gray-100 text-gray-800", icon: Clock },
  Medium: { color: "bg-blue-100 text-blue-800", icon: Clock },
  High: { color: "bg-orange-100 text-orange-800", icon: AlertTriangle },
  Critical: { color: "bg-red-100 text-red-800", icon: AlertTriangle },
}

const statusConfig = {
  Open: { color: "bg-gray-100 text-gray-800", icon: Clock },
  Assigned: { color: "bg-blue-100 text-blue-800", icon: Clock },
  Resolved: { color: "bg-green-100 text-green-800", icon: CheckCircle },
}

export default function TenantDashboard() {
  const [tickets, setTickets] = useState<MaintenanceTicket[]>([])
  const [tenantProfile, setTenantProfile] = useState<any>(null)

  useEffect(() => {
    // Initialize sample data on first load
    initializeSampleData()

    // Load tenant profile and tickets
    const profile = getTenantProfile()
    const allTickets = getTenantTickets()

    setTenantProfile(profile)
    setTickets(allTickets.slice(0, 5)) // Show only recent 5 tickets
  }, [])

  const openTickets = tickets.filter((t) => t.status !== "Resolved").length
  const recentTickets = tickets.slice(0, 3)

  return (
    <TenantLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 text-balance">
            Welcome back{tenantProfile ? `, ${tenantProfile.firstName} ${tenantProfile.lastName}` : ""}!
          </h1>
          <p className="mt-2 text-gray-600">
            {tenantProfile ? `Unit ${tenantProfile.unitNo} • ${tenantProfile.building}` : "Loading your information..."}
          </p>
          <p className="text-gray-500">Manage your requests and stay updated with building announcements.</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/tenant/request">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Submit Request</CardTitle>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Plus className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>Maintenance, incidents, services, and visitor access</CardDescription>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/tenant/requests">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">My Requests</CardTitle>
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FileText className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  {openTickets > 0 ? `${openTickets} open request${openTickets > 1 ? "s" : ""}` : "No open requests"}
                </CardDescription>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/tenant/contacts">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Emergency Contact</CardTitle>
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Phone className="w-5 h-5 text-red-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>24/7 emergency maintenance hotline</CardDescription>
              </CardContent>
            </Link>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Requests */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Requests</CardTitle>
                  <Link href="/tenant/requests">
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {recentTickets.length > 0 ? (
                  <div className="space-y-4">
                    {recentTickets.map((ticket) => {
                      const PriorityIcon = priorityConfig[ticket.priority].icon
                      const StatusIcon = statusConfig[ticket.status].icon

                      return (
                        <div
                          key={ticket.ticketId}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm text-gray-900 truncate">{ticket.title}</span>
                              <Badge variant="secondary" className={priorityConfig[ticket.priority].color}>
                                <PriorityIcon className="w-3 h-3 mr-1" />
                                {ticket.priority}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>#{ticket.ticketId}</span>
                              <span>{ticket.requestType}</span>
                              <span>{formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={statusConfig[ticket.status].color}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {ticket.status}
                            </Badge>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No maintenance requests yet</p>
                    <Link href="/tenant/request">
                      <Button className="mt-4">Create Your First Request</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Announcements */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Announcements</CardTitle>
                  <Link href="/tenant/announcements">
                    <Button variant="ghost" size="sm">
                      See All
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {sampleAnnouncements.slice(0, 2).map((announcement) => (
                  <div key={announcement.id} className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-medium text-sm text-gray-900 mb-1">{announcement.title}</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">{announcement.body}</p>
                    <p className="text-xs text-gray-500 mt-2">{announcement.effectiveDate}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Contacts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Contacts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Building Manager</p>
                    <p className="text-xs text-gray-500">Mon-Fri 9AM-6PM</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Mail className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Emergency Line</p>
                    <p className="text-xs text-gray-500">24/7 Available</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="text-red-600 border-red-200 bg-transparent">
                      <Phone className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <Link href="/tenant/contacts">
                  <Button variant="ghost" size="sm" className="w-full mt-4">
                    View All Contacts
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TenantLayout>
  )
}
