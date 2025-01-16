import React, { useState, useEffect } from "react";

function ManageDoctors() {
  // List of doctors 
  const [doctors, setDoctors] = useState([]);

  // New doctor form
  const [newDoctor, setNewDoctor] = useState({
    firstName: "",
    lastName: "",
    specialty: "",
    codiceFiscale: "",
    phoneNumber: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    // reading all users from localStorage
    const allUsers = JSON.parse(localStorage.getItem("users")) || [];
    // list all users with role = "doctor"
    const doctorsFromStorage = allUsers.filter((user) => user.role === "doctor");
    setDoctors(doctorsFromStorage);
  }, []);

  // edit form
  const handleChange = (e) => {
    setNewDoctor({ ...newDoctor, [e.target.name]: e.target.value });
  };

  // Adding doctor
  const handleAddDoctor = () => {
    // all users from localStorage
    const allUsers = JSON.parse(localStorage.getItem("users")) || [];

    // new object of user
    const doctorUser = {
      ...newDoctor,
      id: Date.now(),   // unique id
      role: "doctor",  // Role = "doctor"
    };

    // Adding to massive
    allUsers.push(doctorUser);

    // Saving again
    localStorage.setItem("users", JSON.stringify(allUsers));

    // Updating list of doctors
    setDoctors((prev) => [...prev, doctorUser]);

    // Cleaning form
    setNewDoctor({
      firstName: "",
      lastName: "",
      specialty: "",
      email: "",
      password: "",
    });
  };

  // Delete doctor
  const handleDelete = (id) => {
    const allUsers = JSON.parse(localStorage.getItem("users")) || [];
    // deleting user with signed ID
    const updatedUsers = allUsers.filter((user) => user.id !== id);
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    // Updating list again
    setDoctors(updatedUsers.filter((user) => user.role === "doctor"));
  };

  return (
    <div>
      <h1>Manage Doctors</h1>
      <ul>
        {doctors.map((doc) => (
          <li key={doc.id}>
            {doc.firstName} {doc.lastName} ({doc.specialty}) / {doc.email}
            <button onClick={() => handleDelete(doc.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <hr />

      <h2>Add New Doctor</h2>
      <div>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={newDoctor.firstName}
          onChange={handleChange}
        />
      </div>

      <div>
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={newDoctor.lastName}
          onChange={handleChange}
        />
      </div>

      <div>
        <input
          type="text"
          name="specialty"
          placeholder="Specialty"
          value={newDoctor.specialty}
          onChange={handleChange}
        />
      </div>

      <div>
        <input
          type="email"
          name="email"
          placeholder="Email (login)"
          value={newDoctor.email}
          onChange={handleChange}
        />
      </div>

      <div>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={newDoctor.password}
          onChange={handleChange}
        />
      </div>

      <button onClick={handleAddDoctor}>Add Doctor</button>
    </div>
  );
}

export default ManageDoctors;
