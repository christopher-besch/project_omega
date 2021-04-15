from datetime import datetime

from flask import render_template, flash, redirect, url_for, request, current_app, abort
from flask_login import current_user, login_user, logout_user, login_required
from werkzeug.urls import url_parse
from app import db
from app.main import bp
from app.models import User


# update last seen
@bp.before_request
def before_request():
    if current_user.is_authenticated:
        current_user.last_seen = datetime.utcnow()
        db.session.commit()


@bp.route("/")
@bp.route("/index")
def index():
    return render_template("main/index.html", title="Home", canonical_url=url_for("main.index", _external=True))


@bp.route("/user/<username>")
@login_required
def user(username):
    user = User.query.filter_by(username=username).first_or_404()
    posts = [
        {'author': user, 'body': 'Test post #1'},
        {'author': user, 'body': 'Test post #2'}
    ]
    return render_template("main/user.html", user=user, posts=posts)


@bp.route("/alert/<error_type>")
@login_required
def alert(error_type):
    flash("TEST ALERT", error_type)
    flash("TEST ALERT", error_type)
    flash("TEST ALERT", error_type)
    flash("TEST ALERT", error_type)
    flash("TEST ALERT", error_type)
    flash("TEST ALERT", error_type)
    flash("TEST ALERT", error_type)
    flash("TEST ALERT", error_type)
    return "Marca"


@bp.route("/marca")
def marca():
    # smul
    return "Marca Is Cool!"
