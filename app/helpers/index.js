'use strict';

const async = require('async');
const ObjectID = require('mongodb').ObjectID;

const db = require('../db');
const Match = require('../models').Match;
const Item = require('../models').Item;
const User = require("../models").User;
const ErrorTypes = require('../error').types;


var d = new Date();
var n = d.getTime();

let createItemData = (ownerIds) => {

  var adj = ["hairy", "swole", "curvacious", "bbacious", "excellent"];
  var nouns = ["bb", "dragon", "dwarf", "elf", "human"];
  var categories = ['Furniture', 'Household', 'Electronics', 'Books', 'Kitchen', 'Clothing'];
  var details = "Random item for DB population";
  var locationName = "Hogwarts";
  var locationDescription = "Magical and shit";
  var minPrice = 10;
  var photos = ["url", "url", "url"];
  var photoCount = 3;
  var xCoord = 12;
  var yCoord = 15;
  var postedDate = n;
  var allItems = [];

  ownerIds.forEach((el, index, array) => {
    for (var j = 0; j < 20; j++) {
      var params = {
        _id: new ObjectID(),
        name: adj[Math.floor(Math.random()*5)] + " " + nouns[Math.floor(Math.random()*5)],
        details: details,
        ownerId: el,
        category: categories[Math.floor(Math.random()*6)],
        locationName: locationName,
        locationDescription: locationDescription,
        photos: photos,
        photoCount: photoCount,
        minPrice: minPrice,
        bought: 0,
        nuSwipesLeft: 0,
        nuSwipesRight: 0,
        matches: [],
        timeBought: "",
        offersMade: [],
        avgOffer: 0,
        xCoordinate: xCoord,
        yCoordinate: yCoord,
        postedDate: postedDate
      }
      allItems.push(params);
    }
  });
  
  return allItems;
}

var d = new Date();
var n = d.getTime();

let createMatchData = (userId, matchItems) => {
  var matchData = [];

  matchItems.forEach( (item) => {
    var data = {
      _id: new ObjectID(),
      itemId: item._id,
      itemName : item.name,
      itemDetails: item.details,
      itemPickupLocation: item.locationDescription,
      buyerId: userId,
      sellerId: item.ownerId,
      matchedPrice: 500,
      bought: 0,
      numberOfMessages: 0,
      numberOfMessagesReadByUser: 0,
      numberOfMessagesReadBySeller: 0,
      dateMatched: n,
    }
    matchData.push(data);
  });

  return matchData;
}

let validateParameters = (req, res, next) => {

  if (!checkProperties(req.params.table, req.body.params)) {
    //winston.log?
    return next(ErrorTypes.badRequest());
  }
  else {
    return next();
  }

}

let checkProperties = (table, params) => {

  if (!params) {
    return false;
  }

  var requiredProperties = [];

  switch(table) {
    case 'item':
      requiredProperties = Object.keys(Item.schema.obj);
      break;
    case 'match':
      requiredProperties = Object.keys(Match.schema.obj);
      break;
    case 'user':
      requiredProperties = Object.keys(User.schema.obj);
      break;
  }

  return Object.keys(params).every( parameter => {
    return requiredProperties.includes(parameter);
  });
}


module.exports = {
  validateParameters,
  createItemData,
  createMatchData
}
