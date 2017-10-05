const express = require('express');
const router = express.Router();

const ErrorTypes = require('/Users/Dave/Documents/venndor_backend/app/error').types;
const helper = require('/Users/Dave/Documents/venndor_backend/app/helpers');
const Match = require('/Users/Dave/Documents/venndor_backend/app/models').Match;

var fetchUserMatches = (req, res, next) => {
  let userId = req.user.id;

  Match.fetchUserMatches(userId, (err, docs, status) => {
    if (err) {
      return next(ErrorTypes.serverError());
    }
    else if (docs) {
      res.status(200).json({ matches: docs });
    }
    else {
      // winston.log
      return next(ErrorTypes.notFound());
    }
  });
}

var postNewMatch = (req, res, next) => {
  let params = req.body.params;
  let userId = req.user.id;
  Match.createMatch(userId, params, (err, match) => {
    if (err) {
      return next(err);
    }
    else if (match) {
      res.status(200).json({ match: match});
    }
    else {
      //Winston.log
      return next(ErrorTypes.serverError());
    }
  });
}

var updateMatch = (req, res, next) => {
  let params = req.body.params;
  let userId = req.user.id;
  let matchId = req.params.id;

  Match.updateMatchById(userId, matchId, params, (err, success) => {
    if (err) {
      return next(err);
    }
    else if (success) {
      res.status(200).send("Match updated succesfully");
    }
    else {
      //Winston.log
      return next(ErrorTypes.serverError());
    }
  });

}

var deleteMatch = (req, res, next) => {
  var matchId = req.params.id;
  var userId = req.user.id;

  Match.deleteMatchById(matchId, userId, (err, success) => {
    if (err) {
      return next(err);
    }
    else if (success) {
      res.status(200).send("Succesful match deletion.");
    }
    else {
      return next(ErrorTypes.serverError());
    }
  });
}

var deleteUserMatches = (req, res, next) => {
  
  var userId = req.user.id;

  Match.deleteUserMatches(userId, (err, success) => {
    if (err) {
      debugger
      return next(err);
    }
    else if (success) {
      debugger;
      res.status(200).send("Succesful match deletion.");
    }
    else {
      debugger;
      return next(ErrorTypes.serverError());
    }
  });
}

router.get('/', fetchUserMatches);
router.post('/', postNewMatch);
router.put('/:id', updateMatch);
router.delete('/:id', deleteMatch);
router.delete('/', deleteUserMatches);

module.exports.router = router;
