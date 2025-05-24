"use client"

import { useState, useContext, useEffect } from "react"
import { FaSave } from "react-icons/fa"
import { AuthContext } from "../context/AuthContext"
import { toast } from "react-toastify"

const Profile = () => {
  const { user, updateProfile, loading } = useContext(AuthContext)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "",
        confirmPassword: "",
      })
    }
  }, [user])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    const userData = {
      name: formData.name,
      email: formData.email,
    }

    if (formData.password) {
      userData.password = formData.password
    }

    try {
      await updateProfile(userData)
      toast.success("Profile updated successfully")
      setFormData({
        ...formData,
        password: "",
        confirmPassword: "",
      })
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile")
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
    <div className="form-card">
      <div className="form-card-header">
        <h2 className="form-card-title">Profile Settings</h2>
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
          <label htmlFor="password">New Password (leave blank to keep current)</label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-control"
            value={formData.password}
            onChange={handleChange}
            minLength="6"
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className="form-control"
            value={formData.confirmPassword}
            onChange={handleChange}
            minLength="6"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            <FaSave /> {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Profile
