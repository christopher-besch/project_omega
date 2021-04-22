from jinja2.utils import internal_code
from app.main.forms import CreateArticleForm
from flask import render_template, flash, redirect, url_for, request, current_app, abort
from flask_login import current_user, login_user, logout_user, login_required
from app import db
from app.main import bp
from app.models import Article, User
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
    page = request.args.get("page", 1, type=int)
    articles = Article.query.order_by(Article.created_on.desc()).paginate(
        page, current_app.config["ARTICLES_PER_PAGE"], False)
    prev_url = url_for(
        "main.articles", page=articles.prev_num) if articles.has_prev else None
    next_url = url_for(
        "main.articles", page=articles.next_num) if articles.has_next else None
    return render_template("article_overview.html", articles=articles.items, prev_url=prev_url, next_url=next_url, amount_pages=articles.pages, title="Article Overview")


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
        source = form.source.data.stream.read()
        html = markdown.markdown(source, extensions=["extra"])
        article = Article(internal_name=form.internal_name.data,
                          name=form.name.data, source=source, html=html)
        db.session.add(article)
        db.session.commit()
        return redirect(url_for("main.articles"))
    return render_template("create_article.html", form=form, title="Create Article")
