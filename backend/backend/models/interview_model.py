from database.db_config import db

class Interview(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    domain = db.Column(db.String(100))