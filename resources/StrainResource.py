# This defines the Strain Resource that will be used for CRUD operations in the API

# Importing necessary dependencies
from flask import Flask, request
from flask_restful import Resource, reqparse
from models.StrainModel import StrainModel
from models.TimepointModel import TimepointModel
from db import db

class StrainResource(Resource):

    # GET a particular strain's information by id
    def get(self,id):
        strainOfInterest = StrainModel.find_by_id(id)
        if(strainOfInterest):
            return strainOfInterest.json()

        return {"message":"No strain could be found with that ID"}

# A resource to return a list of all strains in the db
class StrainListResource(Resource):

    # Return all strains in a json format
    def get(self):
        return StrainModel.return_all_strains()

# A resource to register a new strain
class StrainRegister(Resource):

    # Defining a parser that will handle data collection from post requests
    parser = reqparse.RequestParser()

    parser.add_argument("name",
        type = str,
        required = True, # If there is no price argument, stop.
        help = "Name cannot be left blank"
    )

    parser.add_argument("experimenter",
        type = str,
        required = True, # If there is no price argument, stop.
        help = "Experimenter cannot be left blank"
    )

    parser.add_argument("institution",
        type = str,
        required = True, # If there is no price argument, stop.
        help = "Instituion cannot be left blank"
    )

    # Create a new strain, add it to the table
    def post(self):

        data = StrainRegister.parser.parse_args();
        newStrain = StrainModel(**data) ## ** automatically separates dict keywords into arguments

        # Due to a bug in reqparse for when parsing lists, we have to access these lists manually
        timePointData = request.get_json()

        # Error trapping in case the user does not enter in the "days" or "survivalValues". All other error trapping is handled
        # by the reqparse
        if "days" not in timePointData or "survivalValues" not in timePointData:
            return {"message":"Request must include arrays of the same length 'days' and 'survivalValues'"}

        newDays = timePointData["days"]
        newSVs = timePointData["survivalValues"]

        if not isinstance(newDays,(list,)) or not isinstance(newSVs,(list,)) or not len(newDays) == len(newSVs):
            return {"message": "Both the days and survivalValues fields must be arrays of the same length"}, 401 # bad request

        # Get the most recently inputted object (the one we just created). This contains all the same info as the newStrain, but this will also
        # the ID. By default, the botom most entry in the table is the one we just created.
        newStrain.save_to_db()
        justInputtedStrain = StrainModel.return_last_item()

        # Add values to the timePoint table using the strain ID
        for newDay, newSV in zip(newDays,newSVs):
            newTimePoint = TimepointModel(newDay, newSV, justInputtedStrain.id)
            newTimePoint.save_to_db()

        return justInputtedStrain.json()
