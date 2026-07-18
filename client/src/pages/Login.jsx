import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const user = await login(form.email, form.password);
      const dest =
        location.state?.from ||
        (user.role === "admin" ? "/admin" : user.role === "doctor" ? "/doctor-dashboard" : "/my-appointments");
      navigate(dest);
    } catch (err) {
      setError(err.response?.data?.message || "Could not log in");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-card">
      <h2>Welcome back</h2>
      <p>Log in to manage your appointments.</p>
      {error && <div className="form-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" required value={form.password} onChange={handleChange} />
        </div>
        <button className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? "Logging in…" : "Log in"}
        </button>
      </form>
      <p className="form-note">
        New here? <Link to="/register">Create an account</Link>
      </p>
      <p className="form-note" style={{ fontSize: "0.78rem" }}>
        Demo: admin@docbook.com / admin123 · patient@docbook.com / patient123
      </p>
    </div>
  );
}
