from flask import Blueprint
from ai_engine.question_generator import generate_questions

interview_bp = Blueprint("interview", __name__)

@interview_bp.route("/questions")
def questions():
    return {"questions": generate_questions()}