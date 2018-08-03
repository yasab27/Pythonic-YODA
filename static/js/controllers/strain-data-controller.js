angular.module("MyApp").controller("StrainDataController",StrainDataController)

function StrainDataController(strainDataFactory, $routeParams){
  vm  = this;

  //  Fetching the id of the specific strain in question
  var id = $routeParams.strainID;

  // Acquiring the data related to this specific yeast strain.
  strainDataFactory.strainDisplay(id).then(function(response){
    // Setting the response to get the strain in question.
    vm.strain = response.data;
    vm.timePoints = vm.strain.days;
    vm.survivalValues = vm.strain.survivalValues;
    vm.series = [vm.strain.name];
    // vm.survivalIntegral = _computeSI(vm.timePoints, vm.survivalValues);
    vm.options =
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
      });
}
