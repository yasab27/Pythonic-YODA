# A model of timepoints to store in the db. These corresponds to the individual (day, survival) points on the survival curve
from db import db

class TimepointModel(db.Model):

    # Defining a table schema for this object
    __tablename__ = "timepoints"
    id = db.Column(db.Integer, primary_key= True)
    day = db.Column(db.Integer)
    survivalValue = db.Column(db.Float(precision = 3))

    # Defining the foreign key relationship. This will allow for one strain to have many timepoints
    strain_id = db.Column(db.Integer,db.ForeignKey("strains.id"))
    strain = db.relationship("StrainModel")

    def __init__(self, day, survivalValue, strain_id):
        self.day = day
        self.survivalValue = survivalValue
        self.strain_id = strain_id

    def json(self):
       return {"day":self.day, "survivalValue": self.survivalValue}

    def save_to_db(self):
    # Add one object. automatically converted from object to row
        db.session.add(self)
        db.session.commit()
