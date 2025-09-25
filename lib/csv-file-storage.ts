// CSV file storage system for GitHub repository
export interface CSVRecord {
  [key: string]: string | number | boolean
}

export const saveCSVToFile = async (filename: string, data: CSVRecord[]): Promise<void> => {
  if (typeof window === "undefined") return

  try {
    // Convert data to CSV format
    if (data.length === 0) return

    const headers = Object.keys(data[0])
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header]
            const stringValue = String(value || "")
            // Escape quotes and wrap in quotes if contains comma, quote, or newline
            const escaped = stringValue.replace(/"/g, '""')
            return /[",\n\r]/.test(escaped) ? `"${escaped}"` : escaped
          })
          .join(","),
      ),
    ].join("\n")

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)

    // Create temporary download link
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    link.style.display = "none"

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(url)

    // Also store in localStorage for backup
    localStorage.setItem(`csv_${filename}`, csvContent)
    localStorage.setItem(`csv_${filename}_timestamp`, new Date().toISOString())

    console.log(`[v0] CSV file ${filename} generated and downloaded`)
  } catch (error) {
    console.error(`[v0] Error saving CSV file ${filename}:`, error)
  }
}

export const generateTenantRegistrationCSV = async (): Promise<void> => {
  if (typeof window === "undefined") return

  try {
    const tenants = JSON.parse(localStorage.getItem("registeredTenants") || "[]")

    const csvData: CSVRecord[] = tenants.map((tenant: any) => ({
      "Registration ID": tenant.id || "",
      "Date Registered": tenant.createdAt ? new Date(tenant.createdAt).toLocaleDateString() : "",
      "Date Registered with time": tenant.createdAt || "",
      Email: tenant.email || "",
      "First Name": tenant.firstName || "",
      "Last Name": tenant.lastName || "",
      "Unit Number": tenant.unitNumber || "",
      "Building/Tower": tenant.building || "",
      Phone: tenant.phone || "",
      "Emergency Contact Name": tenant.emergencyContactName || "",
      "Emergency Contact Phone": tenant.emergencyContactPhone || "",
      "Move In Date": tenant.moveInDate || "",
      "Lease End Date": tenant.leaseEndDate || "",
      Status: tenant.isActive ? "Active" : "Inactive",
    }))

    const timestamp = new Date().toISOString().split("T")[0]
    await saveCSVToFile(`tenant_registrations_${timestamp}.csv`, csvData)
  } catch (error) {
    console.error("[v0] Error generating tenant registration CSV:", error)
  }
}

export const generateMaintenanceRequestCSV = async (): Promise<void> => {
  if (typeof window === "undefined") return

  try {
    const requests = JSON.parse(localStorage.getItem("maintenanceRequests") || "[]")

    const csvData: CSVRecord[] = requests.map((request: any) => {
      const createdDate = request.createdAt ? new Date(request.createdAt) : new Date()
      const resolvedDate = request.completedDate ? new Date(request.completedDate) : null
      const preferredDate = request.preferredDate ? new Date(request.preferredDate) : null

      return {
        "Date Submitted": createdDate.toLocaleDateString(),
        "Date Submitted with time": request.createdAt || "",
        "Ticket type": request.requestType || "",
        "Ticket id": request.requestId || "",
        Property: "Property 1", // Default property
        "Building/Tower": request.building || "",
        "Floor Number": request.location ? request.location.match(/Floor (\d+)/)?.[1] || "" : "",
        "Unit/Room Number": request.unitNumber || "",
        "Request Type": request.requestType || "",
        Category: request.category || "",
        "Preferred Date": preferredDate ? preferredDate.toLocaleDateString() : "",
        "Preferred Date with time": request.preferredDate || "",
        "Resolve Date": resolvedDate ? resolvedDate.toLocaleDateString() : "",
        "Resolve Date with time": request.completedDate || "",
        Priority: request.priority || "",
        Status:
          request.status === "completed"
            ? "Resolved"
            : request.status === "in-progress"
              ? "In Progress"
              : request.status === "acknowledged"
                ? "Assigned"
                : "Open",
        "Status Date Change": request.updatedAt || "",
        "Short Title": request.title || "",
        "Detailed Description": request.description || "",
      }
    })

    const timestamp = new Date().toISOString().split("T")[0]
    await saveCSVToFile(`maintenance_requests_${timestamp}.csv`, csvData)
  } catch (error) {
    console.error("[v0] Error generating maintenance request CSV:", error)
  }
}
