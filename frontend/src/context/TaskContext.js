"use client"

import { createContext, useState, useContext } from "react"
import axios from "axios"
import { AuthContext } from "./AuthContext"

export const TaskContext = createContext()

export const TaskProvider = ({ children }) => {
  const { user } = useContext(AuthContext)
  const [tasks, setTasks] = useState([])
  const [tasksDueToday, setTasksDueToday] = useState([])
  const [completedTasksData, setCompletedTasksData] = useState([])
  const [upcomingTasks, setUpcomingTasks] = useState([])
  const [popularCategories, setPopularCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Configure axios with auth token
  const getConfig = () => {
    return {
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    }
  }

  // Fetch all tasks
  const fetchTasks = async () => {
    if (!user) return

    try {
      setLoading(true)
      const response = await axios.get("https://taskmanagerappneww.onrender.com/api/tasks", getConfig())
      setTasks(response.data)
      setError(null)
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch tasks")
    } finally {
      setLoading(false)
    }
  }

  // Fetch tasks due today
  const fetchTasksDueToday = async () => {
    if (!user) return

    try {
      setLoading(true)
      const response = await axios.get("https://taskmanagerappneww.onrender.com/api/tasks/due-today", getConfig())
      setTasksDueToday(response.data)
      setError(null)
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch tasks due today")
    } finally {
      setLoading(false)
    }
  }

  // Fetch completed tasks data for chart
  const fetchCompletedTasksData = async () => {
    if (!user) return

    try {
      setLoading(true)
      const response = await axios.get("https://taskmanagerappneww.onrender.com/api/tasks/completed-last-week", getConfig())
      setCompletedTasksData(response.data)
      setError(null)
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch completed tasks data")
    } finally {
      setLoading(false)
    }
  }

  // Fetch upcoming tasks
  const fetchUpcomingTasks = async () => {
    if (!user) return

    try {
      setLoading(true)
      const response = await axios.get("https://taskmanagerappneww.onrender.com/api/tasks/upcoming", getConfig())
      setUpcomingTasks(response.data)
      setError(null)
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch upcoming tasks")
    } finally {
      setLoading(false)
    }
  }

  // Fetch popular categories
  const fetchPopularCategories = async () => {
    if (!user) return

    try {
      setLoading(true)
      const response = await axios.get("https://taskmanagerappneww.onrender.com/api/tasks/popular-categories", getConfig())
      setPopularCategories(response.data)
      setError(null)
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch popular categories")
    } finally {
      setLoading(false)
    }
  }

  // Create a new task
  const createTask = async (taskData) => {
    try {
      setLoading(true)
      const response = await axios.post("https://taskmanagerappneww.onrender.com/api/tasks", taskData, getConfig())
      setTasks([...tasks, response.data])
      setError(null)
      return response.data
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create task")
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Update a task
  const updateTask = async (id, taskData) => {
    try {
      setLoading(true)
      const response = await axios.put(`https://taskmanagerappneww.onrender.com/api/tasks/${id}`, taskData, getConfig())
      setTasks(tasks.map((task) => (task._id === id ? response.data : task)))
      setError(null)
      return response.data
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update task")
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Delete a task
  const deleteTask = async (id) => {
    try {
      setLoading(true)
      await axios.delete(`https://taskmanagerappneww.onrender.com/api/tasks/${id}`, getConfig())
      setTasks(tasks.filter((task) => task._id !== id))
      setError(null)
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete task")
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Get a single task by ID
  const getTaskById = async (id) => {
    try {
      setLoading(true)
      const response = await axios.get(`https://taskmanagerappneww.onrender.com/api/tasks/${id}`, getConfig())
      setError(null)
      return response.data
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch task")
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Refresh all dashboard data
  const refreshDashboardData = async () => {
    if (!user) return

    try {
      setLoading(true)
      await Promise.all([
        fetchTasks(),
        fetchTasksDueToday(),
        fetchCompletedTasksData(),
        fetchUpcomingTasks(),
        fetchPopularCategories(),
      ])
      setError(null)
    } catch (error) {
      setError(error.response?.data?.message || "Failed to refresh dashboard data")
    } finally {
      setLoading(false)
    }
  }

  return (
    <TaskContext.Provider
      value={{
        tasks,
        tasksDueToday,
        completedTasksData,
        upcomingTasks,
        popularCategories,
        loading,
        error,
        fetchTasks,
        fetchTasksDueToday,
        fetchCompletedTasksData,
        fetchUpcomingTasks,
        fetchPopularCategories,
        createTask,
        updateTask,
        deleteTask,
        getTaskById,
        refreshDashboardData,
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}
