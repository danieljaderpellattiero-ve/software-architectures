import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LoginPage from "./components/Login/LoginPage"; // Импорт компонента
import RegisterPage from "./components/RegisterPage/RegisterPage";
import AdminDashboard from "./components/DashboardPage/AdminFolder/AdminDashboard";
import DoctorDashboard from "./components/DashboardPage/DoctorDashboard";
import PatientDashboard from "./components/DashboardPage/PatientFolder/PatientDashboard";

function App() {
  localStorage.setItem(
    "users",
    JSON.stringify([
      {
        email: "admin@mail.ru",
        password: "admin",
        role: "admin",
      },
      {
        email: "doctor@mail.ru",
        password: "doctor",
        role: "doctor",
      },
      {
        email: "patient@mail.ru",
        password: "patient",
        role: "patient",
      },
    ])
  );

  return (
    <Router>
      <nav>
        {/* <Link to="/">Login</Link> */}
        {/* <Link to="/login">Login</Link>
        <Link to="/register">Sign up</Link> */}
      </nav>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/DoctorDashboard" element={<DoctorDashboard />} />
        <Route path="/PatientDashboard" element={<PatientDashboard />} />

      </Routes>
    </Router>
  );
}

export default App;
