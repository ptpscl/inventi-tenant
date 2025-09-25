"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  FileText,
  ImageIcon,
  Copy,
  CheckCircle,
  AlertTriangle,
  User,
  Building,
  Star,
} from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"
import type { MaintenanceTicket } from "@/lib/storage"
import PriorityBadge from "@/components/priority-badge"
import FeedbackModal from "@/components/feedback-modal"
import { useToast } from "@/hooks/use-toast"

interface TicketDetailDrawerProps {
  ticket: MaintenanceTicket | null
  isOpen: boolean
  onClose: () => void
  onTicketUpdate?: (ticket: MaintenanceTicket) => void
}

const statusConfig = {
  Open: { color: "bg-gray-100 text-gray-800", icon: Clock, label: "Open" },
  Assigned: { color: "bg-blue-100 text-blue-800", icon: User, label: "Assigned" },
  Resolved: { color: "bg-green-100 text-green-800", icon: CheckCircle, label: "Resolved" },
}

const activityTimeline = [
  {
    id: "1",
    type: "created",
    title: "Request Created",
    description: "Maintenance request submitted by tenant",
    timestamp: "2024-12-18T10:30:00Z",
    icon: FileText,
  },
  {
    id: "2",
    type: "assigned",
    title: "Assigned to Technician",
    description: "Request assigned to John Smith from Maintenance Team",
    timestamp: "2024-12-18T14:15:00Z",
    icon: User,
  },
]

export default function TicketDetailDrawer({ ticket, isOpen, onClose, onTicketUpdate }: TicketDetailDrawerProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const { toast } = useToast()

  if (!ticket) return null

  const StatusIcon = statusConfig[ticket.status].icon

  const copyTicketId = () => {
    navigator.clipboard.writeText(ticket.ticketId)
    toast({
      title: "Copied!",
      description: "Ticket ID copied to clipboard",
    })
  }

  const getExpectedResponse = () => {
    switch (ticket.priority) {
      case "Critical":
        return "Within 2 hours"
      case "High":
        return "Within 24 hours"
      case "Medium":
        return "Within 3 business days"
      case "Low":
        return "Within 1 week"
      default:
        return "TBD"
    }
  }

  const hasSubmittedFeedback = () => {
    const existingFeedback = JSON.parse(localStorage.getItem("requestFeedback") || "[]")
    return existingFeedback.some((feedback: any) => feedback.requestId === ticket.ticketId)
  }

  const handleFeedbackClick = () => {
    setShowFeedbackModal(true)
  }

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <SheetTitle className="text-xl text-balance">{ticket.title}</SheetTitle>
                <SheetDescription className="flex items-center gap-2 mt-2">
                  <span className="font-mono">#{ticket.ticketId}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyTicketId}>
                    <Copy className="w-3 h-3" />
                  </Button>
                </SheetDescription>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <PriorityBadge priority={ticket.priority} />
              <Badge variant="outline" className={statusConfig[ticket.status].color}>
                <StatusIcon className="w-3 h-3 mr-1" />
                {statusConfig[ticket.status].label}
              </Badge>
              <Badge variant="secondary">{ticket.requestType}</Badge>
            </div>

            {ticket.status === "Resolved" && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-green-900 mb-1">Request Completed!</h4>
                    <p className="text-sm text-green-800">Your feedback matters and helps us improve our service.</p>
                  </div>
                  {!hasSubmittedFeedback() ? (
                    <Button onClick={handleFeedbackClick} size="sm" className="bg-green-600 hover:bg-green-700">
                      <Star className="w-4 h-4 mr-2" />
                      Rate Service
                    </Button>
                  ) : (
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Feedback Submitted
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </SheetHeader>

          <div className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Request Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Property:</span>
                    <span className="font-medium">{ticket.property}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">
                      Floor {ticket.floor}, Unit {ticket.unit}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">{ticket.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Contact:</span>
                    <span className="font-medium">{ticket.contactPhone}</span>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-gray-600 leading-relaxed">{ticket.description}</p>
                </div>

                {ticket.accessInstructions && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-2">Access Instructions</h4>
                      <p className="text-gray-600 leading-relaxed">{ticket.accessInstructions}</p>
                    </div>
                  </>
                )}

                {ticket.preferredSchedule && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-2">Preferred Schedule</h4>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{format(new Date(ticket.preferredSchedule.date), "PPP")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span>{ticket.preferredSchedule.timeRange}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {ticket.photos.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    Photos ({ticket.photos.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {ticket.photos.map((photo, index) => (
                      <div
                        key={index}
                        className="aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setSelectedPhoto(photo)}
                      >
                        <img
                          src={photo || "/placeholder.svg"}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Service Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Expected Response:</span>
                    <div className="font-medium text-lg">{getExpectedResponse()}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Created:</span>
                    <div className="font-medium">
                      {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                    </div>
                    <div className="text-xs text-gray-500">{format(new Date(ticket.createdAt), "PPp")}</div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 mb-1">What happens next?</h4>
                      <p className="text-sm text-blue-800">
                        Our maintenance team will review your request and contact you within the expected response time.
                        You'll receive updates via email and can track progress here.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Activity Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activityTimeline.map((activity, index) => {
                    const Icon = activity.icon
                    return (
                      <div key={activity.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <Icon className="w-4 h-4 text-blue-600" />
                          </div>
                          {index < activityTimeline.length - 1 && <div className="w-px h-8 bg-gray-200 mt-2" />}
                        </div>
                        <div className="flex-1 pb-4">
                          <h4 className="font-medium text-gray-900">{activity.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </SheetContent>
      </Sheet>

      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="max-w-4xl max-h-full">
            <img
              src={selectedPhoto || "/placeholder.svg"}
              alt="Full size"
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        requestId={ticket.ticketId}
        requestTitle={ticket.title}
      />
    </>
  )
}
