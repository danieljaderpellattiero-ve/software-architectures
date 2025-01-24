import React, { useState } from "react";
import "./UsersList.css"; // Importing the CSS file

const UsersList = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      type: "doctor",
      phone: "+1 123 456 7890",
      dob: "01-01-1990",
      country: "USA",
      city: "New York",
    },
    // Add more users here
  ]);

  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    type: "doctor",
    phone: "",
    dob: "",
    country: "",
    city: "",
  });

  const openModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const deleteUser = (userId) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
  };

  const toggleAddPopup = () => {
    setIsAddPopupOpen(!isAddPopupOpen);
  };

  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const addUser = () => {
    setUsers((prevUsers) => [
      ...prevUsers,
      { ...newUser, id: Math.random() },
    ]);
    setIsAddPopupOpen(false);
  };

  return (
    <div className="users-list">
      <div className="filters">
        <div className="usertype">
          <label htmlFor="select">User Type: </label>
          <select className="select">
            <option value="doctor">Doctor</option>
            <option value="patient">Patient</option>
          </select>
        </div>

        <div className="search">
          <label htmlFor="search">Search: </label>
          <input type="text" onChange={(e) => setQuery(e.target.value)} />
        </div>
      </div>

      {users.map((user) => (
        <div key={user.id} className="user-card" onClick={() => openModal(user)}>
          <div className="user-info">
            <span className="user-name">{user.name}</span>
            <span className="user-email">Email: {user.email}</span>
          </div>
          <div className="user-actions">
            <button
              className="delete-button"
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the modal
                deleteUser(user.id);
              }}
            >
              Delete User ❌
            </button>
          </div>
        </div>
      ))}

      <button className="create-user" onClick={toggleAddPopup}>
        Add User
      </button>

      {isModalOpen && selectedUser && (
        <>
          <div className="overlay" onClick={closeModal}></div>
          <div className="modal">
            <div className="modal-content">
              <h3>User Information</h3>
              <table>
                <tbody>
                  <tr>
                    <td>Name:</td>
                    <td>{selectedUser.name}</td>
                  </tr>
                  <tr>
                    <td>Email:</td>
                    <td>{selectedUser.email}</td>
                  </tr>
                  <tr>
                    <td>Phone:</td>
                    <td>{selectedUser.phone}</td>
                  </tr>
                  <tr>
                    <td>Date of Birth:</td>
                    <td>{selectedUser.dob}</td>
                  </tr>
                  <tr>
                    <td>Country:</td>
                    <td>{selectedUser.country}</td>
                  </tr>
                  <tr>
                    <td>City:</td>
                    <td>{selectedUser.city}</td>
                  </tr>
                </tbody>
              </table>
              <button onClick={closeModal} className="close-modal">
                Close
              </button>
            </div>
          </div>
        </>
      )}

      {isAddPopupOpen && (
        <>
          <div className="overlay" onClick={toggleAddPopup}></div>
          <div className="popup">
            <div className="popup-content">
              <h3>Add New User</h3>
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={newUser.name}
                  onChange={handleAddInputChange}
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleAddInputChange}
                />
              </label>
              <label>
                Password:
                <input
                  type="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleAddInputChange}
                />
              </label>
              <label>
                Phone:
                <input
                  type="text"
                  name="phone"
                  value={newUser.phone}
                  onChange={handleAddInputChange}
                />
              </label>
              <label>
                Date of Birth:
                <input
                  type="date"
                  name="dob"
                  value={newUser.dob}
                  onChange={handleAddInputChange}
                />
              </label>
              <label>
                Country:
                <input
                  type="text"
                  name="country"
                  value={newUser.country}
                  onChange={handleAddInputChange}
                />
              </label>
              <label>
                City:
                <input
                  type="text"
                  name="city"
                  value={newUser.city}
                  onChange={handleAddInputChange}
                />
              </label>
              <label>
                Type:
                <select
                  name="type"
                  value={newUser.type}
                  onChange={handleAddInputChange}
                >
                  <option value="doctor">Doctor</option>
                  <option value="patient">Patient</option>
                </select>
              </label>
              <div className="popup-actions">
                <button onClick={addUser}>Save</button>
                <button onClick={toggleAddPopup}>Cancel</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UsersList;
