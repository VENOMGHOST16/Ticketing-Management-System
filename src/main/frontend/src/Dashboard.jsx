import React from "react";

export default function Dashboard({ user, onLogout }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-800 text-white p-8">
      <h1 className="text-4xl font-bold mb-6">Welcome, {user.email} 👋</h1>
      <p className="mb-4 text-white">Your role: {user.roles}</p>

      <button
        onClick={onLogout}
        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}
