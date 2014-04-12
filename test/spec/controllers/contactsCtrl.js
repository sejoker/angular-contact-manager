describe('Backend service', function () {

'use strict';

  var $http, $httpBackend, $scope, ctrl;

  beforeEach(module('ContactList'));
  beforeEach(function(){
    module(function($provide){
        var _ = {
                  random: function(){
                      return 7;
                  }
                };

      $provide.value('Underscore', _);
    });
  });
  beforeEach(inject(function (_$http_, _$httpBackend_) {
    $http = _$http_;
    $httpBackend = _$httpBackend_;
  }));
  beforeEach(inject(function (_$rootScope_, _$controller_) {
    $scope = _$rootScope_.$new();
    ctrl = _$controller_('ContactListCtrl', {
      $scope : $scope
    });
  }));


  it('should return all users', function () {

    //setup expected requests and responses
    $httpBackend.whenGET('http://www.jscacourse.co.vu/users').respond(
      [
        {
          id: '007',
          user : {
            gender: 'male',
            name: {
              title: 'mr',
              first: 'James',
              last: 'Bond'
            }
          }
        }]);

    //simulate response
    $httpBackend.flush();

    //verify results
    expect($scope.contactList.contacts.length).toEqual(1);
    expect($scope.contactList.contacts[0].id).toEqual('007');
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
});