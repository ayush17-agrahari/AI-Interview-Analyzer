import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setError("");

      const res = await axios.post("http://localhost:5000/login", {
        username,
        password,
      });

      if (res.data.success) {
        // ✅ Save user properly
        localStorage.setItem("user", JSON.stringify(res.data.user));

        // ✅ Redirect
        navigate("/dashboard");
      } else {
        setError("❌ Invalid username or password");
      }

    } catch (err) {
      console.error(err);

      if (err.response) {
        // Backend responded (401, 500, etc.)
        setError(`❌ ${err.response.data.message || "Server error"}`);
      } else if (err.request) {
        // No response
        setError("❌ Backend not reachable");
      } else {
        setError("❌ Something went wrong");
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">

      <div className="bg-white p-8 rounded-2xl shadow-2xl w-80 text-center">

        <h2 className="text-2xl font-bold mb-4">🔐 Login</h2>

        <input
          className="border p-3 w-full rounded-lg mb-3"
          placeholder="Username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setError("");
          }}
        />

        <input
          type="password"
          className="border p-3 w-full rounded-lg mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
        />

        <button
          onClick={handleLogin}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg w-full hover:opacity-90"
        >
          Login
        </button>

        <button
          onClick={() => navigate("/register")}
          className="mt-3 border border-purple-500 text-purple-500 px-4 py-2 rounded-lg w-full hover:bg-purple-50"
        >
          Create Account
        </button>

        {error && <p className="text-red-500 mt-3">{error}</p>}

      </div>
    </div>
  );
}

export default Login;