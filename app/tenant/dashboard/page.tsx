"use client"

import { useState } from "react"
import { BuildingAssistantChat } from "@/components/building-assistant-chat"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"

export default function TenantDashboard() {
  const [chatbotOpen, setChatbotOpen] = useState(false)

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Button
        onClick={() => setChatbotOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg z-40"
        size="lg"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>

      <BuildingAssistantChat isOpen={chatbotOpen} onClose={() => setChatbotOpen(false)} />
    </div>
  )
}
