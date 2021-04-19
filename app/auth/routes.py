from datetime import datetime

from flask import render_template, flash, redirect, url_for, request, abort
from flask_login import current_user, login_user, logout_user, login_required
from werkzeug.urls import url_parse
from app import db
from app.auth import bp
from app.auth.forms import LoginForm, ChangePasswordForm
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
        flash(f"Now logged in as {current_user.username}.", "warning")
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


@login_required
@bp.route("/change_password", methods=["GET", "POST"])
def change_password():
    form = ChangePasswordForm()
    if form.validate_on_submit():
        current_user.set_password(form.password.data)
        db.session.commit()
        flash(f"Your password has been changed.", "info")
        return redirect(url_for("auth.logout"))
    return render_template("change_password.html", form=form, title="Change Password")
