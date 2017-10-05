'use strict'

const ObjectID = require('mongodb').ObjectID;

var date = new Date();
var testOwner = new ObjectID();

var testItems = [
    {
        _id: new ObjectID(),
        name: "First test Item",
        details: "Test Item 1 for bookmarks",
        ownerId: testOwner.toHexString(),
        category: "Household",
        locationName: "Hogwarts",
        locationDescription: "Magical!",
        photos: ["url", "url"],
        photoCount: 2,
        minPrice: 10,
        bought: false,
        nuSwipesLeft: 0,
        nuSwipesRight: 0,
        timeBought: "",
        offersMade: [10, 20],
        avgOffer: 15,
        xCoordinate: 10,
        yCoordinate: 10,
        postedDate: date.getTime()
    },
    {
        _id: new ObjectID(),
        name: "Second test Item", 
        details: "Test item 2 for bookmarks",
        ownerId: testOwner.toHexString(),
        category: "Household",
        locationName: "Hogwarts", 
        locationDescription: "Magical", 
        photos: ["url", "url"],
        photoCount: 2,
        minPrice: 10,
        bought: false,
        nuSwipesLeft: 0,
        nuSwipesRight: 0,
        timeBought: "",
        offersMade: [5, 15],
        avgOffer: 10,
        xCoordinate: 10,
        yCoordinate: 10, 
        postedDate: date.getTime()
    }
]

var testUser = {
    _id: new ObjectID(),
    fbId: "3456",
    firstName: "Old Upsert, Old name - User",
    lastName: "Test Last Name - User",
    gender: "Male",
    ageRange: "18-22",
    pictureUrl: "oldUrl",
    dateJoined: 12345,
    pushId: "1123",
    bookmarks: [

        {
            item: testItems[0]._id,
            lastOfferMade: 20,
            timeOfferMade: 12345
        },
        {
            item: testItems[1]._id,
            lastOfferMade: 15,
            timeOfferMade: 12345
        }
    ],
    offersInCategory: {
        'Furniture': 5,
        'Household': 10,
        'Electronics': 15,
        'Other': 20
    },
    rejectionsInCategory: {
        'Furniture': 51,
        'Household': 123,
        'Electronics': 16,
        'Other': 10
    },
    blockedUsers: [{
        userId: "testUserId", 
        blockedOn: 123456
    }],
    blockedBy: [{
        userId: "testUserId2", 
        blockedOn: 12345
    }],
    hasSeenWalkthrough: false,
    hasBookmarkedItem: false,
    hasSeenSearchPrompt: false
}

var upsertNewParams = {
    fbId: "newUpsertFbId",
    firstName: "New upsert - User", 
    lastName: "Test Last Name - User", 
    gender: "Male", 
    ageRange: "18-22",
    pictureUrl: "url", 
    pushId: "12345"
}

var upsertNewValidation = {
    fbId: "newUpsertFbId",
    firstName: "New upsert - User",
    lastName: "Test Last Name - User",
    gender: "Male",
    ageRange: "18-22",
    pictureUrl: "url",
    pushId: "12345",
    bookmarks: [],
    offersInCategory: {
        'Furniture': 0,
        'Household': 0,
        'Electronics': 0,
        'Other': 0
    },
    rejectionsInCategory: {
        'Furniture': 0,
        'Household': 0,
        'Electronics': 0,
        'Other': 0
    },
    blockedUsers: [],
    blockedBy: [],
    hasSeenWalkthrough: false,
    hasBookmarkedItem: false,
    hasSeenSearchPrompt: false
}

var upsertOldParams = {
    fbId: testUser.fbId,
    firstName: "Old upsert, New Name - User", 
    lastName: testUser.lastName,
    gender: testUser.gender,
    ageRange: testUser.ageRange, 
    pushId: testUser.pushId,
    pictureUrl: "newUrl", 
    hasSeenWalkthrough: true,
    hasBookmarkedItem: true, 
    hasSeenSearchPrompt: true
}


var badUpsertParams = { 
    fbId: "Bad upsert",
    firstName: "This name is too long for the db. Repeat: This name is too long for the db.", 
    lastName: "Test Last Name - User", 
    bookmarks: "whack",
    gender: "Male", 
    ageRange: "18-22",
    pictureUrl: "url", 
    pushId: "12345"
}

var createBookmarkParams = {
    item: new ObjectID(),
    lastOfferMade: 15, 
    timeOfferMade: 1855
}

var badBookmarkParams = {
    item: 12345,
    lastOfferMade: "Not a number", 
    timeOfferMade: 12345
}

var goodBmUpdate = { 
  timeOfferMade: 77,
  lastOfferMade: 17
}

var badBmUpdate = {
  timeOfferMade: "Bad time", 
  lastOfferMade: 12
}

var goodUserUpdate = {

    gender: "Female",
    offersInCategory: {
        'Furniture': 100
    },
    rejectionsInCategory: {
        'Furniture': 100
    }

}

var badUserUpdate = {

    offersInCategory: {
        'Bad key - User Update' : 50
    }

}

module.exports = {
    testUser,
    testItems,
    badUpsertParams,
    upsertNewParams,
    upsertOldParams,
    upsertNewValidation,
    createBookmarkParams,
    badBookmarkParams,
    goodBmUpdate,
    badBmUpdate,
    goodUserUpdate,
    badUserUpdate
}
