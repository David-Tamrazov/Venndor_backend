'use strict';

const config = require('../config');

//connect mongoose to mongolab
const mongoose = require('mongoose').connect(config.dbURI);
mongoose.Promise = global.Promise;

// var db = mongoose.connection.db;

// //Drop indices to reset them whenever I update an index for a collection
// db.on('open', function () {
//   db.listCollections().toArray((err, names) => {

//     names.forEach( collName => { 

//       //unauthorized to drop this for some reason? 
//       if (collName.name == "system.indexes") {
//         return;
//       }
//       db.command({ dropIndexes: collName.name, index: "*"});
      
//     });

//   });
// });

mongoose.connection.on('error', err => {
  ///winston.log
  console.log("Error connecting to mongoDB: ", err);
});

module.exports = {
  mong: mongoose
}
