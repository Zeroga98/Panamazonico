app.factory('playingServices', function($rootScope) {
    return {

        updateCard: function(update) {
            var rol = "";
            $rootScope.idPartida = "h";
            console.log($rootScope.user.rol);
            if ($rootScope.user.rol == "Retado") {
                rol = "Retado";
                // console.log("rolretado");
            } else {
                rol = "Retador";
                console.log("rolretador");
            }

            firebase.database().ref('/items/').orderByChild("email" + rol).equalTo($rootScope.email).on('child_added', function(snapshot) {
                $rootScope.idPartida = snapshot.key;

                // console.log($rootScope.user);
                var getAdve = "";
                if ($rootScope.user.rol == "Retado") {
                    getAdve = "cardRetador";
                } else {
                    getAdve = "cardRetado";
                }
                // console.log(getAdve);
                console.log($rootScope.idPartida);
                firebase.database().ref('/items/' + $rootScope.idPartida + '/' + getAdve + '/').on('value', function(snapshot) {

                    var link = snapshot.val();
                    firebase.database().ref('cards/Fauna').orderByChild("img").equalTo(link).on('value', function(snapshot) {

                        if (snapshot.val() == null) {
                            firebase.database().ref('cards/Flora').orderByChild("img").equalTo(link).on('value', function(snapshot) {
                                snapshot.forEach(function(card) {
                               

                                    update(card.val());
                                });

                            });
                        } else {
                            snapshot.forEach(function(card) {
                        
                                update(card.val());
                            });
                        }
                    });
                });



            });


        },




    };
});
