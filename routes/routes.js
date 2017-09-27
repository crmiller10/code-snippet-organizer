const express = require('express');
const routes = express.Router();
const User = require('../models/user');
const Snippet = require('../models/snippet');
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const requireLogin = function requireLogin(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.redirect('/login');
  }
};

routes.get('/', requireLogin, function (req, res) {
  Snippet.find({
    author: req.user.username
  }).then(function (snippets) {
    res.render;
    res.render('home', {
      user: req.user,
      snippets: snippets
    });
  });
});

routes.get('/login', function (req, res) {
  res.render('loginForm', { failed: req.query.failed });
});

routes.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login?failed=true',
  failureFlash: true
}));

// Edit Snippet
routes.get('/editSnippet', function (req, res) {
  if (req.query.id) {
    Snippet.findById(req.query.id).then(function (snippets) {
      return res.render('editSnippet', {
        snippets: snippets
      });
    });
  } else {
    res.render('editSnippet');
  }
});

routes.post('/updateSnippet', function (req, res) {
  if (req.body.id) {
    Snippet.findByIdAndUpdate(req.body.id, req.body, {
      upsert: true
    }).then(function () {
      return res.redirect('/');
    });
  } else {
    new Snippet(req.body).save()
    .then(function () {
      return res.redirect('/');
    })
    .catch(function (err) {
      console.log(err.errors);
      res.render('/snippet', {
        errors: err.errors,
        snippets: req.body
      });
    });
  }
});

// Registration
routes.get('/registerUser', function (req, res) {
  res.render('registrationForm');
});

routes.post('/register', function (req, res) {
  var user = new User(req.body);
  user.provider = 'local';
  user.setPassword(req.body.password);

  user.save()
  .then(function () {
    return res.redirect('/');
  })
  .catch(function (err) {
    return console.log(err);
  });
});


// Log Out
routes.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});


// Delete Snippet
routes.get('/deleteSnippet', function (req, res) {
  Snippet.findById(req.query.id).remove()
  .then(function () {
    return res.redirect('/');
  });
});

// New Snippet
routes.get('/newSnippet', function (req, res) {
  res.render('newsnippet', {
    user: req.user
  });
});

routes.post('/addSnippet', function (req, res) {
  var snippet = new Snippet(req.body);
  snippet.provider = 'local';

  snippet.save().then(function () {
    return res.redirect('/');
  }).catch(function (err) {
    return console.log(err);
  });
});

// View Snippet
routes.get('/:snippet', function (req, res) {
  Snippet.findById(req.query.id)
  .then(function (snippets) {
    return res.render('snippet', {
      user: req.user,
      snippets: snippets
    });
  });
});

// Search User Snippet's
routes.post('/snippetQuery', function(req, res) {
  console.log(req.body.query);
  Snippet.find({
    author: req.user.username,
    $or: [{
      language: {
        $regex: req.body.query,
        $options: 'i'
      }
    }, {
      tags: {
        $regex: req.body.query,
        $options: 'i'
      }
    }]
  }).then(function(snippets) {
    return res.render('snippetQuery', {
      user: req.user,
      snippets: snippets
    });
  });
});

module.exports = routes;
