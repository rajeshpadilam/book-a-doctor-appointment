const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");

// @route POST /api/appointments  (patient)
const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, timeSlot, reason } = req.body;
    if (!doctorId || !date || !timeSlot) {
      return res.status(400).json({ message: "doctorId, date and timeSlot are required" });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor || !doctor.isActive) return res.status(404).json({ message: "Doctor not found" });

    const clash = await Appointment.findOne({
      doctor: doctorId,
      date,
      timeSlot,
      status: { $in: ["pending", "confirmed"] },
    });
    if (clash) return res.status(409).json({ message: "That slot was just taken. Please pick another." });

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctorId,
      date,
      timeSlot,
      reason,
      status: "pending",
    });

    const populated = await appointment.populate("doctor", "name specialty consultationFee photoUrl");
    res.status(201).json(populated);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "That slot was just taken. Please pick another." });
    }
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/appointments/mine  (patient) — the logged-in patient's bookings
const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate("doctor", "name specialty consultationFee photoUrl")
      .sort({ date: -1, timeSlot: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/appointments/doctor  (doctor) — appointments booked with the logged-in doctor
const getDoctorAppointments = async (req, res) => {
  try {
    if (!req.user.doctorProfile) return res.status(400).json({ message: "No doctor profile linked to this account" });
    const appointments = await Appointment.find({ doctor: req.user.doctorProfile })
      .populate("patient", "name email phone")
      .sort({ date: -1, timeSlot: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/appointments  (admin) — every appointment in the system
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({})
      .populate("doctor", "name specialty")
      .populate("patient", "name email")
      .sort({ date: -1, timeSlot: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route PUT /api/appointments/:id/status  (doctor or admin) — confirm/cancel/complete
const updateStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const allowed = ["pending", "confirmed", "cancelled", "completed"];
    if (!allowed.includes(status)) return res.status(400).json({ message: "Invalid status" });

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    if (
      req.user.role === "doctor" &&
      String(appointment.doctor) !== String(req.user.doctorProfile)
    ) {
      return res.status(403).json({ message: "This appointment does not belong to you" });
    }

    appointment.status = status;
    if (notes !== undefined) appointment.notes = notes;
    await appointment.save();
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route PUT /api/appointments/:id/cancel  (patient) — cancel their own booking
const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });
    if (String(appointment.patient) !== String(req.user._id)) {
      return res.status(403).json({ message: "This appointment does not belong to you" });
    }
    appointment.status = "cancelled";
    await appointment.save();
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  bookAppointment,
  getMyAppointments,
  getDoctorAppointments,
  getAllAppointments,
  updateStatus,
  cancelAppointment,
};
