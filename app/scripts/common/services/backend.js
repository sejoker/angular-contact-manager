'use strict';

angular.module('ContactList').factory('Backend', function($resource, API_URL){
    return $resource(API_URL + '/:action', null, {
        'login' : { method: 'POST' },
        'signup' : { method: 'POST' },
        'users' : { method: 'GET', isArray: true }
    });
});