from app.models import Article
from app.validators import validate_internal_name
from flask_wtf import FlaskForm
from wtforms import FileField, StringField, SubmitField
from wtforms.validators import DataRequired, ValidationError


class CreateArticleForm(FlaskForm):
    title = StringField("Name", validators=[DataRequired()])
    internal_name = StringField("Internal Name", validators=[DataRequired()])
    source = FileField("Source Upload", validators=[DataRequired()])
    submit = SubmitField("Create")

    # automatically used by wtforms
    # name already taken?
    def validate_internal_name(self, internal_article_name: str) -> None:
        validate_internal_name(internal_article_name.data)
