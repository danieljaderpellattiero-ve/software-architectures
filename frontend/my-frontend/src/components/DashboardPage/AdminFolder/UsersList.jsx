import React, { useState } from 'react';
import './UsersList.css';

const UsersList = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', type: 'Doctor', dob: '1990-01-01' },
  ]);
  const [newUser, setNewUser] = useState({ name: '', email: '', type: 'Doctor', dob: '' });
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleAddUser = () => {
    if (newUser.name && newUser.email && newUser.dob) {
      setUsers([...users, { id: users.length + 1, ...newUser }]);
      setNewUser({ name: '', email: '', type: 'Doctor', dob: '' });
      setIsAddUserModalOpen(false);
    }
  };

  const handleDeleteUser = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const filteredUsers = users.filter(
    (user) =>
      (filter === 'All' || user.type === filter) &&
      user.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="users-list">
      <button className="add-user-button" onClick={() => setIsAddUserModalOpen(true)}>
        Add User
      </button>

      <div className="filters">
        <select
          className="filter-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Doctor">Doctor</option>
          <option value="Patient">Patient</option>
        </select>

        <input
          type="text"
          className="search-input"
          placeholder="Search by name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <table className="users-table">
        <thead>
          <tr>
            <th>№</th>
            <th>Name</th>
            <th>Email</th>
            <th>Type</th>
            <th>Date of Birth</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, index) => (
            <tr
              key={user.id}
              className="user-row"
              onClick={() => setSelectedUser(user)}
            >
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.type}</td>
              <td>{user.dob}</td>
              <td>
                <button
                  className="delete-user-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteUser(user.id);
                  }}
                >
                  Delete User
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isAddUserModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddUserModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Add New User</h3>
            <div className="modal-content">
              <label>
                Name *:
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
              </label>
              <label>
                Email *:
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </label>
              <label>
                Date of Birth *:
                <input
                  type="date"
                  value={newUser.dob}
                  onChange={(e) => setNewUser({ ...newUser, dob: e.target.value })}
                />
              </label>
              <label>
                Type *:
                <select
                  value={newUser.type}
                  onChange={(e) => setNewUser({ ...newUser, type: e.target.value })}
                >
                  <option value="Doctor">Doctor</option>
                  <option value="Patient">Patient</option>
                </select>
              </label>
            </div>
            <div className="modal-actions">
              <button onClick={handleAddUser}>Save</button>
              <button onClick={() => setIsAddUserModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>User Information</h3>
            <div className="user-info-modal">
              <p><strong>Name:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Type:</strong> {selectedUser.type}</p>
              <p><strong>Date of Birth:</strong> {selectedUser.dob}</p>
            </div>
            <button
              className="close-button"
              onClick={() => setSelectedUser(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersList;
