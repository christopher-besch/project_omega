from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from app import db, login


# representing a single user in the database
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)
    password_hash = db.Column(db.String(128))
    comments = db.relationship("Comment", backref="author", lazy="dynamic")
    last_seen = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<User {self.username}>"

    # passwords
    def set_password(self, password: str) -> None:
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)


# represent single post by one user
class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    body = db.Column(db.String(140))
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))

    def __repr__(self):
        return f"<Post {self.body}>"


# represent a single article, but content of article is stored in file
class Article(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    file_name = db.Column(db.String(64))
    citations =

    def __repr__(self):
        return f"<Article {self.file_name}"


# like biblatex citation
class Citation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    # name of the cited work
    name = db.Column(db.String(128))
    # author of the work
    author = db.Column(db.String(128))
    # year the work has been published
    year = db.Column(db.Date)

    def __repr__(self):
        return f"<Citation {self.name}>"


citations = db.Table("citations",
                     db.Column("article_id", db.Integer,
                               db.ForeignKey("article.id")),
                     db.Column("citaton_id", db.Integer,
                               db.ForeignKey("citation.id")))


# load user from database to log them in
@login.user_loader
def login_user(id) -> User:
    return User.query.get(int(id))
