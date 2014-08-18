'use strict';

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
      zoom: 11,
      draggable: true
    };
    $scope.initialized = false;
    $scope.busMarkers = [];
    $scope.options = { styles: mapstyles };
    $scope.moving = { 
      latitude: 61.497557,
      longitude: 23.760724 
    };
    /*var line = '13';
    $scope.map['marker'] = {
      icon: 'https://chart.googleapis.com/chart?chst=d_map_spin&chld=0.7|0|0066FF|13|b|' + line,
      pos: {
        latitude: 61.497557,
        longitude: 23.760724
      }
    };*/

    socket.on('send:move', function (data){
      var jsondata = JSON.parse(data);
      var numberOfBuses = jsondata.Siri.ServiceDelivery.VehicleMonitoringDelivery[0].VehicleActivity.length;
      //function to create new marker
      var newMarker = function(latitude, longitude, id, lineNumber){
        var marker = {
          idKey: id,
          icon: 'https://chart.googleapis.com/chart?chst=d_map_spin&chld=0.7|0|0066FF|13|b|' + lineNumber,
          pos:{
            latitude: lat,
            longitude: lon
          }
        }
        return marker;
      };

      if(!$scope.initialized){
        var markers = [];
        for(var i = 0; i < numberOfBuses; ++i){
          var location = jsondata.Siri.ServiceDelivery.VehicleMonitoringDelivery[0].VehicleActivity[i].MonitoredVehicleJourney.VehicleLocation;
          var lat = location.Latitude;
          var lon = location.Longitude;
          var lineNbr = jsondata.Siri.ServiceDelivery.VehicleMonitoringDelivery[0].VehicleActivity[i].MonitoredVehicleJourney.LineRef.value;
          var vehicle = jsondata.Siri.ServiceDelivery.VehicleMonitoringDelivery[0].VehicleActivity[i].MonitoredVehicleJourney.VehicleRef.value;

          //create new marker
          markers.push(newMarker(lat,lon,vehicle,lineNbr));
          $scope.initialized = true;
        }
        $scope.busMarkers = markers;
      }
      else{
        //check if new vehicles have become active and update existing vehicles' positions
        var found = false;
        for(var i = 0; i < numberOfBuses; ++i){
          var location = jsondata.Siri.ServiceDelivery.VehicleMonitoringDelivery[0].VehicleActivity[i].MonitoredVehicleJourney.VehicleLocation;
          var lat = location.Latitude;
          var lon = location.Longitude;
          var lineNbr = jsondata.Siri.ServiceDelivery.VehicleMonitoringDelivery[0].VehicleActivity[i].MonitoredVehicleJourney.LineRef.value;
          var vehicle = jsondata.Siri.ServiceDelivery.VehicleMonitoringDelivery[0].VehicleActivity[i].MonitoredVehicleJourney.VehicleRef.value;
          for(var j = 0; j < $scope.busMarkers.length; ++j){
            if($scope.busMarkers[j].idKey == vehicle){
              found = true;
              //update location
              var logMsg = 'Update position from: ' + $scope.busMarkers[j].pos.latitude + ' ' + $scope.busMarkers[j].pos.longitude + ' to ' + lat + ' ' + lon;
              console.log(logMsg);
              $scope.busMarkers[j].pos.latitude = lat;
              $scope.busMarkers[j].pos.longitude = lon;
              break;
            }
          }
          if(!found){
            $scope.busMarkers.push(newMarker(lat,lon,vehicle,lineNbr));
          }
        }
        //remove vehicles with expired ValidUntilTime property DOES NOT WORK PROPERLY
        /*for(var i = 0; i < $scope.busMarkers.length; ++i){
          var validity = jsondata.Siri.ServiceDelivery.VehicleMonitoringDelivery[0].VehicleActivity[i].ValidUntilTime;
          if( validity <= Date.now() ){
            console.log('No more valid:' + validity + ' at time ' + Date.now());
            $scope.busMarkers.splice(i,1);
          }
        }*/
      }
    });
  });

