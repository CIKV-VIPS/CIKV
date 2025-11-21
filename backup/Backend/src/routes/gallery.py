from flask import Blueprint, request, jsonify #type:ignore
from ..models.gallery_model import GalleryImage #type:ignore
from ..extensions import db #type:ignore

gallery_bp = Blueprint("gallery_bp", __name__)

# ---- ADD IMAGE ----
@gallery_bp.route("/gallery/", methods=["POST"])
def add_image():
    data = request.get_json()
    image = GalleryImage(
        event_name=data.get("event_name"),
        image_url=data.get("image_url")
    )
    db.session.add(image)
    db.session.commit()
    return jsonify({"message": "Image added successfully", "image": image.to_dict()}), 201


# ---- GET ALL IMAGES ----
@gallery_bp.route("/gallery/", methods=["GET"])
def get_images():
    try:
        images = GalleryImage.query.order_by(GalleryImage.uploaded_at.desc()).all()
        return jsonify([img.to_dict() for img in images]), 200
    except Exception as e:
        return jsonify({"message": f"Error fetching images: {str(e)}"}), 500


# ---- GET IMAGES BY EVENT ----
@gallery_bp.route("/gallery/events/<string:event_name>", methods=["GET"])
def get_images_by_event(event_name):
    try:
        images = GalleryImage.query.filter_by(event_name=event_name).all()
        return jsonify([img.to_dict() for img in images]), 200
    except Exception as e:
        return jsonify({"message": f"Error fetching images for event: {str(e)}"}), 500


# ---- UPDATE IMAGE ----
@gallery_bp.route("/gallery/<int:image_id>", methods=["PUT"])
def update_image(image_id):
    image = GalleryImage.query.get_or_404(image_id)
    data = request.get_json() or {}
    image.event_name = data.get("event_name", image.event_name)
    image.image_url = data.get("image_url", image.image_url)
    db.session.commit()
    return jsonify({"message": "Image updated successfully", "image": image.to_dict()}), 200


# ---- DELETE IMAGE ----
@gallery_bp.route("/gallery/<int:image_id>", methods=["DELETE"])
def delete_image(image_id):
    image = GalleryImage.query.get_or_404(image_id)
    db.session.delete(image)
    db.session.commit()
    return jsonify({"message": "Image deleted successfully"}), 200
