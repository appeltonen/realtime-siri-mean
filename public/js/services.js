'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('services', []).
  factory('socket', function (socketFactory) {
    return socketFactory();
  });
