'use strict'

const ObjectID = require('mongodb').ObjectID;
const jwt = require('jsonwebtoken');
const helper = require('/Users/Dave/Documents/venndor_backend/app/helpers/index.js');
const config = require('/Users/Dave/Documents/venndor_backend/app/config');

var date = new Date();

//userIds[0] == test user 
var userIds = [ new ObjectID(), new ObjectID(), new ObjectID(), new ObjectID(), new ObjectID(), new ObjectID() ];
var fakeId = new ObjectID();

var testItems = helper.createItemData(userIds);

var matchItems = testItems.filter(el => el.ownerId == userIds[1]);
var testMatches = helper.createMatchData(userIds[0], matchItems);

var testItem = {
  _id: new ObjectID(),
  name: "Test Item",
  details: "This is a test item.",
  ownerId: testUser._id,
  category: "Household",
  locationName: "Hogwarts",
  locationDescription: "Magical!",
  photos: ["url", "url"],
  photoCount: 2,
  minPrice: 10,
  bought: 0,
  nuSwipesLeft: 0,
  nuSwipesRight: 0,
  matches: [],
  timeBought: "",
  offersMade: [],
  avgOffer: 0,
  xCoordinate: 10,
  yCoordinate: 10,
  postedDate: date.getTime()
}

var testMatch =  {
  _id: new ObjectID(),
  itemId: "53221155",
  itemName : "Test Item - Match",
  itemDetails: "Test Details - Match",
  itemPickupLocation: "Test Pickup Location - Match",
  buyerId: "23423234",
  sellerId: "332221",
  matchedPrice: 15,
  dateMatched: date.getTime(),
  bought: 0,
  numberOfMessages: 0,
  numberOfMessagesReadByUser: 0,
  numberOfMessagesReadBySeller: 0,
  dateBought: date.getTime()
}

var postParams = {
  itemId: "55555",
  itemName: testItem.name,
  itemDetails: testItem.details,
  itemPickupLocation: testItem.locationName,
  sellerId: testItem.ownerId,
  matchedPrice: 10,
  dateMatched: date.getTime()
}

var badPostParams = {
  itemId: 123
}

var token = jwt.sign({
  id: testUser._id
}, config.tokenSecret, {
  expiresIn: 60*30
});

var tokenHeader = "Bearer " + token;

var realMatchUrl = '/match/' + testMatch._id.toHexString();
var fakeMatchUrl = '/match/' + fakeId.toHexString();

module.exports = {
    testUser,
    testMatch,
    testMatches,
    postParams,
    badPostParams,
    realMatchUrl,
    fakeMatchUrl,
    tokenHeader 
}


