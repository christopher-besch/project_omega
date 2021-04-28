from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, FileField
from wtforms.validators import DataRequired, ValidationError
from app.models import Article


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


class CreateArticleForm(FlaskForm):
    title = StringField("Name", validators=[DataRequired()])
    internal_name = StringField("Internal Name", validators=[DataRequired()])
    source = FileField("Source Upload", validators=[DataRequired()])
    submit = SubmitField("Create")

    # automatically used by wtforms
    # name already taken?
    def validate_internal_name(self, internal_article_name: str) -> None:
        validate_internal_name(internal_article_name.data)
