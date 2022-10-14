"""Adopt-a-pet application."""

from forms import AddCupcakeForm
from flask import Flask, render_template, jsonify, request
from models import db, connect_db, Cupcake

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///cupcakes'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True
app.config['SECRET_KEY'] = "bush-did-911"

connect_db(app)
db.create_all()

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

#######################
#########cake##########
#######################

@app.route('/')
def home():
    form = AddCupcakeForm()
    return render_template('index.html', form=form)

@app.route('/api/cupcakes', methods=['GET'])
def all_cupcakes():
    cupcakes = Cupcake.query.all()

    dict = [cake.serialize() for cake in cupcakes]

    return jsonify(cupcakes=dict)

@app.route('/api/cupcakes/<int:id>', methods=['GET'])
def one_cupcake(id):
    cupcake = Cupcake.query.get_or_404(id)

    dict = cupcake.serialize()
    return jsonify(cupcake=dict)

@app.route('/api/cupcakes', methods=['POST'])
def make_cupcake():
    new_cake = Cupcake(flavor=request.json['flavor'], size=request.json['size'], rating=request.json['rating'], image=request.json['image'])

    db.session.add(new_cake)
    db.session.commit()

    return (jsonify(cupcake=new_cake.serialize()), 201)

@app.route('/api/cupcakes/<int:id>', methods=['PATCH'])
def cupdate(id):
    cake = Cupcake.query.get_or_404(id)
    cake.flavor = request.json["flavor"]
    cake.size = request.json["size"]
    cake.rating = request.json["rating"]
    cake.image = request.json["image"]
    
    db.session.add(cake)
    db.session.commit()

    return jsonify(cupcake=cake.serialize())

@app.route('/api/cupcakes/<int:id>', methods=['DELETE'])
def delete_cupcake(id):
    cake = Cupcake.query.get_or_404(id)
    db.session.delete(cake)
    db.session.commit()

    return {"message":"deleted"}

@app.route('/api/cupcakes/filter', methods=['POST'])
def filter_cupcakes():
    mode = request.json['mode']
    value = request.json['value']

    if mode == 'rating':
        type = request.json['type']
        results = Cupcake.filter_by_rating(type, value)
    elif mode == 'flavor':
        results = Cupcake.filter_by_flavor(value)
    else:
        results = Cupcake.filter_by_size(value)

    dict = [cake.serialize() for cake in results]
    return jsonify(cupcakes=dict)