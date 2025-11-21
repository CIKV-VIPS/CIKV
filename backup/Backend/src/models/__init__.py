# models/__init__.py

from .user_model import User
from .blog_model import Blog
from .event_model import Event
from .gallery_model import GalleryImage
from .form_model import Form

# You can optionally add a helper function to initialize all models if needed
# (not mandatory, but helps keep structure clean)

def init_models(db):
    """
    Ensures all models are registered with SQLAlchemy metadata.
    """
    from .user_model import User
    from .blog_model import Blog
    from .event_model import Event
    from .gallery_model import GalleryImage
    from .form_model import Form
    db.create_all()
