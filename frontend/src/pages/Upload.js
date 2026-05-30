import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Upload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Handle file
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
  };

  // Upload
  const handleUpload = async () => {
    if (!file) {
      setMessage("❌ Please select a file first!");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      const data = await res.json();

      localStorage.setItem(
        "latestResume",
        JSON.stringify({ filename: data.filename })
      );

      setMessage("✅ Resume uploaded successfully!");

      setTimeout(() => {
        navigate("/interview");
      }, 1200);

    } catch (err) {
      setMessage("❌ Upload failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 via-pink-600 to-red-500 p-6">

      {/* Card */}
      <div className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl text-white w-[400px] text-center">

        <h1 className="text-3xl font-bold mb-6">📄 Upload Resume</h1>

        {/* Upload Box */}
        <label className="border-2 border-dashed border-white/40 p-6 rounded-xl cursor-pointer hover:bg-white/10 transition block">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="hidden"
          />

          <p className="text-lg">📂 Click or Drag & Drop</p>
          <p className="text-sm text-white/70">PDF, DOC, DOCX</p>

          {file && (
            <p className="mt-3 text-green-300 text-sm">
              ✅ {file.name}
            </p>
          )}
        </label>

        {/* Button */}
        <button
          onClick={handleUpload}
          disabled={loading}
          className={`mt-6 w-full py-2 rounded-xl font-semibold transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Uploading..." : "🚀 Upload & Continue"}
        </button>

        {/* Message */}
        {message && (
          <p className="mt-4 text-sm">{message}</p>
        )}

        {/* Back */}
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-4 text-white/70 hover:text-white text-sm"
        >
          ⬅ Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default Upload;