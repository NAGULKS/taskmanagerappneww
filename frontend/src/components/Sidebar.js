"use client"

import { useContext } from "react"
import { Link, useLocation } from "react-router-dom"
import { FaTasks, FaChartBar, FaUsers, FaHistory, FaUser } from "react-icons/fa"
import { AuthContext } from "../context/AuthContext"

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation()
  const { user } = useContext(AuthContext)

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <h2>Smart Task Manager</h2>
      </div>
      <ul className="sidebar-menu">
        {user && user.isAdmin ? (
          // Admin Navigation
          <>
            <li>
              <Link to="/admin" className={location.pathname === "/admin" ? "active" : ""}>
                <FaChartBar /> Admin Dashboard
              </Link>
            </li>
            <li>
              <Link to="/users" className={location.pathname === "/users" ? "active" : ""}>
                <FaUsers /> User Management
              </Link>
            </li>
            <li>
              <Link to="/audit" className={location.pathname === "/audit" ? "active" : ""}>
                <FaHistory /> Audit Logs
              </Link>
            </li>
          </>
        ) : (
          // User Navigation
          <>
            <li>
              <Link to="/dashboard" className={location.pathname === "/dashboard" ? "active" : ""}>
                <FaChartBar /> Dashboard
              </Link>
            </li>
            <li>
              <Link to="/tasks" className={location.pathname === "/tasks" ? "active" : ""}>
                <FaTasks /> Tasks
              </Link>
            </li>
          </>
        )}
        <li>
          <Link to="/profile" className={location.pathname === "/profile" ? "active" : ""}>
            <FaUser /> Profile
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default Sidebar
