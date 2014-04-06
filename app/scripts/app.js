'use strict';

var app = angular.module('ContactList', ['ngRoute', 'ngResource']);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/contactList.html',
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
        .when('/contacts/remove/:id', {
            templateUrl: 'views/contactList.html',
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

app.constant('API_URL', 'http://www.jscacourse.co.vu');
app.constant('SECRET_TOKEN', 'SECRET-TOKEN');

app.factory('Backend', function($resource, API_URL){
    return $resource(API_URL + '/:action', null, {
        'login' : { method: 'POST' },
        'signup' : { method: 'POST' },
        'users' : { method: 'GET', isArray: true }
    });
});

app.factory('Utils', function(){
    var service = {
        getAvatar: function(gender){
            var imageId = _.random(0, 59),
                avatarTemplate = "http://api.randomuser.me/0.3/portraits/{gender}/{id}.jpg";

            return avatarTemplate.replace('{gender}', gender == 'male' ? 'men' : 'women')
                .replace('{id}', imageId);
        }
    };

    return service;
})

app.factory('Security', function(Backend){
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

app.factory('Users', function($http, $q, Backend, Security, Utils, API_URL, SECRET_TOKEN){

    var service = {
        contactList: null,
        getUsers: function(){
            var that = this,


                getUsersPromise = $q.defer();

            if (this.contactList){
                getUsersPromise.resolve(this.contactList)
            } else {
                Backend.users({action: 'users'}, null, function(result){
                    that.contactList = [];
                    angular.forEach(result, function(userInfo){
                        that.contactList.push({
                            id: userInfo.id,
                            gender: userInfo.user.gender,
                            title: userInfo.user.name.title,
                            firstName: userInfo.user.name.first,
                            lastName: userInfo.user.name.last,
                            avatar: Utils.getAvatar(userInfo.user.gender)
                        })
                    })
                    getUsersPromise.resolve(that.contactList);
                })
            }

            return getUsersPromise.promise;
        },
        getContactDetails: function(userId){
            var deferred = $q.defer(),
                contactIndex = -1,
                contact = this.contactList.filter(function(element, index){
                    var result = element.id === userId;
                    if (result){
                        contactIndex = index;
                    }

                    return result;
                })[0];

            if (contact.loadedDetails){
                deferred.resolve(contact);
            } else {
                var requestHeader = {},
                    that = this;

                requestHeader[SECRET_TOKEN] = Security.token;

                $http.get(API_URL + '/user/' + userId, {
                    headers: requestHeader
                }).then(function(result){
                        var contactDetails = result.data[0],
                            details = {
                                firstName: contactDetails.user.name.first,
                                lastName: contactDetails.user.name.last,
                                title: contactDetails.user.name.title,
                                gender: contactDetails.user.gender,
                                street: contactDetails.user.location.street,
                                city: contactDetails.user.location.city,
                                state: contactDetails.user.location.state,
                                zip: contactDetails.user.location.zip,
                                email: contactDetails.user.email,
                                phone: contactDetails.user.phone,
                                cell: contactDetails.user.cell,
                                SSN: contactDetails.user.SSN,
                                id: contactDetails.id,
                                avatar: that.contactList[contactIndex].avatar,
                                loadedDetails: true
                            };

                        that.contactList[contactIndex] = details;

                        deferred.resolve(details);

                    }, function(error){
                        deferred.reject(new Error('backend error on get user details ' +  error.responseText))
                    });
            }

            return deferred.promise;
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
                    that.errorMessage = response.data.error;
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

app.controller('ContactCtrl', function($scope, $routeParams, $location, Users, Security, Utils){
    if (!Security.isAuthenticated()){
        $location.path('/login');
    } else {
        if ($routeParams.id){
            Users.getContactDetails($routeParams.id).then(function(contactDetails){
                debugger;
                $scope.contact = _.clone(contactDetails);
                $scope.contactOriginal = contactDetails;
            });
        } else {
            $scope.contact = {
                gender: 'male',
                id: _.random(1, 1000),
                isNew: true,
                avatar: Utils.getAvatar('male')
            }
        }
    }

    $scope.save = function(){
        Users.getUsers().then(function(users){
            if ($scope.contact.isNew){
                users.push($scope.contact);
            } else {
                users[users.indexOf($scope.contactOriginal)] = $scope.contact;
            }
            $location.path('/');
        }, function(){
            alert('Unexpected error happened!');
        });
    }
});

app.controller('ContactListCtrl', function ($scope, $location, Users, Security) {
    Users.getUsers().then(function(users){
        $scope.contactList = {
            contacts: users
        };
    }, function(){
        alert('Unexpected error happened!');
    });

   $scope.removeUser = function(id){
       if (!Security.isAuthenticated()){
           $location.path('/login');
       } else {
           var contactIndex = -1,
               contacts = $scope.contactList.contacts;

           contacts.filter(function(value, index){
               if (value.id === id){
                   contactIndex = index;
               }
           })

           contacts.splice(contactIndex, 1);
       }
   }
});

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