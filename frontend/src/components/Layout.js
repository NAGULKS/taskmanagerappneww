"use client"

import { useState, useContext } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import Header from "./Header"
import { AuthContext } from "../context/AuthContext"

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user } = useContext(AuthContext)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  if (!user) {
    return null
  }

  return (
    <div className="app-container">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="main-content">
        <Header toggleSidebar={toggleSidebar} />
        <Outlet />
      </div>
    </div>
  )
}

export default Layout
