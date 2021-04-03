from datetime import datetime

from flask import render_template, flash, redirect, url_for, request
from flask_login import current_user, login_user, logout_user, login_required
from werkzeug.urls import url_parse
from app import app, db
from app.models import User


# update last seen
@app.before_request
def before_request():
    if current_user.is_authenticated:
        current_user.last_seen = datetime.utcnow()
        db.session.commit()


@app.route("/")
@app.route("/index")
def index():
    return render_template("index.html", title="Home", canonical_url=url_for("main.index", _external=True))


@app.route("/user/<username>")
@login_required
def user(username):
    user = User.query.filter_by(username=username).first_or_404()
    posts = [
        {'author': user, 'body': 'Test post #1'},
        {'author': user, 'body': 'Test post #2'}
    ]
    return render_template("user.html", user=user, posts=posts)


@app.route("/alert/<error_type>")
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


@app.route("/marca")
def marce():
    # smul
    return "Marca"
