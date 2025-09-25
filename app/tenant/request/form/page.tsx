"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import TenantLayout from "@/components/tenant-layout"
import RequestForm from "@/components/request-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const requestTypeLabels = {
  maintenance: "Maintenance Request",
  incident: "Incident Report",
  service: "Service Request",
  visitor: "Visitor Access & Delivery",
}

function RequestFormContent() {
  const searchParams = useSearchParams()
  const requestType = searchParams.get("type") || "maintenance"
  const typeLabel = requestTypeLabels[requestType as keyof typeof requestTypeLabels] || "Request"

  return (
    <TenantLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/tenant/request">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Request Types
            </Button>
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 text-balance">New {typeLabel}</h1>
          <p className="mt-2 text-gray-600">
            Complete all required fields to submit your request. Our team will review and respond promptly.
          </p>
        </div>

        <RequestForm initialType={requestType} />
      </div>
    </TenantLayout>
  )
}

export default function NewRequestFormPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RequestFormContent />
    </Suspense>
  )
}
