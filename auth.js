/**
 * @fileoverview Authentication module for the Movie API.
 * @module auth
 */

const jwt = require('jsonwebtoken');
const passport = require('passport');
const router = require('express').Router();
const bcrypt = require('bcryptjs');
require('./passport');

/** Secret key for JWT signing and verification */
const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';

/**
 * Generates a JWT token for a user
 * @param {Object} user - The user object to generate token for
 * @param {string} user._id - MongoDB ID of the user
 * @param {string} user.username - Username of the user
 * @param {string} user.email - Email of the user
 * @param {Array} user.favoriteMovies - Array of user's favorite movie IDs
 * @returns {string} JWT token
 */
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

/**
 * Login endpoint that authenticates user and returns JWT token
 * @name POST/login
 * @function
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.username - Username for login
 * @param {string} req.body.password - Password for login
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} User object and JWT token
 */
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