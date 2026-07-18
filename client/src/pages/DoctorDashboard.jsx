import { useEffect, useState } from "react";
import api from "../api/axios.js";

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api
      .get("/appointments/doctor")
      .then((res) => setAppointments(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const setStatus = async (id, status) => {
    await api.put(`/appointments/${id}/status`, { status });
    load();
  };

  return (
    <section className="section container">
      <div className="section-head">
        <h2>Your patient schedule</h2>
      </div>

      {loading ? (
        <div className="loading-state">Loading appointments…</div>
      ) : appointments.length === 0 ? (
        <div className="empty-state">No appointments booked with you yet.</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Contact</th>
                <th>Date</th>
                <th>Time</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a._id}>
                  <td>{a.patient?.name}</td>
                  <td>{a.patient?.email}</td>
                  <td>{a.date}</td>
                  <td style={{ fontFamily: "var(--font-mono)" }}>{a.timeSlot}</td>
                  <td>{a.reason || "—"}</td>
                  <td><span className={`status-badge status-${a.status}`}>{a.status}</span></td>
                  <td style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {a.status === "pending" && (
                      <button className="btn btn-outline btn-sm" onClick={() => setStatus(a._id, "confirmed")}>
                        Confirm
                      </button>
                    )}
                    {a.status !== "completed" && a.status !== "cancelled" && (
                      <button className="btn btn-primary btn-sm" onClick={() => setStatus(a._id, "completed")}>
                        Mark done
                      </button>
                    )}
                    {a.status !== "cancelled" && a.status !== "completed" && (
                      <button className="btn btn-danger btn-sm" onClick={() => setStatus(a._id, "cancelled")}>
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
