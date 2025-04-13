/**
 * @fileoverview Defines the MongoDB schemas and models for the Movie API.
 * @module models
 */

const mongoose = require('mongoose');

/**
 * Schema definition for movies in the database.
 * @typedef {Object} MovieSchema
 * @property {string} Title - The title of the movie
 * @property {string} Description - A detailed description of the movie
 * @property {Object} Genre - The genre information
 * @property {string} Genre.Name - The name of the genre
 * @property {string} Genre.Description - Description of the genre
 * @property {Object} Director - Information about the movie's director
 * @property {string} Director.Name - The director's name
 * @property {string} Director.Bio - The director's biography
 * @property {Date} Director.Birth - The director's birth date
 * @property {string} ImagePath - Path to the movie's poster image
 * @property {boolean} Featured - Whether the movie is featured
 */
const movieSchema = mongoose.Schema({
    Title: { type: String, required: true },
    Description: { type: String, required: true },
    Genre: {
        Name: { type: String, required: true },
        Description: { type: String, required: true }
    },
    Director: {
        Name: { type: String, required: true },
        Bio: { type: String, required: true },
        Birth: { type: Date }
    },
    ImagePath: { type: String, required: true },
    Featured: { type: Boolean, default: false }
}, {
    toJSON: {
        transform: function(doc, ret) {
            // Ensure consistent casing for all properties
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            
            // Ensure Genre and Director are properly structured
            if (ret.Genre) {
                ret.Genre.Name = ret.Genre.Name || ret.Genre.name;
                ret.Genre.Description = ret.Genre.Description || ret.Genre.description;
                delete ret.Genre.name;
                delete ret.Genre.description;
            }
            
            if (ret.Director) {
                ret.Director.Name = ret.Director.Name || ret.Director.name;
                ret.Director.Bio = ret.Director.Bio || ret.Director.bio;
                ret.Director.Birth = ret.Director.Birth || ret.Director.birth;
                delete ret.Director.name;
                delete ret.Director.bio;
                delete ret.Director.birth;
            }
            
            // Ensure other properties are properly cased
            ret.Title = ret.Title || ret.title;
            ret.Description = ret.Description || ret.description;
            ret.ImagePath = ret.ImagePath || ret.imagePath;
            ret.Featured = ret.Featured !== undefined ? ret.Featured : ret.featured;
            
            // Remove lowercase properties
            delete ret.title;
            delete ret.description;
            delete ret.imagePath;
            delete ret.featured;
            
            return ret;
        }
    }
});

/**
 * Schema definition for users in the database.
 * @typedef {Object} UserSchema
 * @property {string} username - Unique username for the user
 * @property {string} password - Hashed password (not returned in responses)
 * @property {string} email - User's email address
 * @property {Date} birthDate - User's date of birth
 * @property {Array<mongoose.Schema.Types.ObjectId>} favoriteMovies - Array of references to favorite movies
 */
const userSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    birthDate: Date,
    favoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
}, {
    toJSON: {
        transform: function(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            delete ret.password; // Never send password in responses
            return ret;
        }
    }
});

/**
 * Movie model for database operations
 * @type {mongoose.Model}
 */
const Movie = mongoose.model('Movie', movieSchema);

/**
 * User model for database operations
 * @type {mongoose.Model}
 */
const User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;