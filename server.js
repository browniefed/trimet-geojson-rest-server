var schedule = require('node-schedule'),
	restify = require('restify'),
	fs = require('fs'),
	togeojson = require('togeojson'),
	jsdom = require('jsdom').jsdom,
	writeGeoJson = require('./writeGeoJson');


var server = restify.createServer(),
	stringClient = restify.createStringClient({
		url: 'http://developer.trimet.org'
	});

var routeGeoJson;

var respondWithRoute = function(req, res, next) {

	var route = req.params.route,
		direction = req.params.direction;

	fs.readFile('./routes/' + route + '/' + direction + '/route.geojson', {encoding: 'utf-8'}, function(err, data) {
		res.json(JSON.parse(data));
	});
};


var loadNewTrimetData = function() {
	stringClient.get('/gis/data/tm_routes.kml', function(err, req, res, data) {
		if (err) {
			return err;
		}
		writeGeoJson(togeojson.kml(jsdom(data)));
	});
}

loadNewTrimetData();

schedule.scheduleJob({hour: 23, minute: 0, dayOfWeek: [0, new schedule.Range(0, 6)]}, function(){
    loadNewTrimetData();
});
server.get('/route/:route/:direction', respondWithRoute);

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});