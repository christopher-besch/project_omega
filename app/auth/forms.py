from flask_wtf import FlaskForm
from flask_login import current_user
from wtforms import StringField, PasswordField, BooleanField, SubmitField
from wtforms.validators import DataRequired, EqualTo, Email, ValidationError
from app.models import User


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


def validate_email(email: str) -> None:
    user = User.query.filter_by(email=email).first()
    if user is not None:
        raise ValidationError("Please use a different email address.")


class LoginForm(FlaskForm):
    username = StringField("Username", validators=[DataRequired()])
    password = PasswordField("Password", validators=[DataRequired()])
    remember_me = BooleanField("Remember Me")
    submit = SubmitField("Sign in")


class SettingsForm(FlaskForm):
    full_name = StringField("Full Name", validators=[DataRequired()])
    email = StringField("Email", validators=[DataRequired(), Email()])
    submit = SubmitField("Create New User")

    def __init__(self, user: User):
        super().__init__()
        self.user = user

    # email already taken?
    def validate_email(self, email) -> None:
        print(self.user)
        if email.data != self.user.email:
            validate_email(email.data)


class ChangePasswordForm(FlaskForm):
    password = PasswordField("New Password", validators=[DataRequired()])
    password2 = PasswordField("Repeat New Password", validators=[
                              DataRequired(), EqualTo("password")])
    submit = SubmitField("Create New User")
