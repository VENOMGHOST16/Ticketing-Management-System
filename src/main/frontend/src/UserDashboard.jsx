import React, { useState } from "react";
import {
  PlusCircle,
  MessageSquare,
  User,
  LayoutDashboard,
  Settings,
  LogOut
} from "lucide-react";

export default function UserDashboard() {
  const [tickets, setTickets] = useState([
    {
      id: 1,
      subject: "Login Issue",
      description: "Unable to login with my credentials.",
      priority: "High",
      status: "Open",
      comments: [
        { text: "Reported the issue", time: "2025-08-15" },
        { text: "Support team acknowledged", time: "2025-08-16" }
      ]
    },
    {
      id: 2,
      subject: "UI Bug in Dashboard",
      description: "Graph not loading properly.",
      priority: "Medium",
      status: "In Progress",
      comments: [{ text: "Bug identified", time: "2025-08-14" }]
    }
  ]);

  const [newTicket, setNewTicket] = useState({
    subject: "",
    description: "",
    priority: "Low"
  });

  const handleAddTicket = () => {
    if (!newTicket.subject.trim() || !newTicket.description.trim()) return;
    setTickets([
      ...tickets,
      {
        id: tickets.length + 1,
        ...newTicket,
        status: "Open",
        comments: []
      }
    ]);
    setNewTicket({ subject: "", description: "", priority: "Low" });
  };

  const statusColors = {
    Open: "bg-yellow-500",
    "In Progress": "bg-blue-500",
    Resolved: "bg-green-500",
    Closed: "bg-gray-500"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 to-red-800 text-white">
      {/* Page Content */}
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-6">🎯 User Dashboard</h1>

        {/* Add Ticket Form */}
        <div className="bg-gray-700 p-6 rounded-2xl shadow-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <PlusCircle className="text-green-400" /> Raise New Ticket
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Subject"
              className="p-3 rounded-lg bg-gray-800 border border-gray-600 focus:outline-none focus:border-green-400"
              value={newTicket.subject}
              onChange={(e) =>
                setNewTicket({ ...newTicket, subject: e.target.value })
              }
            />
            <select
              className="p-3 rounded-lg bg-gray-800 border border-gray-600 focus:outline-none focus:border-green-400"
              value={newTicket.priority}
              onChange={(e) =>
                setNewTicket({ ...newTicket, priority: e.target.value })
              }
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
            <button
              onClick={handleAddTicket}
              className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg shadow-lg transition-all"
            >
              Submit
            </button>
          </div>
          <textarea
            placeholder="Description"
            className="mt-4 p-3 w-full rounded-lg bg-gray-800 border border-gray-600 focus:outline-none focus:border-green-400"
            rows={3}
            value={newTicket.description}
            onChange={(e) =>
              setNewTicket({ ...newTicket, description: e.target.value })
            }
          ></textarea>
        </div>

        {/* Tickets List */}
        <div className="space-y-6">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-gray-700 p-6 rounded-2xl shadow-lg hover:scale-[1.02] transition-transform"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-bold">{ticket.subject}</h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[ticket.status]}`}
                >
                  {ticket.status}
                </span>
              </div>
              <p className="text-gray-300 mb-2">{ticket.description}</p>
              <p className="text-sm text-gray-400">
                Priority: {ticket.priority}
              </p>

              {/* Comments */}
              <div className="mt-4 bg-gray-800 p-3 rounded-lg">
                <h4 className="font-semibold flex items-center gap-2">
                  <MessageSquare className="text-blue-400" /> Comments
                </h4>
                <ul className="mt-2 space-y-1">
                  {ticket.comments.map((c, i) => (
                    <li key={i} className="text-gray-400 text-sm">
                      {c.text} —{" "}
                      <span className="text-gray-500">{c.time}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
