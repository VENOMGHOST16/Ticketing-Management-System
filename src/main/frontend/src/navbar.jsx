import React from 'react'
import {
  User,
  LayoutDashboard,
  Settings,
  LogOut
} from "lucide-react";

const navbar = () => {
  return (
    <>
    {/* Navbar */}
      <nav className="bg-gray-900 px-6 py-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3 text-2xl font-bold">
          <LayoutDashboard className="text-red-500" />
          HelpDesk
        </div>
        <ul className="flex gap-6 text-lg">
          <li className="hover:text-red-400 cursor-pointer flex items-center gap-1">
            <LayoutDashboard size={18} /> Dashboard
          </li>
          <li className="hover:text-red-400 cursor-pointer flex items-center gap-1">
            <User size={18} /> Profile
          </li>
          <li className="hover:text-red-400 cursor-pointer flex items-center gap-1">
            <Settings size={18} /> Settings
          </li>
          <li className="hover:text-red-400 cursor-pointer flex items-center gap-1">
            <LogOut size={18} /> Logout
          </li>
        </ul>
      </nav>
    </>
    
  )
}

export default navbar