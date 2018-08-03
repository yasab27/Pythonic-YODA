angular.module("MyApp").factory("strainDataFactory", strainDataFactory);

function strainDataFactory($http)
{
  return {
    strainList: strainList,
    strainDisplay: strainDisplay
  };

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

  // function postReview(id, review)
  // {
  //   return $http.post("/hotels/" + id + "/reviews", review).then(complete).catch(failed);
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

}
