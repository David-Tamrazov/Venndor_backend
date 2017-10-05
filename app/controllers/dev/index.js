const helper = require('../../helpers');
const auth = require('../../auth');
const User = require('/Users/Dave/Documents/venndor_backend/app/models/User.js');
const Item = require('/Users/Dave/Documents/venndor_backend/app/models/User.js');
const Match = require('/Users/Dave/Documents/venndor_backend/app/models/Match.js');
const express = require('express');
const router = express.Router();

var getAccessToken = (req, res, next) => {

  let userId = req.query.userId;

  if (userId) {
    auth.gat(userId, (err, accessToken) => {
      if (err) {
        //to be handled with boom
        res.send(err);
      }
      else {
        res.json({at: accessToken});
      }
    });
  }
  //send back a 400 bad request err
  else {
    res.status(400).send("Bad request.");
  }
}

var testAuthentication = (req, res, next) => {
  res.json({user: req.user});
}

var populateItems = (req, res, next) => {
  helper.populateItemFeed((err, result) => {
    if (err) {
      res.send(err);
    }
    else if (result) {
      res.send("Succesfully popuated the item feed.");
    }
  });
}

var populateMatches = (req, res, next) => {
  helper.populateMatches((err, docs) => {
    if (err) {
      res.send(err);
    }
    else if (docs) {
      res.send(docs)
    }
  });
}

router.get('/token', getAccessToken);
router.get('/testAuth', testAuthentication);
router.post('/pi', populateItems);
router.post('/pm', populateMatches);

module.exports.router = router;
