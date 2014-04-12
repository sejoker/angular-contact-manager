'use strict';

angular.module('ContactList', ['ngRoute'])
.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            template: '<contacts-list></contacts-list>',
            controller: 'ContactListCtrl'
        })
        .when('/contacts/new', {
            templateUrl: 'scripts/contact/new-contact.tpl.html',
            controller: 'ContactCtrl'
        })
        .when('/contacts/edit/:id', {
            templateUrl: 'scripts/contact/new-contact.tpl.html',
            controller: 'ContactCtrl'
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
})
.constant('API_URL', 'http://www.jscacourse.co.vu')
.constant('SECRET_TOKEN', 'SECRET-TOKEN');