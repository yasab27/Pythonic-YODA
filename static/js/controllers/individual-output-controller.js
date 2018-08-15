angular.module("MyApp").controller("IndividualOutputController", IndividualOutputController);

function IndividualOutputController($scope,$log,indStrainService, strainDataFactory){
  // Information for the actual yeast data display and
  // meta information.
  $scope.strainName = indStrainService.strainName;
  $scope.survivalValues = indStrainService.survivalValues;
  $scope.days = indStrainService.days;
  $scope.series = [$scope.strainName];
  $scope.researcher = indStrainService.researcher;
  $scope.institution = indStrainService.institution;
  $scope.information = indStrainService.information;

  $log.info($scope.days);
  $log.info($scope.survivalValues);

  // The date
  $scope.date = new Date();

  // Options for the graph
  $scope.options =
  {
    scales: {
      yAxes:
          [{
            id: 'y-axis-1',
            type: 'linear',
            display: true,
            position: 'left',
            ticks: {min: 0, max: 100}
          }]
      },
      elements: {
          line: {tension: 0}
      }
    };

    // A function to "clean" the array of days so they are integers which can be stored to the db
    $scope.numericalDays = [];
    for(var i = 0; i < $scope.days.length; i++){
      $scope.numericalDays.push(parseInt($scope.days[i]));
    }

    // Posting a strain to the database
    var strainJSON = {
      name: $scope.strainName,
      experimenter: $scope.researcher,
      institution: $scope.institution,
      days: $scope.numericalDays,
      survivalValues: $scope.survivalValues
    }

    $scope.postStrain = function(){
      $log.info(JSON.stringify(strainJSON));
      strainDataFactory.strainPost(JSON.stringify(strainJSON));
    }
}
