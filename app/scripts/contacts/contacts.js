'use strict';

var app = angular.module('ContactList', ['ngRoute', 'ngResource']);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/contactList.html',
            controller: 'ContactListCtrl'
        })
        .when('/contacts/new', {
            templateUrl: 'scripts/contact/new-contact.tpl.html'
        })
        .when('/contacts/edit/:id', {
            templateUrl: 'scripts/contact/new-contact.tpl.html',
            controller: 'ContactListCtrl'
        })
        .when('/signup', {
            templateUrl: 'scripts/signup/signup.tpl.html',
            controller: 'SignupCtrl'
        })
        .when('/login', {
            templateUrl: 'scripts/signup/signup.tpl.html',
            controller: 'LoginCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
});


app.factory('Backend', ['$resource', function($resource){
    var API_URL = 'http://www.jscacourse.co.vu';

    return $resource(API_URL + '/:action', null, {
        'login' : { method: 'POST' },
        'signup' : { method: 'POST' },
        'users' : { method: 'GET', isArray: true }
        });
}]);

app.factory('Security', function(Backend){
    var service = {
        isAuthenticated: function(){
            return !!service.token;
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
})

app.controller('LoginCtrl', function($scope, $location, Security){
    $scope.currentUser = {
        signedIn: false,
        createNew: false,
        errorMessage: null,
        loginName: null,
        password: null,

        apply: function(){
            var that = this,
                errorCallback = function(response){
                    that.errorMessage = '';
                    angular.forEach(response.data.errors, function(value){
                        angular.forEach(value, function(value, key){
                            that.errorMessage += key + ':' + value + '; ';
                        })
                    })
                },
                successCallback = function(){
                    $location.path('/');
                }

            Security.login(this.loginName, this.password, successCallback, errorCallback);
        }
    }
});

app.controller('SignupCtrl', function($scope, $location, Security){
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
                        })
                    })
                },
                successCallback = function(){
                    $location.path('/');
                }

            Security.signup(this.loginName, this.password, this.passwordConfirmation, successCallback, errorCallback);
        }
    }
});

app.controller('ContactListCtrl', ['$scope', '$routeParams', 'Backend', function ($scope, $routeParams, Backend) {

    var random = function(min, max) {
            if (max == null) {
                max = min;
                min = 0;
            }
            return min + Math.floor(Math.random() * (max - min + 1));
        },
        getAvatar = function(gender){
            var imageId = random(0, 59),
                avatarTemplate = "http://api.randomuser.me/0.3/portraits/{gender}/{id}.jpg";

            return avatarTemplate.replace('{gender}', gender == 'male' ? 'men' : 'women')
                                 .replace('{id}', imageId);
        };

    $scope.contactList = {
        contacts: []
    };
    Backend.users({action: 'users'}, null, function(result){
        debugger;
        angular.forEach(result, function(userInfo){
            debugger;
            $scope.contactList.contacts.push({
                id: userInfo.id,
                gender: userInfo.user.gender,
                title: userInfo.user.name.title,
                firstName: userInfo.user.name.first,
                lastName: userInfo.user.name.last,
                avatar: getAvatar(userInfo.user.gender)
            })
        })
    })

    if ($routeParams.id){
        $scope.contact = $scope.contactList.contacts[$routeParams.id - 1];
    }
}]);

app.directive('contactsList', function(){
    return {
        //scope: {},
        restrict: 'E',
        templateUrl: 'scripts/contacts/contacts.tpl.html'
    };
});

app.directive('contact', function(){
    return {
        //scope: {},
        restrict: 'E',
        templateUrl: 'scripts/contacts/contact.tpl.html'
    }
});