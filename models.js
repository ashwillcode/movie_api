const mongoose = require('mongoose');

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

const Movie = mongoose.model('Movie', movieSchema);
const User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;