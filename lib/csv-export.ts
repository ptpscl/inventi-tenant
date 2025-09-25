export interface CSVExportData {
  headers: string[]
  rows: string[][]
}

export const convertToCSV = (data: CSVExportData): string => {
  const csvContent = [
    data.headers.join(","),
    ...data.rows.map((row) =>
      row
        .map((cell) => {
          // Escape quotes and wrap in quotes if contains comma, quote, or newline
          const escaped = cell.replace(/"/g, '""')
          return /[",\n\r]/.test(escaped) ? `"${escaped}"` : escaped
        })
        .join(","),
    ),
  ].join("\n")

  return csvContent
}

export const downloadCSV = (csvContent: string, filename: string): void => {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", filename)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}

export const exportTenantsToCSV = (): void => {
  if (typeof window === "undefined") return

  try {
    const tenants = JSON.parse(localStorage.getItem("registeredTenants") || "[]")

    const csvData: CSVExportData = {
      headers: [
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
      rows: tenants.map((tenant: any) => [
        tenant.id || "",
        tenant.email || "",
        tenant.firstName || "",
        tenant.lastName || "",
        tenant.unitNumber || "",
        tenant.building || "",
        tenant.phone || "",
        tenant.emergencyContactName || "",
        tenant.emergencyContactPhone || "",
        tenant.moveInDate || "",
        tenant.leaseEndDate || "",
        tenant.createdAt || "",
        tenant.isActive ? "Active" : "Inactive",
      ]),
    }

    const csvContent = convertToCSV(csvData)
    const timestamp = new Date().toISOString().split("T")[0]
    downloadCSV(csvContent, `tenants_${timestamp}.csv`)
  } catch (error) {
    console.error("Error exporting tenants to CSV:", error)
  }
}

export const exportRequestsToCSV = (): void => {
  if (typeof window === "undefined") return

  try {
    const requests = JSON.parse(localStorage.getItem("maintenanceRequests") || "[]")

    const csvData: CSVExportData = {
      headers: [
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
      rows: requests.map((request: any) => [
        request.requestId || "",
        request.tenantEmail || "",
        request.tenantName || "",
        request.unitNumber || "",
        request.building || "",
        request.requestType || "",
        request.category || "",
        request.title || "",
        request.description || "",
        request.priority || "",
        request.status || "",
        request.location || "",
        request.contactPhone || "",
        request.preferredDate || "",
        request.preferredTime || "",
        request.accessInstructions || "",
        request.photos ? request.photos.length.toString() : "0",
        request.createdAt || "",
        request.updatedAt || "",
        request.completedDate || "",
      ]),
    }

    const csvContent = convertToCSV(csvData)
    const timestamp = new Date().toISOString().split("T")[0]
    downloadCSV(csvContent, `maintenance_requests_${timestamp}.csv`)
  } catch (error) {
    console.error("Error exporting requests to CSV:", error)
  }
}
