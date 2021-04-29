import os
from jinja2.utils import internal_code
from werkzeug.utils import secure_filename
from app.main.forms import CreateArticleForm
from flask import render_template, flash, redirect, url_for, request, current_app, abort
from flask_login import current_user, login_user, logout_user, login_required
from app import db
from app.main import bp
from app.models import Article


def author_required() -> None:
    if not current_user.is_author:
        abort(401)


def author_access_required(article: Article) -> None:
    if not article.allow_access():
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


@bp.route("/article/<internal_name>")
def article(internal_name: str):
    article = Article.query.filter_by(
        internal_name=internal_name).first_or_404()
    return render_template("article.html", article=article, title=article.title)


@bp.route("/edit_article/<internal_name>")
def edit_article(internal_name: str):
    article = Article.query.filter_by(
        internal_name=internal_name).first_or_404()
    author_access_required(article)
    return render_template("edit_article.html", article=article, title=f"Edit {article.title}")


@bp.route("/create_article", methods=["GET", "POST"])
def create_article():
    author_required()
    form = CreateArticleForm()
    if form.validate_on_submit():
        # temporarily save uploaded file
        source_file = request.files["source"]
        filename = secure_filename(source_file.filename)
        source_file.save(os.path.join(
            current_app.config["UPLOAD_FOLDER"], filename))
        source_file.seek(0)
        # read file and save new article
        source = str(source_file.read(), "utf-8")
        article = Article(internal_name=form.internal_name.data,
                          title=form.title.data, source=source)
        article.compile()
        db.session.add(article)
        db.session.commit()
        return redirect(url_for("main.articles"))
    return render_template("create_article.html", form=form, title="Create Article")
