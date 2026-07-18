import { Link } from "react-router-dom";

export default function DoctorCard({ doctor }) {
  return (
    <Link to={`/doctors/${doctor._id}`} className="doctor-card" style={{ textDecoration: "none" }}>
      <div className="doctor-card-top">
        <img
          className="doctor-photo"
          src={doctor.photoUrl || "https://api.dicebear.com/7.x/initials/svg?seed=" + doctor.name}
          alt={doctor.name}
        />
        <div>
          <div className="doctor-name">{doctor.name}</div>
          <div className="doctor-specialty">{doctor.specialty}</div>
        </div>
      </div>
      <p style={{ fontSize: "0.85rem", margin: 0 }}>
        {doctor.experienceYears}+ yrs experience · ⭐ {doctor.rating}
      </p>
      <div className="doctor-meta">
        <span>{doctor.qualifications || "MBBS"}</span>
        <span className="doctor-fee">${doctor.consultationFee}</span>
      </div>
    </Link>
  );
}
