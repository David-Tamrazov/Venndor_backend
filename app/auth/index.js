'use strict';

const config = require('../config');
const db = require('../db');
const request = require('request');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const helper = require('../helpers');
const async = require('async');
const RefreshToken = require('../models').RefreshToken;
const ErrorTypes = require("/Users/Dave/Documents/venndor_backend/app/error/errors.js").getTypes();

let validateFbClientToken = (req, res, next) => {

  var qs = {
    "input_token": req.query.accessToken,
    "access_token": config.fb.clientID + "|" + config.fb.clientSecret
  }


  //this probably needs more work
    //was there a server/fb error, or are they actually unauthorized?
    //make more use of the response and body objects
  request.get({ url: "https://graph.facebook.com/debug_token", qs:qs }, function(err, response, body){
    if(!err) {
      return next();
    } 
    else {
      //winston.log
      return next(ErrorTypes.unauthorized());
    }
  });
}

let validateRefreshToken = (req, res, next) => {

  RefreshToken.model.findOne({ 'userID': req.body.userId }, function (err, token) {
    
    if (err) {
      //Winston.log
      return next(ErrorTypes.serverError());
    }

    else if (token && req.body.refreshToken === token.tokenString) {
      req.body.userID = token.userID;
      return next();
    }

    else {
      return next(ErrorTypes.unauthorized());
    }

  });
}

//production use
let generateAccessToken = (user, cb) => {
  return genAccess(user._id, (error, accessToken) => {
    return cb(null, user, accessToken);
  });
}

//dev use TO BE REMOVED GOING INTO PRODUCTION
let gat = (userId, cb) => {
  genAccess(userId, (error, accessToken) => {
    return cb(null, accessToken);
  });
}

let genAccess = (userId, cb) => {
  var token = {
    accessToken: jwt.sign({
      id: userId
    }, config.tokenSecret, {
      //seconds * minutes
      expiresIn: 60*30
    })
  }
  return cb(null, token);
}

let generateRefreshToken = (user, accessToken, cb) => {
  return genRefresh(user._id, (error, refreshToken) => {
    if (error) {
      return cb(error, null);
    }
    else if (refreshToken) {
      return cb(null, {user: user, at: accessToken, rt: refreshToken});
    }
    else {
      return(null, null);
    }
  })
}

let genRefresh = (userId, cb) => {

    //check to see if we've found a valid refresh token for the user. If so, just move on
    retrieveRefreshToken(userId, function(error, token) {
      if (token) {
        //found a token- move on
        return cb(null, token)
      }
      else {
        //we didn't find a refresh token for this user- let's create one
        let ts = userId + "." + crypto.randomBytes(40).toString('hex');

        let newToken = new RefreshToken.model({
          tokenString: ts,
          userId: userId
        });

        //save the token and, if successful, return it to the callback
        newToken.save( err => {
          if (err) {
            //winston.log
            return cb(err, null);
          } else {
            return cb(null, newToken);
          }
        });
      }
    });
}

let retrieveRefreshToken = (userId, cb) => {
  RefreshToken.model.findOne({ 'userId': userId }, function(err, token){
    if (err) {
      //winston.log
      return cb(error, null);
    } 
    else if (token) {
      return cb(null, token);
    } 
    else {
      //no token was found- must generate one 
      return cb(null, null)
    }
  });
}



module.exports = {
  validateFbClientToken,
  validateRefreshToken,
  generateAccessToken,
  generateRefreshToken,
  gat
}
