from datetime import datetime
from ..extensions import db

class GalleryImage(db.Model):
    __tablename__ = 'gallery_images'

    id = db.Column(db.Integer, primary_key=True)
    event_name = db.Column(db.String(200), nullable=False)
    image_url = db.Column(db.String(500), nullable=False)  # Cloudinary link
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "event_name": self.event_name,
            "image_url": self.image_url,
            "uploaded_at": self.uploaded_at.isoformat() if self.uploaded_at else None
        }

    def __repr__(self):
        return f"<GalleryImage {self.event_name}>"
