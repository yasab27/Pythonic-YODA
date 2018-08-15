angular.module("MyApp").controller("OutputController", OutputController);

function OutputController($scope, $log, $location, strainDataFactory, expInfoFactory, indStrainService){
  $scope.data = strainDataFactory.processedData[0].data.SurvivalOutput;
  $scope.exp = expInfoFactory;

  var series = [];
  for(var i = 0; i < $scope.data.length; i++)
  {
    series.push($scope.data[i].SurvivalValues);
  }
  console.log(series);
  $scope.displayData = series;

  var names = [];
  for(var i = 0; i < $scope.data.length; i++)
  {
    names.push($scope.data[i].StrainName);
  }
  $scope.series = names;
  console.log(names);

  var dayWords = $scope.exp.days[0].split(",")
  $scope.daysCleaned = [];
  for(var i = 0; i < dayWords.length; i++){
    $scope.daysCleaned.push(dayWords[i]);
  }

  $scope.generateIndividualPage = function($index){
    indStrainService.survivalValues = $scope.data[$index].SurvivalValues;
    indStrainService.strainName = $scope.data[$index].StrainName;
    indStrainService.days = dayWords;
    indStrainService.institution = $scope.exp.institution[0];
    indStrainService.researcher = $scope.exp.researcher[0];
    indStrainService.information = $scope.exp.expInfo[0];

    $log.info(indStrainService.strainName)
    $log.info(indStrainService.survivalValues);

    $location.path("/output/" + indStrainService.strainName);
  }

  // vm.survivalIntegral = _computeSI(vm.timePoints, vm.survivalValues);
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
      },
      legend : {
        display: true,
        position: "top"
      }
    };

}
