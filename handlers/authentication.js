var jwt = require('jsonwebtoken');
var errorCodes = require('restify-errors');

module.exports.isAuthenticated = ( req, res, next ) => {
  
  var token = req.headers.authentication;

  if( !token ){
    return next( new errorCodes.NotAuthorizedError({
      message: 'no authorization header provided'
    }));;
  }


  jwt.verify(token, process.env.SECRET, { maxAge: process.env.TOKEN_DURATION }, (err, decoded) => {
    // if jwt id mismatch, err == invalid jwt id
    if( err ){
      return next( new errorCodes.NotAuthorizedError({
        message: 'invalid token'
      }));
    }else{
      req.authData = decoded;
    }
    return next();
  });

};
