from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
def connect_db(app):
    """Connect to database."""
    db.app = app
    db.init_app(app)

class Cupcake(db.Model):
    """Cupcake"""
    __tablename__ = "cupcakes"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    flavor = db.Column(db.String(30), nullable=False)
    size = db.Column(db.String(30), nullable=False)
    rating = db.Column(db.Float, nullable=False)
    image = db.Column(db.String, nullable=False, default='https://tinyurl.com/demo-cupcake')

    @classmethod
    def filter_by_rating(cls, type, value):
        if type == 'gt':
            return cls.query.filter(cls.rating > value)
        elif type == 'lt':
            return cls.query.filter(cls.rating < value)
        else:
            return cls.query.filter_by(rating=value)
    
    @classmethod
    def filter_by_flavor(cls, value):
        return cls.query.filter(cls.flavor.ilike('%'+value+'%'))

    @classmethod
    def filter_by_size(cls, value):
        return cls.query.filter(cls.size.ilike('%'+value+'%'))

    def serialize(self):
        return {
            'id': self.id,
            'flavor': self.flavor,
            'size': self.size,
            'rating': self.rating,
            'image': self.image
        }        