import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="flex justify-between items-center px-6 py-4 bg-black text-white shadow-lg">
      <h2 className="text-2xl font-bold text-pink-400">
        🤖 AI Interview
      </h2>

      <div className="space-x-6">
        <Link to="/interview" className="hover:text-yellow-400">Interview</Link>
        <Link to="/dashboard" className="hover:text-green-400">Dashboard</Link>
        <Link to="/" className="hover:text-red-400">Logout</Link>
      </div>
    </div>
  );
}

export default Navbar;