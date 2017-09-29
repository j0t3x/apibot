const fb = require('../handlers/fbmessaging');

module.exports.processMessage = ( event ) => {
  
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  console.log("Received message for user %d and page %d at %d with message:", senderID, recipientID, timeOfMessage);
  //console.log(JSON.stringify(message));

  var messageId = message.mid;

  var messageText = message.text;
  var messageAttachments = message.attachments;

  var msg;
  if (messageText) {

    // If we receive a text message, check to see if it matches a keyword
    // and send back the example. Otherwise, just echo the text we received.
    switch (messageText) {
      case 'generic':
        msg = fb.makeGenericMessage(senderID);
        break;

      default:
        msg = fb.makeTextMessage(senderID, messageText);
    }

    fb.callSendAPI( msg );
  } else if (messageAttachments) {
    msg = fb.makeTextMessage(senderID, "Message with attachment received");
    fb.callSendAPI( msg );
  }

};

