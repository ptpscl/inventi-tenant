"use client"

import TenantLayout from "@/components/tenant-layout"
import ContactCard from "@/components/contact-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Clock, Phone } from "lucide-react"

const contacts = [
  {
    id: "building-manager",
    name: "Sarah Johnson",
    role: "Building Manager",
    department: "Management",
    phone: "+1-555-0101",
    email: "sarah.johnson@property.com",
    hours: "Monday - Friday, 9:00 AM - 6:00 PM",
    description: "General building management, lease inquiries, and non-emergency maintenance coordination.",
    priority: "normal" as const,
  },
  {
    id: "maintenance-supervisor",
    name: "Mike Rodriguez",
    role: "Maintenance Supervisor",
    department: "Maintenance",
    phone: "+1-555-0102",
    email: "mike.rodriguez@property.com",
    hours: "Monday - Friday, 8:00 AM - 5:00 PM",
    description: "Maintenance request coordination, work order management, and technical support.",
    priority: "normal" as const,
  },
  {
    id: "security",
    name: "Security Desk",
    role: "Security Team",
    department: "Security",
    phone: "+1-555-0103",
    email: "security@property.com",
    hours: "24/7 Available",
    description: "Building security, access control, visitor management, and safety concerns.",
    priority: "high" as const,
  },
  {
    id: "emergency",
    name: "Emergency Hotline",
    role: "Emergency Response",
    department: "Emergency",
    phone: "+1-555-0911",
    email: "emergency@property.com",
    hours: "24/7 Emergency Line",
    description:
      "Fire, flood, gas leaks, electrical emergencies, and other critical situations requiring immediate response.",
    priority: "critical" as const,
  },
  {
    id: "engineering",
    name: "Tom Chen",
    role: "Chief Engineer",
    department: "Engineering",
    phone: "+1-555-0104",
    email: "tom.chen@property.com",
    hours: "Monday - Friday, 7:00 AM - 4:00 PM",
    description: "HVAC systems, electrical infrastructure, plumbing systems, and building mechanical issues.",
    priority: "normal" as const,
  },
  {
    id: "concierge",
    name: "Concierge Desk",
    role: "Concierge Services",
    department: "Services",
    phone: "+1-555-0105",
    email: "concierge@property.com",
    hours: "Monday - Friday, 8:00 AM - 8:00 PM",
    description: "Package delivery, visitor announcements, general inquiries, and resident services.",
    priority: "normal" as const,
  },
]

export default function ContactsPage() {
  const emergencyContacts = contacts.filter((c) => c.priority === "critical")
  const highPriorityContacts = contacts.filter((c) => c.priority === "high")
  const normalContacts = contacts.filter((c) => c.priority === "normal")

  return (
    <TenantLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 text-balance">Contact Directory</h1>
          <p className="mt-2 text-gray-600">
            Get in touch with the right team member for your needs. Emergency contacts are available 24/7.
          </p>
        </div>

        {/* Emergency Contacts */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h2 className="text-xl font-semibold text-red-900">Emergency Contacts</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {emergencyContacts.map((contact) => (
              <ContactCard key={contact.id} contact={contact} />
            ))}
          </div>
        </div>

        {/* High Priority Contacts */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-orange-600" />
            <h2 className="text-xl font-semibold text-orange-900">Security & Safety</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {highPriorityContacts.map((contact) => (
              <ContactCard key={contact.id} contact={contact} />
            ))}
          </div>
        </div>

        {/* Regular Contacts */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Phone className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-blue-900">Building Services</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {normalContacts.map((contact) => (
              <ContactCard key={contact.id} contact={contact} />
            ))}
          </div>
        </div>

        {/* Contact Guidelines */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Contact Guidelines</CardTitle>
            <CardDescription className="text-blue-800">
              Please use the appropriate contact method for your situation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-blue-800">
            <div>
              <strong>Emergency Situations:</strong> Fire, gas leaks, electrical hazards, flooding, or any situation
              requiring immediate response - call the Emergency Hotline.
            </div>
            <div>
              <strong>Security Issues:</strong> Suspicious activity, access problems, or safety concerns - contact
              Security.
            </div>
            <div>
              <strong>Maintenance Requests:</strong> For non-emergency repairs, use the maintenance request form or
              contact the Maintenance Supervisor.
            </div>
            <div>
              <strong>General Inquiries:</strong> Building policies, lease questions, or general information - contact
              the Building Manager.
            </div>
          </CardContent>
        </Card>
      </div>
    </TenantLayout>
  )
}
