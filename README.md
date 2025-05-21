# 🏥 Hospital Management System

[![My Skills](https://skillicons.dev/icons?i=nextjs,react,tailwind,mongodb,nodejs,flask,pyton,docker,gcp,&perline=8)](https://skillicons.dev)

A full-stack hospital management system built using **Next.js** for the frontend and **Node.js/Express** for the backend. It supports patient record handling, account management, and provider coordination. The application is fully containerized using Docker.

---

## 📚 Table of Contents

- [🏥 Hospital Management System](#-hospital-management-system)
  - [📚 Table of Contents](#-table-of-contents)
  - [🚀 Overview](#-overview)
  - [✨ Features](#-features)
  - [📁 Project Structure](#-project-structure)
  - [🛠 Prerequisites](#-prerequisites)
  - [📥 Installation](#-installation)
    - [Local Development](#local-development)
    - [Docker Deployment](#docker-deployment)
  - [🧪 Testing](#-testing)
  - [📝 Author](#-author)

---

## 🚀 Overview

This application demonstrates a complete hospital management workflow:
- Patient management
- Doctor/admin dashboards
- Authentication system
- Modular architecture for ease of maintenance

The frontend is built using **Next.js** with server-side rendering. Backend APIs are handled through integrated Next.js API routes.

---

## ✨ Features

- 🧑‍⚕️ Doctor & Admin Dashboards
- 🧾 Patient Records Management
- 🔐 User Authentication
- 🧪 Unit and API Testing with Jest
- 🐳 Docker-based deployment setup

---

## 📁 Project Structure

```
software-architectures-main/
├── .github/                 ← GitHub Actions workflows
│   └── workflows/
├── docker-compose.yml       ← Docker Compose file
├── next-app/                ← Main application source
│   ├── Dockerfile
│   ├── createAdmin.js       ← Admin setup script
│   ├── jest.config.js
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

---

### Docker Deployment

```bash
docker build -t hospital-app ./next-app
docker run -p 3000:3000 hospital-app
```

Or with Docker Compose:

```bash
docker compose up --build
```

---

## 🧪 Testing

Run unit and API route tests with:

```bash
cd next-app
npm test
```


## 📝 Author

Built for the **Software Architectures** coursework.
