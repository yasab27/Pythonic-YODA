# YASA BAIG
# Harvard Univeristy - (C) 2017
# YODA Backend: Yeast Outgrowth Data Analyzer web application backend, written in Flask with Flask-RESTful framework
# and numpy for data analysis.

# Importing essential dependencies
from flask import Flask, send_file
from flask_restful import Api
from flask_jwt import JWT, jwt_required

# Importing resources
from resources.StrainResource import StrainResource, StrainListResource, StrainRegister

# Setting up application
app = Flask(__name__)

# Configure the SQLAlchemy database connections
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///data.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

api = Api(app)

# Ask the db to create all the necessary tables before operation
@app.before_first_request
def create_tables():
    db.create_all()

# Setting up a basic route for the homepage without using Flask-RESTful. This enables us to run our angular on the front end
@app.route("/")
def home():
    return send_file("templates/index.html")

# Adding resources:
api.add_resource(StrainResource,"/strain/<int:id>")
api.add_resource(StrainListResource,"/strains")
api.add_resource(StrainRegister,"/strains/new")


if __name__ == "__main__":
    from db import db
    db.init_app(app)
    app.run(port=5000,debug=True)
