"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { MessageCircle, Send, Bot, User } from "lucide-react"

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
}

const cannedResponses = {
  "how to file": {
    keywords: ["file", "request", "submit", "create", "maintenance"],
    response:
      "To file a maintenance request:\n\n1. Click 'New Request' in the navigation or dashboard\n2. Fill out all required fields including location and description\n3. Upload photos if helpful (up to 5 images)\n4. Submit your request\n\nYou'll receive a ticket ID and can track progress in 'My Requests'.",
  },
  "ticket status": {
    keywords: ["status", "track", "progress", "ticket", "request"],
    response:
      "To check your ticket status:\n\n1. Go to 'My Requests' in the navigation\n2. Find your ticket in the list\n3. Click on it to see detailed status and timeline\n\nTicket statuses:\n• Open: Just submitted, awaiting review\n• Assigned: Technician assigned, work scheduled\n• Resolved: Work completed",
  },
  emergency: {
    keywords: ["emergency", "urgent", "fire", "gas", "flood", "electrical"],
    response:
      "For EMERGENCIES, do NOT use this chat!\n\n🚨 Call Emergency Hotline: +1-555-0911\n\nEmergencies include:\n• Fire or smoke\n• Gas leaks\n• Electrical hazards\n• Flooding\n• Security threats\n\nFor urgent but non-emergency issues, call Security: +1-555-0103",
  },
  contact: {
    keywords: ["contact", "phone", "email", "hours", "manager"],
    response:
      "Key contacts:\n\n📞 Building Manager: +1-555-0101\n   (Mon-Fri, 9AM-6PM)\n\n🔧 Maintenance: +1-555-0102\n   (Mon-Fri, 8AM-5PM)\n\n🛡️ Security: +1-555-0103\n   (24/7 Available)\n\n🚨 Emergency: +1-555-0911\n   (24/7 Emergency Line)\n\nSee 'Contacts' page for complete directory.",
  },
  hours: {
    keywords: ["hours", "time", "when", "schedule", "office"],
    response:
      "Building service hours:\n\n🏢 Management Office: Mon-Fri, 9AM-6PM\n🔧 Maintenance: Mon-Fri, 8AM-5PM\n🛡️ Security: 24/7\n🎯 Concierge: Mon-Fri, 8AM-8PM\n\nEmergency services are available 24/7.\nNon-emergency requests submitted after hours will be reviewed the next business day.",
  },
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "bot",
      content:
        "Hi! I'm your building assistant. I can help with:\n\n• How to file maintenance requests\n• Checking ticket status\n• Emergency numbers\n• Contact information\n• Building hours\n\nWhat can I help you with?",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")

  const findResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()

    for (const [key, response] of Object.entries(cannedResponses)) {
      if (response.keywords.some((keyword) => message.includes(keyword))) {
        return response.response
      }
    }

    return "I'm sorry, I didn't understand that. I can help with:\n\n• Filing maintenance requests\n• Checking ticket status\n• Emergency contacts\n• Building hours\n• General contact information\n\nTry asking about one of these topics, or contact the Building Manager at +1-555-0101 for personalized assistance."
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      type: "bot",
      content: findResponse(inputValue),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage, botResponse])
    setInputValue("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Floating Chat Button */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            size="icon"
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow z-40 bg-blue-600 hover:bg-blue-700"
          >
            <MessageCircle className="w-6 h-6" />
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md h-[600px] flex flex-col p-0">
          <DialogHeader className="p-6 pb-4 border-b">
            <DialogTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-blue-600" />
              Building Assistant
            </DialogTitle>
            <DialogDescription>Get quick answers to common questions</DialogDescription>
          </DialogHeader>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-3 ${message.type === "user" ? "justify-end" : ""}`}>
                  {message.type === "bot" && (
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-blue-600" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] p-3 rounded-lg whitespace-pre-line ${
                      message.type === "user" ? "bg-blue-600 text-white ml-auto" : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    {message.content}
                  </div>

                  {message.type === "user" && (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Ask me anything..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} size="icon" disabled={!inputValue.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
