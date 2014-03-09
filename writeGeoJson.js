var _ = require('lodash'),
	fs = require('fs-extra');

var writeGeoJson = function(data) {
	var datas = data.features,
			currentRoute, 
			currentDirection, 
			currentFile, 
			lines, 
			currentLine, 
			currentProperties, 
			currentPolylines, 
			allPolylines = {}, 
			groupPolyLines,
			re = /[A-Za-z0-9]/g;

		_(datas).each(function(route) {
			currentRoute = (route.properties.route_number+'').replace(' ','').match(re).join('');
			currentDirection = (route.properties.direction+'').replace(' ','').match(re).join('');

			currentFile = './routes/' + currentRoute + '/' + currentDirection + '/route.geojson';
			currentProperties = route.properties;

			lines = route.geometry.geometries;

			currentLine = [];

			_(lines).each(function(line) {
				currentLine.unshift(line.coordinates);
			});

			(function() {
				if (currentLine.length) {
					var writeString = '{"type": "Feature","properties": ' + JSON.stringify(currentProperties) + ',"geometry": {"type": "MultiLineString","coordinates":' + JSON.stringify(currentLine) +  '}}';
					fs.outputJson(currentFile, writeString);
				}
			}());
		});
};

exports = module.exports = writeGeoJson;