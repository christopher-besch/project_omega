from typing import Optional, Tuple
import os

from flask import Flask
from flask.helpers import total_seconds

from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager

import logging
from logging.handlers import SMTPHandler, RotatingFileHandler

from config import Config

# app setup
app = Flask(__name__)
app.config.from_object(Config)

# Authentication
login = LoginManager(app)
login.login_view = "login"

# database setup
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# mail setup
# when MAIL_SERVER is not defined or debug is enabled, no email will be used
if not app.debug and app.config["MAIL_SERVER"]:
    # get authentication
    auth: Optional[Tuple[str, str]] = None
    if app.config["MAIL_USERNAME"] or app.config["MAIL_PASSWORD"]:
        auth = (app.config["MAIL_USERNAME"], app.config["MAIL_PASSWORD"])
    # get tls
    secure: any = None
    if app.config["MAIL_USE_TLS"]:
        secure = ()

    mail_handler = SMTPHandler(
        mailhost=(app.config["MAIL_SERVER"], app.config["MAIL_PORT"]),
        fromaddr="no-reply@" + app.config["MAIL_SERVER"],
        toaddrs=app.config["ADMINS"], subject="Microblog Failure",
        credentials=auth, secure=secure)
    mail_handler.setLevel(logging.ERROR)
    app.logger.addHandler(mail_handler)

# file logger
if not app.debug:
    if not os.path.exists("logs"):
        os.mkdir("logs")
    file_handler = RotatingFileHandler("logs/project_omega.log", maxBytes=10240, backupCount=10)
    file_handler.setFormatter(logging.Formatter("%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]"))
    file_handler.setLevel(logging.INFO)
    app.logger.addHandler(file_handler)

    app.logger.setLevel(logging.INFO)
    app.logger.info("Project Omega startup")

from app import routes, models, errors
