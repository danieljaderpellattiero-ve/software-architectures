// UsersList.js
import React, { useState } from 'react';
import './UsersList.css';

const UsersList = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', type: 'Doctor', dob: '1990-01-01' },
  ]);

  const [query, setQuery] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({ name: '', email: '', type: 'Doctor', dob: '' });

  const togglePopup = () => setIsPopupOpen(!isPopupOpen);

  const openModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const addUser = () => {
    setUsers([...users, { ...newUser, id: users.length + 1 }]);
    setIsPopupOpen(false);
  };

  const deleteUser = (id) => setUsers(users.filter((user) => user.id !== id));

  return (
    <div className="users-list">
      <div className="controls">
        <button className="add-user" onClick={togglePopup}>Add User</button>
        <select
          className="user-type"
          onChange={(e) => setQuery(e.target.value)}
        >
          <option value="">All</option>
          <option value="Doctor">Doctor</option>
          <option value="Patient">Patient</option>
        </select>
        <input
          className="search"
          type="text"
          placeholder="Search by name"
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="user-cards">
        {users
          .filter(
            (user) =>
              (!query || user.type.toLowerCase().includes(query.toLowerCase())) &&
              user.name.toLowerCase().includes(query.toLowerCase())
          )
          .map((user) => (
            <div key={user.id} className="user-card" onClick={() => openModal(user)}>
              <div className="user-info">
                <strong className="user-name">{user.name}</strong>
                <p className="user-email">{user.email}</p>
                <p className="user-type">{user.type}</p>
              </div>
              <button className="delete-user" onClick={(e) => { e.stopPropagation(); deleteUser(user.id); }}>
                Delete User ❌
              </button>
            </div>
          ))}
      </div>

      {isPopupOpen && (
        <div className="modal-overlay" onClick={togglePopup}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Add New User</h3>
            <label>
              Name:
              <input type="text" name="name" value={newUser.name} onChange={handleInputChange} />
            </label>
            <label>
              Email:
              <input type="email" name="email" value={newUser.email} onChange={handleInputChange} />
            </label>
            <label>
              Date of Birth:
              <input type="date" name="dob" value={newUser.dob} onChange={handleInputChange} />
            </label>
            <label>
              Type:
              <select name="type" value={newUser.type} onChange={handleInputChange}>
                <option value="Doctor">Doctor</option>
                <option value="Patient">Patient</option>
              </select>
            </label>
            <div className="modal-actions">
              <button onClick={addUser}>Save</button>
              <button onClick={togglePopup}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && selectedUser && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>User Information</h3>
            <p><strong>Name:</strong> {selectedUser.name}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Type:</strong> {selectedUser.type}</p>
            <p><strong>Date of Birth:</strong> {selectedUser.dob}</p>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersList;
