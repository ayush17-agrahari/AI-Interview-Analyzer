from flask import Blueprint

dashboard_bp = Blueprint("dashboard", __name__)

@dashboard_bp.route("/stats")
def stats():
    return {"total": 5, "average": 70}