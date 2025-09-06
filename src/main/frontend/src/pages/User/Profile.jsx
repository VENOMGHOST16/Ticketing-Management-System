import React, { useState, useEffect, useRef } from "react";
import { getUserTickets } from "../../services/authService"; // import function

export default function Profile() {
  const [priorityFilter, setPriorityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchText, setSearchText] = useState("");
  const [ticketsData, setTicketsData] = useState([]); // will be filled from backend
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Reference for each ticket to observe
  const ticketRefs = useRef([]);

  // Track which tickets are visible
  const [visibleTickets, setVisibleTickets] = useState([]);

  // Fetch tickets from backend
  useEffect(() => {
    async function fetchTickets() {
      try {
        setLoading(true);
        const data = await getUserTickets(); // call backend
        setTicketsData(data);
      } catch (err) {
        console.error("Error fetching tickets:", err);
        setError("Failed to load tickets.");
      } finally {
        setLoading(false);
      }
    }
    fetchTickets();
  }, []);

  // Filtering logic
  const filteredTickets = ticketsData.filter((ticket) => {
    const matchesPriority = priorityFilter
      ? ticket.priorityLevel === Number(priorityFilter)
      : true;
    const matchesStatus = statusFilter ? ticket.status === statusFilter : true;
    const matchesText =
      searchText.length > 0
        ? ticket.title.toLowerCase().includes(searchText.toLowerCase()) ||
          ticket.description.toLowerCase().includes(searchText.toLowerCase())
        : true;

    return matchesPriority && matchesStatus && matchesText;
  });

  // Animate tickets on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.dataset.index);
            setVisibleTickets((prev) => [...prev, index]);
          }
        });
      },
      {
        threshold: 0.2,
      }
    );

    ticketRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [filteredTickets]);

  const statusColor = (status) => {
    switch (status) {
      case "OPEN":
        return "bg-green-400 text-white";
      case "IN PROGRESS":
        return "bg-yellow-400 text-black";
      case "CLOSED":
        return "bg-gray-400 text-white";
      default:
        return "bg-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <h2 className="text-3xl text-white font-bold mb-6">My Tickets</h2>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filter Panel */}
        <div className="lg:w-1/4 bg-gray-800 p-4 rounded-xl shadow-lg space-y-4">
          <h3 className="text-white font-semibold text-xl mb-2">Filters</h3>
          <input
            type="text"
            placeholder="Search by text..."
            className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <select
            className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="">All Priorities</option>
            {[1, 2, 3, 4, 5].map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <select
            className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        {/* Ticket List */}
        <div className="lg:w-3/4 flex flex-col gap-6">
          {loading ? (
            <p className="text-white">Loading tickets...</p>
          ) : error ? (
            <p className="text-red-400">{error}</p>
          ) : filteredTickets.length === 0 ? (
            <p className="text-white">No tickets found.</p>
          ) : (
            filteredTickets.map((ticket, idx) => (
              <div
                key={ticket.id}
                ref={(el) => (ticketRefs.current[idx] = el)}
                data-index={idx}
                className={`bg-white p-6 rounded-xl shadow-2xl transition-all duration-700 transform ${
                  visibleTickets.includes(idx)
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                <div className="flex justify-between mb-2">
                  <span
                    className={`font-semibold px-2 py-1 rounded ${statusColor(
                      ticket.status
                    )}`}
                  >
                    {ticket.status}
                  </span>
                  <span
                    className={`font-bold px-3 py-1 rounded-full ${
                      ticket.priorityLevel === 1
                        ? "bg-yellow-300"
                        : ticket.priorityLevel === 2
                        ? "bg-yellow-400"
                        : ticket.priorityLevel === 3
                        ? "bg-orange-400"
                        : ticket.priorityLevel === 4
                        ? "bg-orange-500"
                        : "bg-red-500"
                    }`}
                  >
                    Priority: {ticket.priorityLevel}
                  </span>
                </div>
                <p className="text-gray-900 font-semibold">
                  Subject: {ticket.title}
                </p>
                <p className="text-gray-700 mt-1">{ticket.description}</p>
                <p className="text-gray-500 mt-2 text-sm">
                  {new Date(ticket.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
