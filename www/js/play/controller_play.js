app.controller('playCtrl', function($scope, $rootScope, playServices, $state, $ionicLoading, $timeout, $ionicHistory) {

    $rootScope.users = [];
    var idCont = 0;
    $rootScope.acceptedPartida = "esperando";
    var putUsersConnect = function(id, obj) {
        if ($rootScope.email != obj.email) {

            var exists = true;
            for (var i = $rootScope.users.length - 1; i >= 0; i--) {
                if ($rootScope.users[i].email == obj.email) {
                    exists = false;
                    $rootScope.users[i].status = obj.status;
                    console.log($rootScope.users[i]);
                    $ionicHistory.clearCache();
                }
            }

            if (exists) {
                $rootScope.users.push({
                    name: obj.name,
                    status: obj.status,
                    img: obj.profile_picture,
                    email: obj.email,
                    id: idCont
                });
                idCont++;
                $ionicHistory.clearCache();
            }
            $ionicHistory.clearCache();
        }

    };

    var deleteUserDisconnected = function(id, obj) {

        for (var i = $rootScope.users.length - 1; i >= 0; i--) {
            if (obj.name == $scope.users[i].name) {
                $rootScope.users.splice(i, 1);

                $ionicHistory.clearCache();
            }
        }


    }
    $scope.invitarPartida = function(user) {

        $rootScope.message = {
            status: "Esperando oponente",
            show: true
        };
        $ionicLoading.show({
            templateUrl: "loading.html",
            noBackdrop: false,

        });
        if (user.status == "Conectado") {
            $rootScope.user.rol = "Retador";
            playServices.startingInvite(user, idPartida);
            var estus = {};
            estus['/users/' + $rootScope.user.id + '/status'] = "Jugando";
            firebase.database().ref().update(estus);
            $timeout(function() {
                if ($scope.acceptedPartida == "esperando") {
                    $rootScope.message.status = "El oponente no respondio";
                    var updates = {};

                    updates['/items/' + $rootScope.idPartida] = null;
                    localStorage.removeItem("idPartida");
                    return firebase.database().ref().update(updates);
                }
            }, 8000);
            $timeout(function() {
                // console.log($rootScope.acceptedPartida);
                if ($rootScope.acceptedPartida == "esperando") {
                    $ionicLoading.hide();
                    $ionicHistory.clearCache();
                    $state.go('main.play');
                }
            }, 10000);
        } else {

            $rootScope.message.status = "El oponente esta jugando";
            $timeout(function() {

                $rootScope.message.status = "El oponente no respondio";
                $ionicLoading.hide();
                $ionicHistory.clearCache();
                $state.go('main.play');

            }, 1000);
        }
    };

    var idPartida = function(id) {
        $rootScope.idPartida = id;
        localStorage.setItem("idPartida", id);
    };
    var acceptedPartida = function(status) {
        $rootScope.acceptedPartida = status;
    };

    playServices.resOponente(acceptedPartida, $rootScope.idPartida);
    playServices.getUserConnect(putUsersConnect);
    playServices.getUserDisconnected(deleteUserDisconnected);

});
