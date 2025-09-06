import React, { useState } from "react";
import { motion } from "framer-motion";
// 🔹 CHANGE: import the addUser service
import { addUser } from "../../services/authService"; // adjust the path as per your project

export default function AdminAddUser() {
  const [form, setForm] = useState({ name: "", email: "", role: "ROLE_USER", password: "" });

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  // 🔹 CHANGE: make handleSubmit async and call backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const savedUser = await addUser(form.name, form.email, form.password, form.role); // 🔹 CHANGE
      console.log(savedUser)
      alert(
        `✅ User Added:\nName: ${savedUser.user.name}\nEmail: ${savedUser.user.email}\nRole: ${savedUser.user.role.roleName}`
      ); // 🔹 CHANGE
      setForm({ name: "", email: "", role: "ROLE_USER", password: "" }); // reset form
    } catch (err) {
      alert("❌ Failed to add user: " + err.message); // 🔹 CHANGE
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-gray-100 rounded-2xl shadow-xl p-8 w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Add New User
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Enter full name"
              required
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="Enter email"
              required
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enter Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="Enter password"
              required
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              value={form.role}
              onChange={(e) => handleChange("role", e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ROLE_USER">User</option>
              <option value="ROLE_AGENT">Agent</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg shadow-md hover:bg-green-700 transition-colors duration-300 ease-in-out transform hover:scale-105"
          >
            Add User
          </button>
        </form>
      </motion.div>
    </div>
  );
}
