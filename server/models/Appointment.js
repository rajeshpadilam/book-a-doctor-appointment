const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    date: { type: String, required: true }, // "YYYY-MM-DD"
    timeSlot: { type: String, required: true }, // "09:30"
    reason: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    notes: { type: String, default: "" }, // doctor's notes after the visit
  },
  { timestamps: true }
);

// Prevent double-booking the same doctor/date/slot
appointmentSchema.index({ doctor: 1, date: 1, timeSlot: 1 }, { unique: true, partialFilterExpression: { status: { $in: ["pending", "confirmed"] } } });

module.exports = mongoose.model("Appointment", appointmentSchema);
