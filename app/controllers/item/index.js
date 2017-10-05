const uuid = require('uuid');
const express = require('express');
const router = express.Router();
const jwt = require('express-jwt');
const async = require('async');

const helper = require('/Users/Dave/Documents/venndor_backend/app/helpers');
const Item = require('/Users/Dave/Documents/venndor_backend/app/models').Item;
const Match = require('/Users/Dave/Documents/venndor_backend/app/models').Match;
const config = require('/Users/Dave/Documents/venndor_backend/app/config');
const ErrorTypes = require('/Users/Dave/Documents/venndor_backend/app/error').types;


var fetchItemFeed = (req, res, next) => {

    if (!req.body.params) {
      res.status(400).send("Bad request.");
    }

    else {
      var params = req.body.params;
      var userId = req.user.id;

      async.waterfall([
        Match.fetchMatchedItems.bind(0, userId),
        Item.fetchItemFeed.bind(0, userId, params)
      ], function(err, results) {
        if (err) {
          return next(err);
        }
        else if (results.itemFeed) {
          res.status(200).json({itemFeed: results.itemFeed});
        }

        //can add in additional error implementation here like "else if (err.status == 404) { ... }"
        else {
          return next(ErrorTypes.serverError());
        }
      });
    }
}


var fetchItemById = (req, res, next) => {
  var id = req.params.id;
  Item.fetchItemById(id, (err, doc) =>{
    if (err) {
      //log the error
      return next(err);
    }
    else if (doc) {
      res.status(200).json({ item: doc });
    }
    else {
      return next(ErrorTypes.serverError());
    }
  });
}

var postNewItem = (req, res, next) => {

  let params = req.body.params;
  let userId = req.user.id;

  Item.createItem(userId, params, (err, result) => {
   
    if (err) {
      return next(err);
    }

    else if (result) {
      //send back the item if its been succesfully created
      return res.json({ item: result});
    }

    else {
      return next(ErrorTypes.serverError());
    }

  });
}

var updateItem = (req, res, next) => {
  
  let userId = req.user.id
  let itemId = req.params.id;
  let params = req.body.params;

  Item.updateItemById(userId, itemId, params, (err, success) => {
    if (err) {
      return next(err);
    }
    else if (success) {
      res.status(200).send("Item updated succesfully.");
    }
    else {
      return next(ErrorTypes.serverError());
    }
  });
}

  //why we don't delete bookmarks associated with item: 
    // Don't want to confuse user's who bookmarked the item if its suddenly gone from their bookmarks
    // Better they try to match on it and they get told the item has either been bought or removed from the db
    // Furthermore, it would take absurdly long to iterate through every user and delete bookmarks associated with deleted items 
    // Principle of least work- don't deal with the issue (bookmark of deleted item) until it's actually an issue 

var deleteItem = (req, res, next) => {
  var itemId = req.params.id;
  var userId = req.user.id;

  //delete bookmarks associated with the item
  async.series([
    Item.deleteItemById.bind(0, userId, itemId),
    Match.deleteItemMatches.bind(0, userId, itemId)
  ], function(err, results) {
    if (err) {
      return next(err);
    }
    else {
      res.status(200).send("Succesful deletion");
    }
  })
}

//get signed url
var getSignedUrl = (req, res, next) => {

  var params = {
    Bucket: 'venndev',
    Key: uuid.v4(),
    Expires: 100, //number of seconds to perform the upload
    ContentType: 'image/jpeg', //must match the Content-Type header of the PUT request
  };

  s3.getSignedUrl('putObject', params, function(err, signedURL) {
    if (err) {
      //log the error
      return next(ErrorTypes.serverError());
    }
    else {
      res.json({postURL: signedURL, getURL: signedURL.split("?")[0]});
    }
  });
}

router.get('/', fetchItemFeed);
router.get('/:id', fetchItemById);
router.get('/gsu', getSignedUrl);
router.post('/', postNewItem);
router.put('/:id', updateItem);
router.delete('/:id', deleteItem);

module.exports.router = router;
