// app/routes.js

// backend routes 

module.exports = function(app){
/* sample api route
 		app.get('/api/nerds', function(req, res) {
			// use mongoose to get all nerds in the database
			Nerd.find(function(err, nerds) {

				// if there is an error retrieving, send the error. nothing after res.send(err) will execute
				if (err)
					res.send(err);

				res.json(nerds); // return all nerds in JSON format
			});
		});
*/


//frontend routes

// route for angular requests
	app.get('*', function(req, res){
		// load public/index.html
		res.sendfile('./public/index.html');
	})
}