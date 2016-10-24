app.controller('loginCtrl', function($scope, $rootScope, $state, $ionicHistory, $location, $cordovaOauth, $ionicLoading,loginService) {



    $scope.googleSignIn = function() {
     loginService.loginM();

    };

     $scope.googleLogout = function() {
     loginService.logout();

    };
   



    $scope.login = function() {
            loginService.login();
    }

   

});
