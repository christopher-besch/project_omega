from app import app, db
from app.models import User, Article, Citation, Source


@app.shell_context_processor
def make_shell_context():
    return {"db": db,
            "User": User,
            "Article": Article,
            "Citation": Citation,
            "Source": Source}
