"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import TenantLayout from "@/components/tenant-layout"
import TicketList from "@/components/ticket-list"
import TicketDetailDrawer from "@/components/ticket-detail-drawer"
import { getTenantTickets, type MaintenanceTicket } from "@/lib/storage"
import { initializeSampleData } from "@/lib/sampleData"

export default function RequestsPage() {
  const [tickets, setTickets] = useState<MaintenanceTicket[]>([])
  const [selectedTicket, setSelectedTicket] = useState<MaintenanceTicket | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    // Initialize sample data and load tickets
    initializeSampleData()
    const allTickets = getTenantTickets()
    setTickets(allTickets)
  }, []) // Remove searchParams dependency

  useEffect(() => {
    const newTicketId = searchParams.get("new")
    if (newTicketId && tickets.length > 0) {
      const newTicket = tickets.find((t) => t.ticketId === newTicketId)
      if (newTicket) {
        setSelectedTicket(newTicket)
        setIsDrawerOpen(true)
      }
    }
  }, [searchParams, tickets]) // Now safe to use searchParams with tickets

  const handleTicketSelect = (ticket: MaintenanceTicket) => {
    setSelectedTicket(ticket)
    setIsDrawerOpen(true)
  }

  const handleDrawerClose = () => {
    setIsDrawerOpen(false)
    setSelectedTicket(null)
  }

  return (
    <TenantLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 text-balance">My Requests</h1>
          <p className="mt-2 text-gray-600">View and track all your maintenance requests</p>
        </div>

        <TicketList tickets={tickets} onTicketSelect={handleTicketSelect} />

        <TicketDetailDrawer
          ticket={selectedTicket}
          isOpen={isDrawerOpen}
          onClose={handleDrawerClose}
          onTicketUpdate={(updatedTicket) => {
            setTickets((prev) => prev.map((t) => (t.ticketId === updatedTicket.ticketId ? updatedTicket : t)))
            setSelectedTicket(updatedTicket)
          }}
        />
      </div>
    </TenantLayout>
  )
}
