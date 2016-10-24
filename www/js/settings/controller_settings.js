app.controller('settingCtrl', function($scope, $state, $rootScope, $ionicLoading, $cordovaOauth, loginService) {


      $scope.logout = function() {

          firebase.auth().signOut().then(function() {
              // Sign-out successful.
              localStorage.removeItem("token");
              localStorage.removeItem("accessToken");
              localStorage.clear();
              $state.go('login');

          }, function(error) {
              console.log(error);
          });
      };
    $scope.googleLogout = function() {
        loginService.logout();

    };

    $scope.updateStatus = function(status) {
        writeNewPost(status);

        function writeNewPost(status) {
            // A post entry.
            var postData = {
                status: status,
            };
            console.log("hola");
            // Get a key for a new Post.
         //   var newPostKey = firebase.database().ref().child('posts').push().key;

            // Write the new post's data simultaneously in the posts list and the user's post list.
            var updates = {};
            //updates['/posts/' + newPostKey] = postData;
            updates['/users/' + $rootScope.user.id+'/status' ] = status;

            return firebase.database().ref().update(updates);
        }
    };



});
