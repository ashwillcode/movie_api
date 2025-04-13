// Load environment variables
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Configure allowed origins for CORS
let allowedOrigins = [
    'http://localhost:8080', 
    'http://localhost:1234',
    'http://localhost:4200',  // Angular development server
    'https://filmapi-ab3ce15dfb3f.herokuapp.com',
    'https://film-client.netlify.app'
];

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

// Configure middleware
app.use(express.json());    
app.use(express.urlencoded({ extended: true }));
app.use(morgan('common')); 

// Updated CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      let message = 'The CORS policy for this application doesn\'t allow access from origin ' + origin;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-Content-Type-Options'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Add a specific handler for OPTIONS requests
app.options('*', cors());

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

// Validation middleware
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

// Database connection
mongoose.connect(process.env.CONNECTION_URI)
.then(() => {
    console.log('Connected to MongoDB Atlas!');
    // Log the database name we're connected to
    console.log('Database:', mongoose.connection.name);
    // Log the number of movies in the database
    Models.Movie.countDocuments().then(count => {
        console.log('Number of movies in database:', count);
    });
})
.catch(err => {
    console.error('Error connecting to MongoDB Atlas:', err);
    process.exit(1);
});

// Model setup
const Movies = Models.Movie;
const Users = Models.User;

// User validation schema
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
    birthDate: Joi.date()
        .iso()
        .messages({
            'date.base': 'Please enter a valid date in ISO format (YYYY-MM-DD)'
        })
});

// Movie validation schema
const movieSchema = Joi.object({
    Title: Joi.string()
        .min(1)
        .max(100)
        .required(),
    Description: Joi.string()
        .min(1)
        .max(1000)
        .required(),
    Genre: Joi.object({
        Name: Joi.string().required(),
        Description: Joi.string().required()
    }).required(),
    Director: Joi.object({
        Name: Joi.string().required(),
        Bio: Joi.string().required(),
        Birth: Joi.date().iso().allow(null)
    }).required(),
    ImagePath: Joi.string().uri().required(),
    Featured: Joi.boolean().default(false)
}).unknown(true); // Allow unknown properties to handle both cases

// Create new user
app.post('/users', validateRequest(userSchema), async (req, res) => {
    try {
        const userExists = await Users.findOne({ username: req.body.username });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        
        const user = await Users.create({
            username: req.body.username,
            password: hashedPassword,
            email: req.body.email,
            birthDate: req.body.birthDate
        });

        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                birthDate: user.birthDate,
                favoriteMovies: user.favoriteMovies
            }
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
});

// Get all users
app.get('/users', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const allUsers = await Users.find();
        res.json(allUsers);
    } catch (error) {
        res.status(500).send('Error fetching users: ' + error.message);
    }
});

// Get user by username
app.get('/users/:username', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const user = await Users.findOne({ username: req.params.username });
        if (user) {
            res.json(user);
        } else {
            res.status(404).send('User not found.');
        }
    } catch (error) {
        res.status(500).send('Error fetching user: ' + error.message);
    }
});

// Update user
app.put('/users/:username', 
    passport.authenticate('jwt', { session: false }), 
    validateRequest(userSchema), 
    async (req, res) => {
        try {
            const user = await Users.findOne({ username: req.params.username });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            const updatedUser = await Users.findOneAndUpdate(
                { username: req.params.username },
                {
                    $set: {
                        username: req.body.username,
                        password: hashedPassword,
                        email: req.body.email,
                        birthDate: req.body.birthDate
                    }
                },
                { new: true }
            );

            res.json({
                message: 'User updated successfully',
                user: {
                    id: updatedUser._id,
                    username: updatedUser.username,
                    email: updatedUser.email,
                    birthDate: updatedUser.birthDate,
                    favoriteMovies: updatedUser.favoriteMovies
                }
            });
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ message: 'Error updating user', error: error.message });
        }
    }
);

// Delete user
app.delete('/users/:username', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const user = await Users.findOneAndDelete({ username: req.params.username });
        if (user) {
            res.status(200).send('User has been deregistered.');
        } else {
            res.status(404).send('User not found.');
        }
    } catch (error) {
        res.status(500).send('Error deleting user: ' + error.message);
    }
});

// Add movie to favorites
app.post('/users/:username/favorites', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        // First check if the movieId is a valid ObjectId
        const { movieId } = req.body;
        if (!mongoose.Types.ObjectId.isValid(movieId)) {
            return res.status(400).json({
                message: 'Invalid movie ID format'
            });
        }

        const user = await Users.findOne({ username: req.params.username });
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        const movie = await Movies.findById(movieId);
        if (!movie) {
            return res.status(404).json({
                message: 'Movie not found'
            });
        }

        if (!user.favoriteMovies.includes(movieId)) {
            user.favoriteMovies.push(movieId);
            await user.save();
            return res.status(200).json({
                message: 'Movie added to favorites',
                favoriteMovies: user.favoriteMovies
            });
        } else {
            return res.status(400).json({
                message: 'Movie is already in favorites'
            });
        }
    } catch (error) {
        console.error('Error adding movie to favorites:', error);
        res.status(500).json({
            message: 'Error adding movie to favorites',
            error: error.message
        });
    }
});

// Remove movie from favorites
app.delete('/users/:username/favorites/:movieId', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const user = await Users.findOne({ username: req.params.username });
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                favoriteMovies: []
            });
        }

        const movieId = req.params.movieId;
        if (user.favoriteMovies.includes(movieId)) {
            user.favoriteMovies = user.favoriteMovies.filter(id => id.toString() !== movieId);
            await user.save();
            
            return res.status(200).json({
                message: 'Movie removed from favorites',
                favoriteMovies: user.favoriteMovies
            });
        } else {
            return res.status(404).json({
                message: 'Movie not found in favorites',
                favoriteMovies: user.favoriteMovies
            });
        }
    } catch (error) {
        console.error('Error removing movie from favorites:', error);
        res.status(500).json({
            message: 'Error removing movie from favorites',
            error: error.message,
            favoriteMovies: user?.favoriteMovies || []
        });
    }
});

// Get all movies
app.get('/movies', 
    passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const movies = await Movies.find();
        res.status(200).json(movies);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error: ' + error);
    }
});

// Get movie by ID
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

// Get movies by genre
app.get('/movies/genre/:genreName', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const movies = await Movies.find({ 'Genre.Name': req.params.genreName });
        res.status(200).json(movies);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error: ' + error);
    }
});

// Get movies by director
app.get('/movies/director/:directorName', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const movies = await Movies.find({ 'Director.Name': req.params.directorName });
        res.status(200).json(movies);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error: ' + error);
    }
});

// Welcome route
app.get('/', (req, res) => {
    res.send('Welcome to the Movie API!');
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start server
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log('Listening on Port ' + port);
});