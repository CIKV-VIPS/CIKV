from flask import Blueprint, request, jsonify #type:ignore
from ..models.user_model import User
from ..extensions import db #type:ignore
from flask_jwt_extended import create_access_token #type:ignore

auth_bp = Blueprint("auth_bp", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    user_id = data.get("user_id")
    password = data.get("password")

    if not user_id or not password:
        return jsonify({"message": "User ID and password are required"}), 400

    existing = User.query.filter_by(user_id=user_id).first()
    if existing:
        return jsonify({"message": "User ID already exists"}), 409

    user = User(user_id=user_id)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "Registration successful", "user": user.to_dict()}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    user_id = data.get("user_id")
    password = data.get("password")

    if not user_id or not password:
        return jsonify({"message": "User ID and password are required"}), 400

    user = User.query.filter_by(user_id=user_id).first()
    if user and user.check_password(password):
        access_token = create_access_token(identity=user.user_id)
        return jsonify({"message": "Login successful", "access_token": access_token, "user": user.to_dict()}), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401
