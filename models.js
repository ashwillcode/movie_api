const mongoose = require('mongoose');

const movieSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    genre: {
        name: String,
        description: String
    },
    director: {
        name: String,
        bio: String,
        birth: Date
    },
    actors: [String],
    imagePath: String,
    featured: Boolean
}, {
    toJSON: {
        transform: function(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
});

const userSchema = mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
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

const Movie = mongoose.model('Movie', movieSchema);
const User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;