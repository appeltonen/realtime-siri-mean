
//PubTransport server.js
//accepts command line parameters --initdb <filename> for initializing db with station data as json array (see station.js for file struture)

var express = require('express'),
  //routes = require('./routes'),
  //api = require('./routes/api'),
  http = require('http'),
  path = require('path'),
  mongoose = require('mongoose'),
  dbconfig = require('./config/db'),
  fs = require('fs');

var app = module.exports = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

//set port
app.set('port', process.env.PORT || 3000);

//bootstrap database connection
mongoose.connect(dbconfig.url);

//establish db connection
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', function callback () {
	console.log('Database connection established.');

	//create a new Station model instance
	var Station = require('./models/station').Station;

	//initialize database at first time use: run app as node server.js --initdb filename
	if(process.argv[2] == '--initdb'){
		fs.readFile(__dirname + '/' + process.argv[3], function(err,data){
			if(err) throw err;
			var stationsArray = JSON.parse(data);
			
			//Note: Mongoose Model.create IS NOT a true batch insert, but only abstracts looping through multiple saves
			Station.create(stationsArray, function(err, stationsArray){
				if(err) throw err;
				console.log('Database initialized with data from file ' + process.argv[3]);
			});	
		});
	}
	else{
		//list stations names and numbers for testing purposes (verify success of db initialize)
		/*Station.find(function(err,stations){
			if(err) throw err;
			for(var i = 0; i < stations.length; ++i){
				console.log('Station number ' + stations[i].number + ' is called ' + stations[i].name);
			}
		});*/
	}
});

app.set('views', __dirname + '/views');
app.use(express.logger('dev'));

//enable if need parse POST
//app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, 'public')));

///this will not exist in Express 4: the routing must be changed in case of migrating
app.use(app.router);

// development only
if (app.get('env') === 'development') {
  app.use(express.errorHandler());
}

// production only
if (app.get('env') === 'production') {
  // TODO
};

// serve index 
require('./app/routes')(app); // configure our routes

// Socket.io Communication
io.sockets.on('connection', require('./app/socket'));

//Start server
server.listen(app.get('port'), function () {
  console.log('Server listening on localhost:' + app.get('port') + '\nCtrl+C to quit server process.');
});

