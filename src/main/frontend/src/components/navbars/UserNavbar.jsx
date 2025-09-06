import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";

export default function UserNavbar({ username, onLogout }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    onLogout();
    navigate("/"); // redirect to login
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-blue-700 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Left: Logout + Welcome */}
          <div className="flex items-center space-x-3">
            {/* Small logout button */}
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 !text-white px-2 py-1 rounded-md text-sm font-medium transition-colors"
            >
              Logout
            </button>
            <span className="!text-white font-semibold text-lg">
              Welcome, <span className="!text-green-400">{username}</span>
            </span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link
              to="/raise-ticket"
              className="!text-white text-lg font-medium hover:!text-green-400 hover:underline transition-all duration-200"
            >
              Raise Ticket
            </Link>
            <Link
              to="/profile"
              className="!text-white text-lg font-medium hover:!text-green-400 hover:underline transition-all duration-200"
            >
              Profile
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="!text-white hover:!text-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 p-2 rounded-md"
            >
              {isOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-gradient-to-r from-gray-900 to-blue-700 shadow-lg px-4 pt-2 pb-4 space-y-2 animate-slide-down">
          <Link
            to="/raise-ticket"
            onClick={() => setIsOpen(false)}
            className="block !text-white text-lg font-medium hover:!text-green-400 hover:underline transition-all duration-200"
          >
            Raise Ticket
          </Link>
          <Link
            to="/profile"
            onClick={() => setIsOpen(false)}
            className="block !text-white text-lg font-medium hover:!text-green-400 hover:underline transition-all duration-200"
          >
            Profile
          </Link>
          {/* Logout button in mobile menu */}
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 !text-white px-3 py-1 rounded-md font-medium transition-colors"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
