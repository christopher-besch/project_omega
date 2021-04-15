# project_omega

## Build

-   `git clone https://github.com/christopher-besch/project_omega.git --recursive`
-   `python3 -m venv venv`
-   `source venv/bin/activate`
<!-- -   `pip install -r requirements.txt` -->
-   install dependencies
-   `python3 setup.py > .env`

## Requirements

-   python-dotenv
-   flask
-   flask_sqlalchemy
-   flask_migrate
-   flask_login
-   flask_wtf
-   email_validator
-   flask_moment

## commands

-   `flask db init`
-   `flask db migrate -m "comment"`
-   `flask db upgrade`
