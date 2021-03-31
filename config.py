import os
from typing import List
# basedir = os.path.abspath(os.path.dirname(__file__))
# print("sqlite:///" + os.path.join(basedir, "app.db"))


class Config(object):
    SECRET_KEY = os.environ.get("SECRET_KEY")

    # database settings
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # mail settings
    MAIL_SERVER = os.environ.get("MAIL_SERVER")
    MAIL_PORT = int(os.environ.get("MAIL_PORT") or 25)
    MAIL_USE_TLS = os.environ.get("MAIL_USE_TLS") is not None
    MAIL_USERNAME = os.environ.get("MAIL_USERNAME")
    MAIL_PASSWORD = os.environ.get("MAIL_PASSWORD")
    # get admin emails
    ADMINS: List[str] = []
    idx = 0
    while True:
        new_admin = os.environ.get(f"ADMIN{idx}")
        if new_admin is not None:
            ADMINS.append(new_admin)
        else:
            break
        idx += 1

    if SQLALCHEMY_DATABASE_URI is None:
        raise EnvironmentError(
            "Can't find environment variable: DATABASE_URL")
    if SECRET_KEY is None:
        raise EnvironmentError(
            "Can't find environment variable: SECRET_KEY")
