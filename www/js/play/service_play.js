app.factory('playServices', function($rootScope, $ionicLoading) {
    return {
        getUserConnect: function(putUser) {
            firebase.database().ref('users').orderByChild("status").equalTo("Conectado").on('child_added', function(snapshot) {
                putUser(snapshot.key, snapshot.val());
            });
            firebase.database().ref('users').orderByChild("status").equalTo("Jugando").on('child_added', function(snapshot) {
                putUser(snapshot.key, snapshot.val());
            });
        },
        getUserDisconnected: function(putUser) {
            firebase.database().ref('users').orderByChild("status").equalTo("Desconectados").on('child_added', function(snapshot) {
                putUser(snapshot.key, snapshot.val());
            });
        },
        startingInvite: function(user, idPartida) {
            var id = "";
            firebase.database().ref('items').orderByChild("email").equalTo(user.email).once('value', function(snapshot) {
                if (snapshot.val() != null) {} else {
                    id = firebase.database().ref('items/').push({
                        emailRetador: $rootScope.email,
                        retador: $rootScope.user.name,
                        emailRetado: user.email,
                        retado: user.name,
                        status: "esperando",
                        cardRetador: "null",
                        cardRetado: "null"

                    });

                    idPartida(id.key);
                    $rootScope.idPartida=id.key;

                }

            });
        },
        resOponente: function(acceptedPartida, idPartida) {
            console.log( $rootScope.idPartida);
            firebase.database().ref('items/' +  $rootScope.idPartida).orderByChild("status").equalTo("accepted").on('child_added', function(snapshot) {
                $ionicLoading.hide();
               
                acceptedPartida(snapshot.val());
                acceptedPartida.retador = snapshot.val().retado;
               
            });

        }


    };
});
