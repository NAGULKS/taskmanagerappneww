"use client"

import React, { useContext } from "react"
import { FaBars, FaSignOutAlt, FaUser } from "react-icons/fa"
import { Link } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"

const Header = ({ toggleSidebar }) => {
  const { user, logout } = useContext(AuthContext)
  const [dropdownOpen, setDropdownOpen] = React.useState(false)

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  return (
    <header className="header">
      <button className="mobile-toggle" onClick={toggleSidebar}>
        <FaBars />
      </button>
      <h1>Smart Task Manager</h1>
      <div className="user-info">
        <div className="dropdown">
          <button onClick={toggleDropdown} className="btn btn-secondary">
            {user?.name} <FaUser className="ml-2" />
          </button>
          {dropdownOpen && (
            <div className="dropdown-menu">
              <Link to="/profile" onClick={() => setDropdownOpen(false)}>
                Profile
              </Link>
              <a
                href="#!"
                onClick={() => {
                  logout()
                  setDropdownOpen(false)
                }}
              >
                <FaSignOutAlt /> Logout
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
