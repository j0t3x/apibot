var errorCodes = require('restify-errors');
var model = require('../model');

module.exports.verify = ( req, res, next ) => {

	var verifyToken = req.params.hub.verify_token;
	var mode = req.params.hub.mode;
	var challengeValue = parseInt(req.params.hub.challenge);

	if( mode === 'subscribe' && verifyToken === 'wawasilawa' ){
		res.send( 200, challengeValue );
	}else{
		res.send( 403 );
	}
	return next();
};

module.exports.receiveMessages = ( req, res, next ) => {

	var data = req.params;

		// Make sure this is a page subscription
	if (data.object === 'page') {

		// Iterate over each entry - there may be multiple if batched
		data.entry.forEach(function(entry) {
		  var pageID = entry.id;
		  var timeOfEvent = entry.time;

		  // Iterate over each messaging event
		  entry.messaging.forEach(function(event) {
		    if (event.message) {
		      model.bot.processMessage(event);
		    } else {
		      console.log("Webhook received unknown event: ", event);
		    }
		  });
		});

		// Assume all went well.
		//
		// You must send back a 200, within 20 seconds, to let us know
		// you've successfully received the callback. Otherwise, the request
		// will time out and we will keep trying to resend.
		res.send( 200 );
		return next();
	}

};

