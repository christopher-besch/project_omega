import os
# basedir = os.path.abspath(os.path.dirname(__file__))
# print("sqlite:///" + os.path.join(basedir, "app.db"))


class Config(object):
    SECRET_KEY = os.environ.get("SECRET_KEY")

    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    if SQLALCHEMY_DATABASE_URI is None:
        raise EnvironmentError(
            "Can't find environment variable: DATABASE_URL")
    if SECRET_KEY is None:
        raise EnvironmentError(
            "Can't find environment variable: SECRET_KEY")
