'use strict';

angular.module('ContactList').factory('Utils', ['Underscore', function(_){
    var service = {
        getAvatar: function(gender){
            var imageId = _.random(0, 59),
                avatarTemplate = 'http://api.randomuser.me/0.3/portraits/{gender}/{id}.jpg';

            return avatarTemplate.replace('{gender}', gender === 'male' ? 'men' : 'women')
                .replace('{id}', imageId);
        }
    };

    return service;
}]);