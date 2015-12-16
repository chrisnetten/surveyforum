var express = require('express');
var passport = require('passport');
var router = express.Router();

var User = require('../models/user');
var Survey = require('../models/survey');


function requireAuth(req,res,next) {
   
   //is user logged in
   if(!req.isAuthenticated()){
   return res.redirect('/login');
}
next();
}

/* GET home page. */

 
 router.get('/',  function (req, res, next) {
  Survey.find(function(err, survey) {
    
    if(err) {
      console.log(err);
      res.end(err);
    }
    else{
      res.render('index', {
          title: 'Survey',
          survey: survey,
          displayName: req.user ? req.user.displayName : '',
           username: req.user ? req.user.username : ''
          
      });
    }
    });
  });


    


router.get('/login', function(req, res, next) {
  res.render('login', {
    title: 'Home', 
     messages: req.flash('loginMessage'),
    displayName: req.user ? req.user.displayName : ''
  })
});

router.post('/login', passport.authenticate('loginLocal', {
  successRedirect: '/users',
  failerRedirect: '/login',
  failureFlash: true
}))

/* Show Registration Page */
router.get('/register', function(req, res, next) {
  if(!req.user) {
    res.render('register', {
      title: 'Register',
      message: req.flash('registrationMessage'),
      displayName: req.user ? req.user.displayName : ''
    });
  }
  else {
    return res.redirect('/');
  }
});

/* Registration Post Request */

router.post('/register', passport.authenticate('localRegistration', {
  successRedirect: '/users',
  failureRedirect: '/register',
  failerFlash: true
}))

/* Logout Request */

router.get('/logout', function(req,res) {
  req.logout();
  res.redirect('/');
});

/* Render add user page */
router.get('/add', requireAuth, function(req, res, next) {
    res.render('users/add', {
      title: 'Add',
      displayName: req.user ? req.user.displayName : ''
});
});

/* Submisson of new user */

router.post('/add', requireAuth, function (req, res, next) {
    var survey = new Survey(req.body);
    
    
    Survey.create({
      name: req.body.name,
      username: req.body.username,
      Question: req.body.question,
      answer: req.body.answer,
      created: Date.now(),
      updated: Date.now()
    }, function(err, User) {
      if(err) {
        console.log(err);
        res.end(err);
      }
      else {
        res.redirect('index')
      }
    });
});

module.exports = router;
