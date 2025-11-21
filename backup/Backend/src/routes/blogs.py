from flask import Blueprint, request, jsonify #type:ignore
from ..models.blog_model import Blog 
from ..extensions import db #type:ignore

blog_bp = Blueprint("blog_bp", __name__)

# ---- CREATE BLOG ----
@blog_bp.route("/blogs/", methods=["POST"])
def create_blog():
    data = request.get_json()
    blog = Blog(
        title=data.get("title"),
        author=data.get("author"),
        content=data.get("content"),
        image_url=data.get("image_url")
    )
    db.session.add(blog)
    db.session.commit()
    return jsonify({"message": "Blog created successfully", "blog": blog.to_dict()}), 201


# ---- GET ALL BLOGS ----
@blog_bp.route("/blogs/", methods=["GET"])
def get_blogs():
    blogs = Blog.query.order_by(Blog.created_at.desc()).all()
    return jsonify([b.to_dict() for b in blogs]), 200


# ---- GET SINGLE BLOG ----
@blog_bp.route("/blogs/<int:blog_id>", methods=["GET"])
def get_blog(blog_id):
    blog = Blog.query.get_or_404(blog_id)
    return jsonify(blog.to_dict()), 200

# ---- UPDATE BLOG ----
@blog_bp.route("/blogs/<int:blog_id>", methods=["PUT"])
def update_blog(blog_id):
    blog = Blog.query.get_or_404(blog_id)
    data = request.get_json() or {}
    blog.title = data.get("title", blog.title)
    blog.author = data.get("author", blog.author)
    blog.content = data.get("content", blog.content)
    blog.image_url = data.get("image_url", blog.image_url)
    db.session.commit()
    return jsonify({"message": "Blog updated successfully", "blog": blog.to_dict()}), 200


# ---- DELETE BLOG ----
@blog_bp.route("/blogs/<int:blog_id>", methods=["DELETE"])
def delete_blog(blog_id):
    blog = Blog.query.get_or_404(blog_id)
    db.session.delete(blog)
    db.session.commit()
    return jsonify({"message": "Blog deleted successfully"}), 200
