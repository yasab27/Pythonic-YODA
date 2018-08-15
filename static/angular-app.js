angular.module("MyApp",["ngRoute", 'angularUtils.directives.dirPagination',"chart.js"]).config(config);

function config($routeProvider)
{
  $routeProvider
    .when("/",{
      templateUrl: '../static/partials/home.html',
      controller: "HomeController",
      controllerAs: "vm"
    })
    .when("/strains",{
      templateUrl: '../static/partials/strain-list.html',
      controller: "StrainListController",
      controllerAs: "vm"
    })
    .when("/strain/:strainID",{
      templateUrl:"../static/partials/strain-data.html",
      controller: "StrainDataController",
      controllerAs: "vm"
    })
    .when("/newExperiment",{
      templateUrl:"../static/partials/new-experiment.html",
      controller: "ExperimentController",
      controllerAs: "vm"
    })
    .when("/output",{
      templateUrl:"../static/partials/output.html",
      controller: "OutputController",
      controllerAs: "vm"
    })
    .when("/output/:strain",{
      templateUrl:"../static/partials/individualOutput.html",
      controller: "IndividualOutputController",
      controllerAs: "vm"
    })
    .when("/about",{
      templateUrl:"../static/partials/about.html",
      controller: "AboutController",
      controllerAs: "vm"
    })
    .when("/instructions",{
      templateUrl:"../static/partials/instructions.html",
      controller: "InstructionController",
      controllerAs: "vm"
    });
}
