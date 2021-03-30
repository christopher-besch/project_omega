from datetime import datetime
from app import db


# representing a single user in the database
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)
    password_hash = db.Column(db.String(128))
    comments = db.relationship("Comment", backref="author", lazy="dynamic")

    def __repr__(self):
        return f"<User {self.username}>"


# represent single post by one user
class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    body = db.Column(db.String(140))
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))

    def __repr__(self):
        return f"<Post {self.body}>"

# like biblatex citation
# class Citation(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
