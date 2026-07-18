import { useEffect, useState } from "react";
import api from "../api/axios.js";

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api
      .get("/appointments/mine")
      .then((res) => setAppointments(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCancel = async (id) => {
    await api.put(`/appointments/${id}/cancel`);
    load();
  };

  return (
    <section className="section container" style={{ maxWidth: 800 }}>
      <div className="section-head">
        <h2>My appointments</h2>
      </div>

      {loading ? (
        <div className="loading-state">Loading your appointments…</div>
      ) : appointments.length === 0 ? (
        <div className="empty-state">
          You haven't booked anything yet. <a href="/doctors">Find a doctor →</a>
        </div>
      ) : (
        <div className="appt-list">
          {appointments.map((a) => (
            <div className="appt-card" key={a._id}>
              <div className="appt-info">
                <b>{a.doctor?.name}</b>
                <div style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>{a.doctor?.specialty}</div>
                <div className="appt-when">{a.date} · {a.timeSlot}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span className={`status-badge status-${a.status}`}>{a.status}</span>
                {["pending", "confirmed"].includes(a.status) && (
                  <button className="btn btn-danger btn-sm" onClick={() => handleCancel(a._id)}>
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
