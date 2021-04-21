from app.main.forms import CreateArticleForm
from flask import render_template, flash, redirect, url_for, request, current_app, abort
from flask_login import current_user, login_user, logout_user, login_required
from app import db
from app.main import bp
from app.models import User
import markdown


def author_required() -> None:
    if not current_user.is_author:
        abort(401)


@bp.route("/")
@bp.route("/index")
def index():
    return render_template("index.html", title="Home", canonical_url=url_for("main.index", _external=True))


@bp.route("/articles")
def articles():
    return render_template("article_overview.html", title="Article Overview")


@bp.route("/article")
def article():
    with open("article.md", "r", encoding="utf-8") as file:
        article_md = file.read()
    article_html = markdown.markdown(article_md, extensions=["extra"])
    return render_template("article.html", article=article_html, title="Article")


@bp.route("/create_article", methods=["GET", "POST"])
def create_article():
    author_required()
    form = CreateArticleForm()
    if form.validate_on_submit():
        print(form.name.data)
        print(form.internal_name.data)
        print(form.source.data)
        return "test"
    return render_template("create_article.html", form=form, title="Create Article")
