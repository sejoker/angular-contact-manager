'use strict';

angular.module('ContactList').factory('Security', function(Backend){
    var service = {
        isAuthenticated: function(){
            return !!this.token;
        },
        token: null,
        login: function(login, password, callback, errorCallback){
            var that = this;

            Backend.login({action: 'login'}, { data: {
                login: login,
                password: password
            }}, function(value){
                that.token = value.token;
                callback();
            }, function(response){
                errorCallback(response);

            });
        },
        signup: function(login, password, passwordConfirmation, callback, errorCallback){
            var that = this;

            Backend.signup({action: 'signup'}, { data: {
                login: login,
                password: password,
                passwordConfirmation: passwordConfirmation
            }}, function(value){
                that.token = value.token;
                callback();
            }, function(response){
                errorCallback(response);

            });
        }
    }

    return service;
});