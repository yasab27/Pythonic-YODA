angular.module("MyApp").factory("expInfoFactory", expInfoFactory);

function expInfoFactory(){
  var experimentName = [];
  var researcher = [];
  var institution = [];
  // var days = [];
  var expInfo = [];

  function setData(eN, r, i,  eI){
    experimentName.push(eN);
    researcher.push(r);
    institution.push(i);
    // for(var i = 0; i < d.length; i++)
    // {
    //   days.push(d[i]);
    // }
    expInfo.push(eI);
  }

  return {
    setData: setData,
    experimentName: experimentName,
    researcher: researcher,
    institution: institution,
    // days: days,
    expInfo: expInfo
  };
}
