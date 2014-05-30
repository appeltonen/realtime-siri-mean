'use strict';

/* Controllers */

angular.module('controllers', []).
  controller('AppCtrl', function ($scope, socket) {
    $scope.map = {
      center: {
        latitude: 61.497557,
        longitude: 23.760724
      },
      zoom: 11
    };
    $scope.moving = { 
      latitude: 61.497557,
      longitude: 23.760724 
    };
    socket.on('send:name', function (data) {
      $scope.name = data.name;
    });
    socket.on('send:move', function (data){
      $scope.moving = { 'latitude': data.latitude, 'longitude': data.longitude };
    })
  });