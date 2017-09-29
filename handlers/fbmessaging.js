const request = require('request');


module.exports.makeGenericMessage = ( recipientId ) => {
  
	var messageData = {
		recipient: {
	  		id: recipientId
		},
		message: {
	  		text: 'sono la traga'
		}
	};

	return messageData;

};


module.exports.makeTextMessage = ( recipientId, messageText ) => {
  
	var messageData = {
		recipient: {
	  		id: recipientId
		},
		message: {
	  		text: messageText
		}
	};

	return messageData;

};

module.exports.callSendAPI = ( messageData ) => {

	request({
	    uri: 'https://graph.facebook.com/v2.6/me/messages',
	    qs: { access_token: process.env.ACCESS_TOKEN },
	    method: 'POST',
	    json: messageData

	}, function (error, response, body) {
	    if (!error && response.statusCode == 200) {
			var recipientId = body.recipient_id;
			var messageId = body.message_id;

	      	console.log("Successfully sent generic message with id %s to recipient %s", messageId, recipientId);
	    } else {
			console.error("Unable to send message.");
			console.error(response);
			console.error(error);
	    }
	});  

};