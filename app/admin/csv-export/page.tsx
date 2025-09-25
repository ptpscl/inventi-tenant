"use client"

import CSVExportPanel from "@/components/csv-export-panel"

export default function CSVExportPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <CSVExportPanel />
      </div>
    </div>
  )
}
