import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState("patient");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    specialty: "General Physician",
    consultationFee: 60,
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const user = await register({ ...form, role });
      navigate(user.role === "doctor" ? "/doctor-dashboard" : "/my-appointments");
    } catch (err) {
      setError(err.response?.data?.message || "Could not create account");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-card">
      <h2>Create your account</h2>
      <p>Book appointments as a patient, or list yourself as a doctor.</p>

      <div className="role-toggle">
        <button type="button" className={role === "patient" ? "active" : ""} onClick={() => setRole("patient")}>
          I'm a patient
        </button>
        <button type="button" className={role === "doctor" ? "active" : ""} onClick={() => setRole("doctor")}>
          I'm a doctor
        </button>
      </div>

      {error && <div className="form-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="name">Full name</label>
          <input id="name" name="name" required value={form.name} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} />
        </div>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" minLength={6} required value={form.password} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label htmlFor="phone">Phone</label>
            <input id="phone" name="phone" value={form.phone} onChange={handleChange} />
          </div>
        </div>

        {role === "doctor" && (
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="specialty">Specialty</label>
              <input id="specialty" name="specialty" value={form.specialty} onChange={handleChange} />
            </div>
            <div className="form-field">
              <label htmlFor="consultationFee">Fee ($)</label>
              <input
                id="consultationFee"
                name="consultationFee"
                type="number"
                min="0"
                value={form.consultationFee}
                onChange={handleChange}
              />
            </div>
          </div>
        )}

        <button className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? "Creating account…" : "Create account"}
        </button>
      </form>
      <p className="form-note">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}
