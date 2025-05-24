import { Link } from "react-router-dom"
import { FaHome } from "react-icons/fa"

const NotFound = () => {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">404</h1>
          <p className="auth-subtitle">Page Not Found</p>
        </div>

        <p className="text-center mb-4">The page you are looking for does not exist.</p>

        <div className="text-center">
          <Link to="/" className="btn btn-primary">
            <FaHome /> Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound
