import React, { useEffect, useState } from "react";
import { getAllUsers,deleteUser } from "../../services/authService"; // import API functions

export default function AdminAllUsers() {
  const [users, setUsers] = useState([]);
  const [modal, setModal] = useState({ isOpen: false, userId: null, newRole: "" });

  // Fetch all users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        // Map API response to frontend format
        console.log(data)
        const formatted = data.map((user) => ({
          id: user.id,
          email: user.email,
          role: user.role?.roleName || "ROLE_USER",
          status: "active", // default (you can add status in backend later if needed)
        }));
        setUsers(formatted);
      } catch (err) {
        console.error("❌ Failed to fetch users:", err);
      }
    };
    fetchUsers();
  }, []);

  const handleRoleChange = (userId, newRole) => {
    setModal({ isOpen: true, userId, newRole });
  };

  const confirmChange = () => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === modal.userId ? { ...user, role: modal.newRole } : user
      )
    );
    setModal({ isOpen: false, userId: null, newRole: "" });
  };

  const cancelChange = () => {
    setModal({ isOpen: false, userId: null, newRole: "" });
  };

  // Delete user handler
  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      console.log(`✅ User ${userId} deleted`);
    } catch (err) {
      console.error("❌ Failed to delete user:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">All Users</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white !shadow-lg rounded-xl p-5 flex flex-col justify-between hover:shadow-2xl transition duration-300"
          >
            <div className="flex justify-between items-start">
              {/* Status */}
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  user.status === "active"
                    ? "!bg-green-200 !text-green-800"
                    : "!bg-red-200 !text-red-800"
                }`}
              >
                {user.status.toUpperCase()}
              </span>

              {/* Delete button */}
              <button
                onClick={() => handleDelete(user.id)}
                className="text-red-500 hover:text-red-700 font-bold text-lg"
                title="Delete User"
              >
                ✕
              </button>
            </div>

            {/* Email */}
            <p className="mt-4 text-lg font-semibold text-gray-900">{user.email}</p>

            {/* Role Dropdown */}
            <div className="mt-4">
              <label className="block mb-1 font-medium text-gray-700">Role</label>
              <select
                value={user.role}
                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 !text-gray-900"
              >
                <option value="ROLE_USER">User</option>
                <option value="ROLE_ADMIN">Admin</option>
                <option value="ROLE_AGENT">Agent</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Confirm Role Change
            </h3>
            <p className="mb-6 text-gray-700">
              Are you sure you want to change the role to{" "}
              <span className="font-semibold">{modal.newRole}</span>?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelChange}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmChange}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
