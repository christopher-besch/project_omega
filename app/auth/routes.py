from datetime import datetime

from flask import render_template, flash, redirect, url_for, request
from flask_login import current_user, login_user, logout_user, login_required
from werkzeug.urls import url_parse
from app import db
from app.auth import bp
from app.auth.forms import LoginForm, RegistrationForm
from app.models import User


@bp.route("/login", methods=["GET", "POST"])
def login():
    # already logged in?
    if current_user.is_authenticated:
        return redirect(url_for("main.index"))
    form = LoginForm()
    # trying to log in?
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        # unauthorized?
        if user is None or not user.check_password(form.password.data):
            flash("Invalid username of password", "error")
            return redirect(url_for("auth.login"))
        login_user(user, remember=form.remember_me.data)
        flash(f"Now logged in as {current_user.username}.", "info")
        # get next page
        next_page = request.args.get("next")
        # check if malisouse redirect to other website
        if not next_page or url_parse(next_page).netloc != "":
            next_page = url_for("main.index")
        return redirect(next_page)
    return render_template("auth/login.html", title="Sign In", form=form)


@bp.route("/logout")
def logout():
    logout_user()
    return redirect(url_for("main.index"))


@bp.route("/register", methods=["GET", "POST"])
def register():
    # already logged in?
    if current_user.is_authenticated:
        return redirect(url_for("main.index"))
    form = RegistrationForm()
    if form.validate_on_submit():
        user = User(username=form.username.data, email=form.email.data)
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        flash("Congratulations, you are now a registered user!", "info")
        return redirect(url_for("auth.login"))
    return render_template("auth/register.html", title="Registet", form=form)
