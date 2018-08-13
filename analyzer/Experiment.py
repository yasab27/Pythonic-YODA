import numpy as np
import pandas as pd
from scipy import stats
from analyzer.DayData import DayData

class Experiment:

    def __init__(self, dayList):
        # dayList is an array of DayData objects
        self.dayList = dayList

    def calculateThresholdMatrix(self):
        # Get the names of the wells
        names = list(self.dayList[0].getThresholdTimes())
        # Create a list of all the threshold times. Note this is a numpy array
        thresholdList = [day.getThresholdTimes().values for day in self.dayList]
        # Return a new pandas dataframe with the names
        return pd.DataFrame(np.concatenate(thresholdList),columns=names)

    # Get the doubling times of the first day (generally day 2)
    def generateFirstDayDoublingTimes(self):
        return self.dayList[0].getWellDoublingTimes()

    # Generate a matrix of survival values at each timepoint
    def generateWellSurivalMatrix(self):
        # Set up a matrix of the threshold times for each time point for each well.
        thresholdMatrix = self.calculateThresholdMatrix()
        doublingTimes = self.generateFirstDayDoublingTimes().to_frame().T
        # Add the doubling times for each well as the final row for the matrix. This makes
        # computation easier when we use an apply() function and the additioal day can be tossed out
        # after.
        thresholdMatrixDT = thresholdMatrix.append(doublingTimes,ignore_index= True)

        survivalMatrix = thresholdMatrixDT.apply(Experiment.computeSurvivalValues)

        survivalMatrix.drop(survivalMatrix.tail(1).index,inplace=True)
        return survivalMatrix

    def generateGroupedSurvivalMatrix(self,nameList,dayNameList):
        # Generate the standard survivalMatrix for each well.
        wellSurvivalMatrix = self.generateWellSurivalMatrix()
        # Rename the rows with the appropriate days
        groupedSurvivalMatrix = wellSurvivalMatrix.rename(index= lambda x:  dayNameList[x] )
        # Rename the columns with the names of the strains
        groupedSurvivalMatrix.columns = nameList

        # Generate new columns, each with the mean performed for columns of the same name
        averagedOutput = groupedSurvivalMatrix.groupby(by=groupedSurvivalMatrix.columns,axis=1).mean()
        return averagedOutput

    def generateGroupedSurvivalMatrixSDs(self,nameList,dayNameList):
        # Generate the standard survivalMatrix for each well.
        wellSurvivalMatrix = self.generateWellSurivalMatrix()
        # Rename the rows with the appropriate days
        groupedSurvivalMatrix = wellSurvivalMatrix.rename(index= lambda x:  dayNameList[x] )
        # Rename the columns with the names of the strains
        groupedSurvivalMatrix.columns = nameList

        # Generate new columns, each with the mean performed for columns of the same name
        standardDeviations = groupedSurvivalMatrix.groupby(by=groupedSurvivalMatrix.columns,axis=1).std()
        return standardDeviations

    def wellJSON(self):
        # Get the well survival Matrix
        wellSurvivalMatrix = self.generateWellSurivalMatrix()
        # Acquire the names of each column (well names)

        # Iterate over each column of the dataframe and return a vector of the survival for each well
        survivalList = []
        for column in wellSurvivalMatrix:
            survivalList.append({"WellName:": column, "SurvivalValues" : wellSurvivalMatrix[column].values.tolist()})

        return survivalList

    def strainJSON(self, nameList, dayNameList):
        strainSurvivalMatrix = self.generateGroupedSurvivalMatrix(nameList,dayNameList)

        survivalList = []
        for column in strainSurvivalMatrix:
            survivalList.append({"StrainName": column, "SurvivalValues" : strainSurvivalMatrix[column].values.tolist()})

        return survivalList

    @classmethod
    def computeSurvivalValues(cls,thresholdTimes):
        # Subtracting each timepoint's vector from the initial value
        thresholdDifferences = thresholdTimes[0:len(thresholdTimes)] - thresholdTimes[0]
        doublingTime = thresholdTimes.iloc[-1]
        survivalVector = (1/ (2**(thresholdDifferences.values/doublingTime))) * 100
        return survivalVector
