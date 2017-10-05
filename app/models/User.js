const db = require('../db');
const ErrorTypes = require('/Users/Dave/Documents/venndor_backend/app/error').types;
const Mongoose = db.mong;

var date = new Date();

const userSchema = new Mongoose.Schema({

  fbId: {
    type: String,
    index: true,
    required: "Users must have a facebook ID.",
    maxlength: 40
  },
  firstName: {
    type: String,
    required: "Users must have a name.",
    maxlength: 40
  },
  lastName: {
    type: String,
    required: "Users must have a name.",
    maxlength: 40
  },
  gender: {
    type: String,
    required: "Users must have a gender",
    default: "Unknown"
  },
  ageRange: {
    type: String,
    default: "Unknown",
    maxlength: 25
  },
  pictureUrl: {
    type: String,
    required: "Users must have a profile picture."
  },
  dateJoined: {
    type: Number,
    required: "Users must have a joined date.", 
    default: date.getTime()
  },
  pushId: String,
  bookmarks: {
    type: [{
      item: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: "An item id is required to create a bookmark."
      },
      lastOfferMade: Number,
      timeOfferMade: Number,
    }],
    default: []
  }, 
  offersInCategory: {
      type: Object,
      validate: object => { //our custom validator, object is the provided object
        let allowedKeys = ['Furniture', 'Household', 'Electronics', 'Other'];
        let correctKeys = Object.keys(object).every(key => allowedKeys.includes(key)); //make sure all keys are inside `allowedKeys`

        let min = 0;
        let correctValues = Object.values(object).every(value => value >= min); //make sure all values are in correct range

        return correctKeys && correctValues; //return true if keys and values pass validation
      }, 
      default: {
          'Furniture': 0,
          'Household': 0,
          'Electronics': 0,
          'Other': 0
      },
      required: "A user must have offers in category"
  },
  rejectionsInCategory: {
      type: Object,
      validate: object => { //our custom validator, object is the provided object
        let allowedKeys = ['Furniture', 'Household', 'Electronics', 'Other'];
        let correctKeys = Object.keys(object).every(key => allowedKeys.includes(key)); //make sure all keys are inside `allowedKeys`

        let min = 0;
        let correctValues = Object.values(object).every(value => value >= min ); //make sure all values are in correct range

        return correctKeys && correctValues; //return true if keys and values pass validation
      }, 
      default: {
          'Furniture': 0,
          'Household': 0,
          'Electronics': 0,
          'Other': 0
      },
      required: "A user must have rejections in category."
  }, 
  blockedUsers: {
    type: [{
      userId: String,
      blockedOn: Number
    }],
    default: []
  }, 
  blockedBy: {
    type: [{
      userId: String,
      blockedOn: Number
    }],
    default: []
  },
  hasSeenWalkthrough: { type: Boolean, default: false },
  hasBookmarkedItem: { type: Boolean, default: false },
  hasSeenSearchPrompt: { type: Boolean, default: false }

});

let User = Mongoose.model('User', userSchema);

let serialize = (params, cb) => {

  let options = { upsert: true, setDefaultsOnInsert: true, new: true }

  User.findOneAndUpdate({"fbId" : params.fbId}, params, options, (err, doc) => {
    
    if (err) {
      //winston.log
      return cb (ErrorTypes.serverError(), null);
    }

    else if (doc) {
      return cb(null, doc);
    }

    else {
      return cb(ErrorTypes.serverError(), null);
    }

  });

}

let findById = (userId) => {

   User.findOne({ "_id": userId }, (err, doc) => {
     if (err) {
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

let updateUser = (userId, params, cb) => {

  User.findOne({ "_id" : userId}, (err, user) => {

    if (err) {
      //winston.log
      return cb(ErrorTypes.serverError(), false);
    }

    else if (user) {

      for (var field in params) {
        
        if (field == 'offersInCategory' || field == 'rejectionsInCategory') {

          for (var cat in params[field]) {
            user[field][cat] = params[field][cat];
          }

          user.markModified(field);
          continue;
        }

        user[field] = params[field];

      }

      user.save((err) => {
        if (err) {
          //winston.log
          return cb(ErrorTypes.serverError(), false);
        }
        else {
          return cb(null, true);
        }
      });

     
    }

    else {
      //winston.log
      return cb(ErrorTypes.notFound(), false);
    }

  });

}

let deleteUser = (userId, cb) => {

  User.find({ "_id" : userId})
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

let createBookmark = (userId, params, cb) => {

  User.findOne({_id : userId}, (err, user) => {

    if (err) {
      //winston.log
      return cb(ErrorTypes.serverError(), null);
    }

    else if (user) {
      
      let newBookmark = {
        item: params.item, 
        lastOfferMade: params.lastOfferMade,
        timeOfferMade: params.timeOfferMade
      }
      
      user.bookmarks.push(newBookmark);

      user.save((err) => {

        if (err) {
          //winston.log
          return cb(ErrorTypes.serverError(), null);
        }
        else {
          return cb(null, newBookmark);
        }
      });

    }

    else {
      return cb(ErrorTypes.notFound(), null);
    }

  });

}

let fetchBookmarks = (userId, cb) => {

  User.findOne({ "_id": userId })
  .populate('bookmarks.item')
  .exec((err, user) => {

    if (err) {
      debugger;
      //winston.log
      return cb(ErrorTypes.serverError(), null);
    }
    else if (user) {
      return cb(null, user.bookmarks);
    }
    else {
      return cb(ErrorTypes.notFound(), null);
    }

  });

}

//NEEDS VALIDATION MIDDLEWARE FOR PARAMS
let updateBookmark = (userId, itemId, params, cb) => {

  var set = {};
  for (var field in params) {
    set['bookmarks.$.' + field] = params[field];
  }

  User.update({ "_id" : userId, "bookmarks.item": itemId },
    { "$set" : set },
    { runValidators : true },
    (err, raw) => {

      if (err) {
        //winston.log
        return cb(ErrorTypes.serverError(), false);
      }

      else if (raw.ok) {
        return cb(null, true);
      }

      else {
        return cb(ErrorTypes.notFound(), false);
      }

    });

}

let deleteBookmark = (userId, itemId, cb) => {

  var pull = { "bookmarks" : { "item" : itemId } }

  User.update({ "_id" : userId }, 
  { "$pull": pull },
  (err, raw) => {

    if (err) { 
      //winston.log
      return cb(ErrorTypes.serverError(), false);
    }
    else if (raw.ok) {
      return cb(null, true);
    }

    else {
      return cb(ErrorTypes.notFound(), false);
    }
  });

}

let deleteBookmarks = (userId, cb) => {

  var set = { bookmarks : [] }
  
  User.update({ "_id" : userId }, 
  { "$set": set }, 
  (err, raw) => {

    if (err) {
      //winston.log
      return cb(ErrorTypes.serverError(), false);
    }

    else if (raw.ok) {
      return cb(null, true);
    }

    else {
      return cb(ErrorTypes.notFound(), false);
    }

  });
    
}

module.exports = {
  schema: userSchema,
  model: User,
  serialize,
  createBookmark,
  fetchBookmarks,
  updateBookmark,
  deleteBookmark,
  deleteBookmarks,
  updateUser, 
  deleteUser
}
