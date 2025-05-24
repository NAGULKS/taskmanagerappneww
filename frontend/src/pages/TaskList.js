"use client"

import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { FaPlus, FaFilter, FaSort } from "react-icons/fa"
import { TaskContext } from "../context/TaskContext"
import TaskItem from "../components/TaskItem"
import ExportButtons from "../components/ExportButtons"

const TaskList = () => {
  const { tasks, loading, fetchTasks, updateTask, deleteTask } = useContext(TaskContext)
  const [filteredTasks, setFilteredTasks] = useState([])
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")
  const [sortField, setSortField] = useState("dueDate")
  const [sortDirection, setSortDirection] = useState("asc")
  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetchTasks()
  }, [])

  useEffect(() => {
    // Extract unique categories
    const uniqueCategories = [...new Set(tasks.map((task) => task.category))]
    setCategories(uniqueCategories)

    // Apply filters and sorting
    let result = [...tasks]

    // Filter by status
    if (filterStatus !== "all") {
      result = result.filter((task) => task.status === filterStatus)
    }

    // Filter by category
    if (filterCategory !== "all") {
      result = result.filter((task) => task.category === filterCategory)
    }

    // Sort tasks
    result.sort((a, b) => {
      let comparison = 0

      if (sortField === "dueDate") {
        comparison = new Date(a.dueDate) - new Date(b.dueDate)
      } else if (sortField === "name") {
        comparison = a.name.localeCompare(b.name)
      } else if (sortField === "status") {
        comparison = a.status.localeCompare(b.status)
      } else if (sortField === "category") {
        comparison = a.category.localeCompare(b.category)
      }

      return sortDirection === "asc" ? comparison : -comparison
    })

    setFilteredTasks(result)
  }, [tasks, filterStatus, filterCategory, sortField, sortDirection])

  const handleStatusChange = async (id, status) => {
    try {
      await updateTask(id, { status })
      fetchTasks()
    } catch (error) {
      console.error("Failed to update task status:", error)
    }
  }

  const handleDeleteTask = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(id)
      } catch (error) {
        console.error("Failed to delete task:", error)
      }
    }
  }

  const toggleSortDirection = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
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
    <div className="task-list-page">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Task List</h2>
          <Link to="/tasks/new" className="btn btn-primary">
            <FaPlus /> New Task
          </Link>
        </div>

        <div className="filter-section">
          <div className="form-row">
            <div className="form-col">
              <label htmlFor="filterStatus">
                <FaFilter /> Filter by Status:
              </label>
              <select
                id="filterStatus"
                className="form-control"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="form-col">
              <label htmlFor="filterCategory">
                <FaFilter /> Filter by Category:
              </label>
              <select
                id="filterCategory"
                className="form-control"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-col">
              <label htmlFor="sortField">
                <FaSort /> Sort by:
              </label>
              <select
                id="sortField"
                className="form-control"
                value={sortField}
                onChange={(e) => toggleSortDirection(e.target.value)}
              >
                <option value="dueDate">Due Date</option>
                <option value="name">Name</option>
                <option value="status">Status</option>
                <option value="category">Category</option>
              </select>
            </div>

            <div className="form-col">
              <label htmlFor="sortDirection">Order:</label>
              <select
                id="sortDirection"
                className="form-control"
                value={sortDirection}
                onChange={(e) => setSortDirection(e.target.value)}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
        </div>

        <div className="export-section">
          <ExportButtons data={filteredTasks} filename="tasks" />
        </div>

        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onEdit={(id) => (window.location.href = `/tasks/edit/${id}`)}
              onDelete={handleDeleteTask}
              onStatusChange={handleStatusChange}
            />
          ))
        ) : (
          <p>No tasks found.</p>
        )}
      </div>
    </div>
  )
}

export default TaskList
