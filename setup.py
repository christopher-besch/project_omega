import os
basedir = os.path.abspath(os.path.dirname(__file__))
print(f"SECRET_KEY={os.urandom(16)}")
print(f"DATABASE_URL=sqlite:///{os.path.join(basedir, 'app.db')}")
