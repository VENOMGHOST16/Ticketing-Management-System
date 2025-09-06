import React, { useState, useEffect } from "react";
import { getAllUserTickets, getAllAgents, } from "../../services/authService";

export default function AdminDashboard() {
  const [tickets, setTickets] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [filters, setFilters] = useState({ email: "", status: "", subject: "" });
  const [popup, setPopup] = useState({ show: false, ticketId: null });
  const [loading, setLoading] = useState(true);
  const [agents, setAgents] = useState([]);

  // Normalize incoming tickets so UI never holds agent objects
  const normalizeTickets = (rawTickets) =>
    (rawTickets || []).map((t) => ({
      ...t,
      // Keep only ID + name in UI state
      assignedAgentId: t.assignedAgent ? t.assignedAgent.id : "",
      assignedAgentName: t.assignedAgent ? t.assignedAgent.name : null,
    }));

  // Fetch tickets
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await getAllUserTickets();
        setTickets(normalizeTickets(data));
      } catch (err) {
        console.error("Failed to fetch tickets:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  // Fetch agents
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const data = await getAllAgents();
        setAgents(data || []);
      } catch (err) {
        console.error("Failed to fetch agents:", err);
      }
    };
    fetchAgents();
  }, []);

  const handleToggleExpand = (id) =>
    setExpandedId((prev) => (prev === id ? null : id));

  // Generic change handler for ticket fields
  const handleChange = (id, field, value) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;

        // If changing agent from dropdown
        if (field === "assignedAgentId") {
          const agentId = value === "" ? "" : Number(value);
          const agent = agents.find((a) => a.id === agentId);
          return {
            ...t,
            assignedAgentId: agentId,
            assignedAgentName: agent ? agent.name : null,
          };
        }

        // If changing status
        if (field === "status") {
          return { ...t, status: value };
        }

        // Fallback
        return { ...t, [field]: value };
      })
    );
  };

  const handleSave = (ticketId) => {
    setPopup({ show: true, ticketId });
  };

  const confirmChange = async () => {
    const ticket = tickets.find((t) => t.id === popup.ticketId);
    if (!ticket) {
      setPopup({ show: false, ticketId: null });
      return;
    }

    // Send only what backend needs
    const payload = {
      status: ticket.status,
      assignedAgentId: ticket.assignedAgentId === "" ? null : ticket.assignedAgentId,
    };

    try {
      const res = await fetch(
        `${import.meta.env.VITE_SPRINGBOOT_API_URL}/api/admin/updateTicket/${ticket.id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Failed to update ticket");

      // Optional: refresh from server or optimistic update already done in state
      alert("Changes saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Error updating ticket");
    } finally {
      setPopup({ show: false, ticketId: null });
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 1:
        return "bg-yellow-200 text-yellow-800";
      case 2:
        return "bg-yellow-300 text-yellow-900";
      case 3:
        return "bg-orange-300 text-orange-900";
      case 4:
        return "bg-orange-400 text-orange-900";
      case 5:
        return "bg-red-400 text-red-900";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  // Apply filters safely
  const filteredTickets = (tickets || []).filter((t) => {
    const email = t.user?.email || "";
    const status = t.status || "";
    const title = t.title || "";
    return (
      email.toLowerCase().includes(filters.email.toLowerCase()) &&
      status.toLowerCase().includes(filters.status.toLowerCase()) &&
      title.toLowerCase().includes(filters.subject.toLowerCase())
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Loading tickets...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 flex space-x-6 bg-gray-900 min-h-screen">
      {/* Filter Section */}
      <div className="w-1/4 space-y-4 p-4 bg-gray-800 rounded-xl shadow-md h-fit text-white">
        <h3 className="font-bold text-lg mb-2">Filters</h3>

        <div>
          <label className="block font-medium text-sm mb-1">User Email</label>
          <input
            type="text"
            value={filters.email}
            onChange={(e) => setFilters({ ...filters, email: e.target.value })}
            placeholder="Search by email..."
            className="w-full px-3 py-2 rounded border bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-medium text-sm mb-1">Status</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="w-full px-3 py-2 rounded border bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>

        <div>
          <label className="block font-medium text-sm mb-1">Title</label>
          <input
            type="text"
            value={filters.subject}
            onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
            placeholder="Search by title..."
            className="w-full px-3 py-2 rounded border bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Tickets Section */}
      <div className="w-3/4 space-y-6">
        {filteredTickets.map((ticket) => (
          <div
            key={ticket.id}
            className="bg-gray-100 rounded-xl shadow-lg p-4 transition-transform transform hover:scale-105"
          >
            {/* Top row: Status + Priority + Modify */}
            <div className="flex justify-between items-start mb-3">
              <div>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    ticket.status === "OPEN"
                      ? "bg-green-200 text-green-800"
                      : ticket.status === "IN_PROGRESS"
                      ? "bg-yellow-200 text-yellow-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {ticket.status}
                </span>
                <span
                  className={`ml-2 inline-block px-3 py-1 rounded-full text-sm font-semibold ${getPriorityColor(
                    ticket.priorityLevel
                  )}`}
                >
                  Priority: {ticket.priorityLevel}
                </span>
              </div>
              <button
                onClick={() => handleToggleExpand(ticket.id)}
                className="text-blue-600 hover:text-blue-800 font-medium text-base transition-colors duration-300 ease-in-out transform hover:scale-105"
              >
                {expandedId === ticket.id ? "Collapse" : "Modify"}
              </button>
            </div>

            {/* Ticket Info */}
            <div className="mb-3">
              <p className="font-semibold text-base text-gray-900">Title:</p>
              <p className="text-base text-gray-800">{ticket.title}</p>
            </div>
            <div className="mb-3">
              <p className="font-semibold text-base text-gray-900">Description:</p>
              <p className="text-base text-gray-700">{ticket.description}</p>
            </div>
            <div className="text-sm text-gray-600">
              <p>
                User: {ticket.user?.name} ({ticket.user?.email})
              </p>
              <p>
                Agent: {ticket.assignedAgentName || "Unassigned"}
              </p>
              <p>
                Created:{" "}
                {ticket.createdAt
                  ? new Date(ticket.createdAt).toLocaleString()
                  : "N/A"}
              </p>
            </div>

            {/* Expandable Modify Section */}
            <div
              className={`overflow-hidden transition-all duration-500 ${
                expandedId === ticket.id ? "max-h-96 mt-4" : "max-h-0"
              }`}
            >
              <div className="mt-3 space-y-3">
                {/* Agent */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Agent
                  </label>
                  <select
                    value={ticket.assignedAgentId === "" ? "" : ticket.assignedAgentId}
                    onChange={(e) =>
                      handleChange(ticket.id, "assignedAgentId", e.target.value)
                    }
                    className="w-full px-3 py-2 border rounded bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Unassigned</option>
                    {agents.map((agent) => (
                      <option key={agent.id} value={agent.id}>
                        {agent.name} ({agent.email})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    value={ticket.status || "OPEN"}
                    onChange={(e) =>
                      handleChange(ticket.id, "status", e.target.value)
                    }
                    className="w-full px-3 py-2 border rounded bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>

                <button
                  onClick={() => handleSave(ticket.id)}
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors duration-300 ease-in-out transform hover:scale-105"
                >
                  Change
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Popup Modal */}
      {popup.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full text-gray-900">
            <h3 className="text-lg font-semibold mb-4">Confirm Changes</h3>
            <p className="mb-4 text-gray-700">
              Are you sure you want to apply the changes?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setPopup({ show: false, ticketId: null })}
                className="px-4 py-2 rounded-lg border border-gray-400 text-gray-900 hover:bg-gray-200 transition-colors duration-300 ease-in-out transform hover:scale-105"
              >
                Cancel
              </button>
              <button
                onClick={confirmChange}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors duration-300 ease-in-out transform hover:scale-105"
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
