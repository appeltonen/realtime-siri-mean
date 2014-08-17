/*
 * Serve content over a socket
 */

module.exports = function (socket) {
	
  setInterval(function () {
  	var http = require('http');
	var print;

	var options = {
	  hostname: 'data.itsfactory.fi',
	  path: '/siriaccess/vm/json',
	  method: 'GET'
	}; 

	http.request(options, function(res){
	  var jsondata = '';
	  console.log('STATUS ' + res.statusCode)
	  res.on('data', function(chunk){
	  	jsondata += chunk.toString();
	  });
	  res.on('end', function(){
	  	if(jsondata ==='foo') return;
	  	//json = JSON.parse(json);
	  	//var location = json.Siri.ServiceDelivery.VehicleMonitoringDelivery[0].VehicleActivity[0].MonitoredVehicleJourney.VehicleLocation;
	    socket.emit('send:move', jsondata);
	    //print = 'Longitude: ' + location.Longitude + ', Latitude: ' + location.Latitude;
	    console.log('Sent JSON at ' + Date.now());
	  })

	}).on('error', function(e) {
	  console.log('Got error: ' + e.message);
	}).end()
  }, 1000);
};
