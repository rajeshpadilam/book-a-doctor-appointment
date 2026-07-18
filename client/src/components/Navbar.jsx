import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const dashboardPath =
    user?.role === "admin" ? "/admin" : user?.role === "doctor" ? "/doctor-dashboard" : "/my-appointments";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          Doc<span className="brand-mark">Book</span>
        </Link>
        <nav className="nav-links">
          <Link to="/doctors">Find a doctor</Link>
          {user && <Link to={dashboardPath}>Dashboard</Link>}
          {!user && <Link to="/login">Log in</Link>}
          {!user && (
            <Link to="/register" className="nav-pill">
              Get started
            </Link>
          )}
          {user && (
            <>
              <span className="nav-role-badge">{user.role}</span>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                Log out
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
