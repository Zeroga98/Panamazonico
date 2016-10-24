app.factory('specieService', function($rootScope,  $ionicHistory) {
    return {
        getCards: function(cartasFauna) {
             firebase.database().ref('cards/Flora').on('child_added', function(snapshot) {
               cartasFauna(snapshot.key, snapshot.val());         
            });
        },


    };
});
