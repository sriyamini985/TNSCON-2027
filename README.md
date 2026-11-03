# TNSCON 2027 — Official Conference Portal

[![React 19](https://img.shields.io/badge/React-19.2-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.1-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.3-38B2AC.svg)](https://tailwindcss.com/)
[![Node Express](https://img.shields.io/badge/Node_Express-5001-green.svg)](https://expressjs.com/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-ORM-2D3748.svg)](https://www.prisma.io/)

**TNSCON 2027** is the official web portal and secretariat management system for the **11th Annual Conference of Telangana Neurosciences Society**, scheduled for **12th – 14th March 2027** at the **Conference Hall, Rajiv Gandhi Terminal, Begumpet Airport, Hyderabad, Telangana, India**.

---

## 🌟 Features

* **Official Brand Identity:** Logo-based color system with Primary Blue (`#003399`), Gold Accent (`#D49B00`), and Universal Warm Ivory (`#FAF5ED`).
* **Interactive Hero & Neural Atlas:** High-resolution illustrated background integrating Hyderabad Charminar heritage with 3D neural brain cortex visualizer.
* **Delegate Registration System:** 3-step registration flow following the ASSTCON pattern with automated duplicate checking, UTR/payment verification, and instant provisional PDF receipt generator.
* **Scientific Abstract Portal:** IMRaD structured submission portal supporting Award Paper, Free Paper, and E-Poster categories with strict 250-word validation, DOC/DOCX upload, and real-time tracking.
* **Admin Secretariat Dashboard:** JWT-authenticated dashboard with real-time analytics, status verification, Excel/CSV/RegXperts roster exports, and badge printing.
* **Mobile-First Responsive Design:** Fully responsive layout with custom mobile hamburger drawer, touch-friendly tap targets, and scroll-locked modals.
* **SEO & Social Metadata:** Pre-configured OpenGraph tags, Twitter cards, JSON-LD `MedicalEvent` schema, `sitemap.xml`, and `robots.txt`.

---

## 🛠 Tech Stack

### Frontend
* **Core:** React 19, TypeScript, React Router 7
* **Build Tool:** Vite 8
* **Styling:** Tailwind CSS 4, Lucide React Icons
* **PDF Engine:** jsPDF, html2canvas

### Backend
* **Runtime:** Node.js, Express.js
* **Database ORM:** Prisma ORM (MySQL / SQLite compatible)
* **Authentication:** JWT (JSON Web Tokens), Bcrypt.js
* **Uploads:** Multer with file type & extension filtering
* **Email:** Nodemailer (SMTP with fallback simulation)
* **Data Processing:** SheetJS / XLSX for automated roster exports

---

## 🚀 Getting Started

### 1. Prerequisites
* Node.js v18+ or v20+
* MySQL or MariaDB (for production)
* Git

### 2. Installation

Clone the repository:
```bash
git clone https://github.com/sriyamini985/TNSCON-2027.git
cd TNSCON-2027
```

Install frontend dependencies:
```bash
npm install
```

Install backend dependencies:
```bash
cd server
npm install
cd ..
```

### 3. Environment Configuration

Copy the example environment files:

```bash
# Frontend
cp .env.example .env

# Backend
cp server/.env.example server/.env
```

Configure `server/.env` with your database and email credentials:
```env
PORT=5001
DATABASE_URL="mysql://username:password@localhost:3306/tnscon2027_db"
JWT_SECRET="your_secure_jwt_secret"
ADMIN_USER="tnscon"
ADMIN_PASS="your_admin_password"
SMTP_HOST="smtp.example.com"
SMTP_PORT=465
SMTP_USER="info@tnscon2027hyd.com"
SMTP_PASS="your_smtp_password"
```

Initialize database tables:
```bash
cd server
npx prisma db push
cd ..
```

### 4. Running the Development Servers

Start the backend server (Port 5001):
```bash
node server/src/server.js
```

Start the frontend development server (Port 5173):
```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 📦 Production Build

Compile the production frontend assets:
```bash
npm run build
```

The optimized static files will be generated in the `dist/` directory, ready to be served by Nginx or any CDN.

---

## 🏛 Organizing Secretariat

* **Organizing Chairman:** Dr. R T S Naik
* **Organizing Secretary:** Dr. Chandrakanth Tapsi
* **Scientific Committee (Neurosurgery):** Dr. N Pratap Kumar
* **Scientific Committee (Neurology):** Dr. Subbaiah Choudary
* **Venue:** Rajiv Gandhi Terminal, Begumpet Airport, Hyderabad
* **Official Portal:** [www.tnscon2027hyd.com](https://www.tnscon2027hyd.com)

---

## 📄 License

Proprietary academic software for Telangana Neurosciences Society (TNSCON 2027). All rights reserved.
