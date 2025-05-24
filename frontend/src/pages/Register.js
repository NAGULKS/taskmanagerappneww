"use client"

import { useState, useContext } from "react"
import { Link } from "react-router-dom"
import { FaUserPlus } from "react-icons/fa"
import { AuthContext } from "../context/AuthContext"
import { toast } from "react-toastify"

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    isAdmin: false, // Added role selection
  })

  const { register, loading } = useContext(AuthContext)

  const { name, email, password, confirmPassword, isAdmin } = formData

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!name || !email || !password) {
      toast.error("Please fill in all fields")
      return
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    try {
      await register({ name, email, password, isAdmin })
      toast.success("Registration successful")
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed")
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Smart Task Manager</h1>
          <p className="auth-subtitle">Create a new account</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-control"
              value={name}
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
              value={email}
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
              value={password}
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
              value={confirmPassword}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>

          {/* Added role selection */}
          <div className="form-group">
            <div className="form-check">
              <input
                type="checkbox"
                id="isAdmin"
                name="isAdmin"
                className="form-check-input"
                checked={isAdmin}
                onChange={handleChange}
              />
              <label htmlFor="isAdmin" className="form-check-label">
                Register as Admin
              </label>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            <FaUserPlus /> {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  )
}

export default Register
