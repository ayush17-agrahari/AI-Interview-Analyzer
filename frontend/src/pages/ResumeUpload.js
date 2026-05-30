import React, { useState } from "react";
import axios from "axios";

function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [questions, setQuestions] = useState([]);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("resume", file);

    const res = await axios.post(
      "http://127.0.0.1:5000/upload-resume",
      formData
    );

    const q = await axios.post(
      "http://127.0.0.1:5000/generate-questions",
      {
        resume_text: res.data.resume_text
      }
    );

    setQuestions(q.data.questions);
  };

  return (
    <div className="flex flex-col items-center mt-10">

      <h2 className="text-2xl font-bold mb-4">Upload Resume</h2>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
      >
        Upload & Generate Questions
      </button>

      <div className="mt-6">
        {questions.map((q, i) => (
          <p key={i}>{q}</p>
        ))}
      </div>

    </div>
  );
}

export default ResumeUpload;