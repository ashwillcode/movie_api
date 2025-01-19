const jwt = require('jsonwebtoken');
const passport = require('passport');
const router = require('express').Router();
const bcrypt = require('bcryptjs');
require('./passport');

// Move this to an environment variable in production
const jwtSecret = 'your_jwt_secret';

const generateJWTToken = (user) => {
  return jwt.sign(user.toJSON(), jwtSecret, {
    subject: user.Username,
    expiresIn: '7d',
    algorithm: 'HS256'
  });
};

// POST login route with error handling
router.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (error, user, info) => {
    if (error) {
      return next(error);
    }
    if (!user) {
      return res.status(400).json({
        message: 'Incorrect username or password.',
        status: 400
      });
    }
    
    try {
      const token = generateJWTToken(user);
      
      // Remove sensitive data before sending the response
      const sanitizedUser = {
        _id: user._id,
        Username: user.Username,
        Email: user.Email,
        FavoriteMovies: user.FavoriteMovies
      };

      return res.json({
        user: sanitizedUser,
        token: token
      });
    } catch (err) {
      return next(err);
    }
  })(req, res, next);
});

module.exports = router;