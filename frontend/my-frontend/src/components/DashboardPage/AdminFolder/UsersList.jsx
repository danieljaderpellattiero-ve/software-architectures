import React, { useState } from 'react';
import './UsersList.css'; // Importing the CSS file

const UsersList = () => {
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', type: 'doctor', phone: '+1 123 456 7890', dob: '01-01-1990', country: 'USA', city: 'New York' }
    // Add more users here
  ];

  const [query, setQuery] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', type: 'doctor' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const addUser = () => {
    console.log('New User:', newUser);
    setIsPopupOpen(false);
  };

  const openModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
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
            <button className="delete-button">Delete User ❌</button>
          </div>
        </div>
      ))}

      <button className="create-user" onClick={togglePopup}>
        Add User
      </button>

      {isPopupOpen && (
        <>
          <div className="overlay" onClick={togglePopup}></div>
          <div className="popup">
            <div className="popup-content">
              <h3>Add New User</h3>
              <div className="name">
                <label className="name">
                  Name:
                  <input
                    type="text"
                    name="name"
                    value={newUser.name}
                    onChange={handleInputChange}
                  />
                </label>
              </div>

              <div className="email">
                <label>
                  Email:
                  <input
                    type="email"
                    name="email"
                    value={newUser.email}
                    onChange={handleInputChange}
                  />
                </label>
              </div>

              <div className="password">
                <label>
                  Password:
                  <input
                    type="password"
                    name="password"
                    value={newUser.password}
                    onChange={handleInputChange}
                  />
                </label>
              </div>

              <label>
                Type:
                <select
                  name="type"
                  value={newUser.type}
                  onChange={handleInputChange}
                >
                  <option value="doctor">Doctor</option>
                  <option value="patient">Patient</option>
                </select>
              </label>
              <div className="popup-actions">
                <button onClick={addUser}>Save</button>
                <button onClick={togglePopup}>Cancel</button>
              </div>
            </div>
          </div>
        </>
      )}

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
    </div>
  );
};

export default UsersList;
