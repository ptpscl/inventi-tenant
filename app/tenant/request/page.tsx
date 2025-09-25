"use client"

import { useState } from "react"
import Link from "next/link"
import TenantLayout from "@/components/tenant-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wrench, AlertTriangle, Users, Settings, ArrowRight, Clock, Shield } from "lucide-react"

const requestTypes = [
  {
    id: "maintenance",
    title: "Maintenance Request",
    description: "Repairs, electrical, plumbing, AC, appliances, and general maintenance issues",
    icon: Wrench,
    color: "bg-blue-100 text-blue-600",
    examples: ["Leaky faucet", "AC not working", "Electrical outlet issue", "Door lock repair"],
    urgency: "Standard processing time: 24-48 hours",
  },
  {
    id: "incident",
    title: "Incident Report",
    description: "Safety concerns, emergencies, security issues, or incidents requiring immediate attention",
    icon: AlertTriangle,
    color: "bg-red-100 text-red-600",
    examples: ["Water leak", "Gas smell", "Security concern", "Fire safety issue"],
    urgency: "Priority processing: Immediate to 4 hours",
  },
  {
    id: "service",
    title: "Service Request",
    description: "Cleaning, pest control, handyman services, move-in/out assistance",
    icon: Settings,
    color: "bg-green-100 text-green-600",
    examples: ["Deep cleaning", "Pest control", "Handyman service", "Move-in assistance"],
    urgency: "Scheduled service: 2-5 business days",
  },
  {
    id: "visitor",
    title: "Visitor Access & Delivery",
    description: "Guest access, courier deliveries, large item deliveries, and visitor management",
    icon: Users,
    color: "bg-purple-100 text-purple-600",
    examples: ["Guest access", "Package delivery", "Food delivery", "Furniture delivery"],
    urgency: "Same-day coordination when possible",
  },
]

export default function RequestTypePage() {
  const [selectedType, setSelectedType] = useState<string | null>(null)

  return (
    <TenantLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 text-balance">Submit a Request</h1>
          <p className="mt-2 text-gray-600">
            Choose the type of request you'd like to submit. Each type has a tailored form to ensure we get the right
            information.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {requestTypes.map((type) => {
            const Icon = type.icon
            const isSelected = selectedType === type.id

            return (
              <Card
                key={type.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  isSelected ? "ring-2 ring-blue-500 shadow-lg" : "hover:shadow-md"
                }`}
                onClick={() => setSelectedType(type.id)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg ${type.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{type.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500">{type.urgency}</span>
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="p-1 bg-blue-100 rounded-full">
                        <div className="w-2 h-2 bg-blue-600 rounded-full" />
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4 text-sm leading-relaxed">{type.description}</CardDescription>

                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-700 uppercase tracking-wide">Common Examples:</p>
                    <div className="flex flex-wrap gap-1">
                      {type.examples.map((example, index) => (
                        <span
                          key={index}
                          className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md"
                        >
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {selectedType && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-900">
                  Ready to submit your {requestTypes.find((t) => t.id === selectedType)?.title.toLowerCase()}?
                </h3>
                <p className="text-blue-700 text-sm mt-1">
                  You'll be taken to a specialized form designed for this type of request.
                </p>
              </div>
              <Link href={`/tenant/request/form?type=${selectedType}`}>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        )}

        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gray-200 rounded-lg">
              <Shield className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Need Help Choosing?</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>
                  • <strong>Maintenance:</strong> Anything broken or not working properly in your unit
                </li>
                <li>
                  • <strong>Incident:</strong> Safety concerns, emergencies, or security issues
                </li>
                <li>
                  • <strong>Service:</strong> Scheduled services like cleaning or pest control
                </li>
                <li>
                  • <strong>Visitor/Delivery:</strong> Access coordination for guests or deliveries
                </li>
              </ul>
              <div className="mt-4">
                <Link href="/tenant/contacts">
                  <Button variant="outline" size="sm">
                    Contact Building Management
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TenantLayout>
  )
}
