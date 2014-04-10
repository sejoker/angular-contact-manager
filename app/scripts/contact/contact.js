
'use strict';

angular.module('ContactList').controller('ContactCtrl', function($scope, $routeParams, $location, Users, Security, Utils){
    if (!Security.isAuthenticated()){
        $location.path('/login');
    } else {
        // edit contact
        if ($routeParams.id){
            Users.getContactDetails($routeParams.id).then(function(contactDetails){
                $scope.contact = _.clone(contactDetails);
                $scope.contactOriginal = contactDetails;
            });
        } else {
            // create new
            $scope.contact = {
                gender: 'male',
                id: _.random(1, 1000),
                isNew: true,
                avatar: Utils.getAvatar('male')
            };
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
            console.log('Unexpected error happened!');
        });
    };
});