'use strict';

angular.module('ContactList').factory('Security', function(Backend){
    var service = {
        isAuthenticated: function(){
            return !!this.token;
        },
        token: null,
        login: function(login, password, callback, errorCallback){
            var that = this;

            Backend.login({ data: {
                login: login,
                password: password
            }}).then(function(value){
                that.token = value.data.token;
                callback();
            }, function(response){
                errorCallback(response);
            });
        },
        signup: function(login, password, passwordConfirmation, callback, errorCallback){
            var that = this;

            Backend.signup({ data: {
                login: login,
                password: password,
                passwordConfirmation: passwordConfirmation
            }}).then(function(value){
                that.token = value.data.token;
                callback();
            }, function(response){
                errorCallback(response);
            });
        }
    };

    return service;
});