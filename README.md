🖨️ ATP — Automated Printing Kiosk Platform

ATP is a full-stack platform being built for an automated / self-service printing kiosk.
The goal of ATP is to handle user access, job submission, and kiosk-side control in a clean, secure, and scalable way.

At the current stage, the project focuses on user authentication, which is a foundational requirement before enabling paid printing, job tracking, and kiosk automation.

🧠 Why ATP?

Printing kiosks operate 24/7, often without supervision.
That makes identity, access control, and traceability extremely important.

ATP is designed to:

Identify users reliably

Track actions (print jobs, payments, usage)

Act as a backend control layer for multiple kiosks

This repository contains the core platform code, not the kiosk hardware logic yet.

✅ Current Milestone: User Authentication (Completed)

The first completed milestone is secure user authentication using Google OAuth 2.0.

What is done:

Users can sign in using their Google account

Google ID tokens are verified on the backend

ATP issues its own JWT token

Users are stored in the database

Frontend routes are protected using authentication

This ensures:

No anonymous kiosk usage

No password storage by ATP

Easy onboarding for users

🏗 Tech Stack
Frontend

React

Vite (for fast development)

Google Identity Services

React Router

JWT stored client-side

Backend

Node.js

Express.js

Google OAuth2 verification

JWT-based session handling

Database-backed user storage

CORS-enabled API for kiosk / web clients

📁 Project Structure
ATP/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── auth.controller.js
│   │   ├── services/
│   │   │   └── auth.service.js
│   │   └── app.js
│   ├── package.json
│   ├── .env.example
│   └── package-lock.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .gitignore
│
└── README.md

🔐 Authentication Flow (Implemented)

User signs in using Google Sign-In

Frontend receives a Google ID token

ID token is sent to ATP backend

Backend verifies token with Google

ATP:

Creates or fetches the user

Issues an internal ATP JWT

JWT is used to access protected pages

This JWT will later be reused for:

Print job submission

Payment verification

Kiosk access validation

⚙️ Environment Setup
Backend (backend/.env)
PORT=5000
GOOGLE_CLIENT_ID=your_google_client_id
JWT_SECRET=your_jwt_secret
DATABASE_URL=your_database_url


.env files are ignored and not committed.

▶️ Running Locally
Backend
cd backend
npm install
npm run dev


Runs at:

http://localhost:5000

Frontend
cd frontend
npm install
npm run dev


Runs at:

http://localhost:5173

🧪 Current Status

✅ Google OAuth2 login

✅ JWT-based authentication

✅ Protected frontend routes

✅ User persistence in database

🚧 Print job logic — pending

🚧 Payment & kiosk integration — planned

🔭 Planned Features (Roadmap)

Print job upload & queue management

File validation & size limits

Payment integration (UPI / cards)

Kiosk-side authentication using ATP tokens

Admin dashboard for kiosk monitoring

Usage analytics & logging

👨‍💻 Author

Arjun
Final-year Electronics & Communication Engineering student

ATP is a learning-driven project built with the intent of understanding real-world system design, backend architecture, and platform thinking, starting from authentication and moving toward full kiosk automation.