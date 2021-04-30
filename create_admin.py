from sqlalchemy.orm import eagerload
from app.models import User
from app import db, create_app
from config import Config


def main():
    # setup
    app = create_app(Config)
    app_context = app.app_context()
    app_context.push()

    username = input("Input admin name: ")
    full_name = input("Full Name: ")
    email = input("Email: ")
    password = input('password: ')
    password2 = input('repeat password: ')

    user = User.query.filter_by(username=username).first()
    if password2 == password and user is None:
        # create user
        user = User(username=username, full_name=full_name,
                    email=email, is_admin=True)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()

        print('The admin account was successfully created!')
    else:
        print('An error occurred!')


if __name__ == "__main__":
    main()
