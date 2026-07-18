import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import DoctorCard from "../components/DoctorCard.jsx";
import PulseDivider from "../components/PulseDivider.jsx";

export default function Home() {
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);

  useEffect(() => {
    api.get("/doctors").then((res) => setDoctors(res.data.slice(0, 6)));
    api.get("/doctors/specialties").then((res) => setSpecialties(res.data));
  }, []);

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">Book in under two minutes</span>
            <h1>
              Find the right doctor, <em>on your schedule</em>.
            </h1>
            <PulseDivider />
            <p style={{ maxWidth: 460 }}>
              DocBook connects you with verified doctors across specialties. Compare fees,
              check live availability, and confirm your appointment instantly — no phone
              calls, no waiting rooms.
            </p>
            <div className="hero-actions">
              <Link to="/doctors" className="btn btn-primary">
                Browse doctors
              </Link>
              <Link to="/register" className="btn btn-outline">
                Create an account
              </Link>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <b>{doctors.length ? "50+" : "—"}</b>
                <span>Specialists</span>
              </div>
              <div className="hero-stat">
                <b>24/7</b>
                <span>Online booking</span>
              </div>
              <div className="hero-stat">
                <b>0</b>
                <span>Waiting rooms</span>
              </div>
            </div>
          </div>
          <div className="hero-card">
            <h3 style={{ marginBottom: 4 }}>Popular specialties</h3>
            <p style={{ fontSize: "0.85rem" }}>Jump straight to what you need</p>
            <div className="chip-row">
              {(specialties.length ? specialties : ["Cardiology", "Dermatology", "Pediatrics", "Orthopedics"]).map(
                (s) => (
                  <Link key={s} to={`/doctors?specialty=${encodeURIComponent(s)}`} className="chip">
                    {s}
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="section-head">
          <h2>Top-rated doctors</h2>
          <Link to="/doctors">View all →</Link>
        </div>
        {doctors.length === 0 ? (
          <p>Loading doctors…</p>
        ) : (
          <div className="doctor-grid">
            {doctors.map((d) => (
              <DoctorCard key={d._id} doctor={d} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
