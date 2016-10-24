app.factory('settingsService', function ($http) {

return {
	prueba: function() {
      return $http.get(api_url + "/prueba");
    },
    


}


});
