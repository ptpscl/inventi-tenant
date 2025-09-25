"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, Users, Calendar, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { generateTenantRegistrationCSV, generateMaintenanceRequestCSV } from "@/lib/csv-file-storage"

export default function CSVExportPanel() {
  const [isExporting, setIsExporting] = useState(false)
  const [lastUpdatedData, setLastUpdatedData] = useState<{
    tenants: string
    requests: string
  }>({
    tenants: "Never",
    requests: "Never",
  })
  const [recordCounts, setRecordCounts] = useState<{
    tenants: number
    requests: number
  }>({
    tenants: 0,
    requests: 0,
  })
  const { toast } = useToast()

  useEffect(() => {
    const getLastUpdated = (storageKey: string): string => {
      if (typeof window === "undefined") return "Never"

      const lastUpdated = localStorage.getItem(storageKey)
      if (!lastUpdated) return "Never"

      try {
        const date = new Date(lastUpdated)
        return date.toLocaleDateString() + " " + date.toLocaleTimeString()
      } catch {
        return "Unknown"
      }
    }

    const getRecordCount = (storageKey: string): number => {
      if (typeof window === "undefined") return 0

      try {
        const data = localStorage.getItem(
          storageKey === "tenants_csv_last_updated" ? "registeredTenants" : "maintenanceRequests",
        )
        return data ? JSON.parse(data).length : 0
      } catch {
        return 0
      }
    }

    setLastUpdatedData({
      tenants: getLastUpdated("tenants_csv_last_updated"),
      requests: getLastUpdated("requests_csv_last_updated"),
    })

    setRecordCounts({
      tenants: getRecordCount("tenants_csv_last_updated"),
      requests: getRecordCount("requests_csv_last_updated"),
    })
  }, [])

  const handleExportTenants = async () => {
    setIsExporting(true)
    try {
      await generateTenantRegistrationCSV()
      toast({
        title: "Export Successful",
        description: "Tenant registration CSV has been generated and downloaded with the updated format.",
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting tenant data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportRequests = async () => {
    setIsExporting(true)
    try {
      await generateMaintenanceRequestCSV()
      toast({
        title: "Export Successful",
        description: "Maintenance requests CSV has been generated and downloaded with the updated format.",
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting maintenance request data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const downloadCSVFile = (storageKey: string, filename: string) => {
    try {
      if (typeof window === "undefined") return

      const csvContent = localStorage.getItem(storageKey)
      if (!csvContent) {
        toast({
          title: "No Data Available",
          description: "No data found to export. Please ensure there is data in the system.",
          variant: "destructive",
        })
        return
      }

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

        toast({
          title: "Export Successful",
          description: `${filename} has been downloaded successfully.`,
        })
      }
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting the data. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleExportLegacyTenants = async () => {
    setIsExporting(true)
    try {
      const timestamp = new Date().toISOString().split("T")[0]
      downloadCSVFile("tenants_csv_export", `tenants_legacy_${timestamp}.csv`)
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportLegacyRequests = async () => {
    setIsExporting(true)
    try {
      const timestamp = new Date().toISOString().split("T")[0]
      downloadCSVFile("requests_csv_export", `maintenance_requests_legacy_${timestamp}.csv`)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">CSV Database Export</h2>
        <p className="text-gray-600">
          Download CSV files containing all system data. These files are automatically updated when new data is added.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* New Format - Tenants Export */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-green-600" />
              Tenant Registrations (New Format)
            </CardTitle>
            <CardDescription>
              Export tenant registration data in the standardized format for GitHub repository storage.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Records:</span>
              <Badge variant="secondary">{recordCounts.tenants}</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Last Updated:</span>
              <span className="font-mono text-xs">{lastUpdatedData.tenants}</span>
            </div>
            <Button
              onClick={handleExportTenants}
              disabled={isExporting}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <Download className="w-4 h-4 mr-2" />
              {isExporting ? "Exporting..." : "Download New Format CSV"}
            </Button>
          </CardContent>
        </Card>

        {/* New Format - Requests Export */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-green-600" />
              Maintenance Requests (New Format)
            </CardTitle>
            <CardDescription>
              Export maintenance requests in the standardized format matching your sample structure.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Records:</span>
              <Badge variant="secondary">{recordCounts.requests}</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Last Updated:</span>
              <span className="font-mono text-xs">{lastUpdatedData.requests}</span>
            </div>
            <Button
              onClick={handleExportRequests}
              disabled={isExporting}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <Download className="w-4 h-4 mr-2" />
              {isExporting ? "Exporting..." : "Download New Format CSV"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-600" />
          Legacy Format (Backward Compatibility)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Legacy Tenants Export */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Tenant Database (Legacy)
              </CardTitle>
              <CardDescription>Export all registered tenant information in the original format.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Records:</span>
                <Badge variant="secondary">{recordCounts.tenants}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Last Updated:</span>
                <span className="font-mono text-xs">{lastUpdatedData.tenants}</span>
              </div>
              <Button
                onClick={handleExportLegacyTenants}
                disabled={isExporting}
                variant="outline"
                className="w-full bg-transparent"
              >
                <Download className="w-4 h-4 mr-2" />
                {isExporting ? "Exporting..." : "Download Legacy CSV"}
              </Button>
            </CardContent>
          </Card>

          {/* Legacy Requests Export */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Maintenance Requests (Legacy)
              </CardTitle>
              <CardDescription>Export all maintenance requests in the original format.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Records:</span>
                <Badge variant="secondary">{recordCounts.requests}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Last Updated:</span>
                <span className="font-mono text-xs">{lastUpdatedData.requests}</span>
              </div>
              <Button
                onClick={handleExportLegacyRequests}
                disabled={isExporting}
                variant="outline"
                className="w-full bg-transparent"
              >
                <Download className="w-4 h-4 mr-2" />
                {isExporting ? "Exporting..." : "Download Legacy CSV"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Automatic CSV Generation</h4>
              <p className="text-sm text-blue-800 mb-2">
                CSV files are automatically generated whenever new tenants register or new maintenance requests are
                submitted. The new format CSVs are designed to be stored in your GitHub repository.
              </p>
              <div className="text-xs text-blue-700 bg-blue-100 p-2 rounded">
                <strong>New Format Features:</strong>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Matches your sample CSV structure exactly</li>
                  <li>Includes both date-only and date-with-time columns</li>
                  <li>Proper status mapping (Open/Assigned/In Progress/Resolved)</li>
                  <li>Automatic file download for GitHub repository storage</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
