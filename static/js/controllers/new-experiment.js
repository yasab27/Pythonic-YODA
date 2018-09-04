angular.module("MyApp").controller("ExperimentController", ExperimentController);

function ExperimentController(strainDataFactory, $scope, $location, expInfoFactory, $log)
{
  vm = this;

  vm.days = "";

  // Controls whether to show form verification
  $scope.failedAttempt = false;

  // Supported machines
  vm.machines = ["Bioscreen","Epoch"]

  // Supported calculation types
  vm.replicants = ["Single","Duplicates","Triplicates"]

  // A debug function to view which replication type is selected in the console dynamically and in real time
  $scope.$watch("replicationSelector",function(){
    $log.info($scope.replicationSelector);
  });

  // Automatically create a configuration string based on the type of machine and replication type.
  // This allows for faster analysis.
  $scope.$watch("strainDesc", function(){
    vm.strainNames = "";

    if($scope.replicationSelector === "Triplicates" && $scope.machineSelector === "Bioscreen"){
      var strains = cleanArray($scope.strainDesc.replace(/\s/g, "").split(","));
      // $log.info(strains);

      var configurationString = "";
      for(var i = 0; i < strains.length; i++){
        configurationString = configurationString + strains[i] + "," + strains[i] + "," + strains[i] + ",";
      }
    } else if($scope.replicationSelector === "Duplicates" && $scope.machineSelector === "Bioscreen"){
      var strains = cleanArray($scope.strainDesc.replace(/\s/g, "").split(","));
      // $log.info(strains);

      var configurationString = "";
      for(var i = 0; i < strains.length; i++){
        configurationString = configurationString + strains[i] + "," + strains[i] + ",";
      }
    } else if($scope.replicationSelector === "Single" && $scope.machineSelector === "Bioscreen")
    {
      var strains = cleanArray($scope.strainDesc.replace(/\s/g, "").split(","));
      // $log.info(strains);

      var configurationString = "";
      for(var i = 0; i < strains.length; i++){
        configurationString = configurationString + strains[i] + ",";
      }
    }

    if($scope.machineSelector === "Bioscreen"){
      var strains = cleanArray($scope.strainDesc.replace(/\s/g, "").split(","));
      // $log.info(strains);

      var configurationString = "";
      for(var i = 0; i < strains.length; i++){
        strainList = "";
        for(var j =0; j < $scope.repoNumber; j++){
          strainList = strainList + strains[i] + ",";
        }
        configurationString = configurationString +strainList;
      }
    }

    vm.strainNames = configurationString.replace(/\s/g, "").slice(0, -1).toUpperCase();
  });

  $scope.$watch("repoNumber", function(){
    vm.strainNames = "";

    if($scope.replicationSelector === "Triplicates" && $scope.machineSelector === "Bioscreen"){
      var strains = cleanArray($scope.strainDesc.replace(/\s/g, "").split(","));
      // $log.info(strains);

      var configurationString = "";
      for(var i = 0; i < strains.length; i++){
        configurationString = configurationString + strains[i] + "," + strains[i] + "," + strains[i] + ",";
      }
    } else if($scope.replicationSelector === "Duplicates" && $scope.machineSelector === "Bioscreen"){
      var strains = cleanArray($scope.strainDesc.replace(/\s/g, "").split(","));
      // $log.info(strains);

      var configurationString = "";
      for(var i = 0; i < strains.length; i++){
        configurationString = configurationString + strains[i] + "," + strains[i] + ",";
      }
    } else if($scope.replicationSelector === "Single" && $scope.machineSelector === "Bioscreen")
    {
      var strains = cleanArray($scope.strainDesc.replace(/\s/g, "").split(","));
      // $log.info(strains);

      var configurationString = "";
      for(var i = 0; i < strains.length; i++){
        configurationString = configurationString + strains[i] + ",";
      }
    }

    if($scope.machineSelector === "Bioscreen"){
      var strains = cleanArray($scope.strainDesc.replace(/\s/g, "").split(","));
      // $log.info(strains);

      var configurationString = "";
      for(var i = 0; i < strains.length; i++){
        strainList = "";
        for(var j =0; j < $scope.repoNumber; j++){
          strainList = strainList + strains[i] + ",";
        }
        configurationString = configurationString +strainList;
      }
    }

    vm.strainNames = configurationString.replace(/\s/g, "").slice(0, -1).toUpperCase();
  });

  // A helper function which eliminates empty "" strings form the strainDesc object, allowing for
  // cleaner configuraiton strings
  function cleanArray(actual) {
  var newArray = new Array();
    for (var i = 0; i < actual.length; i++) {
      if (actual[i]) {
        newArray.push(actual[i]);
      }
    }
    return newArray;
  }

  // Used to enable and disable buttons for upload and analyze
  $scope.dis = false

  // A factory service to store data between this and the "output" route
  $scope.exp = expInfoFactory;

  // File array used for 2way Data binding for file tpyes
  $scope.files = [];

  // Function which uploads the CSV files, days, and configuration strings to the Flask API, which
  // then processes the data and return viability points for each strain. This data is then stored
  // in the information service.
  $scope.upload= function(){

    // If the user has not entered strain names and a day strings or no files
    if(!vm.strainNames || !vm.days || $scope.files.length === 0)
    {
      $scope.failedAttempt = true;
      return;
    }

    // Informing the user that the information has been uploaded to the backend.
    alert("Uploaded " + $scope.files.length + " documents.");
    console.log($scope.odt);

    strainDataFactory.processData($scope.files, vm.strainNames, vm.days, $scope.odt);
    console.log($scope.odt);
    // console.log($scope.expname, $scope.researcher, $scope.institution, vm.days,$scope.exdes);

    // Upload the information to a factory service which can be used to temporarily save the data
    // as this is not automatically updated by the digest loop.
    expInfoFactory.setData($scope.expname, $scope.researcher, $scope.institution,vm.days, $scope.exdes)
    $scope.dis = true;

  };

  // Redirects the application to the ouput page after data has been submitted for processing
  $scope.getData = function() {
    console.log(strainDataFactory.processedData[0].data);
    $location.path("/output")
  };

};
