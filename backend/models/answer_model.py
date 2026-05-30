from database.db_config import db

class Answer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    interview_id = db.Column(db.Integer)
    question_id = db.Column(db.Integer)
    answer_text = db.Column(db.Text)