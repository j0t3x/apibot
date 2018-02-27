const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const secure_db_url = 'mongodb://' + process.env.MONGODB_USER + ':' + process.env.MONGODB_PASSWORD + '@' + process.env.MONGODB_ADDRESS;
const not_secure_db_url = 'mongodb://' + process.env.MONGODB_ADDRESS;
//mongodb://<dbuser>:<dbpassword>@ds161630.mlab.com:61630/curiosity

let singleton;

exports = module.exports;

exports.osmRead = function(){
   if (!singleton) {
        singleton = new osmRead();
    }
    return singleton;
};

function osmRead(){
  this.client;
  this.db;
  this.connect();
}

osmRead.prototype.connect = function(){

  MongoClient.connect(not_secure_db_url, function(err, client) {
    assert.equal(null, err);
    console.log("Opened Mongodb on " + not_secure_db_url);
    this.client = client;
    // return the db for use
    this.db = this.client.db(process.env.MONGODB_DBNAME);
    this.setIndexes();
  }.bind(this));

};

osmRead.prototype.getCollection = function(){
  const osm_collection = this.db.collection(process.env.MONGODB_NODECOL || 'nodes');
  return osm_collection;
}

osmRead.prototype.setIndexes = function(){

  const col = this.getCollection();
  col.createIndex({'loc': "2dsphere"});
  col.createIndex({'_id.osm': 1});
  col.createIndex({'rel.id': 1});
  // indexes for the most common osm keys
  col.createIndex({'tags.name': 1});
  col.createIndex({'tags.highway': 1});
  col.createIndex({'tags.ref': 1});
  col.createIndex({'tags.waterway': 1});
  col.createIndex({'tags.railway': 1});
  col.createIndex({'tags.amenity': 1});
  col.createIndex({'tags.leisure': 1});
  col.createIndex({'tags.tourism': 1});
  col.createIndex({'tags.service': 1});
  col.createIndex({'tags.natural': 1});
  col.createIndex({'tags.landuse': 1});

  //console.log('Created Indexes successfully');

};

osmRead.prototype.getNear = function( latlng = [ -12.046374, -77.042793 ], d, tags = [ [ "amenity" , "stripclub" ] ], callback ){

  const col = this.getCollection();
  //console.log(latlng,d,tags)
  // Find some documents
  col.find(
    { 
      'loc':{ 
        $near :{ 
          $geometry:{ 
            type: "Point", 
            coordinates: latlng 
          },
          $maxDistance: d
        }
      },
      'tg': {
        $elemMatch:{
          $elemMatch:{
            $in: tags
          }
        }
      }
    }
  ).toArray(function(err, docs) {
    assert.equal(err, null);
    //console.log("Successful request :)");
    callback(docs);
  });   

};

osmRead.prototype.killConnection = function(){
  this.client.close();
};
