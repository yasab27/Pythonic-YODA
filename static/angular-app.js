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
    });
}
