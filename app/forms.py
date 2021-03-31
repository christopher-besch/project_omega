from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField
from wtforms.validators import DataRequired, EqualTo, Email, ValidationError
from app.models import User


class LoginForm(FlaskForm):
    username = StringField("Username", validators=[DataRequired()])
    password = PasswordField("Password", validators=[DataRequired()])
    remember_me = BooleanField("Remember Me")
    submit = SubmitField("Sign in")


class RegistrationForm(FlaskForm):
    username = StringField("Username", validators=[DataRequired()])
    email = StringField("Email", validators=[DataRequired(), Email()])
    password = PasswordField("Password", validators=[DataRequired()])
    password2 = PasswordField("Password", validators=[
                              DataRequired(), EqualTo("password")])
    submit = SubmitField("Register")

    # automatically used by wtforms
    # username already taken?
    def validate_username(self, username) -> None:
        user = User.query.filter_by(username=username.data).first()
        if user is not None:
            raise ValidationError("Please us a different username.")

    # email already taken?
    def validate_email(self, email) -> None:
        user = User.query.filter_by(email=email.data).first()
        if user is not None:
            raise ValidationError("Please use a different email address.")
