var app = angular.module('starter', ['ionic', 'satellizer', 'ngCordova', 'ngCordovaOauth']) //init: satellizer aut

var db = null;
var provider = new firebase.auth.GoogleAuthProvider(); // firebase
var config = {
    apiKey: "AIzaSyBlG_7GqdehotSPJB1CHEGo20y8PeFof6c",
    authDomain: "panamazonico-2e754.firebaseapp.com",
    databaseURL: "https://panamazonico-2e754.firebaseio.com",
    storageBucket: "panamazonico-2e754.appspot.com",
};
try {
    firebase.initializeApp(config);
    var fireDB = firebase.database();
} catch (er) {
    if (fireDB !== undefined) {
        fireDB.ref("disconnectmessage").onDisconnect().set("I disconnected!");
    }
}

app.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {

        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
        if (cordova.platformId == 'android') {
            StatusBar.backgroundColorByHexString("#1B5E20");
        }
    });
})

.config(function($stateProvider, $urlRouterProvider, $authProvider) { //pasar $authProvider
    $authProvider.tokenName = 'token';
    $authProvider.tokenPrefix = '';
    $authProvider.storageType = 'localStorage';

    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'templates/login/view_login.html',
            controller: 'loginCtrl'

        })

    // setup an abstract state for the tabs directive
    .state('main', {
        url: '/main',
        abstract: true,
        templateUrl: 'templates/home/home.html',
        controller: 'homeCtrl'
    })

    // Each tab has its own nav history stack:

    .state('main.specie', {
        url: '/specie',
        views: {
            'main-specie': {
                templateUrl: 'templates/specie/view_specie.html',
                controller: 'especieCtrl'
            }
        }
    })

    .state('main.play', {
            url: '/play',
            views: {
                'main-play': {
                    templateUrl: 'templates/play/view_play.html',
                    controller: 'playCtrl'
                }
            }
        })
        .state('main.play-playing', {
            url: '/play/playing',
            views: {
                'main-play': {
                    templateUrl: 'templates/play/view_playing.html',
                    controller: 'playingCtrl'
                }
            }
        })

    .state('main.settings', {
        url: '/settings',
        views: {
            'main-settings': {
                templateUrl: 'templates/settings/view_settings.html',
                controller: 'settingCtrl'
            }
        }
    });

    // if none of the above states are matched, use this as the fallback


    var url = window.location.hash.split("/");
    if (url[0] === "") {
        if (localStorage.token === undefined) {
            $urlRouterProvider.otherwise('/login');


        } else {
            $urlRouterProvider.otherwise('/main/specie')
            $urlRouterProvider.otherwise('/main/play');
            

        }
    } else {
        $urlRouterProvider.otherwise('/login');
     
    }

})

.run(["$rootScope", "$auth", "$state", function($rootScope, $auth, $state) {

    $rootScope.$on('$stateChangeStart', function(event, toState) {

        if (toState.name === "login") {
        	    console.log($auth.getPayload());
            if ($auth.getPayload() !== undefined && $auth.getPayload().email_verified) {
                event.preventDefault();
                 $state.go('main.play');
	   

            }
        } else { // Cuando esta dentro de la app
    
            if ($auth.getPayload()==undefined) { //No existe un token el localStorage
                event.preventDefault();
                console.log($auth.isAuthenticated());
                $state.go('login');
            } else {
                if ($auth.getPayload() !== undefined) {

                    var user = $auth.getPayload();
                    $rootScope.email = user.email;

                    if (user.email.length && user.email_verified) {
                        //Todo esta bien
             

                    } else {
                        event.preventDefault();
                        $state.go('login');

                    }
                } else { // cuando el token no existe
                    $rootScope.user = undefined;
                    event.preventDefault();
                    //          $state.go('login');
                }

            }
        }
    });

}]);
