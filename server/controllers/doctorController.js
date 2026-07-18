const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");

// @route GET /api/doctors?search=&specialty=
// @desc  Public list of active doctors, optionally filtered
const getDoctors = async (req, res) => {
  try {
    const { search, specialty } = req.query;
    const query = { isActive: true };
    if (specialty) query.specialty = specialty;
    if (search) query.$text = { $search: search };

    const doctors = await Doctor.find(query).sort({ rating: -1 });
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/doctors/specialties
const getSpecialties = async (req, res) => {
  try {
    const specialties = await Doctor.distinct("specialty", { isActive: true });
    res.json(specialties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/doctors/:id
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/doctors/:id/availability?date=YYYY-MM-DD
// @desc  Returns which of the doctor's time slots are still free on a given date
const getAvailability = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ message: "date query param is required" });

    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const booked = await Appointment.find({
      doctor: doctor._id,
      date,
      status: { $in: ["pending", "confirmed"] },
    }).select("timeSlot");

    const bookedSlots = booked.map((b) => b.timeSlot);
    const slots = doctor.timeSlots.map((slot) => ({
      time: slot,
      available: !bookedSlots.includes(slot),
    }));

    res.json({ date, slots });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route POST /api/doctors  (admin only)
const createDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.create(req.body);
    res.status(201).json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route PUT /api/doctors/:id  (admin or the doctor themselves)
const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route DELETE /api/doctors/:id  (admin only)
const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json({ message: "Doctor removed from listings" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getDoctors,
  getSpecialties,
  getDoctorById,
  getAvailability,
  createDoctor,
  updateDoctor,
  deleteDoctor,
};
