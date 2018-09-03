angular.module("MyApp").factory("strainDataFactory", strainDataFactory);

function strainDataFactory($http)
{
  var processedData= [];

  // Return the entire list of Hotels
  function strainList()
  {
    return $http.get("/strains").then(complete).catch(failed);
  }

  //Return a specific Strain by ID
  function strainDisplay(id)
  {
    return $http.get("/strain/" + id).then(complete).catch(failed);
  }

  //Post a new strain to the database
  function strainPost(strain){
    return $http.post("/strains/new",strain).then(complete).catch(failed);
  }

  // function postReview(id, review)
  // {
  //   return $http.post("/hotels/" + id + "/reviews", review).then(complete).catch(failed);
  // }

  function processData(files, layout, days, odt)
  {
    $http({
      method: 'POST',
      url: '/upload',
      headers: {
          'Content-Type': 'multipart/form-data'
      },
      transformRequest: function (data, headersGetter) {
          var formData = new FormData();
          formData.append("layout", layout);
          formData.append("days", days);
          formData.append("odt",odt );

          for(i = 0; i < files.length; i++) {
              console.log(files[i]._file);
              formData.append("dat", files[i]._file);
          };
          console.log(formData);
          var headers = headersGetter();
          delete headers['Content-Type'];

          return formData;
        }
      })
      .then(function (response) {
        console.log( response);
        processedData.push(response);
      })
      .catch(function (response, status) {
        console.log(response);
      });

  }

  // Return the processedData
  // function getProcessedData(){
  //   return processedData;
  // }

  // What to do in the case of either promise. Since these are both
  // get methods, we want to return the JSON message's data on each instance
  // We specify "data" as a JSON return from our API also returns
  // additional HTTP informaiton (headers, config, etc)
  function complete(response)
  {
    console.log(response);
    return response;
  }

  // In the event of an error, log status text of the error into the console
  // (this will be the chrome developer console)/
  function failed(error)
  {
    console.log(error.statusText);
  }


  return {
    processedData: processedData,
    strainList: strainList,
    strainDisplay: strainDisplay,
    processData: processData,
    strainPost: strainPost
  };


}
