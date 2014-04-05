'use strict';

angular.module('ContactList', [])
    .controller('ContactListCtrl', ['$scope', function ($scope) {
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
        }])
    .directive('contactsList', function(){
        return {
            //scope: {},
            restrict: 'E',
            templateUrl: 'scripts/contacts/contacts.tpl.html'
        };
    })
    .directive('contact', function(){
        return {
            //scope: {},
            restrict: 'E',
            templateUrl: 'scripts/contacts/contact.tpl.html'
        }
    });