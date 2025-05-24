"use client"

import { useContext, useEffect } from "react"
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom"
import { AuthContext } from "./context/AuthContext"

// Components
import Layout from "./components/Layout"
import PrivateRoute from "./components/PrivateRoute"
import AdminRoute from "./components/AdminRoute"

// Pages
import Dashboard from "./pages/Dashboard"
import AdminDashboard from "./pages/AdminDashboard"
import TaskList from "./pages/TaskList"
import TaskForm from "./pages/TaskForm"
import Login from "./pages/Login"
import Register from "./pages/Register"
import UserManagement from "./pages/UserManagement"
import UserForm from "./pages/UserForm"
import AuditLogs from "./pages/AuditLogs"
import Profile from "./pages/Profile"
import NotFound from "./pages/NotFound"
import UserTasksView from "./pages/UserTasksView"

function App() {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()

  // Handle routing based on user role
  useEffect(() => {
    if (user) {
      // If user is logged in and at root path, redirect based on role
      if (location.pathname === "/") {
        if (user.isAdmin) {
          navigate("/admin")
        } else {
          navigate("/dashboard")
        }
      }
    }
  }, [user, location.pathname, navigate])

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to={user?.isAdmin ? "/admin" : "/dashboard"} />} />
      <Route
        path="/register"
        element={!user ? <Register /> : <Navigate to={user?.isAdmin ? "/admin" : "/dashboard"} />}
      />

      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        {/* Redirect based on user role */}
        <Route index element={<Navigate to={user?.isAdmin ? "/admin" : "/dashboard"} />} />

        {/* User routes */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="tasks" element={<TaskList />} />
        <Route path="tasks/new" element={<TaskForm />} />
        <Route path="tasks/edit/:id" element={<TaskForm />} />
        <Route path="profile" element={<Profile />} />

        {/* Admin routes */}
        <Route
          path="admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="admin/user-tasks/:userId"
          element={
            <AdminRoute>
              <UserTasksView />
            </AdminRoute>
          }
        />
        <Route
          path="users"
          element={
            <AdminRoute>
              <UserManagement />
            </AdminRoute>
          }
        />
        <Route
          path="users/new"
          element={
            <AdminRoute>
              <UserForm />
            </AdminRoute>
          }
        />
        <Route
          path="audit"
          element={
            <AdminRoute>
              <AuditLogs />
            </AdminRoute>
          }
        />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
