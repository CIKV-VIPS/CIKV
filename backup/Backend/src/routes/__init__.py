from flask import Blueprint #type:ignore

# Registering all blueprints
from .auth import auth_bp
from .blogs import blog_bp
from .events import event_bp
from .gallery import gallery_bp
from .forms import forms_bp

def register_routes(app):
    """Attach all blueprints to the main Flask app."""
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(blog_bp, url_prefix="/api/blogs")
    app.register_blueprint(event_bp, url_prefix="/api/events")
    app.register_blueprint(gallery_bp, url_prefix="/api/gallery")
    app.register_blueprint(forms_bp, url_prefix="/api/forms")
