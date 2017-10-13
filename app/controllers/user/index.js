const async = require('async');
const express = require('express');
const path = require('path');
const Item = require(path.resolve('app', 'models')).Item;
const auth = require('../../auth');
const ErrorTypes = require(path.resolve('app', 'error')).types;
const User = require(path.resolve('app', 'models')).User;
const router = express.Router();

var authUserCallback =  [auth.validateFbClientToken, (req, res, next) => {

    var params = {
      fbId: req.query.fbId,
      pictureUrl: req.query.pictureUrl,
      firstName: req.query.firstName,
      lastName: req.query.lastName,
      gender: req.query.gender
    }

    async.waterfall([
      User.serialize.bind(null,params),
      auth.generateAccessToken,
      auth.generateRefreshToken
    ], function(err, results){
      if (err) {

        //boom wrappage necessary
        res.send(err);
      }
      else if (results) {
        res.status(200).json({ user: results.user,  accessToken: results.at.accessToken, refreshToken: results.rt.tokenString})
      }
      else {

        //boom wrappage necessary
        res.status(500).send("An unknown error has occured.");
      }
    })
}]

var updateUser = (req, res, next) => {
  var id = req.user.id; 
  var params = req.body.params;

  User.updateUser(id, params, (err, success) => {
    
    if (err) {
      return next(err);
    }

    else if (success) {
      return res.status(200).send('User successfully updated.');
    }

    else {
      return next(ErrorTypes.serverError());
    }

  });

}

var fetchUserById = (req, res, next) => {

  var id = req.user.id;

  User.findById(id, (err, user) => {

    if (err) {
      return next(err);
    }

    return res.status(200).json({user});

  });

}

//NEEDS IMPLEMENTATION
var logoutUser = (req, res, next) => {
  
    //delete any refresh tokens associated with the user 
    //blacklist any jwt's associated with the user
    //return a 200 success msg
  
}

var deleteUser = (req, res, next) => {

  //remove all matches created with user's posts
  //remove all of user's posts
  //remove the user's refresh token
  //blacklist their jwt 
  //remove the user 

}

var fetchBookmarks = (req, res, next) => {

  var id = req.user.id;

  User.fetchBookmarks(userId, (err, bookmarks) =>{

    if (err) {
      return next(err);
    }

    return req.status(200).json({bookmarks});

  });

}

var createBookmark = (req, res, next) => {

  var id = req.user.id;
  var params = req.body.params;

  User.createBookmark(userId, params, (err, newBookmark) => {

    if (err) {
      return next(err);
    }

    return res.status(200).json({newBookmark});

  });

}

//NEEDS CUSTOM VALIDATION: Won't pattern-match with app-wide middleware
var updateBookmark = (req, res, next) => {

  var id = req.user.id;
  var params = req.body.params; 

  User.updateBookmark(id, params, (err, success) => {
    
    if (err) {
      return next(err);
    }

    return res.status(200).send("Bookmark successfully updated.");

  });
}

var deleteBookmark = (req, res, next) => {
  
  var userId = req.user.id;
  var itemId = req.params.id;

  User.deleteBookmark(userId, itemId, (err, success) => {

    if (err) {
      return next(err);
    }

    return res.status(200).send("Bookmark successfully deleted.");
  });
  
}

var deleteAllBookmarks = (req, res, next) => {
 
  var id = req.user.id; 

  User.deleteAllBookmarks(id, (err, success) => {

    if (err) {
      return next(err);
    }

    return res.status(200).send("All bookmarks successfully deleted.");

  });

}

router.get('/auth/facebook/callback', authUserCallback);
router.get('/logout', logoutUser);
router.get('/:id', fetchUserById);
router.put('/', updateUser);
router.delete('/', deleteUser);
router.get('/bookmark', fetchBookmarks);
router.post('/bookmark', createBookmark);
router.put('/bookmark/:itemId', updateBookmark);
router.delete('/bookmark/', deleteAllBookmarks);
router.delete('/bookmark/:itemId', deleteBookmark);


module.exports.router = router;
