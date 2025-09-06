import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";

// User components
import UserNavbar from "./components/navbars/UserNavbar";
import RaiseTicket from "./pages/User/RaiseTicket";
import Profile from "./pages/User/Profile";

// Admin components
import AdminNavbar from "./components/navbars/AdminNavbar";
import Dashboard from "./pages/Admin/Dashboard";
import AllTickets from "./pages/Admin/AllTickets";
import AdminAllUsers from "./pages/Admin/AdminAllUsers";
import AdminAddUser from "./pages/Admin/AddUser";

export default function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    if (userData?.success) setUser(userData);
  };

  const handleLogout = () => setUser(null);

  return (
    <Router>
      {!user ? (
        // If no user -> always show Login
        <Routes>
          <Route path="*" element={<Login onLogin={handleLogin} />} />
        </Routes>
      ) : (
        <>
          {/* Navbar */}
          {user.roles === "ROLE_USER" && (
            <UserNavbar
              username={user.email?.split("@")[0] || "User"}
              onLogout={handleLogout}
            />
          )}
          {user.roles === "ROLE_ADMIN" && (
            <AdminNavbar
              adminName={user.email?.split("@")[0] || "Admin"}
              onLogout={handleLogout}
            />
          )}

          {/* Content with padding below navbar */}
          <div className="pt-16 p-4">
            <Routes>
              {/* User Routes */}
              {user.roles === "ROLE_USER" && (
                <>
                  <Route path="/" element={<Navigate to="/profile" replace />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/raise-ticket" element={<RaiseTicket />} />
                </>
              )}

              {/* Admin Routes */}
              {user.roles === "ROLE_ADMIN" && (
                <>
                  <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="/admin/dashboard" element={<Dashboard />} />
                  <Route path="/admin/tickets" element={<AllTickets />} />
                  <Route path="/admin/users" element={<AdminAllUsers />} />
                  <Route path="/admin/adduser" element={<AdminAddUser />} />
                </>
              )}

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </>
      )}
    </Router>
  );
}
