# 🏥 Hospital Management System

[![My Skills](https://skillicons.dev/icons?i=nextjs,react,tailwind,mongodb,flask,nodejs,py,docker,gcp,&perline=10)](https://skillicons.dev)

A full-stack hospital management system built using **Next.js** for the frontend and **Node.js/Express** for the backend. It supports patient record handling, account management, and provider coordination. The application is fully containerized using Docker.

---

## 📚 Table of Contents

- [🏥 Hospital Management System](#-hospital-management-system)
  - [📚 Table of Contents](#-table-of-contents)
  - [🚀 Overview](#-overview)
  - [✨ Features](#-features)
  - [📱 Pages & Routes](#-pages--routes)
  - [📁 Project Structure](#-project-structure)
  - [🛠 Prerequisites](#-prerequisites)
  - [📥 Installation](#-installation)
  - [👥 User Roles & Access](#-user-roles--access)
  - [📝 Author](#-author)

---

## 🚀 Overview

This application demonstrates a complete hospital management workflow:

- Patient registration and dashboard
- PDF analyzef feature for analyzing and saving medical reports as pdf and in patients personal pdata
- 2FA for patients
- Doctor/admin dashboards
- Authentication system
- Modular architecture for ease of maintenance

The frontend is built using **Next.js** with server-side rendering. Backend APIs are handled through integrated Next.js API routes.

---

## ✨ Features

- 🧑‍⚕️ Doctor & Admin Dashboards
- 🧾 Patient appointments request Management
- 🔐 User Authentication
- 🐳 Docker-based deployment setup
- 📱 Responsive Design
- 🔒 Role-based Access Control

---

## 📱 Pages & Routes

### Public Pages

- `/` - Home page with system overview
- `/login` - User authentication
- `/register` - New user registration

### Patient Pages

- `/patient/dashboard` - Patient's main dashboard
- `/patient/appointments` - Appointment management
- `/patient/records` - Medical records view
- `/patient/profile` - Profile management

### Doctor Pages

- `/doctor/dashboard` - Doctor's main dashboard
- `/doctor/patients` - Patient list and management
- `/doctor/appointments` - Appointment scheduling
- `/doctor/records` - Medical records management
- `/doctor/profile` - Profile settings

### Admin Pages

- `/admin/dashboard` - Admin control panel
- `/admin/users` - User management
- `/admin/doctors` - Doctor management
- `/admin/settings` - System settings

---

## 📁 Project Structure

```
software-architectures-main/
├── .github/                 ← GitHub Actions workflows
│   └── workflows/
├── docker-compose.yml       ← Docker Compose file
├── next-app/                ← Main application source
│   ├── Dockerfile
│   ├── package.json
│   ├── app/
│   │   ├── layout.jsx
│   │   ├── page.jsx         ← Home Page
│   │   ├── adminDashboard/  ← Admin view
│   │   ├── doctorDashboard/ ← Doctor view
│   │   └── api/
│   │       ├── auth/        ← Auth routes
│   │       ├── admin/       ← Admin-specific APIs
│   │       └── users/       ← User APIs and tests
│   ├── components/          ← Shared components
│   ├── lib/                 ← Utility libraries
│   └── public/              ← Static files
```

---

## 🛠 Prerequisites

- [Node.js](https://nodejs.org/) v16+
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

---

## 📥 Installation

### Local Development

```bash
git clone https://github.com/your-username/hospital-management-system.git
cd software-architectures-main/next-app
npm install
npm run dev
```

Visit the app at [http://localhost:3000](http://localhost:3000)

### Docker Deployment

```bash
docker compose up --build
```

The application will be available at [http://localhost:8080](http://localhost:8080)

---

## 👥 User Roles & Access

### Patient Access

1. Register a new account
2. Complete your profile information
3. Access your dashboard, appointments, and medical records

### Admin Access

- **Default Credentials:**
  - Email: admin@admin.com
  - Password: admin123
- Manage all users and doctors
- Configure system settings
- Monitor system activity

### Doctor Access

1. Admin creates doctor account
2. Doctor logs in with provided credentials
3. Access patient management and medical records

---

<div align="center">
  <sub>Hospital Management System  Built for software architecture course</sub>
</div>

---
