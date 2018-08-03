# Models for individual strains to store in the database. This will include static methods and
# dynamic methods in order to interact with the database.

# A strain represents the meta-data for each run--experimenter, name, etc.--as well as a
# a list of time point and survival values.

# Importing essential resources:
from db import db
from models.TimepointModel import TimepointModel
from datetime import datetime


class StrainModel(db.Model):

    # Defining the schema for the table to store the db information. TODO: Implement a separable table for survival values
    __tablename__ = "strains"
    id = db.Column(db.Integer,primary_key=True)  # An id used to reference any strain model, used later for foreign keys
    name = db.Column(db.String(40))              # Limit the name to 40 characters only.
    experimenter = db.Column(db.String(40))
    institution = db.Column(db.String(40))
    created_date = db.Column(db.DateTime, default=datetime.utcnow)
    # Accessing the timepoints associated with this value
    timepoints = db.relationship("TimepointModel", lazy = "dynamic")

    # Construct a new StrainModel instance
    def __init__(self, name, experimenter, institution):
        self.name = name
        self.experimenter = experimenter
        self.institution = institution
        # NOTE: The Id field will automatically be entered into the table by SQL Alchemy

    # Return a json representation of the object (note that this returns a dict since python automatically converts)
    def json(self):
        # Convert the timepoint values to two seperate arrays
        days = [timepoint.day for timepoint in self.timepoints]
        survivalValues = [timepoint.survivalValue for timepoint in self.timepoints]

        return {"id": self.id, "name" : self.name, "createdOn": str(self.created_date),
        "experimenter":self.experimenter,"institution":self.institution, "days": days,
        "survivalValues": survivalValues}


    # Write this particular strain model instance to the DB. Note this also will automatically perform an update as well
    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    # Delete this strain from the db
    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()

    # A classmethod to query the strains table and return a strain by name. Returns a StrainModel object
    @classmethod
    def find_by_name(cls,name):
        foundStrain = cls.query.filter_by(name=name).first() # Always return the first strain with this name
        return foundStrain

    # A classmethod to query the strains table and return a strain by id number. Returns a Strain Model object
    @classmethod
    def find_by_id(cls,_id):
        foundStrain = cls.query.filter_by(id=_id).first() # All ID numbers are unique so this should always return one object
        return foundStrain

    # A class method to query the strains table and return all strains. Returns a list of items encoded into json-style dicts
    @classmethod
    def return_all_strains(cls):
        allStrains = cls.query.all()
        allStrainsJSON = [strain.json() for strain in allStrains]
        return allStrainsJSON

    # Return the last item in the db
    @classmethod
    def return_last_item(cls):
        return db.session.query(cls).order_by(cls.id.desc()).first()
