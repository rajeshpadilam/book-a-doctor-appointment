const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Doctor = require("../models/Doctor");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// @route POST /api/auth/register
// @desc  Register a new patient (or, if role="doctor", a doctor account + profile)
const register = async (req, res) => {
  try {
    const { name, email, password, phone, role, specialty, consultationFee, bio } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ message: "An account with this email already exists" });

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: role === "doctor" ? "doctor" : "patient",
    });

    // If registering as a doctor, also create the public Doctor profile
    if (user.role === "doctor") {
      const doctor = await Doctor.create({
        user: user._id,
        name,
        specialty: specialty || "General Physician",
        consultationFee: consultationFee || 0,
        bio: bio || "",
      });
      user.doctorProfile = doctor._id;
      await user.save();
    }

    const token = signToken(user._id);
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, doctorProfile: user.doctorProfile },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = signToken(user._id);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, doctorProfile: user.doctorProfile },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/auth/me
const getMe = async (req, res) => {
  res.json({ user: req.user });
};

module.exports = { register, login, getMe };
