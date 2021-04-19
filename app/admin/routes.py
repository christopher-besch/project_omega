from datetime import datetime

from flask import render_template, flash, redirect, url_for, request, abort
from flask.json import jsonify
from flask_login import current_user
from flask_login.utils import login_required
from app import db
from app import admin
from app.admin import bp
from app.admin.forms import ChangePasswordForm, CreateUserForm
from app.models import User


def admin_required() -> None:
    if not current_user.is_admin:
        abort(401)


# includes user creation form
@bp.route("/users", methods=["GET", "POST"])
@login_required
def users():
    admin_required()
    form = CreateUserForm()
    users = User.query.all()
    if form.validate_on_submit():
        user = User(username=form.username.data,
                    email=form.email.data)
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        flash(f"{form.username.data} has been created.", "info")
        return redirect(url_for("admin.users"))
    return render_template("users.html", users=users, form=form, title="User Overview")


@login_required
@bp.route("/change_password/<username>", methods=["GET", "POST"])
def change_password(username: str):
    admin_required()
    form = ChangePasswordForm()
    user = User.query.filter_by(username=username).first_or_404()
    if form.validate_on_submit():
        user.set_password(form.password.data)
        db.session.commit()
        flash(f"The password of {username} got changed.", "info")
        return redirect(url_for("admin.users"))
    return render_template("change_password.html", user=user, form=form, title="Change Password")


# ajax
@bp.route("/set_admin", methods=["POST"])
@login_required
def set_admin():
    admin_required()
    # todo: type might not be correct <- bad trust in client
    username: str = request.json["username"]
    status: bool = request.json["status"]
    print(f"{username} to {status}")
    user = User.query.filter_by(username=username).first()
    if user:
        user.change_admin_status(status)
        db.session.commit()
        return jsonify({"success": True})
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
    print("deleting " + username)
    # searching for user
    user = User.query.filter_by(username=username).first()
    if user and user != current_user:
        # deleting the user
        db.session.delete(user)
        db.session.commit()
        flash('{} has been deleted!'.format(user.username), "info")
        return jsonify({'success': True})
    return jsonify({'success': False})
