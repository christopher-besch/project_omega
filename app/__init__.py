from flask import Flask

from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager

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

from app import routes, models
