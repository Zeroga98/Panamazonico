app.controller('playingCtrl', function($scope, $rootScope, $ionicLoading, $timeout, $ionicHistory, $state, playingServices, $state, $ionicLoading) {

    $scope.cont = 0;
    var num1 = Math.floor(Math.random() * (10 - 0)) + 0;
    var num2 = Math.floor(Math.random() * (10 - 0)) + 0;
    var num3 = Math.floor(Math.random() * (10 - 0)) + 0;
    $scope.card1 = $rootScope.cardFauna[num1];
    $scope.card2 = $rootScope.cardFlora[num2];
    $scope.card3 = $rootScope.cardFauna[num3];
    $scope.miCard = "https://firebasestorage.googleapis.com/v0/b/panamazonico-2e754.appspot.com/o/cards%2FcartaVacia.png?alt=media&token=857746a0-4724-46a9-a050-dc1105029f8d";
    $scope.adCard = "https://firebasestorage.googleapis.com/v0/b/panamazonico-2e754.appspot.com/o/cards%2FcartaVacia.png?alt=media&token=857746a0-4724-46a9-a050-dc1105029f8d";
    $scope.myCard;
    $scope.enCard;
    if ($rootScope.user.rol == "Retado") {


        $ionicLoading.show({
            template: 'esperando jugador'
        }).then(function() {

        });

    }

    $scope.cartaclick = function(card, carta) {

        console.log($rootScope.user.rol);
        $scope.miCard = card.img;
        $scope.myCard = card;
        var updates = {};
        $scope.cont = $scope.cont + 1;
        console.log($scope.cont);
        updates['/items/' + $rootScope.idPartida + '/' + "card" + $rootScope.user.rol] = card.img;


        if ($rootScope.user.rol == "Retador") {
            $ionicLoading.show({
                template: 'esperando jugador'
            }).then(function() {

            });
        }

        firebase.database().ref().update(updates);

        if ($rootScope.user.rol == "Retado") {
            console.log($scope.enCard);
            if ($scope.myCard.poder > $scope.enCard.Poder) {
                $ionicLoading.show({
                    template: 'gane',
                    duration: 800
                }).then(function() {});

                $timeout(function() {
                    if ($scope.cont < 3) {
                        console.log("entro-------------------------");
                        $ionicLoading.show({
                            template: 'esperando jugador'
                        }).then(function() {

                        });
                    } else {

                        if ($scope.cont == 3) {
                            $scope.cont = 0;
                        }
                    }
                }, 1000);

                console.log("gane");
            } else {
                $ionicLoading.show({
                    template: 'perdi',
                    duration: 800
                }).then(function() {});
                $timeout(function() {

                    if ($scope.cont < 3) {
                        console.log("entro-------------------------");
                        $ionicLoading.show({
                            template: 'esperando jugador'
                        }).then(function() {

                        });
                    } else {
                        if ($scope.cont == 3) {
                            $scope.cont = 0;
                        }
                    }

                }, 1000);
                console.log("perdi");
            }


        }

        if ($scope.cont > 2 && $rootScope.user.rol == "Retado") {
         /*   $ionicLoading.hide().then(function() {
                console.log("The loading indicator is now hidden");
            });*/
            $state.go('main.play');
            console.log($rootScope.idPartida);
            var fin = {};
            fin['/items/' + $rootScope.idPartida] = null;
            localStorage.removeItem("idPartida");
            firebase.database().ref().update(fin);
            var estus = {};
            estus['/users/' + $rootScope.user.id + '/status'] = "Conectado";
            firebase.database().ref().update(estus);

            $scope.enCard = undefined;
            $ionicHistory.clearCache();
        }



    };




    $scope.update = function(card) {


        $ionicLoading.hide().then(function() {
            // console.log("The loading indicator is now hidden");

        });
        $scope.enCard = card;
        $scope.adCard = card.img;
        $ionicHistory.clearCache();
        console.log(card);
        if ($rootScope.user.rol == "Retador") {
            console.log($scope.myCard.poder + "----" + card.Poder);
            if ($scope.myCard.poder > card.Poder) {
                $ionicLoading.show({
                    template: 'gane',
                    duration: 600
                }).then(function() {

                });

                console.log("gane");
            } else {
                $ionicLoading.show({
                    template: 'perdi',
                    duration: 600
                }).then(function() {

                });
                console.log("perdi");
            }


        }



        if ($scope.cont > 2) {
            $state.go('main.play');
      /*      $ionicLoading.hide().then(function() {
                console.log("The loading indicator is now hidden");
            });*/
            var estus = {};
            estus['/users/' + $rootScope.user.id + '/status'] = "Conectado";
            firebase.database().ref().update(estus);
            $scope.cont = 0;
            $scope.myCard = undefined;


        }
    };


    playingServices.updateCard($scope.update);
});
