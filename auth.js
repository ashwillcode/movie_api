const jwt = require('jsonwebtoken');
const passport = require('passport');
const router = require('express').Router();
const bcrypt = require('bcryptjs');
require('./passport');

const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';

const generateJWTToken = (user) => {
  return jwt.sign({
    _id: user._id,
    username: user.username,
    email: user.email,
    favoriteMovies: user.favoriteMovies
  }, jwtSecret, {
    subject: user.username,
    expiresIn: '7d',
    algorithm: 'HS256'
  });
};

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
      
      const sanitizedUser = {
        id: user._id,
        username: user.username,
        email: user.email,
        favoriteMovies: user.favoriteMovies
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