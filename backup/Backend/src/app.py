from flask import Flask, jsonify #type:ignore
from flask_cors import CORS #type:ignore
from dotenv import load_dotenv #type:ignore
import os

from .extensions import db, jwt
from .routes import auth_bp, blog_bp, event_bp, gallery_bp, forms_bp
from .config import Config

load_dotenv()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Init extensions
    db.init_app(app)
    jwt.init_app(app)
    CORS(app, origins=["https://website-nine-bay-86.vercel.app"])

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(blog_bp, url_prefix='/api')
    app.register_blueprint(event_bp, url_prefix='/api')
    app.register_blueprint(gallery_bp, url_prefix='/api')
    app.register_blueprint(forms_bp, url_prefix='/api')

    @app.route('/')
    def index():
        return jsonify({"message": "running"})

    # Error handlers to return JSON instead of HTML
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"message": "Resource not found"}), 404

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({"message": "Internal server error", "error": str(error)}), 500

    with app.app_context():
        db.create_all()

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
