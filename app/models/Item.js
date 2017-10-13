const db = require('../db');
const path = require('path');
const ErrorTypes = require(path.resolve('app', 'error')).types;
const Match = require('./Match.js');

const Mongoose = db.mong;

const itemSchema = new Mongoose.Schema({

  name: { type: String, maxlength: 100, required: "An item name is mandatory.", index: true },
  details: { type: String, maxlength: 400, required: "Item details are required." },
  ownerId: { type: String, maxlength: 50, required: "An ownerId is required", index: true },
  locationName: { type: String, maxlength: 50, required: "Item must have a location name." },
  locationDescription: { type: String, maxlength: 200, required: "Item location must have a description" },
  xCoordinate: { type: Number, required: "An item must have a pickup location (Missing: X)" },
  yCoordinate: { type: Number, required: "An item must have a pickup location (Missing: Y)" },
  postedDate: { type: Number, required: "An item must have a posted date", default: 0 },
  photos: { type: [String], required: "An item must have photos." },
  photoCount: {
    type: Number,
    min: [1, "At least one photo must be included in the post."],
    max: [5, "Cannot make a post with more than 5 photos."]
  },
  minPrice: {
    type: Number,
    required: "A minimum price is required.",
    min: [0, "Minimum prices cannot be negative."]
  },
  category: {
    type: String,
    required: "A category is required.",
    enum: ['Furniture', 'Household', 'Electronics', 'Books', 'Kitchen', 'Clothing', 'Sports', 'School Supplies', 'Other' ],
    index: true
  },
  postedDate: {
    type: Number,
    required: "Item must have a posted date.",
    min: 0
  },
  timeBought: { type: String, default: "" },
  offersMade: { type: [Number], default: [] },
  bought: { type: Boolean, default: false },
  avgOffer: { type: Number, default: 0 },
  nuSwipesLeft: { type: Number, default: 0 },
  nuSwipesRight: { type: Number, default: 0 },
  nuMatches: { type: Number, default: 0 }
});

let Item = Mongoose.model('Item', itemSchema);

let createItem = (userId, params, cb) => {

  let newItem = new Item({
    name: params.name,
    details: params.details,
    ownerId: userId,
    category: params.category,
    locationName: params.locationName,
    locationDescription: params.locationDescription,
    photos: params.photos,
    photoCount: params.photoCount,
    minPrice: params.minPrice,
    xCoordinate: params.xCoordinate,
    yCoordinate: params.yCoordinate,
    postedDate: params.postedDate
  });

  newItem.save(err => {
    if (err) {
      //winston.log
      return cb(ErrorTypes.serverError(), null);
    }
    else {
      return cb(null, newItem);
    }
  });
}

//  NEEDS MAJOR REWORKING
let fetchItemFeed = (userId, categories, matchedItems, cb) => {

    var query = {
      $and : [ {_id : {$nin: matchedItems}} ],
      ownerId: { $ne: userId },
      bought: 0
    }

    if (categories) {
      query.category = categories
    }

    Item.find(query).limit(20).sort({ nuSwipesLeft : 'asc'}).exec((err, docs) => {

      if (err) {
        cb(err, null);
      }
      else if (docs) {
        cb(null, {itemFeed: docs});
      }
      else {
        cb(null, null);
      }
    });
}

let fetchItemById = (id, cb) => {
  Item.findOne({ _id: id }, function(err, doc) {
    if (err) {
      //winston.log
      return cb(ErrorTypes.serverError(), null);
    }
    else if (doc) {
      return cb(null, doc);
    }
    else {
      return cb(ErrorTypes.notFound(), null);
    }
  });
}

let updateItemById = (userId, itemId, params, cb) => {

  Item.findOne({ "_id" : itemId, ownerId: userId }, (err, doc) => {
    
    if (err) {
      return cb(ErrorTypes.serverError());
    }

    else if (doc) {

      for (var key in params) {
        doc[key] = params[key];
      }

      doc.save(err => {
        if (err) {
          return cb(ErrorTypes.serverError());
        }
        else {
          return cb(null, true);
        }
      });

    }

    else {
      return cb(ErrorTypes.notFound());
    }
    
  });
  
}


let deleteItemById = (userId, itemId, cb) => {

  Item.find({ "_id": itemId, "ownerId": userId })
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

//Must also remove all matches associated with a user's posts 
let deleteUserPosts = (userId, cb) => {
  
}

module.exports = {
  schema: itemSchema,
  model: Item,
  createItem,
  fetchItemFeed,
  deleteItemById,
  updateItemById
}
