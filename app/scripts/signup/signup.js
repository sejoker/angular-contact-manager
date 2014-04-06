'use strict';

angular.module('ContactList')
    .controller('LoginCtrl', function($scope, $location, Security){
        $scope.currentUser = {
            signedIn: false,
            createNew: false,
            errorMessage: null,
            loginName: null,
            password: null,

            apply: function(){
                var that = this,
                    errorCallback = function(response){
                        that.errorMessage = response.data.error;
                    },
                    successCallback = function(){
                        $location.path('/');
                    };

                Security.login(this.loginName, this.password, successCallback, errorCallback);
            }
        };
    })
    .controller('SignupCtrl', function($scope, $location, Security){
        $scope.currentUser = {
            signedIn: false,
            token: null,
            createNew: true,
            errorMessage: null,
            loginName: null,
            password: null,
            passwordConfirmation: null,

            apply: function(){
                var that = this,
                    errorCallback = function(response){
                        that.errorMessage = '';
                        angular.forEach(response.data.errors, function(value){
                            angular.forEach(value, function(value, key){
                                that.errorMessage += key + ':' + value + '; ';
                            });
                        });
                    },
                    successCallback = function(){
                        $location.path('/');
                    };

                Security.signup(this.loginName, this.password, this.passwordConfirmation, successCallback, errorCallback);
            }
        };
    });