angular.module("MyApp").controller("OutputController", OutputController);

function OutputController($scope, strainDataFactory, expInfoFactory){
  $scope.days = [2,4,6,9,11,13];
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
