let allowedOrigins = ['http://localhost:8080', 'http://localhost:1234', 'https://your-movie-app.herokuapp.com'];

const express = require('express');
const morgan = require('morgan'); 
const fs = require('fs');
const mongoose = require('mongoose');
const Joi = require('joi');
const Models = require('./models.js');
const passport = require('passport');
const cors = require('cors');
const bcrypt = require('bcryptjs');

require('./passport');
const auth = require('./auth');

const app = express();

// Middleware
app.use(express.json());    
app.use(express.urlencoded({ extended: true }));
app.use(morgan('common')); 
app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn't found on the list of allowed origins
      let message = 'The CORS policy for this application doesn\'t allow access from origin ' + origin;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  }
}));
app.use(passport.initialize());
app.use((req, res, next) => {
    const log = `${new Date().toISOString()} - ${req.method} ${req.url}\n`;
    fs.appendFile('log.txt', log, (err) => {
        if (err) {
            console.error('Logging error:', err);
        }
    });
    next();
});
const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            });
        }
        next();
    };
};
app.use('/', auth);

// Connect to MongoDB database
mongoose.connect(process.env.CONNECTION_URI || 'mongodb://localhost:27017/movies_api_mongo', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
});

const db = mongoose.connection;
db.on('error', (error) => console.error('Connection error:', error));
db.once('open', () => {
    console.log('Connected to MongoDB!');
});

// Model Setup
const Movies = Models.Movie;
const Users = Models.User;

// Validation schema
// User validation schema for any endpoints that create/update users
const userSchema = Joi.object({
    username: Joi.string()
        .min(3)
        .max(30)
        .pattern(/^[a-zA-Z0-9_]*$/)
        .required()
        .messages({
            'string.pattern.base': 'Username can only contain alphanumeric characters and underscores',
            'string.min': 'Username must be at least 3 characters long',
            'string.max': 'Username cannot be longer than 30 characters'
        }),
    password: Joi.string()
        .pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
        .required()
        .messages({
            'string.pattern.base': 'Password must contain at least 8 characters, one letter, one number and one special character'
        }),
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Please enter a valid email address'
        }),
    birthday: Joi.date()
        .iso()
        .messages({
            'date.base': 'Please enter a valid date in ISO format (YYYY-MM-DD)'
        })
});

// Movie validation schema for any endpoints that create/update movies
const movieSchema = Joi.object({
    title: Joi.string()
        .min(1)
        .max(100)
        .required(),
    description: Joi.string()
        .min(1)
        .max(1000)
        .required(),
    genre: Joi.object({
        name: Joi.string().required(),
        description: Joi.string()
    }).required(),
    director: Joi.object({
        name: Joi.string().required(),
        bio: Joi.string(),
        birthYear: Joi.number(),
        deathYear: Joi.number()
    }).required(),
    imageURL: Joi.string().uri(),
    featured: Joi.boolean()
});
// Routes
// POST - Create user
app.post('/users', validateRequest(userSchema), async (req, res) => {
    try {
        // Check if user already exists
        const userExists = await Users.findOne({ Username: req.body.Username });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(req.body.Password, 10);
        
        // Create new user with hashed password
        const user = await Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
        });

        // Return success response
        res.status(201).json({
            message: 'User created successfully',
            user: {
                Username: user.Username,
                Email: user.Email,
                Birthday: user.Birthday,
                FavoriteMovies: user.FavoriteMovies
            }
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Error creating user' });
    }
});

// GET - List users
app.get('/users', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const allUsers = await Users.find();
        res.json(allUsers);
    } catch (error) {
        res.status(500).send('Error fetching users: ' + error.message);
    }
});

// GET - Find user by username
app.get('/users/:username', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const user = await Users.findOne({ Username: req.params.username });
        if (user) {
            res.json(user);
        } else {
            res.status(404).send('User not found.');
        }
    } catch (error) {
        res.status(500).send('Error fetching user: ' + error.message);
    }
});

// PUT - Update user by username
app.put('/users/:username', 
    passport.authenticate('jwt', { session: false }), 
    validateRequest(userSchema), 
    async (req, res) => {
        try {
            // Check if user exists
            const user = await Users.findOne({ Username: req.params.username });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Hash the new password if it's being updated
            const hashedPassword = await bcrypt.hash(req.body.Password, 10);

            // Update user information
            const updatedUser = await Users.findOneAndUpdate(
                { Username: req.params.username },
                {
                    $set: {
                        Username: req.body.Username,
                        Password: hashedPassword,
                        Email: req.body.Email,
                        Birthday: req.body.Birthday
                    }
                },
                { new: true } // This option returns the updated document
            );

            // Return success response
            res.json({
                message: 'User updated successfully',
                user: {
                    Username: updatedUser.Username,
                    Email: updatedUser.Email,
                    Birthday: updatedUser.Birthday,
                    FavoriteMovies: updatedUser.FavoriteMovies
                }
            });
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ message: 'Error updating user' });
        }
    }
);

// DELETE - Delete user by username
app.delete('/users/:username', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const user = await Users.findOneAndDelete({ Username: req.params.username });
        if (user) {
            res.status(200).send('User has been deregistered.');
        } else {
            res.status(404).send('User not found.');
        }
    } catch (error) {
        res.status(500).send('Error deleting user: ' + error.message);
    }
});

// POST - Add a movie to user's favorites
app.post('/users/:username/favorites', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const user = await Users.findOne({ Username: req.params.username });
        if (!user) {
            return res.status(404).send('User not found.');
        }

        const { movieId } = req.body;
        const movie = await Movies.findById(movieId);
        if (!movie) {
            return res.status(404).send('Movie not found.');
        }

        if (!user.FavoriteMovies.includes(movieId)) {
            user.FavoriteMovies.push(movieId);
            await user.save();
            return res.status(200).send(`Movie added to favorites.`);
        } else {
            return res.status(400).send('Movie is already in favorites.');
        }
    } catch (error) {
        res.status(500).send('Error adding movie to favorites: ' + error.message);
    }
});

// DELETE - Remove a movie from user's favorites
app.delete('/users/:username/favorites/:movieId', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const user = await Users.findOne({ Username: req.params.username });
        if (!user) {
            return res.status(404).send('User not found.');
        }

        const movieId = req.params.movieId;
        if (user.FavoriteMovies.includes(movieId)) {
            user.FavoriteMovies = user.FavoriteMovies.filter(id => id.toString() !== movieId);
            await user.save();
            return res.status(200).send('Movie removed from favorites.');
        } else {
            return res.status(404).send('Movie not found in favorites.');
        }
    } catch (error) {
        res.status(500).send('Error removing movie from favorites: ' + error.message);
    }
});

// GET - List all movies
app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const movies = await Movies.find();
        res.status(200).json(movies);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error: ' + error);
    }
});

// GET - Movie by ID
app.get('/movies/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const movie = await Movies.findById(req.params.id);
        if (movie) {
            res.status(200).json(movie);
        } else {
            res.status(404).send('Movie not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error: ' + error);
    }
});

// GET - Movies by genre
app.get('/movies/genre/:genreName', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const movies = await Movies.find({ 'Genre.Name': req.params.genreName });
        res.status(200).json(movies);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error: ' + error);
    }
});

// GET - Movies by director
app.get('/movies/director/:directorName', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const movies = await Movies.find({ 'Director.Name': req.params.directorName });
        res.status(200).json(movies);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error: ' + error);
    }
});

// Basic Routes
app.get('/', (req, res) => {
    res.send('Welcome to the Movie API!');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start server
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log('Listening on Port ' + port);
});