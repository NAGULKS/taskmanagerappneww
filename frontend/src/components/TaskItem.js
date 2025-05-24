"use client"
import { FaEdit, FaTrash, FaCheck } from "react-icons/fa"
import { format } from "date-fns"

const TaskItem = ({ task, onEdit, onDelete, onStatusChange }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "status-pending"
      case "in-progress":
        return "status-in-progress"
      case "completed":
        return "status-completed"
      default:
        return ""
    }
  }

  return (
    <div className="task-item">
      <div className="task-checkbox">
        {task.status !== "completed" ? (
          <button
            className="btn btn-sm btn-success"
            onClick={() => onStatusChange(task._id, "completed")}
            title="Mark as completed"
          >
            <FaCheck />
          </button>
        ) : (
          <button
            className="btn btn-sm btn-warning"
            onClick={() => onStatusChange(task._id, "pending")}
            title="Mark as pending"
          >
            <FaCheck />
          </button>
        )}
      </div>
      <div className="task-content">
        <h3 className="task-title">{task.name}</h3>
        <p>{task.description}</p>
        <div className="task-meta">
          <span className="task-category">
            <strong>Category:</strong> {task.category}
          </span>
          <span className={`task-status ${getStatusClass(task.status)}`}>
            <strong>Status:</strong> {task.status}
          </span>
          <span className="task-due-date">
            <strong>Due:</strong> {format(new Date(task.dueDate), "MMM dd, yyyy")}
          </span>
        </div>
      </div>
      <div className="task-actions">
        <button className="btn btn-sm btn-primary" onClick={() => onEdit(task._id)}>
          <FaEdit />
        </button>
        <button className="btn btn-sm btn-danger" onClick={() => onDelete(task._id)}>
          <FaTrash />
        </button>
      </div>
    </div>
  )
}

export default TaskItem
