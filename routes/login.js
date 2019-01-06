var passport = require('passport');
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var db = require('../db');




//Local - for local database strategy
router.post('/', passport.authenticate('local', {
    successRedirect: '/dashboard.html',
    failureRedirect: '/index.html',
}));


router.get('/dashboard',authenticationMiddleware (), function (req, res) {


    //  deserializeUser ... if so - creates a session and returns a session key
    console.log(req.user);
    console.log(req.isAuthenticated());
    res.redirect('/dashboard.html');

});

//verify if the user exists and the password is correct
passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    },
    function (username, password, done) {

        console.log(username);
        console.log(password);


        db.query('SELECT id, password FROM user WHERE username = ?', [username], function (err, result) {
            if (err) throw err;
            console.log(err);
            console.log(result[0]);

            //if nothing is returned
            if (result.length === 0) {
                return done(null, false);

            }
            console.log(result[0].password);
            console.log(result[0].password.toString());
            var hash = result[0].password.toString();
            bcrypt.compare(password, hash, function (err, response) {
                if (response === true) {
                    console.log("da");
                    return done(null, {
                        user_id: result[0].id
                    });
                } else {
                    console.log("else")
                    return done(null, false);
                }
            });
        });
    }
));

function authenticationMiddleware () {
  return (req, res, next) => {
    console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

      if (req.isAuthenticated()) return next();
      res.redirect('/login')
  }
}

module.exports = router;
