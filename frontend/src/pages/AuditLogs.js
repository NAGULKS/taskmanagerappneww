"use client"

import { useState, useEffect, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import axios from "axios"
import { toast } from "react-toastify"
import { format } from "date-fns"
import ExportButtons from "../components/ExportButtons"

const AuditLogs = () => {
  const { user } = useContext(AuthContext)
  const [auditLogs, setAuditLogs] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchAuditLogs()
  }, [])

  const fetchAuditLogs = async () => {
    try {
      setLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }

      const response = await axios.get("https://taskmanagerappneww.onrender.com/api/audit", config)
      setAuditLogs(response.data)
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch audit logs")
    } finally {
      setLoading(false)
    }
  }

  const getActionClass = (action) => {
    switch (action) {
      case "create":
        return "badge-success"
      case "update":
        return "badge-primary"
      case "delete":
        return "badge-danger"
      case "login":
        return "badge-info"
      case "logout":
        return "badge-warning"
      case "register":
        return "badge-success"
      case "deactivate":
        return "badge-danger"
      default:
        return "badge-secondary"
    }
  }

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Audit Logs</h2>
      </div>

      <div className="export-section">
        <ExportButtons data={auditLogs} filename="audit-logs" />
      </div>

      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>User</th>
              <th>Action</th>
              <th>Resource Type</th>
              <th>Resource ID</th>
              <th>IP Address</th>
              <th>Timestamp</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {auditLogs.map((log) => (
              <tr key={log._id}>
                <td>{log.user?.name || "Unknown"}</td>
                <td>
                  <span className={`badge ${getActionClass(log.action)}`}>{log.action}</span>
                </td>
                <td>{log.resourceType}</td>
                <td>{log.resourceId}</td>
                <td>{log.ipAddress}</td>
                <td>{format(new Date(log.createdAt), "MMM dd, yyyy HH:mm:ss")}</td>
                <td>
                  {log.details && (
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => alert(JSON.stringify(log.details, null, 2))}
                    >
                      View Details
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AuditLogs
