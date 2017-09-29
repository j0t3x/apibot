////////////////BEGIN controller files////////////////
var usercontroller = require('./user');
var questioncontroller = require('./question');
var answercontroller = require('./answer');
var botcontroller = require('./bot');
/////////////////END controller files/////////////////
module.exports = {
    user: usercontroller,
    question: questioncontroller,
    answer: answercontroller,
    bot: botcontroller
};
