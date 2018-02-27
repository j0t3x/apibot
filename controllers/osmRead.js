var jwt = require('jsonwebtoken');
var errorCodes = require('restify-errors');
var model = require('../model').osmRead;
var validator = require('../utils').validator;

/*
* Search database for nodes, ways and relations with the given tag(s)
* near a given location(s).
*
* 'loc' is a point [lon,lat] or an array of points [[lon,lat],...]
* 'distance' is in kilometers.
*
* findOsmNear(loc, distance, tags, callback);
*/
module.exports.findNearByAmenities = ( req, res, next ) => {

	let loc = validator.isLatLngOk(req.params.loc) || [-12.046374, -77.042793];
	let distance = validator.isDistanceOk(req.params.d) || 0.5;
	distance *= 1000;
	let tags = validator.areTagsOk(req.params.tags) || [ "hospital", "fuel" ];
	
	//console.log( loc, distance, tags)

	model.getNear(loc, distance, tags, function(data){
		res.set({'content-type': 'application/json'});
		res.send(data);
		return next();
	});
};


