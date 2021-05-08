import os

from app.models import Article
from flask import abort
from flask_login import current_user


def author_required() -> None:
    if not current_user.is_author:
        abort(401)


# admin or author of specific article
def edit_access_required(article: Article) -> None:
    if not article:
        abort(404)
    if not article.allow_access():
        abort(401)


def admin_required() -> None:
    if not current_user.is_admin:
        abort(401)
