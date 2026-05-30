// ================== IMPORTS ==================
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");

const app = express();
app.use(cors());
app.use(express.json());

// ================== 📁 UPLOAD FOLDER ==================
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ================== 📦 STORAGE ==================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

// ================== 📝 REGISTER ==================
app.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    return res.json({
      success: true,
      message: "User registered successfully",
    });
  }

  res.status(400).json({
    success: false,
    message: "Missing fields",
  });
});

// ================== 🔐 LOGIN ==================
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  console.log("Login attempt:", username, password);

  if (username && password) {
    return res.json({
      success: true,
      user: { username },
    });
  }

  res.status(401).json({
    success: false,
    message: "Invalid credentials",
  });
});

// ================== 📄 UPLOAD ==================
app.post("/upload", (req, res) => {
  upload.single("resume")(req, res, function (err) {
    if (err) {
      console.error("❌ Upload Error:", err);
      return res.status(500).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("✅ File uploaded:", req.file.filename);

    res.json({
      success: true,
      filename: req.file.filename,
    });
  });
});

// ==================  GENERATE QUESTIONS ==================
app.post("/generate-questions", async (req, res) => {
  try {
    const { filename } = req.body;

    if (!filename) {
      return res.status(400).json({ error: "Filename required" });
    }

    const filePath = path.join(uploadDir, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Resume not found" });
    }

    let text = "";

    // ✅ READ PDF USING pdfjs
    if (filename.endsWith(".pdf")) {
      const data = new Uint8Array(fs.readFileSync(filePath));
      const pdf = await pdfjsLib.getDocument({ data }).promise;

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map(item => item.str);
        text += strings.join(" ");
      }
    } else {
      text = "Resume uploaded (non-pdf)";
    }

    console.log("📄 Resume Preview:\n", text.substring(0, 300));

    const lowerText = text.toLowerCase();
    const questions = [];

    // 🔥 HR-style questions
    if (lowerText.includes("Introduction")) {
      questions.push("Introduce yourself .");
    }

    if (lowerText.includes("project")) {
      questions.push("Explain your challenging project in detail.");
    }

    if (lowerText.includes("react")) {
      questions.push("What challenges did you face while working with your project ?");
    }

    if (lowerText.includes("project")) {
      questions.push("What  have you used  in your projects?");
    }

    if (lowerText.includes("Benefit ")) {
      questions.push("What's the benefit of this project?");
    }

    if (lowerText.includes("internship")) {
      questions.push("What did you learn during your internship?");
    }

    if (lowerText.includes("sql") || lowerText.includes("database")) {
      questions.push("How do you design a database?");
    }

    if (lowerText.includes("api")) {
      questions.push("Have you used any API ? ");
    }

    // ✅ fallback
    if (questions.length === 0) {
      questions.push("Tell me about yourself.");
    }

    res.json({ questions });

  } catch (err) {
    console.error("❌ ERROR:", err);
    res.status(500).json({ error: "Error generating questions" });
  }
});

// ================== 📊 ANALYZE ==================
app.post("/analyze", (req, res) => {
  const { answer } = req.body;

  if (!answer) {
    return res.status(400).json({ error: "Answer required" });
  }

  let score = 50;

  if (answer.length > 50) score += 10;
  if (answer.length > 100) score += 10;
  if (answer.toLowerCase().includes("project")) score += 10;
  if (answer.toLowerCase().includes("experience")) score += 10;

  score = Math.min(score, 100);

  const feedback =
    score > 80
      ? "Excellent answer! Very well explained."
      : score > 60
      ? "Good answer! Can improve clarity."
      : "Try to give more detailed and structured answer.";

  res.json({ score, feedback });
});

// ================== TEST ==================
app.get("/", (req, res) => {
  res.send("✅ Server is running");
});

// ================== START ==================
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});