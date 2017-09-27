var jwt = require('jsonwebtoken');
var errorCodes = require('restify-errors');
var model = require('../model');

module.exports.create = ( req, res, next ) => {

  res.send(req.params);
  return next();
};

module.exports.get = ( req, res, next ) => {

  res.send(req.authData);
  return next();

};

module.exports.authenticate = ( req, res, next ) => {

  var user = model.user;

  //console.log( req.params );
  user.getOneUserByUsername( req.params.username, ( data ) => {

    if( !data.length ){
      res.send( new errorCodes.ResourceNotFoundError() );
      return next();
    }

    if( data[0].username === req.params.username && data[0].password === req.params.password ){
      var token = jwt.sign({
        username: data[0].username,
        expiresIn: process.env.TOKEN_DURATION
      }, process.env.SECRET );

      res.send(200, token);
    }else{
      res.send( new errorCodes.InvalidCredentialsError() );
    }
    return next();

  });

};

module.exports.modify = ( req, res, next ) => {

  res.send(req.params);
  return next();
};

module.exports.delete = ( req, res, next ) => {

  res.send(req.params);
  return next();
};
