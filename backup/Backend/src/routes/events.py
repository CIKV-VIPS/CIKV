from flask import Blueprint, request, jsonify #type:ignore
from ..models.event_model import Event
from ..extensions import db #type:ignore
from datetime import datetime

event_bp = Blueprint("event_bp", __name__)

# ---- TEST ROUTE ----
@event_bp.route("/events/test", methods=["GET"])
def test_events():
    return jsonify({"message": "Events API is working!"}), 200

# ---- CREATE EVENT ----
@event_bp.route("/events/", methods=["POST"])
def create_event():
    data = request.get_json()
    try:
        date_obj = datetime.strptime(data.get("date"), "%Y-%m-%d").date()
    except:
        return jsonify({"message": "Invalid date format. Use YYYY-MM-DD"}), 400

    event = Event(
        title=data.get("title"),
        description=data.get("description"),
        date=date_obj,
        category=data.get("category"),
        image_url=data.get("image_url")
    )
    db.session.add(event)
    db.session.commit()
    return jsonify({"message": "Event created successfully", "event": event.to_dict()}), 201


# ---- GET ALL EVENTS ----
@event_bp.route("/events/", methods=["GET"])
def get_events():
    try:
        events = Event.query.order_by(Event.date.desc()).all()
        return jsonify([e.to_dict() for e in events]), 200
    except Exception as e:
        return jsonify({"message": f"Error fetching events: {str(e)}"}), 500


# ---- GET SINGLE EVENT ----
@event_bp.route("/events/<int:event_id>", methods=["GET"])
def get_event(event_id):
    try:
        event = Event.query.get_or_404(event_id)
        return jsonify(event.to_dict()), 200
    except Exception as e:
        return jsonify({"message": f"Error fetching event: {str(e)}"}), 500


# ---- UPDATE EVENT ----
@event_bp.route("/events/<int:event_id>", methods=["PUT"])
def update_event(event_id):
    event = Event.query.get_or_404(event_id)
    data = request.get_json() or {}

    # Update simple fields if provided
    event.title = data.get("title", event.title)
    event.description = data.get("description", event.description)
    event.category = data.get("category", event.category)
    event.image_url = data.get("image_url", event.image_url)

    # Update date if provided
    if "date" in data and data.get("date"):
        try:
            event.date = datetime.strptime(data.get("date"), "%Y-%m-%d").date()
        except:
            return jsonify({"message": "Invalid date format. Use YYYY-MM-DD"}), 400

    db.session.commit()
    return jsonify({"message": "Event updated successfully", "event": event.to_dict()}), 200


# ---- DELETE EVENT ----
@event_bp.route("/events/<int:event_id>", methods=["DELETE"])
def delete_event(event_id):
    event = Event.query.get_or_404(event_id)
    db.session.delete(event)
    db.session.commit()
    return jsonify({"message": "Event deleted successfully"}), 200
