const db = require('../db');

const Mongoose = db.mong;
const refreshToken = new Mongoose.Schema({

  tokenString: {
    type: String,
    require: 'Token string is required'
  },
  userId: {
    type: String,
    require: 'User ID required to save refresh token.'
  },
  iat: {
    type: Date,
    expires: '30d',
    default: Date.now()
  }
});

let RefreshToken = Mongoose.model('refresh_token', refreshToken);

module.exports = {
  model: RefreshToken
}
