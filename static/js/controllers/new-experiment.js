angular.module("MyApp").controller("ExperimentController", ExperimentController);

function ExperimentController(strainDataFactory, $scope, $location, expInfoFactory)
{
  vm = this;

  $scope.dis = false;

  $scope.exp = expInfoFactory;
  $scope.name = 'World';
  $scope.files = [];

  $scope.upload= function(){
    alert("Uploaded " + $scope.files.length + " documents.");
    strainDataFactory.processData($scope.files, vm.strainNames, vm.days);
    console.log($scope.expname, $scope.researcher, $scope.institution, vm.days,$scope.exdes);
    expInfoFactory.setData($scope.expname, $scope.researcher, $scope.institution,vm.days, $scope.exdes)
    $scope.dis = true;
  };

  $scope.getData = function() {
    console.log(strainDataFactory.processedData[0].data);
    $location.path("/output")
  };

};
