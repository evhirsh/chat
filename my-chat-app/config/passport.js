const JwtStrategy = require('passport-jwt').Strategy,
 ExtractJwt = require('passport-jwt').ExtractJwt;

// load up the user model
const {User} = require('../models/User');
const config = require('../config/db'); // get db config file

module.exports = function(passport) {
  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
  opts.secretOrKey = config.secret;
  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.findById(jwt_payload._id, function(err, user) {
          if (err) {
              return done(err, false);
          }
          if (user) {
              console.log("in pass.js user authenticate",user);
              done(null, user);
          } else {
              done(null, false);
          }
      });
  }));
};