import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Interview() {
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState("");
  const [resumeFile, setResumeFile] = useState("");

  const [timeLeft, setTimeLeft] = useState(60);
  const [feedback, setFeedback] = useState("");
  const [videoOn, setVideoOn] = useState(false);

  const navigate = useNavigate();

  // ================= LOAD QUESTIONS =================
  useEffect(() => {
    const latestResume = JSON.parse(localStorage.getItem("latestResume"));

    if (!latestResume?.filename) {
      alert("Upload resume first!");
      navigate("/upload");
      return;
    }

    setResumeFile(latestResume.filename);

    axios
      .post("http://127.0.0.1:5000/generate-questions", {
        filename: latestResume.filename,
      })
      .then((res) => {
        const q = res.data.questions || ["Tell me about yourself"];
        setQuestions(q);
        speak(q[0]);
      });
  }, [navigate]);

  // ================= TIMER =================
  useEffect(() => {
    if (submitted) return;

    if (timeLeft === 0) {
      nextQuestion();
      return;
    }

    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  // ================= SPEAK =================
  const speak = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(speech);
  };

  // ================= VOICE =================
  const startVoice = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return alert("Use Chrome");

    const recognition = new SpeechRecognition();
    recognition.start();

    recognition.onresult = (e) => {
      setAnswer(e.results[0][0].transcript);
    };
  };

  // ================= CAMERA =================
  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    document.getElementById("video").srcObject = stream;
    setVideoOn(true);
  };

  // ================= NEXT QUESTION =================
  const nextQuestion = async () => {
    if (!answer.trim()) return alert("Answer first!");

    try {
      const res = await axios.post("http://127.0.0.1:5000/analyze", {
        answer,
        resume: resumeFile,
      });

      const score = res.data.score;
      const fb = res.data.feedback;

      setFeedback(`Score: ${score} | ${fb}`);

      const updated = [
        ...answers,
        { question: questions[currentQ], answer, score },
      ];
      setAnswers(updated);

      // Save to dashboard
      const old = JSON.parse(localStorage.getItem("history")) || [];
      localStorage.setItem(
        "history",
        JSON.stringify([
          ...old,
          {
            question: questions[currentQ],
            answer,
            score,
            topic: "AI Interview",
            date: new Date().toLocaleString(),
          },
        ])
      );

      setAnswer("");
      setTimeLeft(60);

      if (currentQ < questions.length - 1) {
        setCurrentQ(currentQ + 1);
        speak(questions[currentQ + 1]);
      } else {
        finishInterview(updated);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ================= FINISH =================
  const finishInterview = (data) => {
    setSubmitted(true);
    setResult(`🎉 Completed! Total Questions: ${data.length}`);
  };

  if (!questions.length)
    return <h2 className="text-white">Loading...</h2>;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">

      <div className="bg-gray-900 border border-gray-700 p-8 rounded-2xl w-[650px] shadow-xl">

        {!submitted ? (
          <>
            <h2 className="text-xl font-semibold mb-2">
              👨‍💼 AI Interviewer
            </h2>

            {/* Timer */}
            <p className="text-red-400 font-bold mb-2">
              ⏱️ {timeLeft}s
            </p>

            {/* Progress */}
            <p className="text-gray-400 mb-3">
              Question {currentQ + 1}/{questions.length}
            </p>

            {/* Camera */}
            <video
              id="video"
              autoPlay
              className="w-full rounded mb-3"
            ></video>

            {!videoOn && (
              <button
                onClick={startCamera}
                className="mb-3 bg-gray-700 px-3 py-1 rounded"
              >
                🎥 Start Camera
              </button>
            )}

            {/* Question */}
            <p className="mb-4 text-lg">
              {questions[currentQ]}
            </p>

            {/* Answer */}
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full p-3 rounded text-black mb-3"
              placeholder="Speak or type..."
            />

            {/* Feedback */}
            {feedback && (
              <p className="text-green-400 mb-2">{feedback}</p>
            )}

            {/* Buttons */}
            <div className="flex gap-2">
              <button
                onClick={startVoice}
                className="bg-green-500 px-3 py-2 rounded"
              >
                🎤 Speak
              </button>

              <button
                onClick={() => speak(questions[currentQ])}
                className="bg-blue-500 px-3 py-2 rounded"
              >
                🔊 Repeat
              </button>

              <button
                onClick={nextQuestion}
                className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 rounded"
              >
                Next ➡️
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-xl mb-3">📊 Result</h2>
            <p>{result}</p>

            <button
              onClick={() => navigate("/dashboard")}
              className="mt-4 bg-blue-500 px-4 py-2 rounded"
            >
              Go Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Interview;