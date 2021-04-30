from datetime import datetime

from flask import render_template, flash, redirect, url_for, request, abort,  current_app
from flask.json import jsonify
from flask_login import current_user
from flask_login.utils import login_required
from app import db
from app import admin
from app.admin import bp
from app.admin.forms import CreateUserForm
from app.models import User


def admin_required() -> None:
    if not current_user.is_admin:
        abort(401)


# includes user creation form
@bp.route("/users")
@login_required
def users():
    admin_required()
    page = request.args.get("page", 1, type=int)
    users = User.query.order_by(User.is_admin.desc(), User.is_author.desc(), User.last_seen.desc()).paginate(
        page, current_app.config["USERS_PER_PAGE"], False)
    # None or pagination links
    prev_url = url_for(
        "admin.users", page=users.prev_num) if users.has_prev else None
    next_url = url_for(
        "admin.users", page=users.next_num) if users.has_next else None
    return render_template("users.html", users=users.items, prev_url=prev_url, next_url=next_url, amount_pages=users.pages, title="User Overview")


# includes user creation form
@bp.route("/create_user", methods=["GET", "POST"])
@login_required
def create_user():
    admin_required()
    form = CreateUserForm()
    if form.validate_on_submit():
        user = User(username=form.username.data,
                    email=form.email.data,
                    full_name=form.full_name.data)
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        flash(f"{form.username.data} has been created.", "info")
        return redirect(url_for("admin.users"))
    return render_template("create_user.html", form=form, title="Create User")


# ajax
@bp.route("/set_admin", methods=["POST"])
@login_required
def set_admin():
    admin_required()
    # todo: type might not be correct <- bad trust in client
    username: str = request.json["username"]
    status: bool = request.json["status"]
    user = User.query.filter_by(username=username).first()
    if user and user != current_user:
        user.change_admin_status(status)
        db.session.commit()
        return jsonify({"success": True, "status": status})
    return jsonify({"success": False})


# ajax
@bp.route("/set_author", methods=["POST"])
@login_required
def set_author():
    admin_required()
    # todo: type might not be correct <- bad trust in client
    username: str = request.json["username"]
    status: bool = request.json["status"]
    user = User.query.filter_by(username=username).first()
    if user:
        user.change_author_status(status)
        db.session.commit()
        return jsonify({"success": True, "status": status, "reload_page": user == current_user})
    return jsonify({"success": False})


# delete user
@bp.route('/delete_user/<username>')
@login_required
def delete_user(username):
    admin_required()
    user = User.query.filter_by(username=username).first()
    if not user or user == current_user:
        return redirect(url_for("admin.users"))
    return render_template("delete_user.html", user=user, title="Delete User")


# actually deleting an account
# ajax
@bp.route('/confirm_delete', methods=['POST'])
@login_required
def confirm_delete():
    admin_required()
    username = request.json["username"]
    # searching for user
    user = User.query.filter_by(username=username).first()
    if user and user != current_user:
        # deleting the user
        db.session.delete(user)
        db.session.commit()
        flash('{} has been deleted!'.format(user.username), "info")
        return jsonify({'success': True})
    return jsonify({'success': False})
