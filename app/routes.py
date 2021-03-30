from flask import render_template, flash, redirect, url_for, request
from flask_login import current_user, login_user, logout_user, login_required
from werkzeug.urls import url_parse
from app import app, db
from app.forms import LoginForm
from app.models import User


@app.route("/")
@app.route("/index")
def index():
    return render_template("index.html", title="Home", posts=posts)


@app.route("/login", methods=["GET", "POST"])
def login():
    # already logged in?
    if current_user.is_authenticated:
        return redirect(url_for("index"))
    form = LoginForm()
    # trying to log in?
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        # unauthorized?
        if user is None or not user.check_password(form.password.data):
            flash("Invalid username of password")
            return redirect(url_for("login"))
        login_user(user, remember=form.remember_me.data)
        # get next page
        next_page = request.args.get("next")
        # check if malisouse redirect to other website
        if not next_page or url_parse(next_page).netloc != "":
            next_page = url_for("index")
        return redirect(next_page)
    return render_template("login.html", title="Sign In", form=form)


@app.route("/logout")
def logout():
    logout_user()
    return redirect(url_for("index"))


@app.route("/test")
@login_required
def test():
    return "test"
