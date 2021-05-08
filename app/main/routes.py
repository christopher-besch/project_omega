import os
import re

from wtforms import meta

from app import db
from app.auth.access import author_required, edit_access_required
from app.main import bp
from app.main.forms import CreateArticleForm, MetaDataForm, UpdateArticleSourceForm
from app.models import Article, User
from flask import (current_app, flash, jsonify, redirect, render_template,
                   request, url_for)
from flask_login import current_user, login_required
from werkzeug.utils import secure_filename


@bp.route("/")
@bp.route("/index")
def index():
    return render_template("index.html", title="Home", canonical_url=url_for("main.index", _external=True))


@bp.route("/articles")
def articles():
    page = request.args.get("page", 1, type=int)
    # only listed articles for not logged in
    if not current_user.is_authenticated:
        articles = Article.query.filter(Article.unlisted == False).order_by(Article.created_on.desc()).paginate(
            page, current_app.config["ARTICLES_PER_PAGE"], False)
    # admins can see everything
    elif current_user.is_admin:
        articles = Article.query.order_by(Article.created_on.desc()).paginate(
            page, current_app.config["ARTICLES_PER_PAGE"], False)
    # listed and own articles for logged in
    else:
        articles = Article.query.filter(Article.unlisted == False or Article.authors.any(id=current_user.id)).order_by(Article.created_on.desc()).paginate(
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
    if article.unlisted:
        article.check_auth_token(request.args.get("token"))
    return render_template("article.html", article=article, title=article.title)


@bp.route("/create_article", methods=["GET", "POST"])
@login_required
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
        article.add_authors(current_user)
        db.session.add(article)
        db.session.commit()
        return redirect(url_for("main.articles"))
    return render_template("create_article.html", form=form, title="Create Article")


@bp.route("/edit_article/<internal_name>", methods=["GET", "POST"])
@login_required
def edit_article(internal_name: str):
    article = Article.query.filter_by(
        internal_name=internal_name).first_or_404()
    edit_access_required(article)

    update_source_form = UpdateArticleSourceForm()
    metadata_form = MetaDataForm()
    # load old data if not filled with new
    # got metadata form
    if "title" not in request.form:
        metadata_form.title.data = article.title
        metadata_form.subtitle.data = article.subtitle

    # save changes
    if "title" in request.form:
        article.title = metadata_form.title.data
        article.subtitle = metadata_form.subtitle.data
        article.modify()
        db.session.commit()
        flash("The metadata has been updated.", "info")

    if "source" in request.files and update_source_form.validate_on_submit():
        # temporarily save uploaded file
        source_file = request.files["source"]
        filename = secure_filename(source_file.filename)
        source_file.save(os.path.join(
            current_app.config["UPLOAD_FOLDER"], filename))
        source_file.seek(0)
        # read file and save new article
        source = str(source_file.read(), "utf-8")
        article.source = source
        article.compile()
        article.modify()
        db.session.commit()
        flash("The source has been updated.", "info")

    page = request.args.get("page", 1, type=int)
    # get all authors
    # todo: show authors of this article first
    users = User.query.filter_by(is_author=True).order_by(User.last_seen.desc()).paginate(
        page, current_app.config["USERS_PER_PAGE"], False)
    # None or pagination links
    prev_url = url_for(
        "main.edit_article", internal_name=internal_name, page=users.prev_num) if users.has_prev else None
    next_url = url_for(
        "main.edit_article", internal_name=internal_name, page=users.next_num) if users.has_next else None
    return render_template("edit_article.html",
                           article=article, users=users.items, metadata_form=metadata_form, update_source_form=update_source_form,
                           prev_url=prev_url, next_url=next_url, amount_pages=users.pages,
                           title=f"Edit {article.title}")


# ajax
# add or remove this user as author from this article
@bp.route("/set_author", methods=["POST"])
@login_required
def set_author():
    internal_name: str = request.json["internal_name"]
    username: str = request.json["username"]
    status: bool = request.json["status"]
    article = Article.query.filter_by(
        internal_name=internal_name).first()
    user = User.query.filter_by(username=username).first()
    edit_access_required(article)
    if user:
        if status:
            article.add_authors(user)
        else:
            article.rm_author(user)
        article.modify()
        db.session.commit()
        return jsonify({"success": True, "status": status})
    return jsonify({"success": False})


# ajax
@bp.route("/set_unlisted", methods=["POST"])
@login_required
def set_unlisted():
    internal_name: str = request.json["internal_name"]
    status: bool = request.json["status"]
    article = Article.query.filter_by(internal_name=internal_name).first()
    edit_access_required(article)
    article.unlisted = status
    db.session.commit()
    return jsonify({"success": True, "status": status})


# delete article
@bp.route('/delete_article/<internal_name>')
@login_required
def delete_article(internal_name: str):
    article = Article.query.filter_by(
        internal_name=internal_name).first()
    edit_access_required(article)
    if not article:
        return redirect(url_for("main.articles"))
    return render_template("delete_article.html", article=article, title="Delete Article")


# actually deleting an account
# ajax
@bp.route("/confirm_delete_article", methods=["POST"])
@login_required
def confirm_delete_article():
    internal_name = request.json["id"]
    article = Article.query.filter_by(
        internal_name=internal_name).first()
    edit_access_required(article)
    if article:
        db.session.delete(article)
        db.session.commit()
        flash('{} has been deleted!'.format(article.internal_name), "info")
        return jsonify({'success': True})
    return jsonify({'success': False})
