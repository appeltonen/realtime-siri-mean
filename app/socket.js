/*
 * Serve content over a socket
 */

module.exports = function (socket) {
  socket.emit('send:name', {
    name: 'Tom'
  });

  setInterval(function () {
  	var http = require('http');
	var print;

	var options = {
	  hostname: 'data.itsfactory.fi',
	  path: '/siriaccess/vm/json?lineRef=30',
	  method: 'GET'
	}; 

	http.request(options, function(res){
	  var json = '';
	  res.on('data', function(chunk){
	  	json += chunk.toString();
	  });
	  res.on('end', function(){
	  	json = JSON.parse(json);
	  	var location = json.Siri.ServiceDelivery.VehicleMonitoringDelivery[0].VehicleActivity[0].MonitoredVehicleJourney.VehicleLocation;
	    socket.emit('send:move', {
      		latitude: location.Latitude , longitude: location.Longitude
    	});
	    print = 'Longitude: ' + location.Longitude + ', Latitude: ' + location.Latitude;
	    console.log(print);
	  })

	}).on('error', function(e) {
	  console.log('Got error: ' + e.message);
	}).end()
  }, 1000);
};
