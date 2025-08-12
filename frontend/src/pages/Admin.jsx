import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import toast from 'react-hot-toast';


function Admin() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ role: "", skills: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const self = JSON.parse(localStorage.getItem('user'));
  
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setUsers(data);
        setFilteredUsers(data);
      } else {
        console.error(data.error);
      }
    } catch (err) {
      console.error("Error fetching users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);


  const handleUpdate = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/auth/update-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: editingUser,
            role: formData.role,
            skills: formData.skills
              .split(",")
              .map((skill) => skill.trim())
              .filter(Boolean),
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to update user");
        console
        return;
      }

      setEditingUser(null);
      setFormData({ role: "", skills: "" });
      toast.success("User Info. updated!");
      fetchUsers();
    } catch (err) {
      console.error("Update failed", err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };


  const handleEditClick = (user) => {
    setEditingUser(user.email);
    setFormData({
      role: user.role,
      skills: user.skills?.join(", "),
    });
  };

  const handleSearch = (e) => {
    const query = e.target.value.trim();
    setSearchQuery(query);
    setFilteredUsers(users.filter((user) => user.email.toLowerCase().includes(query)));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <span className="loading loading-spinner loading-xl text-success" />
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
  <Navbar />
  <div className="w-full max-w-5xl mx-auto mt-10 px-4">
    <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
      Admin Panel – Manage Users
    </h1>

    <input
      type="text"
      className="w-full bg-white border border-gray-400 text-gray-800 px-4 py-3 rounded-md mb-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
      placeholder="Search by email"
      value={searchQuery}
      onChange={handleSearch}
    />

    {filteredUsers.map((user) => (
      <div
        key={user._id}
        className={`rounded-lg p-5 mb-6 border shadow-sm flex flex-col md:flex-row md:justify-between md:items-center gap-4
          ${
            user._id === self._id
              ? 'bg-indigo-100 border-indigo-400'
              : 'bg-white border-gray-200'
          }`}
      >
        <div className="flex-1 space-y-1 text-gray-800">
          <p><strong>Email:</strong> {user.email}</p>
          <p className="flex items-center gap-2">
            <strong>Current Role:</strong>
            <span
              className={`inline-block text-md px-2 py-0.5 rounded-md font-medium
                ${
                  user.role === 'admin'
                    ? 'bg-red-100 text-red-700'
                    : user.role === 'moderator'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-blue-100 text-blue-700'
                }`}
            >
              {user.role}
            </span>
          </p>
          <p>
            <strong>Skills:</strong>{" "}
            {user.skills && user.skills.length > 0
              ? user.skills.join(", ")
              : "N/A"}
          </p>
        </div>

        {user._id !== self._id && editingUser === user.email ? (
          <div className="w-full md:w-1/2 space-y-3 text-gray-700">
            <input
              type="text"
              placeholder="Comma-separated skills"
              className="w-full bg-white border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.skills}
              onChange={(e) =>
                setFormData({ ...formData, skills: e.target.value })
              }
            />
            <select
              className="w-full bg-white border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-150"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            >
              <option value="user" className='border border-gray-800'>User</option>
              <option value="moderator">Moderator</option>
              <option value="admin">Admin</option>
            </select>

            <div className="flex justify-end gap-3">
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                onClick={handleUpdate}
              >
                Save
              </button>
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                onClick={() => setEditingUser(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          user._id !== self._id && (
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
              onClick={() => handleEditClick(user)}
            >
              Edit
            </button>
          )
        )}
      </div>
    ))}
  </div>
</div>

  )
}

export default Admin