    app.factory('loginService', function($http, $state, $rootScope, $ionicHistory, $location, $cordovaOauth, $ionicLoading) {

        return {
            login: function(sap) {

                firebase.auth().signInWithPopup(provider).then(function(result) {
                    // This gives you a Google Access Token. You can use it to access the Google API.
                    var token = result.credential.idToken;
                    var accessToken = result.credential.accessToken;
                    var idToken = result.credential.idToken;
                    var myUserId = firebase.auth().currentUser.uid;
                    localStorage.setItem("token", token);
                    localStorage.setItem("accessToken", accessToken);
                    localStorage.setItem("idToken", accessToken);

                    console.log(result);
                    // conexion con firebase
                    firebase.database().ref('users').orderByChild("email").equalTo(result.user.email).once('value', function(snapshot) {
                        if (snapshot.val() != null) {
                            //update
                        } else {
                            firebase.database().ref('users/').push({
                                name: result.user.displayName,
                                email: result.user.email,
                                profile_picture: result.user.photoURL,
                                status: "Conectado",
                                gamesWin:0
                            });

                        }

                    });
                    $state.go('main.specie');
                }).catch(function(error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    // The email of the user's account used.
                    var email = error.email;
                    // The firebase.auth.AuthCredential type that was used.
                    var credential = error.credential;
                    console.log(error);
                });

            },
            loginM: function() {
                $ionicLoading.show({
                    template: 'Logging in...'
                });
                window.plugins.googleplus.login({ webClientId: '712207650476-vag8j9tmk12rhetj4kqa4qm90a622ki1.apps.googleusercontent.com' },
                    function(user_data) {

                        console.log(user_data);
                        //settingsService.saveUser(user_data.displayName, user_data.email, user_data.imageUrl);
                        $ionicLoading.hide();
                        var token = user_data.idToken;
                        localStorage.setItem("token", token);

                        firebase.database().ref('users').orderByChild("email").equalTo(user_data.email).once('value', function(snapshot) {
                            if (snapshot.val() != null) {
                                //update
                            } else {
                                firebase.database().ref('users/').push({
                                    name: user_data.displayName,
                                    email: user_data.email,
                                    profile_picture: user_data.imageUrl,
                                    status: "Conectado",
                                    gamesWin: 0
                                });

                            }

                        });
                         $ionicHistory.clearCache().then(function(){ $state.go('main.specie');});
                 

                    },
                    function(msg) {
                        $ionicLoading.hide();
                        console.log(msg);

                    }
                );

            },
            logout: function() {

                window.plugins.googleplus.login({ webClientId: '712207650476-vag8j9tmk12rhetj4kqa4qm90a622ki1.apps.googleusercontent.com' },
                    function(user_data) {

                        console.log(user_data);
                        window.plugins.googleplus.logout(
                            function(msg) {
                                console.log(msg);
                                $ionicLoading.hide();
                                localStorage.removeItem("token");
                                localStorage.removeItem("accessToken");
                                localStorage.clear();
                                $ionicHistory.clearCache();
                                $state.go('login');
                                //$state.go('welcome');
                            },
                            function(fail) {
                                console.log(fail);
                            }
                        );
                    },
                    function(msg) {
                        $ionicLoading.hide();
                        console.log(msg);

                    }
                );

                $ionicLoading.show({
                    template: 'Logging out...'
                });
                //google logout

            }


        }


    });
