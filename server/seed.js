// Populates the database with a demo admin, a few doctors, and a demo patient.
// Run with: npm run seed
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const User = require("./models/User");
const Doctor = require("./models/Doctor");

const run = async () => {
  await connectDB();

  await User.deleteMany({});
  await Doctor.deleteMany({});

  const admin = await User.create({
    name: "Admin",
    email: "admin@docbook.com",
    password: "admin123",
    role: "admin",
  });

  const patient = await User.create({
    name: "Jordan Patient",
    email: "patient@docbook.com",
    password: "patient123",
    role: "patient",
  });

  const doctorSeeds = [
    { name: "Dr. Ava Simmons", specialty: "Cardiology", fee: 120, exp: 12, bio: "Specialist in heart health and preventive cardiology.", photo: "https://i.pravatar.cc/300?img=47" },
    { name: "Dr. Liam Chen", specialty: "Dermatology", fee: 90, exp: 8, bio: "Focused on skin health, acne and cosmetic dermatology.", photo: "https://i.pravatar.cc/300?img=12" },
    { name: "Dr. Priya Rao", specialty: "Pediatrics", fee: 80, exp: 10, bio: "Caring for infants, children and adolescents.", photo: "https://i.pravatar.cc/300?img=32" },
    { name: "Dr. Marcus Lee", specialty: "Orthopedics", fee: 110, exp: 15, bio: "Bone, joint and sports injury specialist.", photo: "https://i.pravatar.cc/300?img=51" },
    { name: "Dr. Sofia Rossi", specialty: "General Physician", fee: 60, exp: 6, bio: "Primary care for everyday health concerns.", photo: "https://i.pravatar.cc/300?img=44" },
    { name: "Dr. Ethan Brooks", specialty: "Neurology", fee: 140, exp: 18, bio: "Treating disorders of the brain and nervous system.", photo: "https://i.pravatar.cc/300?img=15" },
  ];

  for (const d of doctorSeeds) {
    const user = await User.create({
      name: d.name,
      email: d.name.toLowerCase().replace(/[^a-z]+/g, ".") + "@docbook.com",
      password: "doctor123",
      role: "doctor",
    });
    const doctor = await Doctor.create({
      user: user._id,
      name: d.name,
      specialty: d.specialty,
      qualifications: "MBBS, MD",
      experienceYears: d.exp,
      bio: d.bio,
      consultationFee: d.fee,
      photoUrl: d.photo,
      clinicAddress: "DocBook Clinic, Main Street",
    });
    user.doctorProfile = doctor._id;
    await user.save();
  }

  console.log("Seed complete.");
  console.log("Admin login:   admin@docbook.com / admin123");
  console.log("Patient login: patient@docbook.com / patient123");
  console.log("Doctor login:  <any doctor email above> / doctor123");

  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
