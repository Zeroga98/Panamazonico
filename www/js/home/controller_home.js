app.controller('homeCtrl', function($scope, $rootScope, $ionicHistory, homeServices, $ionicPopup, $timeout) {
    $rootScope.user = {
        name: "",
        email: "",
        status: "",
        img: "",
        id: "",
        gamesWin: "",
        rol:""
    };
    $rootScope.idPartida="";
    homeServices.getUser();

    $rootScope.cardFlora = [];
    var cartasFlora = function(id, obj) {
        $rootScope.cardFlora.push({
            name: id,
            poder: obj.Poder,
            tipo: obj.Tipo,
            img: obj.img
        });
        $ionicHistory.clearCache();
        // console.log(obj);
    };
    $rootScope.cardFauna = [];
    var cartasFauna = function(id, obj) {
        $rootScope.cardFauna.push({
            name: id,
            poder: obj.Poder,
            tipo: obj.Tipo,
            img: obj.img
        });
        $ionicHistory.clearCache();
        // console.log(obj);
    };
    $scope.showConfirm = function() {

    };
    homeServices.getIdPartida();
    homeServices.getPartida();
    homeServices.getCards(cartasFlora,cartasFauna);
});
