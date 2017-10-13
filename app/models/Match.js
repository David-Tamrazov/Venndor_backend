const db = require('../db');
const path = require('path');
const ErrorTypes = require(path.resolve('app', 'error')).types;
const Mongoose = db.mong;

const matchSchema = new Mongoose.Schema({
  itemId: {
    type: String,
    required: 'Match must have item ID associated with it.',
    index: true
  },
  itemName : {
    type: String,
    required: 'Match must have an item name attached to it.'
  },
  itemDetails: {
    type: String,
    required: 'Matches must have item details.'
  },
  itemPickupLocation: {
    type: String,
    required: 'Must have a pickup location.'
  },
  buyerId: {
    type: String,
    required: 'Match must have a buyer.',
    index: true
  },
  sellerId: {
    type: String,
    required: 'Match must have a seller.',
    index: true
  },
  matchedPrice: {
    type: Number,
    required: 'Match must have a price.'
  },
  dateMatched: {
    type: Number,
    required: 'Match must store the date matched.'
  },

  messaged: { type: Boolean, default: false },
  bought: { type: Boolean, default: false },
  numberOfMessages: { type: Number, default: 0 },
  numberOfMessagesReadByUser: { type: Number, default: 0 },
  numberOfMessagesReadBySeller: { type: Number, default: 0 },
  dateFirstMessaged: Number

});

let Match = Mongoose.model('match', matchSchema);

let createMatch = (userId, params, cb) => {

  let newMatch = Match({
    itemId: params.itemId,
    itemName : params.itemName,
    itemDetails: params.itemDetails,
    itemPickupLocation: params.itemPickupLocation,
    buyerId: userId,
    sellerId: params.sellerId,
    matchedPrice: params.matchedPrice,
    dateMatched: params.dateMatched
  });

  newMatch.save( err => {
    if (err) {
      //Winston.log
      return cb(ErrorTypes.serverError(), null);
    }
    else {
      return cb(null, newMatch);
    }
  });

}

let fetchUserMatches = (userId, cb) => {

  Match.find({ buyerId: userId }).exec((err, docs) => {
    if (err) {
      return cb(ErrorTypes.serverError(), null)
    }
    else if (docs) {
      return cb(null, docs)
    }
    else {
      return cb(ErrorTypes.notFound(), null)
    }
  });
}

let fetchMatchedItems = (userId, cb) => {

  Match.find({'buyerId' : userId}, 'itemId', (err, results) => {
    if (err) {
     //winston.log
     return cb(ErrorTypes.serverError(), null);
    }

    else if (results) {
      var itemIdArray = results.map(el => el.itemId);
      return cb(null, itemIdArray);
    }

  });
}

let updateMatchById = (userId, matchId, params, cb) => {

  Match.findOne({ "_id" : matchId, buyerId: userId }, (err, doc) => {
    if (err) {
      return cb(ErrorTypes.serverError(), false);
    }
    else if (doc) {
      for (var key in params) {
        doc[key] = params[key];
      }

      doc.save(err => {
        if (err) {
          return cb(ErrorTypes.serverError(), false);
        }
        else {
          return cb(null, true);
        }
      });
    }
    else {
      return cb(ErrorTypes.notFound(), false);
    }
  });

}

let deleteItemMatches = (userId, itemId, cb) => {

  var query = {
    itemId : itemId,
    sellerId: userId
  }

  Match.find(query).remove().exec((err, data) => {

    if (err) {
      //winston.log
      return cb(ErrorTypes.serverError);
    }
    else if (data.result.ok == 1) {
      return cb(null);
    }
    else {
      return cb(ErrorTypes.notFound());
    }

  });
}

let deleteUserMatches = (userId, cb) => {

  Match.find({ "buyerId": userId})
  .remove()
  .exec((err, data) => {

    if (err) {
      //winston.log
      return cb(ErrorTypes.serverError(), false);
    }
    else if (data.result.ok) {
      return cb(null, true);
    }
    else {
      return cb(ErrorTypes.notFound(), false);
    }
  });

}

let deleteMatchById = (matchId, userId, cb) => {

  Match.find({ "_id": matchId, "buyerId": userId})
  .remove()
  .exec((err, data) => {

    if (err) {
      //winston.log
      return cb(ErrorTypes.serverError(), false);
    }
    else if (data.result.n == 1) {
      return cb(null, true);
    }
    else {
      return cb(ErrorTypes.notFound(), false);
    }
  });
}


module.exports = {
  schema: matchSchema,
  model: Match,
  createMatch,
  fetchUserMatches,
  fetchMatchedItems,
  updateMatchById,
  deleteItemMatches,
  deleteUserMatches,
  deleteMatchById
}
