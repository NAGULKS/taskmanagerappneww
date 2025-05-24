"use client"

import { useContext, useEffect } from "react"
import { Link } from "react-router-dom"
import { FaTasks, FaCalendarAlt, FaCheckCircle, FaPlus } from "react-icons/fa"
import { TaskContext } from "../context/TaskContext"
import TaskChart from "../components/TaskChart"
import CategoryChart from "../components/CategoryChart"
import TaskItem from "../components/TaskItem"

const Dashboard = () => {
  const {
    tasks,
    tasksDueToday,
    completedTasksData,
    upcomingTasks,
    popularCategories,
    loading,
    refreshDashboardData,
    updateTask,
  } = useContext(TaskContext)

  useEffect(() => {
    refreshDashboardData()
  }, [])

  const handleStatusChange = async (id, status) => {
    try {
      await updateTask(id, { status })
      refreshDashboardData()
    } catch (error) {
      console.error("Failed to update task status:", error)
    }
  }

  const completedTasks = tasks.filter((task) => task.status === "completed").length
  const pendingTasks = tasks.filter((task) => task.status !== "completed").length

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-card-header">
            <h3 className="stat-card-title">Total Tasks</h3>
            <div className="stat-card-icon" style={{ backgroundColor: "rgba(67, 97, 238, 0.1)", color: "#4361ee" }}>
              <FaTasks />
            </div>
          </div>
          <div className="stat-card-value">{tasks.length}</div>
          <div className="stat-card-description">All tasks in your account</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <h3 className="stat-card-title">Tasks Due Today</h3>
            <div className="stat-card-icon" style={{ backgroundColor: "rgba(243, 156, 18, 0.1)", color: "#f39c12" }}>
              <FaCalendarAlt />
            </div>
          </div>
          <div className="stat-card-value">{tasksDueToday.length}</div>
          <div className="stat-card-description">Tasks that need attention today</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <h3 className="stat-card-title">Completed Tasks</h3>
            <div className="stat-card-icon" style={{ backgroundColor: "rgba(46, 204, 113, 0.1)", color: "#2ecc71" }}>
              <FaCheckCircle />
            </div>
          </div>
          <div className="stat-card-value">{completedTasks}</div>
          <div className="stat-card-description">Tasks you've completed</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <h3 className="stat-card-title">Pending Tasks</h3>
            <div className="stat-card-icon" style={{ backgroundColor: "rgba(231, 76, 60, 0.1)", color: "#e74c3c" }}>
              <FaTasks />
            </div>
          </div>
          <div className="stat-card-value">{pendingTasks}</div>
          <div className="stat-card-description">Tasks that need to be completed</div>
        </div>
      </div>

      <div className="dashboard-charts">
        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-card-title">Tasks Completed (Last 7 Days)</h3>
          </div>
          {completedTasksData.length > 0 ? (
            <TaskChart data={completedTasksData} />
          ) : (
            <p>No completed tasks in the last 7 days.</p>
          )}
        </div>

        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-card-title">Popular Categories</h3>
          </div>
          {popularCategories.length > 0 ? (
            <CategoryChart data={popularCategories} />
          ) : (
            <p>No categories data available.</p>
          )}
        </div>
      </div>

      <div className="task-list">
        <div className="task-list-header">
          <h3 className="task-list-title">Tasks Due Today</h3>
          <Link to="/tasks/new" className="btn btn-primary">
            <FaPlus /> New Task
          </Link>
        </div>

        {tasksDueToday.length > 0 ? (
          tasksDueToday.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onEdit={(id) => (window.location.href = `/tasks/edit/${id}`)}
              onDelete={() => {}}
              onStatusChange={handleStatusChange}
            />
          ))
        ) : (
          <p>No tasks due today.</p>
        )}
      </div>

      <div className="task-list">
        <div className="task-list-header">
          <h3 className="task-list-title">Upcoming Tasks</h3>
          <Link to="/tasks" className="btn btn-secondary">
            View All
          </Link>
        </div>

        {upcomingTasks.length > 0 ? (
          upcomingTasks
            .slice(0, 5)
            .map((task) => (
              <TaskItem
                key={task._id}
                task={task}
                onEdit={(id) => (window.location.href = `/tasks/edit/${id}`)}
                onDelete={() => {}}
                onStatusChange={handleStatusChange}
              />
            ))
        ) : (
          <p>No upcoming tasks.</p>
        )}
      </div>
    </div>
  )
}

export default Dashboard
