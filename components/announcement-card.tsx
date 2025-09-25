"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Paperclip, Info, Bell, AlertTriangle } from "lucide-react"
import { format, isAfter, isBefore } from "date-fns"

interface Announcement {
  id: string
  title: string
  body: string
  effectiveDate: string
  endDate: string
  priority: string
  attachments: string[]
}

interface AnnouncementCardProps {
  announcement: Announcement
}

const priorityConfig = {
  Low: { color: "bg-gray-100 text-gray-800", icon: Info, label: "Info" },
  Medium: { color: "bg-blue-100 text-blue-800", icon: Bell, label: "Notice" },
  High: { color: "bg-orange-100 text-orange-800", icon: AlertTriangle, label: "Important" },
}

export default function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  const config = priorityConfig[announcement.priority as keyof typeof priorityConfig] || priorityConfig.Medium
  const Icon = config.icon

  const effectiveDate = new Date(announcement.effectiveDate)
  const endDate = new Date(announcement.endDate)
  const now = new Date()

  const isActive = isAfter(now, effectiveDate) && isBefore(now, endDate)
  const isUpcoming = isAfter(effectiveDate, now)
  const isPast = isAfter(now, endDate)

  const getStatusBadge = () => {
    if (isUpcoming) {
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
          Upcoming
        </Badge>
      )
    }
    if (isActive) {
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800">
          Active
        </Badge>
      )
    }
    if (isPast) {
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-600">
          Completed
        </Badge>
      )
    }
    return null
  }

  return (
    <Card className={`${announcement.priority === "High" ? "border-orange-200 bg-orange-50/30" : ""}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl text-balance">{announcement.title}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-2">
              <Calendar className="w-4 h-4" />
              {announcement.effectiveDate === announcement.endDate ? (
                <span>{format(effectiveDate, "PPP")}</span>
              ) : (
                <span>
                  {format(effectiveDate, "PPP")} - {format(endDate, "PPP")}
                </span>
              )}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 ml-4">
            {getStatusBadge()}
            <Badge variant="outline" className={config.color}>
              <Icon className="w-3 h-3 mr-1" />
              {config.label}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-gray-700 leading-relaxed">{announcement.body}</p>

        {announcement.attachments.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="font-medium text-sm text-gray-900 mb-3 flex items-center gap-2">
              <Paperclip className="w-4 h-4" />
              Attachments ({announcement.attachments.length})
            </h4>
            <div className="space-y-2">
              {announcement.attachments.map((attachment, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">{attachment}</span>
                  <Button size="sm" variant="outline" className="h-7 text-xs bg-transparent">
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {announcement.priority === "High" && (
          <div className="border-t pt-4">
            <div className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-orange-900 text-sm">Action Required</h4>
                <p className="text-sm text-orange-800 mt-1">
                  This announcement may require action on your part. Please read carefully and follow any instructions
                  provided.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
