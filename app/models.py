from datetime import datetime
from typing import List
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


# relationships:
# article one-to-many citation
# citation many-to-one article
# citation many-to-one source
# source one-to-many citation
# -> basically a many-to-many between article and source
# -> using citation as the edge e.g. storing page number of citation

# represent a single article, but content of article is stored in file
class Article(db.Model):
    __tablename__ = "article"
    id = db.Column(db.Integer, primary_key=True)
    # location of the actual article
    file_name = db.Column(db.String(64))

    # many citations
    # citation get deleted when not referenced anymore
    citations = db.relationship("Citation", back_populates="article",
                                cascade="all, delete-orphan")

    def add_citation(self, citation: "Citation") -> None:
        if not self.is_cited(citation):
            self.citations.append(citation)

    def rm_citation(self, citation: "Citation") -> None:
        if self.is_cited(citation):
            self.citations.remove(citation)

    def is_cited(self, citation: "Citation") -> bool:
        # todo: shouldn't use python in
        return citation in self.citations

    def __repr__(self):
        return f"<Article {self.file_name}>"


# represent edge between a single article and source
# includes extra information
class Citation(db.Model):
    __tablename__ = "citation"
    id = db.Column(db.Integer, primary_key=True)
    extra_data = db.Column(db.String(140))

    # one article this citation belongs to
    article_id = db.Column(db.Integer, db.ForeignKey("article.id"))
    article = db.relationship("Article", back_populates="citations")

    # one source this citation uses
    # citations must have one source, but if the source gets deleted, the citation gets flagged as corrupted instead of being deleted
    source_id = db.Column(db.Integer, db.ForeignKey("source.id"))
    source = db.relationship("Source", back_populates="citations")

    def check_integrity(self) -> bool:
        # corrupted if the source has been deleted
        return self.article is not None

    def __repr__(self):
        return f"<Citation {self.extra_data}>"


# source for citation, like with biblatex
class Source(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128))
    author = db.Column(db.String(128))
    # year the work has been published
    year = db.Column(db.Date)

    # sources are allowed to not be used by a single citation
    citations = db.relationship("Citation", back_populates="source")

    def __repr__(self):
        return f"<Source {self.name}>"


# load user from database to log them in
@login.user_loader
def login_user(id) -> User:
    return User.query.get(int(id))
