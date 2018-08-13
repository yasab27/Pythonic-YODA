angular.module("MyApp").factory("expInfoFactory", expInfoFactory);

function expInfoFactory(){
  var experimentName = [];
  var researcher = [];
  var institution = [];
  var days = [];
  var expInfo = [];

  function setData(eN, r, i,d,  eI){

    // experimentName = [];
    // researcher = [];
    // institution = [];
    // days = [];
    // expInfo = [];


    experimentName.push(eN);
    researcher.push(r);
    institution.push(i);
    days.push(d);
    expInfo.push(eI);
  }

  return {
    setData: setData,
    experimentName: experimentName,
    researcher: researcher,
    institution: institution,
    days: days,
    expInfo: expInfo
  };
}
