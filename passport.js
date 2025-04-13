/**
 * @fileoverview Passport authentication configuration for the Movie API.
 * @module passport
 */

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const bcrypt = require('bcryptjs');
const Models = require('./models.js');
const User = Models.User;

/** Secret key for JWT verification */
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

/**
 * Local authentication strategy configuration
 * Verifies username and password against database
 * @param {string} username - Username to verify
 * @param {string} password - Password to verify
 * @param {Function} done - Passport callback
 */
passport.use(new LocalStrategy(
  {
    usernameField: 'username',    
    passwordField: 'password',    
    session: false
  },
  async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });  
      
      if (!user) {
        return done(null, false, { 
          message: 'Incorrect username or password.' 
        });
      }

      const isValid = await bcrypt.compare(password, user.password);  
      
      if (!isValid) {
        return done(null, false, { 
          message: 'Incorrect username or password.' 
        });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

/**
 * JWT authentication strategy configuration
 * Verifies JWT token from Authorization header
 * @param {Object} jwtPayload - Decoded JWT payload
 * @param {Function} done - Passport callback
 */
passport.use(new JWTStrategy(
  {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
    algorithms: ['HS256'],
    ignoreExpiration: false
  },
  async (jwtPayload, done) => {
    try {
      const currentTime = Date.now() / 1000;
      if (currentTime > jwtPayload.exp) {
        return done(null, false, { message: 'Token expired' });
      }

      const user = await User.findById(jwtPayload._id);
      
      if (!user) {
        return done(null, false, { 
          message: 'User not found' 
        });
      }

      const sanitizedUser = {
        id: user._id,
        username: user.username,           
        email: user.email,                 
        favoriteMovies: user.favoriteMovies  
      };

      return done(null, sanitizedUser);
    } catch (error) {
      return done(error);
    }
  }
));

/**
 * Serializes user for the session
 * @param {Object} user - User object
 * @param {Function} done - Passport callback
 */
passport.serializeUser((user, done) => {
  done(null, user._id);
});

/**
 * Deserializes user from the session
 * @param {string} id - User ID
 * @param {Function} done - Passport callback
 */
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;