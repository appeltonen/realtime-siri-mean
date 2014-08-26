//Send json over socket
//Time interval 1000 ms equals minimum allowed interval between HTTP requests to ITSFactory API
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
	  res.on('data', function(chunk){
	  	jsondata += chunk.toString();
	  });
	  res.on('end', function(){
	  	if(jsondata ==='foo') return;
	    socket.emit('send:move', jsondata);
	  })

	}).on('error', function(e) {
	  console.log('Got error: ' + e.message);
	}).end()
  }, 1000);
};
