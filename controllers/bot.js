var errorCodes = require('restify-errors');
var model = require('../model');

module.exports.verify = ( req, res, next ) => {

	var verifyToken = req.params.hub.verify_token;
	var mode = req.params.hub.mode;

	if( mode === 'subscribe' && verifyToken === 'wawasilawa' ){
		res.send( 200, 'wawasilawa' );
	}else{
		res.send( 403 );
	}
	return next();
};

