from flask import Blueprint, request, jsonify
from ..models.form_model import Form
from ..extensions import db
from flask_jwt_extended import jwt_required

forms_bp = Blueprint("forms_bp", __name__)

@forms_bp.route("/forms", methods=["POST"])
@jwt_required()
def create_form():
    data = request.get_json()
    title = data.get("title")
    google_form_link = data.get("google_form_link")
    status = data.get("status", "inactive")

    if not title or not google_form_link:
        return jsonify({"message": "Title and Google Form link are required"}), 400

    form = Form(title=title, google_form_link=google_form_link, status=status)
    db.session.add(form)
    db.session.commit()

    return jsonify({"message": "Form created successfully", "form": form.to_dict()}), 201

@forms_bp.route("/forms", methods=["GET"])
def get_forms():
    forms = Form.query.all()
    return jsonify([form.to_dict() for form in forms]), 200

@forms_bp.route("/forms/<int:id>", methods=["GET"])
def get_form(id):
    form = Form.query.get_or_404(id)
    return jsonify(form.to_dict()), 200

@forms_bp.route("/forms/<int:id>", methods=["PUT"])
@jwt_required()
def update_form(id):
    form = Form.query.get_or_404(id)
    data = request.get_json()
    form.title = data.get("title", form.title)
    form.google_form_link = data.get("google_form_link", form.google_form_link)
    form.status = data.get("status", form.status)
    db.session.commit()
    return jsonify({"message": "Form updated successfully", "form": form.to_dict()}), 200

@forms_bp.route("/forms/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_form(id):
    form = Form.query.get_or_404(id)
    db.session.delete(form)
    db.session.commit()
    return jsonify({"message": "Form deleted successfully"}), 200
