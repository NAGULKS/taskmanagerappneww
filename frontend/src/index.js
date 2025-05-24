import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"
import { AuthProvider } from "./context/AuthContext"
import { TaskProvider } from "./context/TaskContext"
import { BrowserRouter as Router } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <TaskProvider>
          <App />
          <ToastContainer position="top-right" autoClose={3000} />
        </TaskProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>,
)
