app.factory('homeServices', function($rootScope, $ionicHistory, $ionicPopup, $timeout, $state) {
    return {
        getUser: function() {
            firebase.database().ref('/users/').orderByChild("email").equalTo($rootScope.email).once('child_added', function(snapshot) {
                $rootScope.user.name = snapshot.val().name;
                $rootScope.user.email = snapshot.val().email;
                $rootScope.user.status = snapshot.val().status;
                $rootScope.user.img = snapshot.val().profile_picture;
                $rootScope.user.id = snapshot.key;
                $rootScope.user.gamesWin = snapshot.val().gamesWin;
                //    $ionicHistory.clearCache();
            });
        },
        getCards: function(cartasFlora, cartasFauna) {
            firebase.database().ref('cards/Flora').on('child_added', function(snapshot) {
                cartasFlora(snapshot.key, snapshot.val());
            });
            firebase.database().ref('cards/Fauna').on('child_added', function(snapshot) {
                cartasFauna(snapshot.key, snapshot.val());
            });
        },
        getPartida: function() {
            firebase.database().ref('/items/').orderByChild("emailRetado").equalTo($rootScope.email).on('child_added', function(snapshot) {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Invitacion a jugar',
                    template: snapshot.val().retador + ' te invito a jugar'
                });
                console.log(snapshot.key);
                /*    console.log(snapshot.val().retador);
                    $rootScope.acceptedPartida.retado=snapshot.val().retador;*/
                confirmPopup.then(function(res) {
                    if (res) {
                        var updates = {};
                        updates['/items/' + snapshot.key + '/status'] = "accepted";
                        var estus = {};
                        estus['/users/' + $rootScope.user.id + '/status'] = "Jugando";
                        $state.go('main.play-playing');
                        $ionicHistory.clearCache();
                        // console.log('You are sure');
                        firebase.database().ref().update(estus);
                        $rootScope.user.rol = "Retado";
                        // console.log($rootScope.user);
                        $rootScope.idPartida = snapshot.key;
                        return firebase.database().ref().update(updates);
                    } else {
                        /* var updates = {};
                         updates['/items/' + snapshot.key + '/status'] = "esperando";

                         return firebase.database().ref().update(updates);
                         console.log('You are not sure');*/
                    }
                });

                $timeout(function() {
                    confirmPopup.close(); //close the popup after 3 seconds for some reason
                }, 10000);
                //    $ionicHistory.clearCache();
            });

        },
        getIdPartida: function() {
            console.log($rootScope.user.rol);
            firebase.database().ref('/items/').orderByChild("email" + $rootScope.user.rol).equalTo($rootScope.email).on('child_added', function(snapshot) {
                $rootScope.idPartida = snapshot.key;
                console.log(snapshot.key);
            });
        }

    };
});
