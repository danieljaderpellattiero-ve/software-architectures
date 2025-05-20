import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import DeleteConfirmationModal from './DeleteConfirmationModal';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ 
    name: '', 
    email: '', 
    role: 'patient', 
    phoneNumber: '', 
    codiceFiscale: '', 
    homeAddress: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      // Validate and clean the data
      const validatedUsers = data.map(user => ({
        _id: user._id || '',
        name: user.name || 'N/A',
        email: user.email || 'N/A',
        role: user.role || 'patient',
        phoneNumber: user.phoneNumber || 'N/A',
        codiceFiscale: user.codiceFiscale || 'N/A',
        homeAddress: user.homeAddress || 'N/A'
      }));
      setUsers(validatedUsers);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateDefaultPassword = (name) => {
    return name.slice(0, 5).toLowerCase() + '123';
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setNewUser(prev => ({
      ...prev,
      name,
      password: name ? generateDefaultPassword(name) : ''
    }));
  };

  const handleAddUser = async () => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error('Failed to add user');
      }

      // Refresh the users list
      await fetchUsers();
      setNewUser({ name: '', email: '', role: 'patient', phoneNumber: '', codiceFiscale: '', homeAddress: '', password: '' });
      setIsAddUserModalOpen(false);
    } catch (err) {
      console.error('Error adding user:', err);
      setError(err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      // Refresh the users list
      await fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
      setError(err.message);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      (filter === 'All' || (user.role && user.role.toLowerCase() === filter.toLowerCase())) &&
      (user.name && user.name.toLowerCase().includes(query.toLowerCase()))
  );

  if (loading) {
    return <div className="p-5 text-center">Loading users...</div>;
  }

  if (error) {
    return <div className="p-5 text-center text-red-500">Error: {error}</div>;
  }

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
            <th className="border border-gray-300 p-3 text-left">Role</th>
            <th className="border border-gray-300 p-3 text-left">Phone Number</th>
            <th className="border border-gray-300 p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, index) => (
            <tr
              key={user._id}
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => setSelectedUser(user)}
            >
              <td className="border border-gray-300 p-3">{index + 1}</td>
              <td className="border border-gray-300 p-3">{user.name}</td>
              <td className="border border-gray-300 p-3">{user.email}</td>
              <td className="border border-gray-300 p-3">{user.role}</td>
              <td className="border border-gray-300 p-3">{user.phoneNumber}</td>
              <td className="border border-gray-300 p-3">
                <button
                  className="bg-red-500 text-white border-none py-1 px-3 rounded-md cursor-pointer hover:bg-red-400 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setUserToDelete(user); 
                    setIsDeleteModalOpen(true);
                  }}
                  disabled={user.role === 'admin'}
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
                  onChange={handleNameChange}
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
                <span>Password <span className="text-red-500">*</span>:</span>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full py-2 px-3 border border-gray-300 rounded-md text-sm pr-10"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </label>
              <label className="grid grid-cols-[150px_auto] items-center font-bold">
                <span>Role <span className="text-red-500">*</span>:</span>
                <select
                  className="w-full py-2 px-3 border border-gray-300 rounded-md text-sm"
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                >
                  <option value="doctor">Doctor</option>
                  <option value="patient">Patient</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
              <label className="grid grid-cols-[150px_auto] items-center font-bold">
                <span>Phone Number <span className="text-red-500">*</span>:</span>
                <input
                  type="tel"
                  className="w-full py-2 px-3 border border-gray-300 rounded-md text-sm"
                  value={newUser.phoneNumber}
                  onChange={(e) => setNewUser({ ...newUser, phoneNumber: e.target.value })}
                />
              </label>
              <label className="grid grid-cols-[150px_auto] items-center font-bold">
                <span>Codice Fiscale <span className="text-red-500">*</span>:</span>
                <input
                  type="text"
                  className="w-full py-2 px-3 border border-gray-300 rounded-md text-sm"
                  value={newUser.codiceFiscale}
                  onChange={(e) => setNewUser({ ...newUser, codiceFiscale: e.target.value })}
                />
              </label>
              <label className="grid grid-cols-[150px_auto] items-center font-bold">
                <span>Home Address <span className="text-red-500">*</span>:</span>
                <input
                  type="text"
                  className="w-full py-2 px-3 border border-gray-300 rounded-md text-sm"
                  value={newUser.homeAddress}
                  onChange={(e) => setNewUser({ ...newUser, homeAddress: e.target.value })}
                />
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
                <strong>Role:</strong> {selectedUser.role}
              </p>
              <p>
                <strong>Phone Number:</strong> {selectedUser.phoneNumber}
              </p>
              <p>
                <strong>Codice Fiscale:</strong> {selectedUser.codiceFiscale}
              </p>
              <p>
                <strong>Home Address:</strong> {selectedUser.homeAddress}
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

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={async () => {
          if (userToDelete) {
            await handleDeleteUser(userToDelete._id);
            setUserToDelete(null);
          }
          setIsDeleteModalOpen(false);
        }}
        userName={userToDelete?.name}
      />
    </div>
  );
};

export default UsersList;