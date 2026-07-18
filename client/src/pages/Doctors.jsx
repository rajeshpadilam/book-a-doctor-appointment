import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios.js";
import DoctorCard from "../components/DoctorCard.jsx";

export default function Doctors() {
  const [searchParams, setSearchParams] = useSearchParams();
  const specialty = searchParams.get("specialty") || "";
  const [search, setSearch] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/doctors/specialties").then((res) => setSpecialties(res.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (specialty) params.specialty = specialty;
    if (search) params.search = search;
    api
      .get("/doctors", { params })
      .then((res) => setDoctors(res.data))
      .finally(() => setLoading(false));
  }, [specialty, search]);

  return (
    <section className="section container">
      <div className="section-head">
        <h2>Find a doctor</h2>
        <input
          placeholder="Search by name or specialty…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "10px 14px",
            borderRadius: "8px",
            border: "1px solid var(--color-border)",
            minWidth: 240,
          }}
        />
      </div>

      <div className="chip-row">
        <span className={`chip ${!specialty ? "active" : ""}`} onClick={() => setSearchParams({})}>
          All specialties
        </span>
        {specialties.map((s) => (
          <span
            key={s}
            className={`chip ${specialty === s ? "active" : ""}`}
            onClick={() => setSearchParams({ specialty: s })}
          >
            {s}
          </span>
        ))}
      </div>

      {loading ? (
        <div className="loading-state">Loading doctors…</div>
      ) : doctors.length === 0 ? (
        <div className="empty-state">No doctors match your search yet. Try a different specialty.</div>
      ) : (
        <div className="doctor-grid">
          {doctors.map((d) => (
            <DoctorCard key={d._id} doctor={d} />
          ))}
        </div>
      )}
    </section>
  );
}
