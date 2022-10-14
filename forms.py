from flask_wtf import FlaskForm
from wtforms import StringField, SelectField, IntegerField
from wtforms.validators import Optional, URL, NumberRange
class AddCupcakeForm(FlaskForm):
    """Form for adding and editing pets."""
    
    flavor = StringField("Flavor")
    size = SelectField("Size", choices=[('small','small'), ('medium','medium'), ('large', 'large')])
    rating = IntegerField("Rating", validators=[NumberRange(min=1, max=10)])
    image = StringField("Image", validators=[URL(), Optional()])
