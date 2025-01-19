// Require Mongoose package
const mongoose = require('mongoose');

// Define the schema for the Movies collection
const movieSchema = mongoose.Schema({
    Title: { type: String, required: true },
    Description: { type: String, required: true },
    Genre: {
        Name: String,
        Description: String
    },
    Director: {
        Name: String,
        Bio: String,
        Birth: Date
    },
    Actors: [String],
    ImagePath: String,
    Featured: Boolean
});

// Define the schema for the Users collection
const userSchema = mongoose.Schema({
    Username: { type: String, required: true },
    Password: { type: String, required: true },
    Email: { type: String, required: true },
    Birthday: Date,
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

// Create the models from the schemas
const Movie = mongoose.model('Movie', movieSchema);
const User = mongoose.model('User', userSchema);

// Export the models for use in other files
module.exports.Movie = Movie;
module.exports.User = User;
