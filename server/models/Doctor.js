const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    specialty: { type: String, required: true, index: true },
    qualifications: { type: String, default: "" },
    experienceYears: { type: Number, default: 0 },
    bio: { type: String, default: "" },
    consultationFee: { type: Number, required: true, default: 0 },
    photoUrl: { type: String, default: "" },
    clinicAddress: { type: String, default: "" },
    // Days the doctor is available, e.g. ["Mon","Tue","Wed"]
    availableDays: { type: [String], default: ["Mon", "Tue", "Wed", "Thu", "Fri"] },
    // Time slots offered each available day, e.g. ["09:00","09:30",...]
    timeSlots: {
      type: [String],
      default: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "16:00", "16:30", "17:00"],
    },
    rating: { type: Number, default: 4.5 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

doctorSchema.index({ name: "text", specialty: "text" });

module.exports = mongoose.model("Doctor", doctorSchema);
