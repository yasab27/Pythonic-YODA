angular.module("MyApp").controller("StrainListController",StrainListController)

function StrainListController(strainDataFactory) {

  // Setting the view model to this, allowing us to have to improved controller syntax on the
  // html file
  var vm = this;

  // Sending a GET command to acquire the list of the first ten strains in the Repo (or however many there are)
  strainDataFactory.strainList().then(function(response){
   vm.strains = response.data;
  });

}
