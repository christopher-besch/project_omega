import os
basedir = os.path.abspath(os.path.dirname(__file__))
os.environ["SECRET_KEY"] = f"sqlite:///{os.path.join(basedir, 'app.db')}"
os.environ["DATABASE_URL"] = "sqlite://"
