'use strict'

const ObjectID = require('mongodb').ObjectID;

var date = new Date();

var eventPostParams = {
  itemInfo: {
    id: "12345",
    name: "Test Item - Event",
    locationName: "Test Location - Event",
    category: "Furniture",
    postedDate: 12345,
    offersMade: [11, 11, 11],
    avgOffer: 11
  },
  action: "Offered",
  price: 20
}

var badEventPostParams = {
  itemInfo: {
    id: "12345",
    name: "Test Item - Event",
    locationName: "Test Location - Event",
    category: "Furniture",
    postedDate: 12345,
    offersMade: [11, 11, 11],
    avgOffer: 11
  },
  action: "Bad Action",
  price: 20
}

var user = {
  _id: new ObjectID(),
  gender: "Male",
  ageRange: "18-22",
  dateJoined: date.getTime(),
  pushId: "456",
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
  }
}

var badUser = {
  _id: new ObjectID(),
  ageRange: "18-22",
  gender: "Male",
  dateJoined: 4483,
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
  }
}

var testEvents = [
    {
        _id: new ObjectID(),
        userId: testUser._id.toHexString(),
        userInfo: {
            offersInCategory: {
                "Furniture": 3,
                "Electronics": 5,
                "Household": 12,
                "Other": 44
            },
            rejectionsInCategory: {
                "Furniture": 33,
                "Electronics": 10,
                "Household": 12,
                "Other": 10
            },
            ageRange: "18-22",
            gender: "Male",
            dateJoined: 12345
        },
        itemInfo: {
            id: "12345",
            name: "Test Item - Event",
            locationName: "Test Location - Event",
            category: "Furniture",
            postedDate: 12345,
            offersMade: [11, 11, 11],
            avgOffer: 11
        },
        action: "Offered",
        price: 25

    },
    {
        _id: new ObjectID(),
        userId: testUser._id.toHexString(),
        userInfo: {
            offersInCategory: {
                "Furniture": 3,
                "Electronics": 5,
                "Household": 12,
                "Other": 44
            },
            rejectionsInCategory: {
                "Furniture": 33,
                "Electronics": 10,
                "Household": 12,
                "Other": 10
            },
            ageRange: "18-22",
            gender: "Male",
            dateJoined: 12345
        },
        itemInfo: {
            id: "12345",
            name: "Second Event Item",
            locationName: "Event Location",
            category: "Furniture",
            postedDate: 12345,
            offersMade: [11, 23, 44],
            avgOffer: 26
        },
        action: "Offered",
        price: 30

    }
]


module.exports = {
    userId: testUser._id.toHexString(),
    postParams: eventPostParams,
    badPostParams: badEventPostParams,
    user,
    badUser,
    testEvents
}


