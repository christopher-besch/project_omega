from datetime import datetime
from flask_login import current_user
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from app import db, login
import markdown

# relationships:
# user     many-to-many article
# article  many-to-many user
#
# article  one-to-many  citation
# citation many-to-one  article
# citation many-to-one  source
# source   one-to-many  citation
# -> basically a many-to-many between article and source
# -> using citation as the edge e.g. storing page number of citation


user_article_association = db.Table(
    "user_article_association", db.Model.metadata,
    db.Column("user_id", db.Integer,
              db.ForeignKey("user.id")),
    db.Column("article_id", db.Integer,
              db.ForeignKey("article.id"))
)


class User(UserMixin, db.Model):
    __tablename__ = "user"
    id = db.Column(db.Integer, primary_key=True)
    # login
    username = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)
    password_hash = db.Column(db.String(128))

    # data
    full_name = db.Column(db.String(120))
    last_seen = db.Column(db.DateTime, default=datetime.utcnow)
    # flags
    is_admin = db.Column(db.Boolean, default=False)

    # role flags
    is_admin = db.Column(db.Boolean, default=False)
    is_author = db.Column(db.Boolean, default=False)

    # many articles
    articles = db.relationship(
        "Article",
        secondary=user_article_association,
        back_populates="authors"
    )

    def change_admin_status(self, status: bool) -> None:
        self.is_admin = status

    def change_author_status(self, status: bool) -> None:
        self.is_author = status

    # passwords
    def set_password(self, password: str) -> None:
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f"<User {self.username}>"


class Article(db.Model):
    __tablename__ = "article"
    id = db.Column(db.Integer, primary_key=True)
    internal_name = db.Column(db.String(64), index=True, unique=True)
    title = db.Column(db.String(64))
    sub_title = db.Column(db.String(64))
    last_modified = db.Column(db.DateTime, default=datetime.utcnow)
    created_on = db.Column(db.DateTime, default=datetime.utcnow)

    # data
    source = db.Column(db.String(1000000))
    html = db.Column(db.String(1000000))

    # many users
    authors = db.relationship(
        "User",
        secondary=user_article_association,
        back_populates="articles"
    )

    # many citations
    # citation get deleted when not referenced anymore
    citations = db.relationship(
        "Citation",
        back_populates="article",
        cascade="all, delete-orphan"
    )

    def compile(self) -> None:
        self.html = markdown.markdown(self.source, extensions=["extra"])

    def get_authors(self) -> str:
        authors = ""
        for idx, author in enumerate(self.authors):
            authors += author.full_name
            if idx == len(self.authors) - 2:
                authors += " and "
            elif idx == len(self.authors) - 1:
                pass
            else:
                authors += ", "
        return authors

    def allow_access(self) -> bool:
        return current_user.is_admin or current_user in self.authors

    # author control
    def add_authors(self, *authors: "User") -> None:
        for author in authors:
            if not self.is_author(author):
                self.authors.append(author)

    def rm_author(self, author: "User") -> None:
        if self.is_cited(author):
            self.authors.remove(author)

    def is_author(self, author: "User") -> bool:
        return author in self.authors

    # citation control
    def add_citations(self, *citations: "Citation") -> None:
        for citation in citations:
            if not self.is_cited(citation):
                self.citations.append(citation)

    def rm_citation(self, citation: "Citation") -> None:
        if self.is_cited(citation):
            self.citations.remove(citation)

    def is_cited(self, citation: "Citation") -> bool:
        return citation in self.citations

    def __repr__(self):
        return f"<Article {self.name}>"


# represent edge between a single article and source
# includes extra information
class Citation(db.Model):
    __tablename__ = "citation"
    id = db.Column(db.Integer, primary_key=True)
    time_stamp_hour = db.Column(db.Integer)
    time_stamp_minute = db.Column(db.Integer)
    time_stamp_second = db.Column(db.Integer)
    page = db.Column(db.Integer)
    line = db.Column(db.Integer)

    # one article this citation belongs to
    article_id = db.Column(db.Integer, db.ForeignKey("article.id"))
    article = db.relationship("Article", back_populates="citations")

    # one source this citation uses
    # citations must have one source, but if the source gets deleted, the citation gets flagged as corrupted instead of being deleted
    source_id = db.Column(db.Integer, db.ForeignKey("source.id"))
    source = db.relationship("Source", back_populates="citations")

    def set_source(self, source: "Source") -> None:
        source.add_citation(self)

    def check_integrity(self) -> bool:
        # corrupted if the source has been deleted
        return self.article is not None

    def get_time_stamp(self) -> str:
        hour = self.time_stamp_hour if self.time_stamp_hour is not None else 0
        minute = self.time_stamp_minute if self.time_stamp_minute is not None else 0
        second = self.time_stamp_second if self.time_stamp_second is not None else 0
        return f"{hour:02}:{minute:02}:{second:02}"

    def __repr__(self):
        name = ""
        if self.time_stamp_hour is not None or self.time_stamp_minute is not None or self.time_stamp_second is not None:
            name += self.get_time_stamp()
        else:
            if self.page is not None:
                name += f"p. {self.page}"
                if self.line is not None:
                    name += f" l. {self.line}"
        return f"<Citation {name} from {str(self.article)} with {str(self.source)}>"


# source for citation, like with biblatex
class Source(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    # like bibtex reference
    ref = db.Column(db.String(32), unique=True)
    # or "quote" if name unknown
    name = db.Column(db.String(128))
    author = db.Column(db.String(128))
    publisher = db.Column(db.String(128))
    year = db.Column(db.Integer)
    url = db.Column(db.String(128))
    accessed_on = db.Column(db.DateTime, default=datetime.utcnow)

    # sources are allowed to not be used by a single citation
    citations = db.relationship("Citation", back_populates="source")

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
        return f"<Source {self.ref}>"


# load user from database to log them in
@login.user_loader
def login_user(id) -> User:
    return User.query.get(int(id))
