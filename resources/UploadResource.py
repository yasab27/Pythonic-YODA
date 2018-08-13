# A resource to test out uploading and reading form data,specifically excel files in python flask

# Necessary improts
import os
import sys

from flask import Flask, request
from flask_restful import Resource, reqparse
from flask_uploads import UploadSet, configure_uploads, DATA
from analyzer.DayData import DayData
from analyzer.Experiment import Experiment


# Math imports if necessary
import numpy as np
import pandas as pd
from scipy import stats
from sklearn.linear_model import LinearRegression

class UploadResource(Resource):

    # In order to upload files using Flask-RESTful, we need to configure the uploader in the app.py file, but then
    # import the uploadset object --in this case, data-- in the application

    def post(self):

        if "dat" in request.files:

            timePoints = [] # A list of day Data documents,
            fileList = (request.files.getlist("dat"))
            for file in fileList:
                timePoints.append(DayData(pd.read_csv(file)))
            exp = Experiment(timePoints)

            # STRAIN OUTLINE:
            colNames = request.form["layout"].split(",")
            days = [int(day) for day in request.form["days"].split(",")]
            return {"SurvivalOutput": exp.strainJSON(colNames,days)}

        # If no data transmitted
        return {"Message":"Please input CSV files for each day and comma delimited layout and "}
