const express = require("express");
const {
  getDoctors,
  getSpecialties,
  getDoctorById,
  getAvailability,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} = require("../controllers/doctorController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.get("/", getDoctors);
router.get("/specialties", getSpecialties);
router.get("/:id", getDoctorById);
router.get("/:id/availability", getAvailability);

router.post("/", protect, authorize("admin"), createDoctor);
router.put("/:id", protect, authorize("admin", "doctor"), updateDoctor);
router.delete("/:id", protect, authorize("admin"), deleteDoctor);

module.exports = router;
