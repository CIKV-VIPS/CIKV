from ..extensions import db

class Form(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    google_form_link = db.Column(db.String(255), nullable=False)
    status = db.Column(db.String(20), nullable=False, default='inactive')

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'google_form_link': self.google_form_link,
            'status': self.status
        }
