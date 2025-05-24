"use client"

import { createContext, useState, useEffect } from "react"
import axios from "axios"

export const AuthContext = createContext()

// Set your backend URL here
const BACKEND_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000" // your local backend URL
    : "https://taskmanagerappneww.onrender.com" // your production backend URL

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const register = async (userData) => {
    try {
      setLoading(true)
      const response = await axios.post(`${BACKEND_URL}/api/auth/register`, userData)
      const data = response.data

      setUser(data)
      localStorage.setItem("user", JSON.stringify(data))
      setError(null)
      return data
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed")
      throw error
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      setLoading(true)
      const response = await axios.post(`https://taskmanagerappneww.onrender.com/api/auth/login`, { email, password })
      const data = response.data

      setUser(data)
      localStorage.setItem("user", JSON.stringify(data))
      setError(null)
      return data
    } catch (error) {
      setError(error.response?.data?.message || "Login failed")
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("user")
    setUser(null)
  }

  const updateProfile = async (userData) => {
    try {
      setLoading(true)
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }

      const response = await axios.put(`https://taskmanagerappneww.onrender.com/api/auth/profile`, userData, config)
      const updatedUser = { ...response.data, token: user.token }

      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
      setError(null)
      return updatedUser
    } catch (error) {
      setError(error.response?.data?.message || "Profile update failed")
      throw error
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
