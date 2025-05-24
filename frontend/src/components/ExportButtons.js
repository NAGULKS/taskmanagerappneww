"use client"
import { saveAs } from "file-saver"
import * as XLSX from "xlsx"
import { jsPDF } from "jspdf"
import "jspdf-autotable"

const ExportButtons = ({ data, filename = "export" }) => {
  // Export to CSV
  const exportToCSV = () => {
    const csvData = convertToCSV(data)
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8" })
    saveAs(blob, `${filename}.csv`)
  }

  // Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1")
    XLSX.writeFile(workbook, `${filename}.xlsx`)
  }

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF()

    // Get column headers
    const headers = Object.keys(data[0] || {})

    // Prepare data for autotable
    const tableData = data.map((item) => {
      return headers.map((header) => {
        let value = item[header]

        // Format dates
        if (value instanceof Date) {
          value = value.toLocaleDateString()
        }

        // Convert objects to string representation
        if (typeof value === "object" && value !== null) {
          value = JSON.stringify(value)
        }

        return value
      })
    })

    doc.autoTable({
      head: [headers],
      body: tableData,
    })

    doc.save(`${filename}.pdf`)
  }

  // Helper function to convert JSON to CSV
  const convertToCSV = (data) => {
    if (data.length === 0) return ""

    const headers = Object.keys(data[0])
    const csvRows = []

    // Add headers
    csvRows.push(headers.join(","))

    // Add data rows
    for (const row of data) {
      const values = headers.map((header) => {
        const value = row[header]

        // Handle strings with commas
        if (typeof value === "string" && value.includes(",")) {
          return `"${value}"`
        }

        // Format dates
        if (value instanceof Date) {
          return value.toLocaleDateString()
        }

        // Convert objects to string representation
        if (typeof value === "object" && value !== null) {
          return `"${JSON.stringify(value)}"`
        }

        return value
      })

      csvRows.push(values.join(","))
    }

    return csvRows.join("\n")
  }

  return (
    <div className="export-buttons">
      <button className="btn btn-sm btn-primary" onClick={exportToCSV}>
        Export CSV
      </button>
      <button className="btn btn-sm btn-primary" onClick={exportToExcel}>
        Export Excel
      </button>
      <button className="btn btn-sm btn-primary" onClick={exportToPDF}>
        Export PDF
      </button>
    </div>
  )
}

export default ExportButtons
