"use client"

import { useState, useEffect, useContext } from "react"
import { useParams, Link } from "react-router-dom"
import { FaArrowLeft, FaUser } from "react-icons/fa"
import { AuthContext } from "../context/AuthContext"
import axios from "axios"
import { toast } from "react-toastify"
import TaskItem from "../components/TaskItem"
import ExportButtons from "../components/ExportButtons"

const UserTasksView = () => {
  const { userId } = useParams()
  const { user } = useContext(AuthContext)
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState(null)
  const [userTasks, setUserTasks] = useState([])

  useEffect(() => {
    fetchUserData()
    fetchUserTasks()
  }, [userId])

  const fetchUserData = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }

      const response = await axios.get(`https://taskmanagerappneww.onrender.com/api/users/${userId}`, config)
      setUserData(response.data)
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch user data")
    }
  }

  const fetchUserTasks = async () => {
    try {
      setLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }

      const response = await axios.get(`https://taskmanagerappneww.onrender.com/api/admin/user-tasks/${userId}`, config)
      setUserTasks(response.data)
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch user tasks")
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id, status) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }

      await axios.put(`https://taskmanagerappneww.onrender.com/api/tasks/${id}`, { status }, config)
      toast.success("Task status updated successfully")
      fetchUserTasks()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update task status")
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
    <div className="user-tasks-view">
      <div className="card">
        <div className="card-header">
          <Link to="/admin" className="btn btn-secondary">
            <FaArrowLeft /> Back to Admin Dashboard
          </Link>
        </div>

        {userData && (
          <div className="user-info-card">
            <div className="user-info-header">
              <div className="user-avatar">
                <FaUser size={40} />
              </div>
              <div className="user-details">
                <h2>{userData.name}</h2>
                <p>{userData.email}</p>
                <span className={`badge ${userData.isActive ? "badge-success" : "badge-danger"}`}>
                  {userData.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
            <div className="user-stats">
              <div className="user-stat">
                <h3>Total Tasks</h3>
                <p>{userTasks.length}</p>
              </div>
              <div className="user-stat">
                <h3>Completed</h3>
                <p>{userTasks.filter((task) => task.status === "completed").length}</p>
              </div>
              <div className="user-stat">
                <h3>Pending</h3>
                <p>{userTasks.filter((task) => task.status === "pending").length}</p>
              </div>
              <div className="user-stat">
                <h3>In Progress</h3>
                <p>{userTasks.filter((task) => task.status === "in-progress").length}</p>
              </div>
            </div>
          </div>
        )}

        <div className="card-header">
          <h3 className="card-title">User Tasks</h3>
          <div className="export-section">
            <ExportButtons data={userTasks} filename={`tasks-${userData?.name || userId}`} />
          </div>
        </div>

        {userTasks.length > 0 ? (
          userTasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onEdit={() => {}}
              onDelete={() => {}}
              onStatusChange={handleStatusChange}
            />
          ))
        ) : (
          <p>No tasks found for this user.</p>
        )}
      </div>
    </div>
  )
}

export default UserTasksView
