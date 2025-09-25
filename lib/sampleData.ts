import type { MaintenanceTicket } from "./storage"

export const sampleTenantProfile = {
  email: "john.doe@email.com",
  firstName: "John",
  lastName: "Doe",
  unitNo: "12A",
  floor: "12",
  building: "Main Tower",
  property: "Property 1",
}

export const sampleTickets: MaintenanceTicket[] = [
  {
    ticketId: "12-A-20241218-abc123",
    hashId: "hash_sample_1",
    property: "Property 1",
    building: "Main Tower",
    floor: 12,
    unit: "12A",
    requestType: "Room Maintenance",
    category: "Plumbing",
    title: "Kitchen sink faucet leaking",
    description:
      "The kitchen sink faucet has been dripping constantly for the past 3 days. Water is pooling around the base and the drip rate is increasing.",
    contactPhone: "+1-555-0123",
    photos: [],
    priority: "High",
    status: "Assigned",
    createdAt: "2024-12-15T10:30:00Z",
    updatedAt: "2024-12-16T09:15:00Z",
  },
  {
    ticketId: "12-A-20241217-def456",
    hashId: "hash_sample_2",
    property: "Property 1",
    building: "Main Tower",
    floor: 12,
    unit: "12A",
    requestType: "Building Maintenance",
    category: "Elevator",
    title: "Elevator making strange noises",
    description:
      "The main elevator has been making grinding noises when going up past the 10th floor. It seems to hesitate between floors.",
    contactPhone: "+1-555-0123",
    photos: [],
    priority: "Medium",
    status: "Open",
    createdAt: "2024-12-14T14:20:00Z",
    updatedAt: "2024-12-14T14:20:00Z",
  },
  {
    ticketId: "12-A-20241216-ghi789",
    hashId: "hash_sample_3",
    property: "Property 1",
    building: "Main Tower",
    floor: 12,
    unit: "12A",
    requestType: "Service Request",
    category: "Cleaning",
    title: "Deep cleaning request for move-out",
    description:
      "Requesting professional deep cleaning service for unit before move-out inspection. Need carpet cleaning and window washing included.",
    preferredSchedule: {
      date: "2024-12-25",
      timeRange: "09:00-17:00",
    },
    contactPhone: "+1-555-0123",
    photos: [],
    priority: "Low",
    status: "Resolved",
    createdAt: "2024-12-10T11:45:00Z",
    updatedAt: "2024-12-12T16:30:00Z",
  },
]

export const sampleAnnouncements = [
  {
    id: "1",
    title: "Scheduled Elevator Maintenance",
    body: "The main elevator will be undergoing routine maintenance on December 22nd from 8:00 AM to 12:00 PM. Please use the service elevator during this time.",
    effectiveDate: "2024-12-22",
    endDate: "2024-12-22",
    priority: "Medium",
    attachments: [],
  },
  {
    id: "2",
    title: "Water System Upgrade",
    body: "We will be upgrading the building water system on December 28th. Water service may be interrupted between 6:00 AM and 2:00 PM. Please store water in advance.",
    effectiveDate: "2024-12-28",
    endDate: "2024-12-28",
    priority: "High",
    attachments: ["Water Storage Guidelines.pdf"],
  },
  {
    id: "3",
    title: "Holiday Office Hours",
    body: "The building management office will have reduced hours during the holiday season. We will be closed December 24th-26th and January 1st.",
    effectiveDate: "2024-12-24",
    endDate: "2025-01-01",
    priority: "Low",
    attachments: [],
  },
]

export const initializeSampleData = (): void => {
  if (typeof window === "undefined") return

  // Only initialize if no tickets exist
  const existingTickets = localStorage.getItem("tenantTickets")
  if (!existingTickets) {
    localStorage.setItem("tenantTickets", JSON.stringify(sampleTickets))
  }

  const existingProfile = localStorage.getItem("tenantProfile")
  if (!existingProfile) {
    localStorage.setItem("tenantProfile", JSON.stringify(sampleTenantProfile))
  }
}
