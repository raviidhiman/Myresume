# ResuméOS — Professional Resume Website

A full-stack MERN application featuring a LaTeX-style public resume, OTP-based owner authentication, and a dynamic edit dashboard.

---

## ✨ Features

| Feature | Details |
|---|---|
| **Public Resume** | Instantly visible, no login required |
| **LaTeX-style Design** | EB Garamond serif font, minimal B&W, academic layout |
| **OTP Authentication** | 6-digit email OTP → JWT session |
| **Edit Dashboard** | Add/edit/delete all resume sections |
| **PDF Export** | Client-side PDF via jsPDF + html2canvas |
| **Print-ready** | A4-optimized print CSS |
| **Section Reordering** | Drag sections up/down in dashboard |
| **Responsive** | Fully mobile-optimized |

---

## 🗂 Project Structure

```
resume-app/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.js
│   │   ├── context/
│   │   │   ├── AuthContext.js
│   │   │   └── ResumeContext.js
│   │   ├── pages/
│   │   │   ├── ResumePage.js      # Public resume (LaTeX-style)
│   │   │   ├── LoginPage.js       # Email input
│   │   │   ├── OTPPage.js         # OTP verification
│   │   │   └── DashboardPage.js   # Edit dashboard
│   │   ├── utils/
│   │   │   └── api.js             # Axios instance
│   │   ├── App.js
│   │   └── index.css              # All styles
│   └── package.json
│
└── server/                  # Express backend
    ├── models/
    │   ├── OTP.js
    │   └── Resume.js
    ├── routes/
    │   ├── auth.js            # /auth/send-otp, /auth/verify-otp
    │   └── resume.js          # GET /resume, PUT /resume
    ├── middleware/
    │   └── auth.js            # JWT middleware
    ├── utils/
    │   ├── mailer.js          # Nodemailer
    │   └── otp.js             # OTP generation
    ├── index.js               # Entry point
    └── package.json
```

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/resume-app.git
cd resume-app
```

### 2. Install dependencies
```bash
npm run install:all
# OR manually:
cd server && npm install
cd ../client && npm install
```

### 3. Configure environment variables

**Server** — create `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/resumedb
JWT_SECRET=your_very_long_random_secret_here
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password_16_chars
OWNER_EMAIL=your_email@gmail.com
CLIENT_URL=http://localhost:3000
```

**Client** — create `client/.env`:
```env
REACT_APP_API_URL=http://localhost:5000
```

### 4. Gmail App Password Setup
1. Go to Google Account → Security
2. Enable 2-Factor Authentication
3. Go to **App Passwords** → Select "Mail" → Generate
4. Use the 16-character password as `EMAIL_PASS`

### 5. Run in development
```bash
# Terminal 1 — backend
cd server && npm run dev

# Terminal 2 — frontend
cd client && npm start
```

Visit `http://localhost:3000`

---

## 📡 API Reference

### Authentication

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/auth/send-otp` | POST | ❌ | Send OTP to owner email |
| `/auth/verify-otp` | POST | ❌ | Verify OTP, returns JWT |
| `/auth/verify-token` | GET | Bearer | Validate existing JWT |

### Resume

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/resume` | GET | ❌ | Get public resume data |
| `/resume` | PUT | ✅ Bearer | Update resume data |
| `/resume/reset` | POST | ✅ Bearer | Reset to default data |

### Example: Send OTP
```bash
curl -X POST http://localhost:5000/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "owner@example.com"}'
```

### Example: Get Resume
```bash
curl http://localhost:5000/resume
```

---

## 🚢 Deployment

### Backend → Render.com
1. Push code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect repo → Set root dir to `server`
4. Build: `npm install` | Start: `node index.js`
5. Add all environment variables from `.env`

### Frontend → Vercel
1. Go to [vercel.com](https://vercel.com) → New Project
2. Import repo → Set root to `client`
3. Framework: Create React App
4. Add env var: `REACT_APP_API_URL=https://your-render-url.onrender.com`

---

## 🔐 Security Features

- **Owner-only login**: Only `OWNER_EMAIL` can authenticate
- **OTP expiry**: 5-minute TTL with MongoDB auto-deletion
- **Attempt limiting**: Max 5 wrong OTP attempts before invalidation
- **JWT expiry**: 24-hour session tokens
- **OTP single-use**: Deleted immediately after successful verification
- **CORS protection**: Whitelist-only frontend origins

---

## 🎨 Customizing the Resume

The default resume data is seeded in `server/routes/resume.js` inside `defaultResume`. Edit this object to pre-populate your real information before first deployment.

After deployment, use the **Edit Dashboard** (login → /dashboard) to update everything dynamically without touching code.

---

## 📦 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6 |
| Styling | Custom CSS (LaTeX-inspired), EB Garamond font |
| State | React Context API |
| HTTP Client | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + Nodemailer OTP |
| PDF Export | jsPDF + html2canvas |
| Notifications | react-hot-toast |

---

## 📄 License

MIT — free to use and customize for your personal resume.
