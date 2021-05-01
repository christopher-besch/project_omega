from wtforms.validators import ValidationError
from app.models import User, Article


def validate_username(username: str) -> None:
    user = User.query.filter_by(username=username).first()
    if user is not None:
        raise ValidationError("Please us a different username.")
    # any disallowed characters used?
    disallowed_characters = set()
    for char in username:
        if not ord("a") <= ord(char) <= ord("z") and \
                not ord("A") <= ord(char) <= ord("Z") and \
                not char == "_":
            quote = "'" if char != "'" else '"'
            disallowed_characters.add(f"{quote}{char}{quote}")
    if len(disallowed_characters) != 0:
        disallowed_characters_str = ", ".join(disallowed_characters)
        raise ValidationError(
            f"Only lower, upper case latin letters and underscores are supported for username; these are not allowed: {disallowed_characters_str}")


def validate_internal_name(internal_article_name: str) -> None:
    article = Article.query.filter_by(
        internal_name=internal_article_name).first()
    if article is not None:
        raise ValidationError("Please us a different article name.")
    # any disallowed characters used?
    disallowed_characters = set()
    for char in internal_article_name:
        if not ord("a") <= ord(char) <= ord("z") and \
                not ord("A") <= ord(char) <= ord("Z") and \
                not char == "_":
            quote = "'" if char != "'" else '"'
            disallowed_characters.add(f"{quote}{char}{quote}")
    if len(disallowed_characters) != 0:
        disallowed_characters_str = ", ".join(disallowed_characters)
        raise ValidationError(
            f"Only lower, upper case latin letters and underscores are supported for internal article names; these are not allowed: {disallowed_characters_str}")


def validate_email(email: str) -> None:
    user = User.query.filter_by(email=email).first()
    if user is not None:
        raise ValidationError("Please use a different email address.")
