'use strict';

angular.module('controllers', [])
.controller( 'AppCtrl', function ($scope, socket) {
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
    $scope.active = 0;
    $scope.delayed = 0;
    $scope.timely = 0;

    $scope.options = { styles: mapstyles };

    $scope.updateNumberOfActive = function(){
      return $scope.active;
    };

    $scope.updateNumberOfTimely = function(){
      return $scope.timely;
    };

    $scope.updateNumberOfDelayed = function(){
      return $scope.delayed;
    }

    $scope.isDelayed = function(timestamp){
      var ts = timestamp;
      ts = ts.substr(ts.lastIndexOf('M')+1);
      var res = ts.substr(0,ts.indexOf('S'));
      res = parseFloat(res);
      if(res<30) return false;
      else return true;
    };

    socket.on('send:move', function (data){
      var jsondata = JSON.parse(data);
      var numberOfBuses = jsondata.Siri.ServiceDelivery.VehicleMonitoringDelivery[0].VehicleActivity.length;
      var numberOfDelayed = 0;

      $scope.active = numberOfBuses;
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
          var delay = jsondata.Siri.ServiceDelivery.VehicleMonitoringDelivery[0].VehicleActivity[i].MonitoredVehicleJourney.Delay;

          if($scope.isDelayed(delay)){
            ++numberOfDelayed;
          };

          for(var j = 0; j < $scope.busMarkers.length; ++j){
            if($scope.busMarkers[j].idKey == vehicle){
              found = true;
              //update location
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
      }
      $scope.delayed = numberOfDelayed;
      $scope.timely = $scope.active - $scope.delayed;
    });

}).directive('activityGraph', function(){
    return{
      restrict: 'E',
      replace: true,
      template: '<div id="chart-container">' + 
                  '<div id="y_axis"></div>' +
                  '<div id="graph"></div>' +
                '</div>',
      link: function(scope, element, attrs, controllers){
        var graph = null;
        var interval = 1000;

        graph = new Rickshaw.Graph( {
          element: document.getElementById('graph'),
          width: 600,
          height: 150,
          max: 200,
          renderer: 'line',
          series: new Rickshaw.Series.FixedDuration([
            {name: 'active', color: '#428bca'},
            {name: 'timely', color: '#5cb85c'},
            {name: 'delayed', color: '#f0ad4e'}
            ], undefined, {
            timeInterval: interval,
            maxDataPoints: 100,
            timeBase: new Date().getTime() / 1000
          }) 
        });

        var y_ticks = new Rickshaw.Graph.Axis.Y( {
          graph: graph,
          orientation: 'left',
          tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
          element: document.getElementById('y_axis')
        });

        graph.render();

        //set graph to update per interval variable
        var iv = setInterval( function() {
          //reference controller's method
          //Note: This results in tight coupling of the controller and the directive
          var data = {
            active: scope.updateNumberOfActive(),
            timely: scope.updateNumberOfTimely(),
            delayed: scope.updateNumberOfDelayed()
          };

          //add data to graph
          graph.series.addData(data);
          //update graph
          graph.render();
        }, interval);
      }
    };
  }
);
  

