import os
import sys
from flask import Flask, request, jsonify
from flask_cors import CORS
from config import Config
from transformers import pipeline
from PyPDF2 import PdfReader

# 🔥 Load FREE AI models
generator = pipeline("text-generation", model="distilgpt2")

# Path fix
root_dir = os.path.dirname(os.path.abspath(__file__))
nested_backend_dir = os.path.join(root_dir, "backend")
if nested_backend_dir not in sys.path:
    sys.path.insert(0, nested_backend_dir)

from database.db_config import db
from routes.auth_routes import auth_bp
from routes.interview_routes import interview_bp
from routes.analysis_routes import analysis_bp
from routes.dashboard_routes import dashboard_bp

app = Flask(__name__)
app.config.from_object(Config)

CORS(app)
db.init_app(app)

with app.app_context():
    db.create_all()

# 🔥 KEEP BLUEPRINTS
app.register_blueprint(auth_bp, url_prefix="/api")
app.register_blueprint(interview_bp, url_prefix="/api")
app.register_blueprint(analysis_bp, url_prefix="/api")
app.register_blueprint(dashboard_bp, url_prefix="/api")

# ------------------- DEFAULT ROUTE -------------------
@app.route("/")
def home():
    return {"msg": "Backend Running"}

# ------------------- TEMP USER STORAGE -------------------
users = {}

# ------------------- REGISTER -------------------
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    print("🔥 REGISTER HIT:", username)

    if not username or not password:
        return jsonify({"success": False})

    if username in users:
        return jsonify({"success": False})

    users[username] = password
    return jsonify({"success": True})

# ------------------- LOGIN -------------------
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    print("🔥 LOGIN HIT:", username)

    if username in users and users[username] == password:
        return jsonify({"success": True})

    return jsonify({"success": False})

# ------------------- RESUME UPLOAD -------------------
@app.route('/upload-resume', methods=['POST'])
def upload_resume():
    try:
        file = request.files['resume']

        reader = PdfReader(file)
        text = ""

        for page in reader.pages:
            text += page.extract_text() or ""

        return jsonify({"resume_text": text})

    except Exception as e:
        return jsonify({"error": str(e)})

# ------------------- AI QUESTION GENERATION -------------------
@app.route('/generate-questions', methods=['POST'])
def generate_questions():
    data = request.get_json()
    resume = data.get("resume_text", "")

    prompt = f"Generate 5 interview questions based on this resume:\n{resume}"

    result = generator(prompt, max_length=150, num_return_sequences=1)

    text = result[0]['generated_text']

    questions = text.split("?")
    questions = [q.strip() + "?" for q in questions if q.strip()][:5]

    return jsonify({"questions": questions})

# ------------------- AI ANSWER ANALYSIS -------------------
@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    answer = data.get("answer", "")

    prompt = f"""
Evaluate this interview answer:
Answer: {answer}

Give:
1. Score out of 10
2. Feedback
3. Improvement tips
"""

    result = generator(prompt, max_length=200, num_return_sequences=1)

    return jsonify({"result": result[0]['generated_text']})

# ------------------- RUN SERVER -------------------
if __name__ == "__main__":
    app.run(debug=True)