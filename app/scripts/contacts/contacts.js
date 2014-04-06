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


app.factory('User', ['$resource', function($resource){
    var API_URL = 'http://www.jscacourse.co.vu';

    return $resource(API_URL + '/:action', null, {
        'login' : { method: 'POST' },
        'signup' : { method: 'POST' }
        });
}]);

app.factory('Security', function(User){
    var service = {
        isAuthenticated: function(){
            return !!service.token;
        },
        token: null,
        login: function(login, password, callback, errorCallback){
            var that = this;

            User.login({action: 'login'}, { data: {
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

            User.signup({action: 'signup'}, { data: {
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

app.controller('ContactListCtrl', ['$scope', '$routeParams', 'User', function ($scope, $routeParams, User) {
    $scope.contactList = {
        contacts: [
            {
                id: 1,
                name : 'Terrence S. Hatfield',
                tel: '651-603-1723',
                email: 'TerrenceSHatfield@rhyta.com',
                avatar: 'http://api.randomuser.me/0.3/portraits/women/1.jpg'
            },
            {
                id: 2,
                name : 'Chris M. Manning',
                tel: '513-307-5859',
                email: 'ChrisMManning@dayrep.com',
                avatar: 'http://api.randomuser.me/0.3/portraits/women/2.jpg'
            },
            {
                id: 3,
                name : 'Ricky M. Digiacomo',
                tel: '918-774-0199',
                email: 'RickyMDigiacomo@teleworm.us',
                avatar: 'http://api.randomuser.me/0.3/portraits/women/3.jpg'
            },
            {
                id: 4,
                name : 'Michael K. Bayne',
                tel: '702-989-5145',
                email: 'MichaelKBayne@rhyta.com',
                avatar: 'http://api.randomuser.me/0.3/portraits/women/4.jpg'
            },
            {
                id: 5,
                name : 'John I. Wilson',
                tel: '318-292-6700',
                email: 'JohnIWilson@dayrep.com',
                avatar: 'http://api.randomuser.me/0.3/portraits/women/5.jpg'
            },
            {
                id: 6,
                name : 'Rodolfo P. Robinett',
                tel: '803-557-9815',
                email: 'RodolfoPRobinett@jourrapide.com',
                avatar: 'http://api.randomuser.me/0.3/portraits/women/6.jpg'
            }
        ]
    };
    if ($routeParams.id){
        $scope.contact = $scope.contactList.contacts[$routeParams.id - 1];
    }
    //var loggedUser = User.login({}, { data: userData });
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