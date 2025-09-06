import React, { useState } from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
// adjust path if your service file is elsewhere
import { createTicket } from "../../services/authService";

export default function RaiseTicket() {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState(3); // default priority (1..5)
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Yellow → Red gradient for 1..5
  const getPriorityColor = (value) => {
    switch (value) {
      case 1:
        return "#FDE68A"; // yellow-300
      case 2:
        return "#FCD34D"; // yellow-400
      case 3:
        return "#FB923C"; // orange-400
      case 4:
        return "#F97316"; // orange-500
      case 5:
        return "#EF4444"; // red-500
      default:
        return "#9CA3AF"; // gray-400
    }
  };

  const marks = [
    { value: 1, label: "1" },
    { value: 2, label: "2" },
    { value: 3, label: "3" },
    { value: 4, label: "4" },
    { value: 5, label: "5" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setLoading(true);
    try {
      // Backend will set default status (e.g., OPEN) and attach current user by session
      const payload = { subject, description, priority };
      const saved = await createTicket(payload); // expects JSON return
      console.log("✅ Ticket created:", saved);

      setSuccess("Ticket submitted successfully!");
      setSubject("");
      setDescription("");
      setPriority(3);
    } catch (err) {
      console.error(err);
      setSuccess("Failed to submit ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-start bg-gradient-to-r from-gray-900 to-gray-800 p-4">
      <div className="w-full max-w-xl bg-gray-700 p-8 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Raise a Ticket</h2>

        {success && (
          <p
            className={`p-3 rounded mb-4 text-center ${
              success.startsWith("Ticket")
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Subject */}
          <div>
            <label className="block text-white font-semibold mb-1">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
              placeholder="Briefly describe your issue"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-white font-semibold mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              required
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 text-white resize-none"
              placeholder="Add details that help us reproduce or understand the issue"
            />
          </div>

          {/* Priority Slider */}
          <div>
            <label className="block text-white font-semibold mb-2">Priority: {priority}</label>
            <Box sx={{ width: "100%" }}>
              <Slider
                value={priority}
                onChange={(_, val) => setPriority(val)}
                step={1}
                marks={marks}
                min={1}
                max={5}
                valueLabelDisplay="auto"
                sx={{
                  color: getPriorityColor(priority),
                  "& .MuiSlider-thumb": {
                    backgroundColor: getPriorityColor(priority),
                    boxShadow: "0 0 0 6px rgba(255,255,255,0.15)",
                    transition: "transform .15s ease, box-shadow .2s ease",
                    "&:hover, &.Mui-focusVisible": {
                      transform: "scale(1.1)",
                      boxShadow: "0 0 0 10px rgba(255,255,255,0.20)",
                    },
                    "&.Mui-active": {
                      transform: "scale(1.15)",
                    },
                  },
                  "& .MuiSlider-track": {
                    transition: "all .25s ease",
                  },
                  "& .MuiSlider-rail": {
                    backgroundColor: "#4B5563", // gray-600
                  },
                  "& .MuiSlider-mark": {
                    backgroundColor: "#ffffff",
                    width: 2,
                    height: 8,
                    borderRadius: 2,
                  },
                  "& .MuiSlider-markLabel": {
                    color: "#E5E7EB", // gray-200 for dark bg
                    fontWeight: 600,
                  },
                  "& .MuiSlider-valueLabel": {
                    backgroundColor: "#111827", // gray-900 bubble
                    color: "#fff",
                    borderRadius: 6,
                  },
                }}
              />
            </Box>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading ? "bg-green-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
            } text-white font-bold py-3 px-4 rounded-lg transition-all duration-300`}
          >
            {loading ? "Submitting..." : "Submit Ticket"}
          </button>
        </form>
      </div>
    </div>
  );
}
