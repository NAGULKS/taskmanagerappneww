"use client"

import { useState, useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import { FaPlus, FaUserSlash, FaUserCheck } from "react-icons/fa"
import { AuthContext } from "../context/AuthContext"
import axios from "axios"
import { toast } from "react-toastify"
import ExportButtons from "../components/ExportButtons"

const UserManagement = () => {
  const { user } = useContext(AuthContext)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }

      const response = await axios.get("/api/users", config)
      setUsers(response.data)
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch users")
    } finally {
      setLoading(false)
    }
  }

  const handleActivateUser = async (id) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }

      await axios.put(`/api/users/${id}/activate`, {}, config)
      toast.success("User activated successfully")
      fetchUsers()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to activate user")
    }
  }

  const handleDeactivateUser = async (id) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }

      await axios.put(`/api/users/${id}/deactivate`, {}, config)
      toast.success("User deactivated successfully")
      fetchUsers()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to deactivate user")
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
        <h2 className="card-title">User Management</h2>
        <Link to="/users/new" className="btn btn-primary">
          <FaPlus /> Add User
        </Link>
      </div>

      <div className="export-section">
        <ExportButtons data={users} filename="users" />
      </div>

      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.isAdmin ? "Admin" : "User"}</td>
                <td>
                  <span className={`badge ${user.isActive ? "badge-success" : "badge-danger"}`}>
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  {user.isActive ? (
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeactivateUser(user._id)}
                      title="Deactivate User"
                    >
                      <FaUserSlash />
                    </button>
                  ) : (
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => handleActivateUser(user._id)}
                      title="Activate User"
                    >
                      <FaUserCheck />
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

export default UserManagement
