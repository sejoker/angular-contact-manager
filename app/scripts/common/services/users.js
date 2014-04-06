'use strict';

angular.module('ContactList').factory('Users', function($http, $q, Backend, Security, Utils, API_URL, SECRET_TOKEN){

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
                        });
                    });
                    getUsersPromise.resolve(that.contactList);
                });
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
    };

    return service;
});