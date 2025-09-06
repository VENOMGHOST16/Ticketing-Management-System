import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";

export default function AdminNavbar({ adminName, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-blue-600 shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logout button */}
          <div className="flex-shrink-0">
            <button
              onClick={onLogout}
              className="text-white text-sm px-3 py-1 bg-red-500 rounded hover:bg-red-600 transition !text-white"
            >
              Logout
            </button>
          </div>

          {/* Welcome text */}
          <div className="flex-1 flex items-center justify-center md:justify-start">
            <span className="font-semibold text-lg text-white ml-4">{`Welcome, ${adminName}`}</span>
          </div>

          {/* Hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white focus:outline-none"
            >
              {menuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link
              to="/admin/dashboard"
              className="text-lg font-medium hover:underline !text-white transition"
            >
              Dashboard
            </Link>
            <Link
              to="/admin/tickets"
              className="text-lg font-medium hover:underline !text-white transition"
            >
              All Tickets
            </Link>
            <Link
              to="/admin/users"
              className="text-lg font-medium hover:underline !text-white transition"
            >
              Users
            </Link>
            <Link
              to="/admin/adduser"
              className="text-lg font-medium hover:underline !text-white transition"
            >
              Add User
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-blue-600 px-2 pt-2 pb-3 space-y-1">
          <Link
            to="/admin/dashboard"
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-500 !text-white transition"
            onClick={() => setMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            to="/admin/tickets"
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-500 !text-white transition"
            onClick={() => setMenuOpen(false)}
          >
            All Tickets
          </Link>
          <Link
            to="/admin/users"
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-500 !text-white transition"
            onClick={() => setMenuOpen(false)}
          >
            Users
          </Link>
        </div>
      )}
    </nav>
  );
}
