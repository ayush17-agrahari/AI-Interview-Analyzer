import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import Confetti from "react-confetti";
import jsPDF from "jspdf";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

function Dashboard() {
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [search, setSearch] = useState("");
  const [sortType, setSortType] = useState("latest");
  const [darkMode, setDarkMode] = useState(true);
  const [goalCompleted, setGoalCompleted] = useState(false);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("history")) || [];
    setHistory(data);
    setFilteredHistory(data);

    const today = new Date().toLocaleDateString();
    const last = localStorage.getItem("lastPractice");
    if (last === today) setGoalCompleted(true);
  }, []);

  // Dark Mode
  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Search + Sort
  useEffect(() => {
    let data = [...history];

    if (search) {
      data = data.filter(
        (h) =>
          h.topic?.toLowerCase().includes(search.toLowerCase()) ||
          h.date?.includes(search)
      );
    }

    if (sortType === "high") {
      data.sort((a, b) => (b.score || 0) - (a.score || 0));
    } else {
      data.reverse();
    }

    setFilteredHistory(data);
  }, [search, sortType, history]);

  // Stats
  const total = filteredHistory.length;

  const avg =
    total > 0
      ? (filteredHistory.reduce((a, b) => a + (b.score || 0), 0) / total).toFixed(1)
      : 0;

  const high = total ? Math.max(...filteredHistory.map((h) => h.score || 0)) : 0;

  // Weak Topic
  const weakTopic = (() => {
    const map = {};
    history.forEach((h) => {
      if (!map[h.topic]) map[h.topic] = [];
      map[h.topic].push(h.score);
    });

    let weakest = null;
    let lowestAvg = 100;

    Object.keys(map).forEach((t) => {
      const avg = map[t].reduce((a, b) => a + b, 0) / map[t].length;
      if (avg < lowestAvg) {
        lowestAvg = avg;
        weakest = t;
      }
    });

    return weakest;
  })();

  // Streak
  const streak = history.length;

  // Improvement
  const improvement =
    history.length > 1
      ? (history[history.length - 1].score || 0) - (history[0].score || 0)
      : 0;

  // Badges
  const badges = [];
  if (streak >= 5) badges.push("🔥 Consistent");
  if (avg > 80) badges.push("🏆 Top Performer");
  if (total >= 10) badges.push("📚 Dedicated");

  // AI Feedback
  const suggestions = [];
  if (avg < 50) suggestions.push("Revise basics");
  if (weakTopic) suggestions.push(`Focus on ${weakTopic}`);
  if (streak < 3) suggestions.push("Be consistent");
  if (avg > 80) suggestions.push("Start applying!");

  const feedback = suggestions.join(" | ");

  // Main Chart
  const chartData = {
    labels: filteredHistory.map((_, i) => `#${i + 1}`),
    datasets: [
      {
        label: "Score",
        data: filteredHistory.map((item) => item.score || 0),
        borderColor: "#22c55e",
        backgroundColor: "rgba(34,197,94,0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Topic Chart
  const topicMap = {};
  history.forEach((h) => {
    if (!topicMap[h.topic]) topicMap[h.topic] = [];
    topicMap[h.topic].push(h.score);
  });

  const topicChart = {
    labels: Object.keys(topicMap),
    datasets: [
      {
        label: "Topic Avg",
        data: Object.values(topicMap).map(
          (arr) => arr.reduce((a, b) => a + b, 0) / arr.length
        ),
        borderColor: "#3b82f6",
        tension: 0.4,
      },
    ],
  };

  // Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Interview Report", 20, 20);
    doc.text(`Total: ${total}`, 20, 40);
    doc.text(`Avg: ${avg}`, 20, 50);
    doc.text(`High: ${high}`, 20, 60);
    doc.text(`Weak Topic: ${weakTopic || "None"}`, 20, 70);
    doc.save("report.pdf");
  };

  // Clear History
  const clearHistory = () => {
    if (window.confirm("Are you sure you want to clear history?")) {
      localStorage.removeItem("history");
      setHistory([]);
      setFilteredHistory([]);
    }
  };

  return (
    <div className={`${darkMode ? "bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white" : "bg-gray-100 text-black"} min-h-screen p-6`}>

      <Confetti numberOfPieces={100} />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📊 Smart Dashboard</h1>
        <button onClick={toggleDarkMode} className="bg-white/20 px-3 py-1 rounded">
          Toggle Theme
        </button>
      </div>

      {/* Search + Clear */}
      <div className="flex gap-4 mb-6">
        <input
          placeholder="Search..."
          className="p-2 rounded w-full text-black"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          onClick={() => setSearch("")}
          className="bg-gray-500 px-3 py-2 rounded"
        >
          Clear
        </button>

        <select
          className="p-2 rounded text-black"
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
        >
          <option value="latest">Latest</option>
          <option value="high">Highest</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[ 
          { label: "Total", value: total },
          { label: "Avg", value: avg },
          { label: "High", value: high },
          { label: "🔥 Streak", value: streak },
        ].map((card, i) => (
          <div key={i} className="bg-white/10 p-4 rounded-xl text-center">
            <p>{card.label}</p>
            <h2 className="text-xl font-bold">{card.value}</h2>
          </div>
        ))}
      </div>

      {/* Goal */}
      <div className="bg-yellow-500/20 p-4 rounded-xl mb-6">
        🎯 Daily Goal: {goalCompleted ? "Done ✅" : "Not Done ❌"}
      </div>

      {/* Improvement */}
      <div className="bg-green-500/20 p-4 rounded-xl mb-6">
        📈 Improvement: {improvement > 0 ? `+${improvement}` : improvement}
      </div>

      {/* Badges */}
      <div className="bg-purple-500/20 p-4 rounded-xl mb-6">
        🏆 {badges.length ? badges.join(", ") : "No badges yet"}
      </div>

      {/* Feedback */}
      <div className="bg-blue-500/20 p-4 rounded-xl mb-6">
        🤖 {feedback}
      </div>

      {/* Weak Area */}
      {weakTopic && (
        <div className="bg-red-500/20 p-4 rounded-xl mb-6">
          ⚠️ Weak: {weakTopic}
        </div>
      )}

      {/* Charts */}
      <div className="bg-white/10 p-4 rounded-xl mb-6">
        <Line data={chartData} />
      </div>

      <div className="bg-white/10 p-4 rounded-xl mb-6">
        <h3>📊 Topic Analysis</h3>
        <Line data={topicChart} />
      </div>

      {/* Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <button onClick={() => navigate("/upload")} className="bg-blue-500 p-2 rounded">
          Upload Resume
        </button>

        <button onClick={() => navigate("/interview")} className="bg-green-500 p-2 rounded">
          Start Interview
        </button>

        <button onClick={exportPDF} className="bg-purple-500 p-2 rounded">
          Export Report
        </button>

        <button onClick={clearHistory} className="bg-yellow-500 p-2 rounded">
          Clear History
        </button>

        <button
          onClick={() => {
            localStorage.clear();
            navigate("/");
          }}
          className="bg-red-500 p-2 rounded col-span-2"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;