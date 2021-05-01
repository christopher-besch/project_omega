from app import db
from app.admin import admin_required
from app.auth import bp
from app.auth.forms import ChangePasswordForm, LoginForm, SettingsForm
from app.models import User
from flask import flash, redirect, render_template, request, url_for
from flask_login import current_user, login_required, login_user, logout_user
from werkzeug.urls import url_parse


@bp.route("/login", methods=["GET", "POST"])
def login():
    # already logged in?
    if current_user.is_authenticated:
        return redirect(url_for("main.index"))
    form = LoginForm()
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
        # check if malicious redirect to other website
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
@bp.route("/settings", defaults={"username": None}, methods=["GET", "POST"])
@bp.route("/settings/<username>", methods=["GET", "POST"])
def settings(username):
    # determin right user
    if not username:
        user = current_user
    else:
        # only admins can change other peoples settings
        admin_required()
        user = User.query.filter_by(username=username).first_or_404()
    # get forms
    settings_form = SettingsForm(user)
    change_password_form = ChangePasswordForm()

    # load old data if not filled with new
    # got settings form from client
    if "full_name" not in request.form:
        settings_form.full_name.data = user.full_name
        settings_form.email.data = user.email
    # got change password form from client
    elif "password" not in request.form:
        change_password_form.password.data = ""
        change_password_form.password2.data = ""

    if "full_name" in request.form and settings_form.validate_on_submit():
        user.full_name = settings_form.full_name.data
        user.email = settings_form.email.data
        db.session.commit()
        flash(f"The changes have been saved.", "info")

    if "password" in request.form and change_password_form.validate_on_submit():
        user.set_password(change_password_form.password.data)
        db.session.commit()
        flash(f"The password has been changed.", "info")
    return render_template("settings.html", user=user, settings_form=settings_form, change_password_form=change_password_form, title=f"Change Settings of {username}")
