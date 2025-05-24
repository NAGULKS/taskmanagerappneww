"use client"

import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { FaSave, FaTimes } from "react-icons/fa"
import { AuthContext } from "../context/AuthContext"
import axios from "axios"
import { toast } from "react-toastify"

const UserForm = () => {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    isAdmin: false,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill in all required fields")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    try {
      setLoading(true)
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }

      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        isAdmin: formData.isAdmin,
      }

      await axios.post("https://taskmanagerappneww.onrender.com/api/users", userData, config)
      toast.success("User created successfully")
      navigate("/users")
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create user")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-card">
      <div className="form-card-header">
        <h2 className="form-card-title">Create New User</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-control"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className="form-control"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            minLength="6"
          />
        </div>

        <div className="form-group">
          <div className="form-check">
            <input
              type="checkbox"
              id="isAdmin"
              name="isAdmin"
              className="form-check-input"
              checked={formData.isAdmin}
              onChange={handleChange}
            />
            <label htmlFor="isAdmin" className="form-check-label">
              Admin User
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate("/users")}>
            <FaTimes /> Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            <FaSave /> {loading ? "Creating..." : "Create User"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default UserForm
