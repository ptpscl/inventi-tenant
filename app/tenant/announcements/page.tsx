"use client"

import { useState } from "react"
import TenantLayout from "@/components/tenant-layout"
import AnnouncementCard from "@/components/announcement-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, AlertTriangle, Info, CheckCircle } from "lucide-react"
import { sampleAnnouncements } from "@/lib/sampleData"

const extendedAnnouncements = [
  ...sampleAnnouncements,
  {
    id: "4",
    title: "New Package Delivery System",
    body: "We've upgraded our package delivery system with smart lockers located in the lobby. You'll receive SMS notifications when packages arrive. Please update your delivery preferences in the tenant portal.",
    effectiveDate: "2024-12-20",
    endDate: "2024-12-31",
    priority: "Medium",
    attachments: ["Package System Guide.pdf", "SMS Setup Instructions.pdf"],
  },
  {
    id: "5",
    title: "Gym Equipment Maintenance Complete",
    body: "The fitness center equipment maintenance has been completed. All cardio machines have been serviced and the weight area has been reorganized. New sanitization stations have been added throughout the gym.",
    effectiveDate: "2024-12-15",
    endDate: "2024-12-15",
    priority: "Low",
    attachments: [],
  },
  {
    id: "6",
    title: "Fire Safety Inspection Scheduled",
    body: "The annual fire safety inspection will take place on January 5th, 2025. Inspectors will need access to all units between 9:00 AM and 5:00 PM. Please ensure someone is available or provide access instructions to building management.",
    effectiveDate: "2025-01-05",
    endDate: "2025-01-05",
    priority: "High",
    attachments: ["Fire Safety Checklist.pdf"],
  },
]

const priorityConfig = {
  Low: { color: "bg-gray-100 text-gray-800", icon: Info, label: "Info" },
  Medium: { color: "bg-blue-100 text-blue-800", icon: Bell, label: "Notice" },
  High: { color: "bg-orange-100 text-orange-800", icon: AlertTriangle, label: "Important" },
}

export default function AnnouncementsPage() {
  const [filter, setFilter] = useState<string>("All")

  const filteredAnnouncements = extendedAnnouncements.filter((announcement) => {
    if (filter === "All") return true
    return announcement.priority === filter
  })

  const priorityCounts = {
    All: extendedAnnouncements.length,
    High: extendedAnnouncements.filter((a) => a.priority === "High").length,
    Medium: extendedAnnouncements.filter((a) => a.priority === "Medium").length,
    Low: extendedAnnouncements.filter((a) => a.priority === "Low").length,
  }

  return (
    <TenantLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 text-balance">Building Announcements</h1>
          <p className="mt-2 text-gray-600">
            Stay informed about building updates, maintenance schedules, and important notices.
          </p>
        </div>

        {/* Filter Tabs */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Filter Announcements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(priorityCounts).map(([priority, count]) => (
                <Button
                  key={priority}
                  variant={filter === priority ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(priority)}
                  className="h-8"
                >
                  {priority} ({count})
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Announcements List */}
        <div className="space-y-6">
          {filteredAnnouncements.length > 0 ? (
            filteredAnnouncements.map((announcement) => (
              <AnnouncementCard key={announcement.id} announcement={announcement} />
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No announcements found</h3>
                <p className="text-gray-500">There are no announcements matching your current filter.</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Information Card */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900 flex items-center gap-2">
              <Info className="w-5 h-5" />
              Stay Updated
            </CardTitle>
            <CardDescription className="text-blue-800">
              Important information about building announcements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-blue-800">
            <div>
              <strong>Email Notifications:</strong> You'll receive email notifications for high-priority announcements
              that affect building services or require tenant action.
            </div>
            <div>
              <strong>Emergency Alerts:</strong> Critical announcements (fire alarms, evacuations, utility outages) will
              be sent via SMS and email immediately.
            </div>
            <div>
              <strong>Archive:</strong> All announcements are archived here for your reference. Check back regularly for
              updates on ongoing maintenance and building improvements.
            </div>
          </CardContent>
        </Card>
      </div>
    </TenantLayout>
  )
}
