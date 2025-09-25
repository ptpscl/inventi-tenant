"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, SortAsc, SortDesc, FileText } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import type { MaintenanceTicket } from "@/lib/storage"
import PriorityBadge from "@/components/priority-badge"

interface TicketListProps {
  tickets: MaintenanceTicket[]
  onTicketSelect: (ticket: MaintenanceTicket) => void
}

const statusConfig = {
  Open: { color: "bg-gray-100 text-gray-800", label: "Open" },
  Assigned: { color: "bg-blue-100 text-blue-800", label: "Assigned" },
  Resolved: { color: "bg-green-100 text-green-800", label: "Resolved" },
}

export default function TicketList({ tickets, onTicketSelect }: TicketListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("All")
  const [sortBy, setSortBy] = useState<"createdAt" | "priority" | "status">("createdAt")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const filteredAndSortedTickets = useMemo(() => {
    let filtered = tickets

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (ticket) =>
          ticket.title.toLowerCase().includes(query) ||
          ticket.ticketId.toLowerCase().includes(query) ||
          ticket.description.toLowerCase().includes(query) ||
          ticket.requestType.toLowerCase().includes(query),
      )
    }

    // Apply status filter
    if (statusFilter !== "All") {
      filtered = filtered.filter((ticket) => ticket.status === statusFilter)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case "createdAt":
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
        case "priority":
          const priorityOrder = { Low: 1, Medium: 2, High: 3, Critical: 4 }
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority]
          break
        case "status":
          comparison = a.status.localeCompare(b.status)
          break
      }

      return sortOrder === "asc" ? comparison : -comparison
    })

    return filtered
  }, [tickets, searchQuery, statusFilter, sortBy, sortOrder])

  const statusCounts = useMemo(() => {
    return {
      All: tickets.length,
      Open: tickets.filter((t) => t.status === "Open").length,
      Assigned: tickets.filter((t) => t.status === "Assigned").length,
      Resolved: tickets.filter((t) => t.status === "Resolved").length,
    }
  }, [tickets])

  const toggleSort = (field: "createdAt" | "priority" | "status") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("desc")
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filter & Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status Filter Chips */}
          <div className="flex flex-wrap gap-2">
            {Object.entries(statusCounts).map(([status, count]) => (
              <Button
                key={status}
                variant={statusFilter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(status)}
                className="h-8"
              >
                {status} ({count})
              </Button>
            ))}
          </div>

          {/* Search and Sort */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by title, ticket ID, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Date Created</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
                {sortOrder === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredAndSortedTickets.length > 0 ? (
          filteredAndSortedTickets.map((ticket) => (
            <Card
              key={ticket.ticketId}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onTicketSelect(ticket)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg text-gray-900 truncate">{ticket.title}</h3>
                      <PriorityBadge priority={ticket.priority} size="sm" />
                      <Badge variant="outline" className={statusConfig[ticket.status].color}>
                        {statusConfig[ticket.status].label}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span className="font-mono">#{ticket.ticketId}</span>
                      <span>{ticket.requestType}</span>
                      <span>{ticket.category}</span>
                      <span>{formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}</span>
                    </div>

                    <p className="text-gray-600 line-clamp-2">{ticket.description}</p>

                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                      <span>
                        Floor {ticket.floor}, Unit {ticket.unit}
                      </span>
                      {ticket.photos.length > 0 && <span>{ticket.photos.length} photo(s)</span>}
                    </div>
                  </div>

                  <div className="ml-4 text-right">
                    <div className="text-sm text-gray-500">{new Date(ticket.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
              <p className="text-gray-500 mb-4">
                {searchQuery || statusFilter !== "All"
                  ? "Try adjusting your search or filter criteria"
                  : "You haven't submitted any maintenance requests yet"}
              </p>
              {!searchQuery && statusFilter === "All" && (
                <Button onClick={() => (window.location.href = "/tenant/request")}>Create Your First Request</Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
