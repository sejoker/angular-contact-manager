'use strict';

angular.module('ContactList').factory('Backend', function($http, API_URL){

	return {
		login: function(data){
			return $http.post(API_URL + '/login', data);
		},
		signup: function(data){
			return $http.post(API_URL + '/signup', data);
		},
		getUsers: function(){
			return $http.get(API_URL + '/users');
		},
		getUserDetails: function(userId, header){
			return $http.get(API_URL + '/user/' + userId, {
				headers: header
			});
		}
	};
});