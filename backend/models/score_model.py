from database.db_config import db

class Score(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    answer_id = db.Column(db.Integer)
    technical_score = db.Column(db.Integer)
    communication_score = db.Column(db.Integer)
    confidence_score = db.Column(db.Integer)