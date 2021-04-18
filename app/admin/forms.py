from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField
from wtforms.validators import DataRequired, EqualTo, Email, ValidationError
from app.models import User


class ChangePasswordForm(FlaskForm):
    password = PasswordField("Password", validators=[DataRequired()])
    password2 = PasswordField("Password", validators=[
                              DataRequired(), EqualTo("password")])
    submit = SubmitField("Change Password")

    # automatically used by wtforms
    # username already taken?
    def validate_username(self, username) -> None:
        user = User.query.filter_by(username=username.data).first()
        if user is not None:
            raise ValidationError("Please us a different username.")
        # any disallowed characters used?
        disallowed_characters = set()
        for char in username.data:
            if not ord("a") <= ord(char) <= ord("z") and \
               not ord("A") <= ord(char) <= ord("Z") and \
               not char == "_":
                quote = "'" if char != "'" else '"'
                disallowed_characters.add(f"{quote}{char}{quote}")
        if len(disallowed_characters) != 0:
            disallowed_characters_str = ", ".join(disallowed_characters)
            raise ValidationError(
                f"Only lower, upper case latin letters and underscores are supported for username; these are not allowed: {disallowed_characters_str}")


class CreateUserForm(FlaskForm):
    username = StringField("Username", validators=[DataRequired()])
    email = StringField("Email", validators=[DataRequired(), Email()])
    password = PasswordField("Password", validators=[DataRequired()])
    password2 = PasswordField("Password", validators=[
                              DataRequired(), EqualTo("password")])
    submit = SubmitField("Create New User")

    # automatically used by wtforms
    # username already taken?
    def validate_username(self, username) -> None:
        user = User.query.filter_by(username=username.data).first()
        if user is not None:
            raise ValidationError("Please us a different username.")
        # any disallowed characters used?
        disallowed_characters = set()
        for char in username.data:
            if not ord("a") <= ord(char) <= ord("z") and \
               not ord("A") <= ord(char) <= ord("Z") and \
               not char == "_":
                quote = "'" if char != "'" else '"'
                disallowed_characters.add(f"{quote}{char}{quote}")
        if len(disallowed_characters) != 0:
            disallowed_characters_str = ", ".join(disallowed_characters)
            raise ValidationError(
                f"Only lower, upper case latin letters and underscores are supported for username; these are not allowed: {disallowed_characters_str}")

    # email already taken?
    def validate_email(self, email) -> None:
        user = User.query.filter_by(email=email.data).first()
        if user is not None:
            raise ValidationError("Please use a different email address.")
