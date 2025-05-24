"use client"

import { useState, useContext, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { FaSave, FaTimes } from "react-icons/fa"
import { TaskContext } from "../context/TaskContext"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

const TaskForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { createTask, updateTask, getTaskById, loading } = useContext(TaskContext)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    dueDate: new Date(),
    status: "pending",
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    const fetchTask = async () => {
      if (id) {
        try {
          const task = await getTaskById(id)
          setFormData({
            ...task,
            dueDate: new Date(task.dueDate),
          })
        } catch (error) {
          console.error("Failed to fetch task:", error)
        }
      }
    }

    fetchTask()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      dueDate: date,
    })
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Task name is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required"
    }

    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      if (id) {
        await updateTask(id, formData)
      } else {
        await createTask(formData)
      }
      navigate("/tasks")
    } catch (error) {
      console.error("Failed to save task:", error)
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
        <h2 className="form-card-title">{id ? "Edit Task" : "Create New Task"}</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Task Name</label>
          <input
            type="text"
            id="name"
            name="name"
            className={`form-control ${errors.name ? "is-invalid" : ""}`}
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            className={`form-control ${errors.description ? "is-invalid" : ""}`}
            value={formData.description}
            onChange={handleChange}
            rows="3"
          ></textarea>
          {errors.description && <div className="invalid-feedback">{errors.description}</div>}
        </div>

        <div className="form-row">
          <div className="form-col">
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <input
                type="text"
                id="category"
                name="category"
                className={`form-control ${errors.category ? "is-invalid" : ""}`}
                value={formData.category}
                onChange={handleChange}
              />
              {errors.category && <div className="invalid-feedback">{errors.category}</div>}
            </div>
          </div>

          <div className="form-col">
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                className="form-control"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="dueDate">Due Date</label>
          <DatePicker
            id="dueDate"
            selected={formData.dueDate}
            onChange={handleDateChange}
            className={`form-control ${errors.dueDate ? "is-invalid" : ""}`}
            dateFormat="MMMM d, yyyy"
          />
          {errors.dueDate && <div className="invalid-feedback">{errors.dueDate}</div>}
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate("/tasks")}>
            <FaTimes /> Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            <FaSave /> {id ? "Update Task" : "Create Task"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default TaskForm
