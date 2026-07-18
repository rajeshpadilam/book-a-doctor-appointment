import { useEffect, useState } from "react";
import api from "../api/axios.js";

export default function AdminDashboard() {
  const [tab, setTab] = useState("doctors");
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", specialty: "", consultationFee: 60, experienceYears: 1, bio: "" });
  const [formError, setFormError] = useState("");

  const loadDoctors = () => api.get("/doctors").then((res) => setDoctors(res.data));
  const loadAppointments = () => api.get("/appointments").then((res) => setAppointments(res.data));

  useEffect(() => {
    setLoading(true);
    Promise.all([loadDoctors(), loadAppointments()]).finally(() => setLoading(false));
  }, []);

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    setFormError("");
    try {
      await api.post("/doctors", form);
      setForm({ name: "", specialty: "", consultationFee: 60, experienceYears: 1, bio: "" });
      loadDoctors();
    } catch (err) {
      setFormError(err.response?.data?.message || "Could not add doctor");
    }
  };

  const removeDoctor = async (id) => {
    await api.delete(`/doctors/${id}`);
    loadDoctors();
  };

  return (
    <section className="section container">
      <div className="section-head">
        <h2>Admin dashboard</h2>
        <div className="chip-row" style={{ marginBottom: 0 }}>
          <span className={`chip ${tab === "doctors" ? "active" : ""}`} onClick={() => setTab("doctors")}>
            Doctors ({doctors.length})
          </span>
          <span className={`chip ${tab === "appointments" ? "active" : ""}`} onClick={() => setTab("appointments")}>
            Appointments ({appointments.length})
          </span>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Loading…</div>
      ) : tab === "doctors" ? (
        <>
          <div className="form-card" style={{ margin: "0 0 28px", maxWidth: "none" }}>
            <h3>Add a doctor</h3>
            {formError && <div className="form-error">{formError}</div>}
            <form onSubmit={handleAddDoctor}>
              <div className="form-row">
                <div className="form-field">
                  <label>Name</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="form-field">
                  <label>Specialty</label>
                  <input required value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-field">
                  <label>Fee ($)</label>
                  <input type="number" min="0" value={form.consultationFee} onChange={(e) => setForm({ ...form, consultationFee: e.target.value })} />
                </div>
                <div className="form-field">
                  <label>Experience (yrs)</label>
                  <input type="number" min="0" value={form.experienceYears} onChange={(e) => setForm({ ...form, experienceYears: e.target.value })} />
                </div>
              </div>
              <div className="form-field">
                <label>Bio</label>
                <textarea rows={2} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
              </div>
              <button className="btn btn-primary">Add doctor</button>
            </form>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Specialty</th>
                  <th>Fee</th>
                  <th>Experience</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((d) => (
                  <tr key={d._id}>
                    <td>{d.name}</td>
                    <td>{d.specialty}</td>
                    <td>${d.consultationFee}</td>
                    <td>{d.experienceYears} yrs</td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => removeDoctor(d._id)}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Specialty</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a._id}>
                  <td>{a.patient?.name}</td>
                  <td>{a.doctor?.name}</td>
                  <td>{a.doctor?.specialty}</td>
                  <td>{a.date}</td>
                  <td style={{ fontFamily: "var(--font-mono)" }}>{a.timeSlot}</td>
                  <td><span className={`status-badge status-${a.status}`}>{a.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
