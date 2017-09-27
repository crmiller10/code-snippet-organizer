const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require("passport-local").Strategy;

const Schema = mongoose.Schema;

const userSchema = new Schema({
  id: {
    type: String
  },
  username: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  passwordHash: {
    type: String
  }
});

userSchema.methods.setPassword = function(password) {
  this.passwordHash = bcrypt.hashSync(password, 8);
};

// Users can authenticate their passwordHash
userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

// Static method to authenticate user
userSchema.statics.authenticate = function (username, password) {
  return User.findOne({
    username: username
  })
  // Validate user's password
  .then(function (user) {
    if (user && user.validatePassword(password)) {
      return user;
    } else {
      return null;
    }
  });
};

const User = mongoose.model('User', userSchema);

module.exports = User;