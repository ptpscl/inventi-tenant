export interface TenantProfile {
  email: string
  firstName: string // Added firstName field
  lastName: string // Added lastName field
  unitNo: string
  building: string
  floor: string
  property?: string // Added optional property field
  loginTime: string
}

export interface MaintenanceTicket {
  ticketId: string
  hashId: string
  property: string
  building?: string
  floor: number
  unit: string
  requestType:
    | "Room Maintenance"
    | "Building Maintenance"
    | "Incident Report"
    | "Service Request"
    | "Visitor Access / Delivery"
  category: string
  title: string
  description: string
  preferredSchedule?: {
    date: string
    timeRange: string
  }
  accessInstructions?: string
  contactPhone: string
  photos: string[]
  priority: "Low" | "Medium" | "High" | "Critical"
  status: "Open" | "Assigned" | "Resolved"
  createdAt: string
  updatedAt: string
}

export interface RequestDraft {
  property?: string
  building?: string
  floor?: number
  unit?: string
  requestType?: string
  category?: string
  title?: string
  description?: string
  preferredSchedule?: {
    date: string
    timeRange: string
  }
  accessInstructions?: string
  contactPhone?: string
  photos?: string[]
}

export interface TenantRegistration {
  email: string
  firstName: string
  lastName: string
  unitNumber: string
  building: string
  phone?: string
  emergencyContactName?: string
  emergencyContactPhone?: string
  moveInDate?: string
  leaseEndDate?: string
}

export interface RegisteredTenant extends TenantRegistration {
  id: string
  createdAt: string
  isActive: boolean
}

export interface MaintenanceRequest {
  id: string
  requestId: string // Human-readable ID like MNT-2024-001
  tenantId: string
  tenantEmail: string
  tenantName: string
  unitNumber: string
  building: string
  requestType: "maintenance" | "incident" | "service" | "visitor"
  category: string
  subcategory?: string
  title: string
  description: string
  priority: "low" | "medium" | "high" | "urgent"
  status: "submitted" | "acknowledged" | "in-progress" | "completed" | "cancelled"
  location: string
  preferredTime?: string
  preferredDate?: string
  photos: string[]
  contactPhone: string
  accessInstructions?: string
  contactPermission: boolean
  createdAt: string
  updatedAt: string
  scheduledDate?: string
  completedDate?: string
  assignedTo?: string
  estimatedCost?: number
  actualCost?: number
  notes?: string
}

import { generateTenantRegistrationCSV, generateMaintenanceRequestCSV } from "./csv-file-storage"

export const getTenantProfile = (): TenantProfile | null => {
  if (typeof window === "undefined") return null

  try {
    const profile = localStorage.getItem("tenantProfile")
    return profile ? JSON.parse(profile) : null
  } catch {
    return null
  }
}

export const setTenantProfile = (profile: TenantProfile): void => {
  if (typeof window === "undefined") return
  localStorage.setItem("tenantProfile", JSON.stringify(profile))
}

export const getTenantTickets = (): MaintenanceTicket[] => {
  if (typeof window === "undefined") return []

  try {
    const tickets = localStorage.getItem("tenantTickets")
    return tickets ? JSON.parse(tickets) : []
  } catch {
    return []
  }
}

export const setTenantTickets = (tickets: MaintenanceTicket[]): void => {
  if (typeof window === "undefined") return
  localStorage.setItem("tenantTickets", JSON.stringify(tickets))
}

export const addTenantTicket = (ticket: MaintenanceTicket): void => {
  const tickets = getTenantTickets()
  tickets.unshift(ticket) // Add to beginning
  setTenantTickets(tickets)
}

export const getRequestDraft = (): RequestDraft | null => {
  if (typeof window === "undefined") return null

  try {
    const draft = localStorage.getItem("requestDraft")
    return draft ? JSON.parse(draft) : null
  } catch {
    return null
  }
}

export const setRequestDraft = (draft: RequestDraft | null): void => {
  if (typeof window === "undefined") return

  if (draft === null) {
    localStorage.removeItem("requestDraft")
  } else {
    localStorage.setItem("requestDraft", JSON.stringify(draft))
  }
}

export const getRegisteredTenants = (): RegisteredTenant[] => {
  if (typeof window === "undefined") return []

  try {
    const tenants = localStorage.getItem("registeredTenants")
    return tenants ? JSON.parse(tenants) : []
  } catch {
    return []
  }
}

export const setRegisteredTenants = (tenants: RegisteredTenant[]): void => {
  if (typeof window === "undefined") return
  localStorage.setItem("registeredTenants", JSON.stringify(tenants))
}

export const exportTenantsToCSV = (): void => {
  if (typeof window === "undefined") return

  try {
    const tenants = getRegisteredTenants()

    const csvData = [
      [
        "ID",
        "Email",
        "First Name",
        "Last Name",
        "Unit Number",
        "Building",
        "Phone",
        "Emergency Contact Name",
        "Emergency Contact Phone",
        "Move In Date",
        "Lease End Date",
        "Created At",
        "Status",
      ],
      ...tenants.map((tenant) => [
        tenant.id,
        tenant.email,
        tenant.firstName,
        tenant.lastName,
        tenant.unitNumber,
        tenant.building,
        tenant.phone || "",
        tenant.emergencyContactName || "",
        tenant.emergencyContactPhone || "",
        tenant.moveInDate || "",
        tenant.leaseEndDate || "",
        tenant.createdAt,
        tenant.isActive ? "Active" : "Inactive",
      ]),
    ]

    const csvContent = csvData
      .map((row) =>
        row
          .map((cell) => {
            const escaped = String(cell).replace(/"/g, '""')
            return /[",\n\r]/.test(escaped) ? `"${escaped}"` : escaped
          })
          .join(","),
      )
      .join("\n")

    // Store CSV content in localStorage for demonstration
    localStorage.setItem("tenants_csv_export", csvContent)
    localStorage.setItem("tenants_csv_last_updated", new Date().toISOString())
  } catch (error) {
    console.error("Error generating tenants CSV:", error)
  }
}

export const exportRequestsToCSV = (): void => {
  if (typeof window === "undefined") return

  try {
    const requests = getAllMaintenanceRequests()

    const csvData = [
      [
        "Request ID",
        "Tenant Email",
        "Tenant Name",
        "Unit Number",
        "Building",
        "Request Type",
        "Category",
        "Title",
        "Description",
        "Priority",
        "Status",
        "Location",
        "Contact Phone",
        "Preferred Date",
        "Preferred Time",
        "Access Instructions",
        "Photos Count",
        "Created At",
        "Updated At",
        "Completed Date",
      ],
      ...requests.map((request) => [
        request.requestId,
        request.tenantEmail,
        request.tenantName,
        request.unitNumber,
        request.building,
        request.requestType,
        request.category,
        request.title,
        request.description,
        request.priority,
        request.status,
        request.location,
        request.contactPhone,
        request.preferredDate || "",
        request.preferredTime || "",
        request.accessInstructions || "",
        request.photos.length.toString(),
        request.createdAt,
        request.updatedAt,
        request.completedDate || "",
      ]),
    ]

    const csvContent = csvData
      .map((row) =>
        row
          .map((cell) => {
            const escaped = String(cell).replace(/"/g, '""')
            return /[",\n\r]/.test(escaped) ? `"${escaped}"` : escaped
          })
          .join(","),
      )
      .join("\n")

    // Store CSV content in localStorage for demonstration
    localStorage.setItem("requests_csv_export", csvContent)
    localStorage.setItem("requests_csv_last_updated", new Date().toISOString())
  } catch (error) {
    console.error("Error generating requests CSV:", error)
  }
}

export const registerTenant = (registration: TenantRegistration): boolean => {
  const existingTenants = getRegisteredTenants()

  // Check if email or unit already exists
  const emailExists = existingTenants.some((tenant) => tenant.email.toLowerCase() === registration.email.toLowerCase())
  const unitExists = existingTenants.some(
    (tenant) => tenant.unitNumber === registration.unitNumber && tenant.building === registration.building,
  )

  if (emailExists || unitExists) {
    return false // Registration failed - duplicate found
  }

  // Create new tenant record
  const newTenant: RegisteredTenant = {
    ...registration,
    id: `tenant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    isActive: true,
  }

  // Add to registered tenants
  const updatedTenants = [...existingTenants, newTenant]
  setRegisteredTenants(updatedTenants)

  exportTenantsToCSV()
  generateTenantRegistrationCSV()

  return true // Registration successful
}

export const validateTenantLogin = (email: string, unitNumber: string): RegisteredTenant | null => {
  const registeredTenants = getRegisteredTenants()

  const tenant = registeredTenants.find(
    (tenant) =>
      tenant.email.toLowerCase() === email.toLowerCase() && tenant.unitNumber === unitNumber && tenant.isActive,
  )

  return tenant || null
}

export const getTenantByEmail = (email: string): RegisteredTenant | null => {
  const registeredTenants = getRegisteredTenants()

  const tenant = registeredTenants.find(
    (tenant) => tenant.email.toLowerCase() === email.toLowerCase() && tenant.isActive,
  )

  return tenant || null
}

export const getAllMaintenanceRequests = (): MaintenanceRequest[] => {
  if (typeof window === "undefined") return []

  try {
    const requests = localStorage.getItem("maintenanceRequests")
    return requests ? JSON.parse(requests) : []
  } catch {
    return []
  }
}

export const setAllMaintenanceRequests = (requests: MaintenanceRequest[]): void => {
  if (typeof window === "undefined") return
  localStorage.setItem("maintenanceRequests", JSON.stringify(requests))
}

export const addMaintenanceRequest = (request: MaintenanceRequest): void => {
  const requests = getAllMaintenanceRequests()
  requests.unshift(request) // Add to beginning for newest first
  setAllMaintenanceRequests(requests)

  exportRequestsToCSV()
  generateMaintenanceRequestCSV()
}

export const getMaintenanceRequestsByTenant = (tenantEmail: string): MaintenanceRequest[] => {
  const allRequests = getAllMaintenanceRequests()
  return allRequests.filter((request) => request.tenantEmail === tenantEmail)
}

export const generateMaintenanceRequestId = (requestType: string): string => {
  const typePrefix = {
    maintenance: "MNT",
    incident: "INC",
    service: "SRV",
    visitor: "VIS",
  }

  const prefix = typePrefix[requestType as keyof typeof typePrefix] || "REQ"
  const year = new Date().getFullYear()
  const allRequests = getAllMaintenanceRequests()

  // Count requests of this type for this year
  const typeRequests = allRequests.filter((req) => req.requestId.startsWith(`${prefix}-${year}`))

  const nextNumber = (typeRequests.length + 1).toString().padStart(3, "0")
  return `${prefix}-${year}-${nextNumber}`
}

export const updateMaintenanceRequestStatus = (
  requestId: string,
  status: MaintenanceRequest["status"],
  notes?: string,
): boolean => {
  const requests = getAllMaintenanceRequests()
  const requestIndex = requests.findIndex((req) => req.requestId === requestId)

  if (requestIndex === -1) return false

  requests[requestIndex] = {
    ...requests[requestIndex],
    status,
    updatedAt: new Date().toISOString(),
    notes: notes || requests[requestIndex].notes,
    completedDate: status === "completed" ? new Date().toISOString() : requests[requestIndex].completedDate,
  }

  setAllMaintenanceRequests(requests)
  return true
}
