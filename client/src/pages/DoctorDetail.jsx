import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

const todayStr = () => new Date().toISOString().slice(0, 10);

export default function DoctorDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState(todayStr());
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reason, setReason] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    api.get(`/doctors/${id}`).then((res) => setDoctor(res.data));
  }, [id]);

  useEffect(() => {
    if (!date) return;
    setLoadingSlots(true);
    setSelectedSlot(null);
    api
      .get(`/doctors/${id}/availability`, { params: { date } })
      .then((res) => setSlots(res.data.slots))
      .finally(() => setLoadingSlots(false));
  }, [id, date]);

  const handleBook = async () => {
    setError("");
    setMessage("");
    if (!user) {
      navigate("/login", { state: { from: `/doctors/${id}` } });
      return;
    }
    if (user.role !== "patient") {
      setError("Only patient accounts can book appointments.");
      return;
    }
    if (!selectedSlot) {
      setError("Please choose a time slot first.");
      return;
    }
    setBooking(true);
    try {
      await api.post("/appointments", { doctorId: id, date, timeSlot: selectedSlot, reason });
      setMessage("Appointment booked! Check your appointments page for details.");
      setSelectedSlot(null);
      const res = await api.get(`/doctors/${id}/availability`, { params: { date } });
      setSlots(res.data.slots);
    } catch (err) {
      setError(err.response?.data?.message || "Could not book that slot");
    } finally {
      setBooking(false);
    }
  };

  if (!doctor) return <div className="loading-state">Loading doctor profile…</div>;

  return (
    <section className="section container" style={{ maxWidth: 900 }}>
      <div className="hero-card" style={{ marginBottom: 28 }}>
        <div className="doctor-card-top" style={{ marginBottom: 12 }}>
          <img
            className="doctor-photo"
            style={{ width: 84, height: 84 }}
            src={doctor.photoUrl || "https://api.dicebear.com/7.x/initials/svg?seed=" + doctor.name}
            alt={doctor.name}
          />
          <div>
            <h2 style={{ marginBottom: 4 }}>{doctor.name}</h2>
            <div className="doctor-specialty">{doctor.specialty}</div>
            <div style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
              {doctor.qualifications} · {doctor.experienceYears}+ yrs experience · ⭐ {doctor.rating}
            </div>
          </div>
        </div>
        <p>{doctor.bio}</p>
        <div style={{ display: "flex", gap: 24, fontSize: "0.88rem", flexWrap: "wrap" }}>
          <span>
            <strong>Fee:</strong> <span className="doctor-fee">${doctor.consultationFee}</span>
          </span>
          <span>
            <strong>Clinic:</strong> {doctor.clinicAddress}
          </span>
          <span>
            <strong>Available:</strong> {doctor.availableDays.join(", ")}
          </span>
        </div>
      </div>

      <div className="form-card" style={{ margin: 0, maxWidth: "none" }}>
        <h3>Book an appointment</h3>

        {message && <div className="form-error" style={{ background: "var(--color-success-bg)", color: "var(--color-success)" }}>{message}</div>}
        {error && <div className="form-error">{error}</div>}

        <div className="form-field" style={{ maxWidth: 220 }}>
          <label htmlFor="date">Date</label>
          <input id="date" type="date" min={todayStr()} value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        {loadingSlots ? (
          <p>Checking availability…</p>
        ) : (
          <div className="slot-grid">
            {slots.map((s) => (
              <button
                key={s.time}
                type="button"
                disabled={!s.available}
                className={`slot-btn ${selectedSlot === s.time ? "selected" : ""}`}
                onClick={() => setSelectedSlot(s.time)}
              >
                {s.time}
              </button>
            ))}
          </div>
        )}

        <div className="form-field">
          <label htmlFor="reason">Reason for visit (optional)</label>
          <textarea id="reason" rows={3} value={reason} onChange={(e) => setReason(e.target.value)} />
        </div>

        <button className="btn btn-primary" onClick={handleBook} disabled={booking}>
          {booking ? "Booking…" : `Confirm ${selectedSlot || "slot"}`}
        </button>
      </div>
    </section>
  );
}
