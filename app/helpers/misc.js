let populateItemFeed = (cb) => {
  var adj = ["hairy", "swole", "curvacious", "bbacious", "excellent"]
  var nouns = ["bb", "dragon", "dwarf", "elf", "human"]
  var categories = ['Furniture', 'Household', 'Electronics', 'Books', 'Kitchen', 'Clothing']
  var details = "Random item for DB population"
  var ownerIds = ["1", "2", "3", "4", "5"]
  var locationName = "Hogwarts"
  var locationDescription = "Magical and shit"
  var minPrice = 10
  var photos = ["url", "url", "url"]
  var photoCount = 3
  var xCoord = 12
  var yCoord = 15
  var postedDate = "Right meow!";

  for (i = 0; i < 5; i++) {
    for (j = 0; j < 10; j++) {

      var randomName = adj[Math.floor(Math.random()*5)] + " " + nouns[Math.floor(Math.random()*5)]
      var randomCategory = categories[Math.floor(Math.random()*6)]
      var ownerId = ownerIds[i]

      var params = {
        name: randomName,
        details: details,
        ownerId: ownerId,
        category: randomCategory,
        locationName: locationName,
        locationDescription: locationDescription,
        photos: photos,
        photoCount: photoCount,
        minPrice: minPrice,
        xCoordinate: xCoord,
        yCoordinate: yCoord,
        nuSwipesLeft: j,
        postedDate: postedDate
      }

      Item.createItem(params, (err, result) => {
        if (!err) {
          cb(err, null)
        }
        else if (result) {
          cb(null, result)
        }
      });
    }
  }
}

//pull 20 items for user
//create 5 matches for each
//return

let populateMatches = (cb) => {
  async.parallel([
    populateUserMatches.bind(null, 1),
    populateUserMatches.bind(null, 2),
    populateUserMatches.bind(null, 3)
  ], function(err, results) {
    if (err) {
      return cb(err, null);
    }
    else {
      return cb(null, results);
    }
  })
}

let populateUserMatches = (userId, cb) => {

  async.waterfall([
    Item.fetchItemFeed.bind(null, { userId: userId }),
    genMatches.bind(null, userId)
  ], function(err, results) {
    if (err) {
      return cb(err, null);
    }
    else if (results) {
      return cb(null, results);
    }
  });
}

let genMatches = (userId, docs, cb) => {
  var mInfo = [];

  for (var i = 0; i < 5; i++) {
    mInfo.push({
        itemId: docs[Object.keys(docs)[i]]._id,
        itemName: docs[Object.keys(docs)[i]].name,
        itemDetails: docs[Object.keys(docs)[i]].details,
        itemPickupLocation: docs[Object.keys(docs)[i]].locationName,
        buyerId: userId,
        sellerId: docs[Object.keys(docs)[i]].ownerId,
        matchedPrice: docs[Object.keys(docs)[i]].minPrice + 5,
        dateMatched: docs[Object.keys(docs)[i]].postedDate

    });
  }

  async.parallel([
    Match.createMatch.bind(null, mInfo[0]),
    Match.createMatch.bind(null, mInfo[1]),
    Match.createMatch.bind(null, mInfo[2]),
    Match.createMatch.bind(null, mInfo[3]),
    Match.createMatch.bind(null, mInfo[4]),
  ], function(err, results) {
    if (err) {
      return cb(err, null);
    }
    else {
      return cb(null, results);
    }
  });
}
