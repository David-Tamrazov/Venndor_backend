const db = require('../db');
const Item = require('/Users/Dave/Documents/venndor_backend/app/models/Item.js');
const ErrorTypes = require('/Users/Dave/Documents/venndor_backend/app/error').types;
const Mongoose = db.mong;

const eventSchema = new Mongoose.Schema({
  userId: {
    type: String, 
    required: "User Id required for events", 
    index: true
  },
  userInfo: {
    offersInCategory: {
      type: Object,
      validate: object => { //our custom validator, object is the provided object
        let allowedKeys = ['Furniture', 'Household', 'Electronics', 'Other'];
        let correctKeys = Object.keys(object).every(key => allowedKeys.includes(key)); //make sure all keys are inside `allowedKeys`

        let min = 0;
        let correctValues = Object.values(object).every(value => value >= min); //make sure all values are in correct range

        return correctKeys && correctValues; //return true if keys and values pass validation
      }
    },
    rejectionsInCategory: {
      type: Object,
      validate: object => { //our custom validator, object is the provided object
        let allowedKeys = ['Furniture', 'Household', 'Electronics', 'Other'];
        let correctKeys = Object.keys(object).every(key => allowedKeys.includes(key)); //make sure all keys are inside `allowedKeys`

        let min = 0;
        let correctValues = Object.values(object).every(value => value >= min ); //make sure all values are in correct range

        return correctKeys && correctValues; //return true if keys and values pass validation
      }
    },
    ageRange: String,
    gender: String,
    dateJoined: Number
  },
  itemInfo: {
    id: { type: String, required: "Item Id required for events" },
    name: { type: String, required: "Item name required for events", maxlength: 100 },
    locationName: { type: String, required: "Location name required for events", maxlength: 50 },
    category: { 
      type: String,
      required: "Item category required for events", 
      enum: ['Furniture', 'Household', 'Electronicts', 'Books', 'Kitchen', 'Clothing', 'Sports', 'School Supplies', 'Other'],
      index: true
    },
    postedDate: Number,
    offersMade: [ {
      type: Number,
      min: 0
    }],
    avgOffer: {
      type: Number, 
      min: 0
    }
  },
  action: {
    type: String,
    enum: ['Offered', 'Rejected'],
    required: "Events require an action"
  },
  price: Number,
  timeStamp: {
    type: Date,
    expires: '30d',
    default: Date.now()
  }
});

let Event = Mongoose.model('Event', eventSchema);

var createEvent = (user, params, cb) => {
  
  let newEvent = new Event({
    userId: user._id,
    userInfo: {
      offersInCategory: user.offersInCategory,
      rejectionsInCategory: user.rejectionsInCategory,
      ageRange: user.ageRange,
      gender: user.gender,
      dateJoined: user.dateJoined
    },
    itemInfo: {
      id: params.itemInfo.id,
      name: params.itemInfo.name,
      locationName: params.itemInfo.locationName,
      category: params.itemInfo.category, 
      postedDate: params.itemInfo.postedDate,
      offersMade: params.itemInfo.offersMade,
      avgOffer: params.itemInfo.avgOffer
    },
    action: params.action,
    price: params.price,
  });

  newEvent.save(err => {
    if (err) {
      //winston.log
      return cb(ErrorTypes.serverError(), null);
    }
    else {
      return cb(null, newEvent);
    }
  });

}

var deleteUserEvents = (userId, cb) => {

  Event.find()
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
        return cb(ErrorTypes.serverError(), false);
      }

    });
}

module.exports = {
  createEvent,
  deleteUserEvents,
  model: Event
}

