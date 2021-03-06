from app.models import User
from app.validators import validate_email
from flask_wtf import FlaskForm
from wtforms import BooleanField, PasswordField, StringField
from wtforms.validators import DataRequired, Email, EqualTo, ValidationError


class LoginForm(FlaskForm):
    username = StringField("Username", validators=[DataRequired()])
    password = PasswordField("Password", validators=[DataRequired()])
    remember_me = BooleanField("Remember Me")


class SettingsForm(FlaskForm):
    full_name = StringField("Full Name", validators=[DataRequired()])
    email = StringField("Email", validators=[DataRequired(), Email()])

    def __init__(self, user: User):
        super().__init__()
        self.user = user

    # email already taken?
    def validate_email(self, email) -> None:
        if email.data != self.user.email:
            validate_email(email.data)


class ChangePasswordForm(FlaskForm):
    password = PasswordField("New Password", validators=[DataRequired()])
    password2 = PasswordField("Repeat New Password", validators=[
                              DataRequired(), EqualTo("password")])
