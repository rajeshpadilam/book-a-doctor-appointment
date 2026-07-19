# DocBook — Doctor Appointment Booking System (MERN)

## 🔗 Live Demo
- **App (Frontend):** https://book-a-doctor-appointment-o277.vercel.app
- **API (Backend):** https://book-a-doctor-appointment.onrender.com

Demo logins: patient@docbook.com /  patient123


A full-stack doctor appointment booking app inspired by the reference project you shared.
Patients browse doctors, check live slot availability, and book instantly. Doctors manage
their schedule. Admins manage the doctor directory and see every booking.


## Stack
- **MongoDB** + Mongoose — data
- **Express** + JWT — REST API
- **React** (Vite) + React Router — frontend
- **Node.js** — runtime

## Project structure
```
docbook/
  backend/     Express API (port 5000)
  frontend/    React app (port 5173)
```

## 1. Backend setup
```bash
cd backend
npm install
cp .env.example .env      # then edit MONGO_URI / JWT_SECRET if needed
npm run seed               # creates demo admin, patient, and 6 doctors
npm run dev                 # starts the API on http://localhost:5000
```

**Demo logins after seeding:**
| Role    | Email                     | Password   |
|---------|---------------------------|------------|
| Admin   | admin@docbook.com         | admin123   |
| Patient | patient@docbook.com       | patient123 |
| Doctor  | dr..ava.simmons@docbook.com (see seed.js output for the full list) | doctor123 |

## 2. Frontend setup
```bash
cd frontend
npm install
cp .env.example .env      # VITE_API_URL=http://localhost:5000/api
npm run dev                 # starts the app on http://localhost:5173
```

Open http://localhost:5173 — the frontend talks to the backend automatically.------ only for user system

## How the pieces are interlinked
- The **frontend** calls the **backend** exclusively through `frontend/src/api/axios.js`,
  which reads `VITE_API_URL` from `.env` and attaches the JWT from `localStorage` to every request.
- **AuthContext** (`frontend/src/context/AuthContext.jsx`) stores the logged-in user and token,
  and every private page is wrapped in `<PrivateRoute roles={[...]}>` which redirects to `/login`
  if the role doesn't match.
- The **backend** exposes three route groups, all mounted in `server.js`:
  - `/api/auth` — register/login/me
  - `/api/doctors` — public directory + admin management
  - `/api/appointments` — booking, cancelling, status updates, per-role views
- **Role-based access** is enforced server-side in `middleware/auth.js` (`protect` + `authorize`),
  so the API itself refuses cross-role actions even if the frontend route guard is bypassed.
- A doctor **User** account is linked 1:1 to a **Doctor** profile via `doctorProfile` on the User
  model — created automatically at registration, or by an admin from the dashboard.
- Double-booking is prevented at the database level with a partial unique index on
  `(doctor, date, timeSlot)` for active appointments, plus a pre-check in the controller.

## Key user flows
1. **Patient**: Register → browse `/doctors` → open a profile → pick a date → pick a free
   slot → confirm → see it under `/my-appointments` → cancel any time before the visit.
2. **Doctor**: Register as a doctor (or be added by an admin) → `/doctor-dashboard` → confirm,
   complete, or cancel bookings made with them.
3. **Admin**: `/admin` → add/remove doctors from the public directory, view every appointment
   in the system.

## Deploying
- Backend: any Node host (Render, Railway, Fly.io) + MongoDB Atlas for the database.
- Frontend: `npm run build` in `frontend/` produces a static `dist/` folder deployable to
  Vercel, Netlify, or any static host — set `VITE_API_URL` to your deployed backend URL.

**SCREENSHOTS:**
<img width="1920" height="1080" alt="Screenshot (30)" src="https://github.com/user-attachments/assets/efe3a054-9c04-4d40-8864-ee71bda23e3b" />



