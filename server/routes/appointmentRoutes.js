const express = require("express");
const {
  bookAppointment,
  getMyAppointments,
  getDoctorAppointments,
  getAllAppointments,
  updateStatus,
  cancelAppointment,
} = require("../controllers/appointmentController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.post("/", protect, authorize("patient"), bookAppointment);
router.get("/mine", protect, authorize("patient"), getMyAppointments);
router.get("/doctor", protect, authorize("doctor"), getDoctorAppointments);
router.get("/", protect, authorize("admin"), getAllAppointments);
router.put("/:id/status", protect, authorize("doctor", "admin"), updateStatus);
router.put("/:id/cancel", protect, authorize("patient"), cancelAppointment);

module.exports = router;
