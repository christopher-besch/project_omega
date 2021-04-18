from datetime import datetime
from typing import Optional, Tuple
import os

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager, current_user
import logging
from logging.handlers import SMTPHandler, RotatingFileHandler

from config import Config

db = SQLAlchemy()
migrate = Migrate()
login = LoginManager()
login.login_view = "auth.login"
login.login_message = "You need to be logged in to access this page."

def create_app(config_class=Config) -> Flask:
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)
    login.init_app(app)

    # blueprints
    from app.errors import bp as errors_bp
    app.register_blueprint(errors_bp)

    from app.auth import bp as auth_bp
    app.register_blueprint(auth_bp, url_prefix='/auth')

    from app.admin import bp as admin_bp
    app.register_blueprint(admin_bp, url_prefix='/admin')

    from app.main import bp as main_bp
    app.register_blueprint(main_bp)

    if not app.debug and not app.testing:
        # mail setup
        # when MAIL_SERVER is not defined or debug is enabled, no email will be used
        if app.config["MAIL_SERVER"]:
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
        if not os.path.exists("logs"):
            os.mkdir("logs")
        file_handler = RotatingFileHandler("logs/project_omega.log", maxBytes=10240, backupCount=10)
        file_handler.setFormatter(logging.Formatter("%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]"))
        file_handler.setLevel(logging.INFO)
        app.logger.addHandler(file_handler)

        app.logger.setLevel(logging.INFO)
        app.logger.info("Project Omega startup")
    
    # update last seen
    @app.before_request
    def before_request():
        if current_user.is_authenticated:
            current_user.last_seen = datetime.utcnow()
            db.session.commit()
    
    return app

from app import models
