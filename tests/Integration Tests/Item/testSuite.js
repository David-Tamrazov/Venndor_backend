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

var ownedItems = testItems.filter(el => el.ownerId == userIds[0]);

var matchItems = testItems.filter(el => el.ownerId == userIds[1]);
var testMatches = helper.createMatchData(userIds[0], matchItems);

var seenItems = testItems.filter(el => el.ownerId == userIds[2]);
var seenPosts = seenItems.map(el => el._id);

var fetchItems = testItems.filter(el => el.ownerId == userIds[3]);
fetchItems.forEach((item) => { item._id = item._id.toHexString(); });

var blockedItems = testItems.filter(el => el.ownerId == userIds[4]);
var blockedByItems = testItems.filter(el => el.ownerId == userIds[5]);

var testUser = {
  _id: userIds[0],
  fbId: "123",
  firstName: "Test",
  lastName: "User",
  gender: "Male",
  ageRange: "18-22",
  pictureUrl: "url",
  joinedDate: date.getTime(),
  pushId: "456",
  bookmarks: [
    {
      item: seenItems[0]._id.toHexString(),
      lastOfferMade: seenItems[0].minPrice + 5,
      timeOfferMade: date.getTime()
    },
    {
      item: seenItems[1]._id.toHexString(),
      lastOfferMade: seenItems[1].minPrice + 5,
      timeOfferMade: date.getTime()
    }
  ],
  offersInCategory: { 
    "Furniture": 12,
    "Household": 2,
    "Electronics": 5,
    "Other": 19
  },
  rejectionsInCategory: { 
    "Furniture": 32,
    "Household": 22,
    "Electronics": 55,
    "Other": 29
  },
  blockedUsers: [userIds[4]],
  blockedBy: [userIds[5]],
  hasSeenWalkThrough: true,
  hasBookmarkedItem: true,
  hasSeenSearchPrompt: true
}

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
  itemId: testItem._id.toHexString(),
  itemName : testItem.name,
  itemDetails: testItem.details,
  itemPickupLocation: testItem.locationDescription,
  buyerId: testUser._id,
  sellerId: testUser._id,
  matchedPrice: 15,
  dateMatched: date.getTime(),
  bought: 0,
  numberOfMessages: 0,
  numberOfMessagesReadByUser: 0,
  numberOfMessagesReadBySeller: 0,
  dateBought: date.getTime()
}

var postParams = {
  name: "test name",
  details: "test details",
  category: "Furniture",
  locationName: "McGill",
  locationDescription: "Dopest place evah",
  photos: ['url', 'url'],
  photoCount: 2,
  minPrice: 10,
  xCoordinate: 5,
  yCoordinate: 5,
  postedDate: date.getTime()
}

var badPostParams = {
  name: "Test Item",
  details: "test details",
  ownerId: 123,
  category: "Bad category",
  locationName: "McGill",
  locationDescription: "Dopest place evah",
  photos: ['url', 'url'],
  photoCount: 2,
  minPrice: 10,
  xCoordinate: 5,
  yCoordinate: 5,
  postedDate: date.getTime()
}

var token = jwt.sign({
  id: testUser._id
}, config.tokenSecret, {
  expiresIn: 60*30
});

var tokenHeader = "Bearer " + token;

var realItemUrl = '/item/' + testItem._id.toHexString();
var fakeItemUrl = '/item/' + fakeId.toHexString();

var realMatchUrl = '/match/' + testMatch._id.toHexString();
var fakeMatchUrl = '/match/' + fakeId.toHexString();

module.exports = {
    
    fetchItems,
    matchItems,
    seenItems,
    ownedItems,
    testItem,
    testItems,
    testMatch,
    testMatches,
    tokenHeader,
    seenPosts,
    postParams,
    badPostParams,
    realItemUrl,
    fakeItemUrl
}


