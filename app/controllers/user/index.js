const async = require('async');
const express = require('express');
const Item = require('/Users/Dave/Documents/venndor_backend/app/models').Item;
const auth = require('../../auth');
const User = require('/Users/Dave/Documents/venndor_backend/app/models').User;
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


//NEEDS IMPLEMENTATION
var logoutUser = (req, res, next) => {

  //delete any refresh tokens associated with the user 
  //blacklist any jwt's associated with the user
  //return a 200 success msg

}

var updateUser = (req, res, next) => {

}

var fetchUserById = (req, res, next) => {

}

var deleteUser = (req, res, next) => {

  //remove all matches created with user's posts
  //remove all of user's posts
  //remove the user's refresh token
  //blacklist their jwt 
  //remove the user 

}

var fetchBookmarks = (req, res, next) => {

}

var createBookmark = (req, res, next) => {

}

//NEEDS CUSTOM VALIDATION: Won't pattern-match with app-wide middleware
var updateBookmark = (req, res, next) => {

}

var deleteUserBookmarks = (req, res, next) => {

}

var deleteBookmark = (req, res, next) => {

}

router.get('/auth/facebook/callback', authUserCallback);
router.get('/logout', logoutUser);
router.get('/:id', fetchUserById);
router.put('/', updateUser);
router.delete('/', deleteUser);
router.get('/bookmark', fetchBookmarks);
router.post('/bookmark', createBookmark);
router.put('/bookmark/:itemId', updateBookmark);
router.delete('/bookmark/', deleteUserBookmarks);
router.delete('/bookmark/:itemId', deleteBookmark);


module.exports.router = router;
