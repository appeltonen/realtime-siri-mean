'use strict';
/* Controllers */

angular.module('controllers', []).
  controller('AppCtrl', function ($scope, socket) {
    var mapstyles = [
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      { "color": "#be4880" },
      { "saturation": 1 },
      { "weight": 0.4 },
      { "visibility": "off" }
    ]
  },{
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      { "weight": 0.5 },
      { "color": "#808080" },
      { "gamma": 0.76 }
    ]
  },{
    "featureType": "transit.line",
    "stylers": [
      { "weight": 0.6 },
      { "gamma": 0.16 },
      { "color": "#282c27" },
      { "visibility": "off" }
    ]
  },{
    "featureType": "landscape.natural",
    "stylers": [
      { "visibility": "off" }
    ]
  },{
    "featureType": "landscape.man_made",
    "stylers": [
      { "visibility": "off" }
    ]
  },{
    "featureType": "water",
    "stylers": [
      { "color": "#9999FF" }
    ]
  }
];
    $scope.map = {
      center: {
        latitude: 61.497557,
        longitude: 23.760724
      },
      zoom: 11
    };
    $scope.options = { styles: mapstyles };
    $scope.moving = { 
      latitude: 61.497557,
      longitude: 23.760724 
    };
    $scope.map['marker'] = {
      icon: 'https://chart.googleapis.com/chart?chst=d_map_spin&chld=0.7|0|0066FF|13|b|17',
      pos: {
        latitude: 61.497557,
        longitude: 23.760724
      }
    };

    socket.on('send:move', function (data){
      //$scope.moving = { 'latitude': data.latitude, 'longitude': data.longitude };
    })
  });

