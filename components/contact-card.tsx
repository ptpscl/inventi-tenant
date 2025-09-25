"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Phone, Mail, Copy, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Contact {
  id: string
  name: string
  role: string
  department: string
  phone: string
  email: string
  hours: string
  description: string
  priority: "normal" | "high" | "critical"
}

interface ContactCardProps {
  contact: Contact
}

const priorityConfig = {
  normal: { color: "bg-blue-100 text-blue-800", label: "Standard" },
  high: { color: "bg-orange-100 text-orange-800", label: "Priority" },
  critical: { color: "bg-red-100 text-red-800", label: "Emergency" },
}

export default function ContactCard({ contact }: ContactCardProps) {
  const { toast } = useToast()

  const handleCall = () => {
    window.location.href = `tel:${contact.phone}`
  }

  const handleEmail = () => {
    window.location.href = `mailto:${contact.email}`
  }

  const copyPhone = () => {
    navigator.clipboard.writeText(contact.phone)
    toast({
      title: "Copied!",
      description: "Phone number copied to clipboard",
    })
  }

  const copyEmail = () => {
    navigator.clipboard.writeText(contact.email)
    toast({
      title: "Copied!",
      description: "Email address copied to clipboard",
    })
  }

  return (
    <Card className={`hover:shadow-lg transition-shadow ${contact.priority === "critical" ? "border-red-200" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg">{contact.name}</CardTitle>
            <CardDescription className="text-sm font-medium text-gray-600">{contact.role}</CardDescription>
          </div>
          <Badge variant="outline" className={priorityConfig[contact.priority].color}>
            {priorityConfig[contact.priority].label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 leading-relaxed">{contact.description}</p>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>{contact.hours}</span>
        </div>

        <div className="space-y-3">
          {/* Phone */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="font-mono">{contact.phone}</span>
            </div>
            <div className="flex gap-1">
              <Button size="sm" onClick={handleCall} className="h-8">
                Call
              </Button>
              <Button size="sm" variant="outline" onClick={copyPhone} className="h-8 w-8 p-0 bg-transparent">
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="truncate">{contact.email}</span>
            </div>
            <div className="flex gap-1">
              <Button size="sm" variant="outline" onClick={handleEmail} className="h-8 bg-transparent">
                Email
              </Button>
              <Button size="sm" variant="outline" onClick={copyEmail} className="h-8 w-8 p-0 bg-transparent">
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t">
          <span className="text-xs text-gray-500 font-medium">{contact.department}</span>
        </div>
      </CardContent>
    </Card>
  )
}
