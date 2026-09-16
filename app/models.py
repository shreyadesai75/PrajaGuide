from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Scheme(db.Model):
    __tablename__ = 'schemes'

    id = db.Column(db.Integer, primary_key=True)
    scheme_name = db.Column(db.String, nullable=False)
    slug = db.Column(db.String, unique=True, index=True)
    details = db.Column(db.Text)
    benefits = db.Column(db.Text)
    eligibility = db.Column(db.Text)
    application = db.Column(db.Text)
    documents = db.Column(db.Text)
    level = db.Column(db.String)
    schemeCategory = db.Column(db.String)
    tags = db.Column(db.String)

    def __repr__(self):
        return f"<Scheme {self.scheme_name} [{self.schemeCategory}]>"

    def to_dict(self):
        return {
            "scheme_name": self.scheme_name,
            "slug": self.slug,
            "details": self.details,
            "benefits": self.benefits,
            "eligibility": self.eligibility,
            "application": self.application,
            "documents": self.documents,
            "level": self.level,
            "schemeCategory": self.schemeCategory,
            "tags": self.tags
        }
