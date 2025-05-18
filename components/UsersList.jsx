import React, { useState } from 'react';

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
    <div className="p-5 font-sans pl-[120px]">
      <button
        className="bg-purple-700 text-white border-none py-2 px-5 rounded-lg cursor-pointer text-lg hover:bg-purple-600 mb-5"
        onClick={() => setIsAddUserModalOpen(true)}
      >
        Add User
      </button>

      <div className="flex items-center gap-2 mb-5">
        <select
          className="py-2 px-3 text-sm border border-gray-300 rounded-md"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Doctor">Doctor</option>
          <option value="Patient">Patient</option>
        </select>

        <input
          type="text"
          className="py-2 px-3 text-sm border border-gray-300 rounded-md w-full"
          placeholder="Search by name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <table className="w-full border-collapse mt-5 bg-white shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-100 font-bold">
            <th className="border border-gray-300 p-3 text-left">№</th>
            <th className="border border-gray-300 p-3 text-left">Name</th>
            <th className="border border-gray-300 p-3 text-left">Email</th>
            <th className="border border-gray-300 p-3 text-left">Type</th>
            <th className="border border-gray-300 p-3 text-left">Date of Birth</th>
            <th className="border border-gray-300 p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, index) => (
            <tr
              key={user.id}
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => setSelectedUser(user)}
            >
              <td className="border border-gray-300 p-3">{index + 1}</td>
              <td className="border border-gray-300 p-3">{user.name}</td>
              <td className="border border-gray-300 p-3">{user.email}</td>
              <td className="border border-gray-300 p-3">{user.type}</td>
              <td className="border border-gray-300 p-3">{user.dob}</td>
              <td className="border border-gray-300 p-3">
                <button
                  className="bg-red-500 text-white border-none py-1 px-3 rounded-md cursor-pointer hover:bg-red-400 text-sm"
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
        <div
          className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center z-50"
          onClick={() => setIsAddUserModalOpen(false)}
        >
          <div
            className="bg-white p-8 rounded-xl w-[500px] shadow-lg flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-center text-xl font-semibold mb-4">Add New User</h3>
            <form className="flex flex-col gap-3">
              <label className="grid grid-cols-[150px_auto] items-center font-bold">
                <span>Name <span className="text-red-500">*</span>:</span>
                <input
                  type="text"
                  className="w-full py-2 px-3 border border-gray-300 rounded-md text-sm"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
              </label>
              <label className="grid grid-cols-[150px_auto] items-center font-bold">
                <span>Email <span className="text-red-500">*</span>:</span>
                <input
                  type="email"
                  className="w-full py-2 px-3 border border-gray-300 rounded-md text-sm"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </label>
              <label className="grid grid-cols-[150px_auto] items-center font-bold">
                <span>Date of Birth <span className="text-red-500">*</span>:</span>
                <input
                  type="date"
                  className="w-full py-2 px-3 border border-gray-300 rounded-md text-sm"
                  value={newUser.dob}
                  onChange={(e) => setNewUser({ ...newUser, dob: e.target.value })}
                />
              </label>
              <label className="grid grid-cols-[150px_auto] items-center font-bold">
                <span>Type <span className="text-red-500">*</span>:</span>
                <select
                  className="w-full py-2 px-3 border border-gray-300 rounded-md text-sm"
                  value={newUser.type}
                  onChange={(e) => setNewUser({ ...newUser, type: e.target.value })}
                >
                  <option value="Doctor">Doctor</option>
                  <option value="Patient">Patient</option>
                </select>
              </label>
            </form>
            <div className="flex justify-center gap-4 mt-5">
              <button
                className="bg-purple-800 text-white border-none py-2 px-5 rounded-lg cursor-pointer text-lg hover:bg-purple-700"
                onClick={handleAddUser}
              >
                Save
              </button>
              <button
                className="bg-red-500 text-white border-none py-2 px-5 rounded-lg cursor-pointer text-lg hover:bg-red-400"
                onClick={() => setIsAddUserModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedUser && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center z-50"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="bg-white p-8 rounded-xl w-[500px] shadow-lg flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-center text-xl font-semibold mb-4">User Information</h3>
            <div className="grid grid-cols-[150px_auto] gap-y-2">
              <p>
                <strong>Name:</strong> {selectedUser.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p>
                <strong>Type:</strong> {selectedUser.type}
              </p>
              <p>
                <strong>Date of Birth:</strong> {selectedUser.dob}
              </p>
            </div>
            <button
              className="bg-red-500 text-white border-none py-2 px-5 rounded-lg cursor-pointer text-lg hover:bg-red-400 mt-5 block mx-auto"
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