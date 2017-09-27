var jwt = require('jsonwebtoken');
var errorCodes = require('restify-errors');
var model = require('../model');

module.exports.create = ( req, res, next ) => {

  res.send(req.params);
  return next();
};

module.exports.get = ( req, res, next ) => {

  res.send(req.params);
  return next();
};

module.exports.modify = ( req, res, next ) => {

  res.send(req.params);
  return next();
};

module.exports.delete = ( req, res, next ) => {

  res.send(req.params);
  return next();
};
