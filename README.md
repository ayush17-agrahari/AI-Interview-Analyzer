# AI Interview Performance Analyzer

An AI-powered interview preparation platform that helps users practice interviews, analyze resumes, receive personalized questions, and improve their interview performance through intelligent feedback.

---

## Features

### Resume Analysis
- Upload PDF Resume
- Extract skills, education, projects, and experience
- AI-powered resume evaluation
- Resume score generation
- Improvement suggestions

### Interview Question Generation
- Generate questions based on resume content
- Technical questions
- HR questions
- Project-based questions
- Experience-based questions

### AI Interview Assistant
- Voice-enabled interview simulation
- Real-time question answering
- Interactive interview experience

### Performance Analysis
- Confidence score
- Communication score
- Technical score
- Overall interview rating
- Personalized feedback

### Dashboard
- View interview history
- Track performance improvements
- Download reports
- Analytics and insights

---

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- React Router DOM
- Axios

### Backend
- Node.js
- Express.js

### Database
- MongoDB

### AI Integration
- Google Gemini API
- Ollama (Local LLM Support)

### Other Tools
- Multer (File Upload)
- PDF Parser
- Speech Recognition API
- Text-to-Speech API

---

## Project Structure

```bash
AI-Interview-Performance-Analyzer/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   ├── uploads/
│   └── server.js
│
├── README.md
└── package.json
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/AI-Interview-Performance-Analyzer.git
```

```bash
cd AI-Interview-Performance-Analyzer
```

---

## Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

GEMINI_API_KEY=your_gemini_api_key

JWT_SECRET=your_secret_key
```

Run backend:

```bash
npm start
```

or

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd frontend
npm install
```

Run frontend:

```bash
npm start
```

Application will run on:

```bash
http://localhost:3000
```

---

## API Endpoints

### Resume Upload

```http
POST /api/resume/upload
```

### Resume Analysis

```http
POST /api/resume/analyze
```

### Generate Questions

```http
POST /api/interview/questions
```

### Submit Interview

```http
POST /api/interview/submit
```

### User Login

```http
POST /api/auth/login
```

### User Registration

```http
POST /api/auth/register
```

---

## Future Enhancements

- AI Mock Interviews
- Video Interview Analysis
- Facial Expression Detection
- Emotion Recognition
- Company-Specific Interview Preparation
- Coding Interview Simulator
- ATS Resume Checker
- Multi-Language Support
- AI Career Guidance

---

## Use Cases

- Students preparing for placements
- Freshers preparing for interviews
- Professionals seeking job transitions
- Colleges conducting mock interviews
- Training and placement departments

---

## Contributing

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature-name
```

3. Commit changes

```bash
git commit -m "Added new feature"
```

4. Push changes

```bash
git push origin feature-name
```

5. Create Pull Request

---

## License

This project is licensed under the MIT License.

---

## Author

**Ayush Agrahari**

