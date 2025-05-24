"use client"

import { useState, useContext } from "react"
import { Link } from "react-router-dom"
import { FaSignInAlt } from "react-icons/fa"
import { AuthContext } from "../context/AuthContext"
import { toast } from "react-toastify"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { login, loading } = useContext(AuthContext)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error("Please fill in all fields")
      return
    }

    try {
      await login(email, password)
      toast.success("Login successful")
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed")
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Smart Task Manager</h1>
          <p className="auth-subtitle">Sign in to your account</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            <FaSignInAlt /> {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Sign up</Link>
        </div>
      </div>
    </div>
  )
}

export default Login
