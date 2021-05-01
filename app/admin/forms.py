from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField
from wtforms.validators import DataRequired, EqualTo, Email, ValidationError
from app.models import User
from app.validators import validate_username, validate_email


class CreateUserForm(FlaskForm):
    username = StringField("Username", validators=[DataRequired()])
    full_name = StringField("Full Name", validators=[DataRequired()])
    email = StringField("Email", validators=[DataRequired(), Email()])
    password = PasswordField("Password", validators=[DataRequired()])
    password2 = PasswordField("Password", validators=[
                              DataRequired(), EqualTo("password")])
    submit = SubmitField("Create New User")

    # automatically used by wtforms
    # username already taken?
    def validate_username(self, username) -> None:
        validate_username(username.data)

    # email already taken?
    def validate_email(self, email) -> None:
        validate_email(email.data)
