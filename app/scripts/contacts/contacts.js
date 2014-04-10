'use strict';

angular.module('ContactList').controller('ContactListCtrl', function ($scope, $location, Users, Security) {
    Users.getUsers().then(function(users){
        $scope.contactList = {
            contacts: users
        };
    }, function(){
        console.log('Unexpected error happened!');
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
            });

            contacts.splice(contactIndex, 1);
        }
    };
})
.directive('contactsList', function(){
    return {
        restrict: 'E',
        templateUrl: 'scripts/contacts/contacts.tpl.html'
    };
})

.directive('contact', function(){
    return {
        restrict: 'E',
        templateUrl: 'scripts/contacts/contact.tpl.html'
    };
});