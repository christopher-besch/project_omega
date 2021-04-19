from flask import render_template, flash, redirect, url_for, request, current_app, abort
from flask_login import current_user, login_user, logout_user, login_required
from app import db
from app.main import bp
from app.models import User


@bp.route("/")
@bp.route("/index")
def index():
    return render_template("index.html", title="Home", canonical_url=url_for("main.index", _external=True))


@bp.route("/marca")
def marca():
    # smul
    return "Marca Is Cool!"
