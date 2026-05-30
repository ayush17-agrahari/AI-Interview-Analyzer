from database.db_config import db

class Report(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    interview_id = db.Column(db.Integer)
    overall_score = db.Column(db.Integer)
    feedback = db.Column(db.Text)