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
  log: Logger,
  formatters: {
    'application/json': function(req, res, body, cb) {
      return cb(null, JSON.stringify(body, null, '\t'));
    }
  }
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
const osmRead = require('./controllers').osmRead;
/////////////////////////END CONTROLLERS/////////////////////////
// server.post('/user/login', user.authenticate );
// server.get('/user/:id', auth.isAuthenticated, user.get );
// server.post('/user/register', auth.isAuthenticated, user.create );
server.get('/near', osmRead.findNearByAmenities)




///////URL FOR MORE DETAILS : https://wiki.openstreetmap.org/wiki/API_v0.6 //////
// Miscelaneous
server.get('/api/capabilities', function(){});
server.get('/api/0.6/map', function(){});
server.get('/api/0.6/permissions', function(){});

// Changesets - Bounding box computation
// create
server.put('/api/0.6/changeset/create', function(){})
// read /api/0.6/changeset/:id?include_discussion=true
server.get('/api/0.6/changeset/:id', function(){})
// update
server.put('/api/0.6/changeset/:id', function(){})
// close
server.put('/api/0.6/changeset/:id/close', function(){})
// Download
server.get('/api/0.6/changeset/:id/download', function(){})
// expand bounding box
server.post('/api/0.6/changeset/:id/expand_bbox', function(){})
// query
server.get('/api/0.6/changesets', function(){})
// diff upload
server.post('/api/0.6/changeset/:id/upload', function(){})

// Changesets - discussion
// comment
server.post('/api/0.6/changeset/:id/comment', function(){})
// subscribe
server.post('/api/0.6/changeset/:id/subscribe', function(){})
// unsubscribe
server.put('/api/0.6/changeset/:id/unsubscribe', function(){})


// Elements
// Create: PUT /api/0.6/[node|way|relation]/create
server.put('/api/0.6/:element/create', function(){})
// Read: GET /api/0.6/[node|way|relation]/#id
server.get('/api/0.6/:element/:id', function(){})
// Update: PUT /api/0.6/[node|way|relation]/#id
server.put('/api/0.6/:element/:id', function(){})
// Delete: DELETE /api/0.6/[node|way|relation]/#id
server.del('/api/0.6/:element/:id', function(){})
// History: GET /api/0.6/[node|way|relation]/#id/history
server.get('/api/0.6/:element/:id/history', function(){})
// Version: GET /api/0.6/[node|way|relation]/#id/#version
server.get('/api/0.6/:element/:id/:version', function(){})
// Multi fetch: GET /api/0.6/[nodes|ways|relations]?#parameters
server.get('/api/0.6/:element', function(){})
// Relations for element: GET /api/0.6/[node|way|relation]/#id/relations
server.get('/api/0.6/:element/:id/relations', function(){})
// Ways for node: GET /api/0.6/node/#id/ways
server.get('/api/0.6/node/:id/ways', function(){})
// Full: GET /api/0.6/[way|relation]/#id/full
server.get('/api/0.6/:element/:id/full', function(){})
// Redaction: POST /api/0.6/[node|way|relation]/#id/#version/redact?redaction=#redaction_id
server.put('/api/0.6/:element/:id/:version/redact', function(){})

// GPS traces
// Retrieving GPS points
// GET /api/0.6/trackpoints?bbox=left,bottom,right,top&page=pageNumber
server.get('/api/0.6/trackpoints', function(){})

// Uploading traces
// POST /api/0.6/gpx/create
server.post('/api/0.6/gpx/create', function(){})

// Downloading trace metadata
// GET /api/0.6/gpx/<id>/details
server.get('/api/0.6/gpx/:id/details', function(){})
// GET /api/0.6/gpx/<id>/data
server.get('/api/0.6/gpx/:id/data', function(){})
// GET /api/0.6/user/gpx_files
server.get('/api/0.6/user/gpx_files', function(){})

// Methods for user data
// Details of a user
// GET /api/0.6/user/#id
server.get('/api/0.6/user/:id', function(){})

// Details of the logged-in user
// GET /api/0.6/user/details
server.get('/api/0.6/user/details', function(){})

// Preferences of the logged-in user
// GET /api/0.6/user/preferences
server.get('/api/0.6/user/preferences', function(){})
// PUT /api/0.6/user/preferences/[your_key] (without the brackets)
server.put('/api/0.6/user/preferences/:key', function(){})

// Map Notes API
// Retrieving notes data by bounding box: GET /api/0.6/notes
server.get('/api/0.6/notes', function(){})
// Read: GET /api/0.6/notes/#id
server.get('/api/0.6/notes/:id', function(){})
// Create a new note: Create: POST /api/0.6/notes
server.post('/api/0.6/notes', function(){})
// Create a new comment: Create: POST /api/0.6/notes/#id/comment
server.post('/api/0.6/notes/:id/comment', function(){})
// Close: POST /api/0.6/notes/#id/close
server.post('/api/0.6/notes/:id/close', function(){})
// Reopen: POST /api/0.6/notes/#id/reopen
server.post('/api/0.6/notes/:id/reopen', function(){})
// Search for notes on text and comments: GET /api/0.6/notes/search
server.get('/api/0.6/notes/search', function(){})


server.listen(process.env.APP_PORT);
