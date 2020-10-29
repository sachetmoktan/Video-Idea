const LocalStrategy = require('passport-local').Strategy;

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load User Model
// require('../models/User');
const User = mongoose.model('users');




module.exports = function(passport) {
    passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => {       //Login form is now connected to LocalStrategy
        // console.log(email);
        User.findOne({email:email})
                    .then(user => {
                        // Match User
                        if(!user){
                            return done(null, false, {message: 'No User Found'})
                        }

                        // Match password  remember the password saved in mongodb is encrypted .but the password ttrying to login isnot encrypted  (unencrypted password, encrypted password)
                        bcrypt.compare(password, user.password, (err, isMatch) => {
                            if(err) throw err;
                            if(isMatch) {
                                return done(null, user);
                            }
                            else {
                                return done(null, false, {message: 'Password Incorrect'})
                            }
                        })

                    })

    }));

    // For session. serialize search in passportjs.com in documentation.
    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });

}