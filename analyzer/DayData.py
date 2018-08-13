import numpy as np
import pandas as pd
from scipy import stats
from sklearn.linear_model import LinearRegression

# This class corresponds to one page of data for analysis
class DayData:

    def __init__(self, dayDataFrame):
        self.ddf = dayDataFrame
        self.timeVector = dayDataFrame["Time"]
        self.timeVectorSeconds, self.ddf_norm = self.preprocess()

    # Convert the data from the HH:MM:SS to seconds and normalize with respect to the blank vector
    def preprocess(self):
        # First, convert the time column into seconds integer values
        timeVectorSeconds = self.timeVector.apply(DayData.timeStringToSeconds)

        # Subtract the final Blank column from the rest of the data
        semiNormalized = self.ddf.drop(["Time"],axis=1).sub(self.ddf.iloc[:,-1], axis = 0)

        # Return the now normalized data with the final now all 0 column eliminated
        ddf_norm = semiNormalized.drop(self.ddf.columns[len(self.ddf.columns)-1], axis=1)

        # Return the timeVector and the normalized data. These are also stored in the class for quick reference
        return timeVectorSeconds, ddf_norm

    def getWellDoublingTimes(self):
        # We get the doubling times for each column by applying a calculate funciton on each well, and passing
        # the corresponding time points as well
        doublingTimes = self.ddf_norm.apply(DayData.calculateDoublingTime,args =(self.timeVectorSeconds,))
        return doublingTimes

    def getThresholdTimes(self):
        ddf_ttimes = self.ddf_norm.apply(DayData.calculateThresholdTime,args =(self.timeVectorSeconds,))
        return ddf_ttimes

    # return a json representation of the well's important values
    def json(self):
        columnNames = self.ddf_norm.columns.values.tolist()
        doublingTimes = self.getWellDoublingTimes().values.tolist()
        thresholdTimes = self.getThresholdTimes().T.values.tolist()

        # Encode each well as a dictionary
        wellInformationList = []
        for colName,dubTime, tTime in zip(columnNames,doublingTimes,thresholdTimes):
            wellInfo = {"Well Name": colName,"Doubling Time":dubTime,"Threshold Time" : tTime[0]}
            wellInformationList.append(wellInfo)

        return wellInformationList

    @classmethod
    def calculateThresholdTime(cls,wellVector,timeVector):
        if max(wellVector) <= 0.3:
            return 100000000
        # Get the points braketing 0.3 OD
        lowerIndex = wellVector.where(wellVector < 0.3).idxmax()
        upperIndex = wellVector.where(wellVector > 0.3).idxmin()


        timeRange = timeVector[lowerIndex:upperIndex+1].values
        odRange = np.log(wellVector[lowerIndex:upperIndex+1].values)

        odRange = odRange.reshape(-1,1)

        lm = LinearRegression()
        lm.fit(odRange, timeRange)
        timePrediction = lm.predict(np.log(0.3))
        timePrediction = timePrediction.transpose()
        return timePrediction

    @classmethod
    def calculateDoublingTime(cls, wellVector, timeVector):
        # If the well does not have values between th 0.2 and 0.5, we return the standard doubling time of 5400
        if(max(wellVector) <= 0.2 or min(wellVector) >= 0.5):
            return 5400
        else:
            # We get the indices of 0.2 and 0.5 occurring
            lowerIndex = wellVector.where(wellVector >= 0.2).idxmin()
            upperIndex = wellVector.where(wellVector <= 0.5).idxmax()

            lowerODRange = wellVector[lowerIndex:upperIndex]
            lowerTimeRange = timeVector[lowerIndex:upperIndex]

            upperODRange = wellVector[lowerIndex+1:upperIndex+1]
            upperTimeRange = timeVector[lowerIndex+1:upperIndex+1]

            rangeDifference = upperTimeRange.values - lowerTimeRange.values
            odDif = np.log(upperODRange.values) - np.log(lowerODRange.values)
            doublingTime = np.mean( np.log(2)*rangeDifference/odDif )
            return doublingTime


    @classmethod
    def timeStringToSeconds(cls, timeString):
        # Split the time string into components
        stringParts = timeString.split(":")
        # Multiply by respective
        seconds = 3600*int(stringParts[0]) + 60*int(stringParts[1]) + int(stringParts[2])
        return seconds
