from flask import Blueprint, request
from ai_engine.answer_analyzer import analyze_answer
from ai_engine.scoring_engine import generate_score

analysis_bp = Blueprint("analysis", __name__)

@analysis_bp.route("/analyze", methods=["POST"])
def analyze():
    data = request.json

    analysis = analyze_answer(data["answer"])
    score = generate_score(analysis)

    return {"analysis": analysis, "score": score}