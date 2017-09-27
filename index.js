//ENV VARIABLES
require('dotenv').config();

var restify = require('restify');
var fs = require('fs');

var bunyan = require('bunyan');
var Logger = new bunyan({
  name: process.env.APP_NAME,
  streams: [
    {
      stream: process.stdout,
      level: 'debug'
    },
    {
      path: 'trace.log',
      level: 'trace'
    }
  ],
  serializers: bunyan.stdSerializers
});


var server = restify.createServer({
  //certificate: fs.readFileSync('path/to/server/certificate'),
  //key: fs.readFileSync('path/to/server/key'),
  name: process.env.APP_NAME,
  log: Logger
});
server.use(restify.acceptParser(server.acceptable));
server.use(restify.authorizationParser());
server.use(restify.dateParser());
server.use(restify.queryParser());
server.use(restify.gzipResponse());
server.use(restify.bodyParser({
    maxBodySize: 0,
    mapParams: true,
    mapFiles: false,
    overrideParams: false,
    keepExtensions: false,
    //uploadDir: os.tmpdir(),
    multiples: true,
    hash: 'sha1'
 }));
//server.use(restify.requestExpiry());
server.use(restify.throttle({
  burst: 100,
  rate: 50,
  ip: true,
  overrides: {
    '192.168.1.1': {
      rate: 0,        // unlimited
      burst: 0
    }
  }
}));
server.use(restify.conditionalRequest());
server.use(restify.CORS());

////AUTH HANDLER////
const auth = require('./handlers/authentication');
////////////////////

////////////////////////BEGIN CONTROLLERS////////////////////////
const user = require('./controllers/index.js').user;
const bot = require('./controllers/index.js').bot;
/////////////////////////END CONTROLLERS/////////////////////////
server.get('/verify', bot.verify );
server.post('/user/login', user.authenticate );
server.get('/user/:id', auth.isAuthenticated, user.get );
server.post('/user/register', auth.isAuthenticated, user.create );





server.listen(process.env.APP_PORT);
