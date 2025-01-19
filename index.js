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
app.use(cors());
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
app.use('/', auth);

// Connect to MongoDB database
mongoose.connect('mongodb://localhost:27017/movies_api_mongo', {
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

// User data validation schema
const userSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
});

// Routes
// POST - Create user
app.post('/users', async (req, res) => {
    const { error } = userSchema.validate(req.body); 
    if (error) {
        return res.status(400).send(error.details[0].message); 
    }

    const { username, email, password } = req.body;
    try {
        const userExists = await Users.findOne({ Email: email });
        if (userExists) {
            return res.status(400).send('User already exists with this email.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new Users({
            Username: username,
            Email: email,
            Password: hashedPassword,
            FavoriteMovies: []
        });
        
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('Error creating user');
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
app.put('/users/:username', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const user = await Users.findOne({ Username: req.params.username });
        if (!user) {
            return res.status(404).send('User not found.');
        }

        const { error } = userSchema.validate(req.body); 
        if (error) {
            return res.status(400).send(error.details[0].message); 
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        user.Username = req.body.username;
        user.Email = req.body.email;
        user.Password = hashedPassword;

        const updatedUser = await user.save();
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).send('Error updating user: ' + error.message);
    }
});

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
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Your app is listening on port ${PORT}`);
});