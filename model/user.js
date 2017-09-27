const MongoClient = require('mongodb').MongoClient;
const db_url = 'mongodb://' + process.env.MONGODB_USER + ':' + process.env.MONGODB_PASSWORD + '@' + process.env.MONGODB_ADDRESS;
//mongodb://<dbuser>:<dbpassword>@ds161630.mlab.com:61630/curiosity
const collection = 'user';

module.exports.getOneUserByUsername = ( username, callback ) => {

  MongoClient.connect(db_url, (err, db) => {
    if( err ){
      //console.error('bad, bad connection!');
    }
    //console.log("Connected correctly to server");

    var col = db.collection( collection );

    // Get first two documents that match the query
    col.find( { username: username } ).limit(1).toArray( (err, docs) => {

      console.log( docs );
      callback( docs );
      db.close();

    });

  });

};
