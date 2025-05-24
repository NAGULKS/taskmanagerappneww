"use client"

import { useState, useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import { FaUsers, FaTasks, FaUserPlus, FaChartLine } from "react-icons/fa"
import { AuthContext } from "../context/AuthContext"
import axios from "axios"
import { toast } from "react-toastify"
import { Bar, Pie } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

const AdminDashboard = () => {
  const { user } = useContext(AuthContext)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
  })
  const [userTaskStats, setUserTaskStats] = useState([])
  const [recentUsers, setRecentUsers] = useState([])
  const [tasksByStatus, setTasksByStatus] = useState({
    pending: 0,
    "in-progress": 0,
    completed: 0,
  })

  useEffect(() => {
    fetchAdminDashboardData()
  }, [])

  const fetchAdminDashboardData = async () => {
    try {
      setLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }

      // Fetch all required data in parallel
      const [usersResponse, tasksResponse, userStatsResponse, recentUsersResponse] = await Promise.all([
        axios.get("/api/users", config),
        axios.get("/api/tasks/admin/all", config),
        axios.get("/api/admin/user-task-stats", config),
        axios.get("/api/admin/recent-users", config),
      ])

      const users = usersResponse.data
      const tasks = tasksResponse.data

      // Calculate stats
      const activeUsers = users.filter((user) => user.isActive).length
      const inactiveUsers = users.filter((user) => !user.isActive).length
      const completedTasks = tasks.filter((task) => task.status === "completed").length
      const pendingTasks = tasks.filter((task) => task.status !== "completed").length

      // Calculate tasks by status
      const pending = tasks.filter((task) => task.status === "pending").length
      const inProgress = tasks.filter((task) => task.status === "in-progress").length
      const completed = tasks.filter((task) => task.status === "completed").length

      setStats({
        totalUsers: users.length,
        activeUsers,
        inactiveUsers,
        totalTasks: tasks.length,
        completedTasks,
        pendingTasks,
      })

      setUserTaskStats(userStatsResponse.data)
      setRecentUsers(recentUsersResponse.data)
      setTasksByStatus({
        pending,
        "in-progress": inProgress,
        completed,
      })
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch admin dashboard data")
    } finally {
      setLoading(false)
    }
  }

  const userTasksChartData = {
    labels: userTaskStats.map((stat) => stat.userName),
    datasets: [
      {
        label: "Total Tasks",
        data: userTaskStats.map((stat) => stat.totalTasks),
        backgroundColor: "rgba(67, 97, 238, 0.6)",
        borderColor: "rgba(67, 97, 238, 1)",
        borderWidth: 1,
      },
      {
        label: "Completed Tasks",
        data: userTaskStats.map((stat) => stat.completedTasks),
        backgroundColor: "rgba(46, 204, 113, 0.6)",
        borderColor: "rgba(46, 204, 113, 1)",
        borderWidth: 1,
      },
    ],
  }

  const userTasksChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Tasks by User",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  }

  const taskStatusChartData = {
    labels: Object.keys(tasksByStatus).map((status) =>
      status === "in-progress" ? "In Progress" : status.charAt(0).toUpperCase() + status.slice(1),
    ),
    datasets: [
      {
        label: "Tasks by Status",
        data: Object.values(tasksByStatus),
        backgroundColor: ["rgba(243, 156, 18, 0.6)", "rgba(52, 152, 219, 0.6)", "rgba(46, 204, 113, 0.6)"],
        borderColor: ["rgba(243, 156, 18, 1)", "rgba(52, 152, 219, 1)", "rgba(46, 204, 113, 1)"],
        borderWidth: 1,
      },
    ],
  }

  const taskStatusChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
      },
      title: {
        display: true,
        text: "Tasks by Status",
      },
    },
  }

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <h1 className="admin-dashboard-title">Admin Dashboard</h1>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-card-header">
            <h3 className="stat-card-title">Total Users</h3>
            <div className="stat-card-icon" style={{ backgroundColor: "rgba(67, 97, 238, 0.1)", color: "#4361ee" }}>
              <FaUsers />
            </div>
          </div>
          <div className="stat-card-value">{stats.totalUsers}</div>
          <div className="stat-card-description">
            {stats.activeUsers} active, {stats.inactiveUsers} inactive
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <h3 className="stat-card-title">Total Tasks</h3>
            <div className="stat-card-icon" style={{ backgroundColor: "rgba(46, 204, 113, 0.1)", color: "#2ecc71" }}>
              <FaTasks />
            </div>
          </div>
          <div className="stat-card-value">{stats.totalTasks}</div>
          <div className="stat-card-description">
            {stats.completedTasks} completed, {stats.pendingTasks} pending
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <h3 className="stat-card-title">Task Completion Rate</h3>
            <div className="stat-card-icon" style={{ backgroundColor: "rgba(52, 152, 219, 0.1)", color: "#3498db" }}>
              <FaChartLine />
            </div>
          </div>
          <div className="stat-card-value">
            {stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%
          </div>
          <div className="stat-card-description">Overall completion rate</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <h3 className="stat-card-title">Add User</h3>
            <div className="stat-card-icon" style={{ backgroundColor: "rgba(231, 76, 60, 0.1)", color: "#e74c3c" }}>
              <FaUserPlus />
            </div>
          </div>
          <div className="stat-card-action">
            <Link to="/users/new" className="btn btn-primary">
              Create User
            </Link>
          </div>
        </div>
      </div>

      <div className="dashboard-charts">
        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-card-title">User Task Progress</h3>
          </div>
          {userTaskStats.length > 0 ? (
            <Bar data={userTasksChartData} options={userTasksChartOptions} />
          ) : (
            <p>No user task data available.</p>
          )}
        </div>

        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-card-title">Tasks by Status</h3>
          </div>
          <Pie data={taskStatusChartData} options={taskStatusChartOptions} />
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">User Progress</h3>
          <Link to="/users" className="btn btn-secondary">
            View All Users
          </Link>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Total Tasks</th>
                <th>Completion Rate</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {userTaskStats.map((stat) => (
                <tr key={stat.userId}>
                  <td>{stat.userName}</td>
                  <td>
                    {stat.isActive ? (
                      <span className="badge badge-success">Active</span>
                    ) : (
                      <span className="badge badge-danger">Inactive</span>
                    )}
                  </td>
                  <td>{stat.totalTasks}</td>
                  <td>
                    <div className="progress">
                      <div
                        className="progress-bar"
                        style={{
                          width: `${stat.completionRate}%`,
                          backgroundColor:
                            stat.completionRate > 75
                              ? "#2ecc71"
                              : stat.completionRate > 50
                                ? "#3498db"
                                : stat.completionRate > 25
                                  ? "#f39c12"
                                  : "#e74c3c",
                        }}
                      >
                        {stat.completionRate}%
                      </div>
                    </div>
                  </td>
                  <td>
                    <Link to={`/admin/user-tasks/${stat.userId}`} className="btn btn-sm btn-primary">
                      View Tasks
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Recently Added Users</h3>
          <Link to="/users" className="btn btn-secondary">
            View All Users
          </Link>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`badge ${user.isActive ? "badge-success" : "badge-danger"}`}>
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Link to={`/admin/user-tasks/${user._id}`} className="btn btn-sm btn-primary">
                      View Tasks
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
