from datetime import datetime

from flask import render_template, flash, redirect, url_for, request, abort
from flask_login import current_user, login_user, logout_user, login_required
from werkzeug.urls import url_parse
from app import db
from app.auth import bp
from app.auth.forms import LoginForm, SettingsForm
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
            flash("Invalid username or password", "error")
            return redirect(url_for("auth.login"))
        login_user(user, remember=form.remember_me.data)
        flash(f"Now logged in as {current_user.username}.", "info")
        # get next page
        next_page = request.args.get("next")
        # check if malisouse redirect to other website
        if not next_page or url_parse(next_page).netloc != "":
            next_page = url_for("main.index")
        return redirect(next_page)
    return render_template("login.html", title="Sign In", form=form)


@bp.route("/logout")
def logout():
    logout_user()
    flash("You have been logged out.", "info")
    return redirect(url_for("main.index"))


# todo: not finished
@login_required
@bp.route("/settings", defaults={"username": None}, methods=["GET", "POST"])
@bp.route("/settings/<username>", methods=["GET", "POST"])
def settings(username):
    if not username:
        user = current_user
    else:
        user = User.query.filter_by(username=username).first_or_404()
    settings_form = SettingsForm()
    settings_form.full_name.data = user.full_name
    settings_form.email.data = user.email
    if settings_form.validate_on_submit():
        user.full_name = settings_form.full_name.data
        user.email = settings_form.email.data
        db.session.commit()
        flash(f"Your settings have been changed.", "info")
        return redirect(url_for("auth.logout"))
    return render_template("settings.html", form=settings_form, title=f"Change Settings of {username}")
