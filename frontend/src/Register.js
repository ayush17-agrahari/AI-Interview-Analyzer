import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:5000/register", {
        username,
        password
      });

      if (res.data.success) {
        setMessage("✅ Registered Successfully!");
        setTimeout(() => navigate("/"), 1500); // go to login
      } else {
        setMessage("❌ User already exists");
      }

    } catch {
      setMessage("❌ Backend not reachable");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-green-400 to-blue-500">

      <div className="bg-white p-8 rounded-2xl shadow-2xl w-80 text-center">

        <h2 className="text-2xl font-bold mb-4">📝 Register</h2>

        <input
          className="border p-3 w-full rounded-lg mb-3"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          className="border p-3 w-full rounded-lg mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleRegister}
          className="bg-green-500 text-white px-4 py-2 rounded-lg w-full"
        >
          Register
        </button>

        <button
          onClick={() => navigate("/")}
          className="mt-3 text-blue-500 underline"
        >
          Back to Login
        </button>

        {message && <p className="mt-3">{message}</p>}
      </div>
    </div>
  );
}

export default Register;