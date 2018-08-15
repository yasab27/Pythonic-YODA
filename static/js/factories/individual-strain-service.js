angular.module("MyApp").service("indStrainService", indStrainService);

function indStrainService(){
  var self = this;

  this.survivalValues = [];
  this.days = [];
  this.strainName = "";

  this.institution = "";
  this.researcher = "";
  this.information = "";
}
