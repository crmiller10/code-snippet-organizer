const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('express-flash-messages');
const Routes = require('./routes/routes');
// require stuff for passport
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const app = express();
const mongoose = require('mongoose');
mongoose.Promise= require('bluebird');

const User = require('./models/user');

// configure passport
passport.use(new LocalStrategy(function (username, password, done) {
  console.log('LocalStrategy', username, password);
  User.authenticate(username, password).then(function (user) {
    if (user) {
      done(null, user);
    } else {
      done(null, null, {
        message: 'User not found'
      });
    }
  }).catch(function (err) {
    return done(err);
  });
}));

// store the user's id in the session
passport.serializeUser(function (user, done) {
  done(null, user);
});

// get the user from the session based on the id
passport.deserializeUser(function (id, done) {
  User.findById(id).then(function (user) {
    return done(null, user);
  });
});

// Using handlebars instead of mustache
app.engine('handlebars', exphbs({ defaultLayout: 'layout' }));
app.set('views', './views');
app.set('view engine', 'handlebars');

app.use(
  session({
    secret: 'passscode',
    resave: false,
    saveUninitialized: true
  })
);

//static files
app.use(express.static('public/'));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', Routes);

mongoose
  .connect('mongodb://localhost:27017/snippet-app', {
    useMongoClient: true
  })
  .then(function() {
    return app.listen(9000, function() {
      return console.log('http://localhost:9000');
    });
  });
