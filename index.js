const express = require('express');
const morgan = require('morgan'); 
const fs = require('fs');
const mongoose = require('mongoose');
const Joi = require('joi');
const Models = require('./models.js');  // Assuming models.js is the correct file for your models

const app = express();

// Connect to MongoDB database
mongoose.connect('mongodb://localhost:27017/movies_api_mongo', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Verify MongoDB connection
const db = mongoose.connection;
db.on('error', (error) => console.error('Connection error:', error));
db.once('open', () => {
    console.log('Connected to MongoDB!');
});

// Middleware
app.use(morgan('common')); // Logging
app.use(express.json());    // Parsing JSON data in requests
app.use(express.urlencoded({ extended: true })); // Parsing URL-encoded data
app.use((req, res, next) => {
    const log = `${new Date().toISOString()} - ${req.method} ${req.url}\n`;
    fs.appendFile('log.txt', log, (err) => {
        if (err) {
            console.error('Logging error:', err);
        }
    });
    next();
});

// Model Setup
const Movies = Models.Movie;
const Users = Models.User;

// In-memory movie data
const movies = [
    {
        title: 'Inception',
        director: 'Christopher Nolan',
        description: 'A skilled thief...',
        genre: 'Science Fiction',
        featured: true,
        imageURL: 'https://m.media-amazon.com/images/I/51fKZ2s8XBL._AC_.jpg'
    },
    // More movies...
];

// User data validation schema
const userSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required()
});

// Routes
// POST - Create user
app.post('/users', (req, res) => {
    const { error } = userSchema.validate(req.body); 
    if (error) {
        return res.status(400).send(error.details[0].message); 
    }

    const { username, email } = req.body;
    const userExists = users.some(user => user.email.toLowerCase() === email.toLowerCase());
    if (userExists) {
        return res.status(400).send('User already exists with this email.');
    }

    const newUser = {
        id: users.length + 1,
        username,
        email,
        favorites: []
    };
    users.push(newUser);
    res.status(201).json(newUser);
});

// GET - List users
app.get('/users', (req, res) => {
    res.json(users);
});

// GET - Find user by username
app.get('/users/:username', (req, res) => {
    const user = users.find((u) => u.username.toLowerCase() === req.params.username.toLowerCase());
    if (user) {
        res.json(user);
    } else {
        res.status(404).send('User not found.');
    }
});

// PUT - Update user by username
app.put('/users/:username', (req, res) => {
    const user = users.find(u => u.username.toLowerCase() === req.params.username.toLowerCase());
    if (!user) {
        return res.status(404).send('User not found.');
    }

    const { error } = userSchema.validate(req.body); 
    if (error) {
        return res.status(400).send(error.details[0].message); 
    }

    user.username = req.body.username; 
    user.email = req.body.email;

    res.status(200).json(user);
});

// DELETE - Delete user by username
app.delete('/users/:username', (req, res) => {
    const userIndex = users.findIndex((u) => u.username.toLowerCase() === req.params.username.toLowerCase());
    if (userIndex !== -1) {
        users.splice(userIndex, 1);
        res.status(200).send('User has been deregistered.');
    } else {
        res.status(404).send('User not found.');
    }
});

// POST - Add a movie to user's favorites
app.post('/users/:username/favorites', (req, res) => {
    const user = users.find((u) => u.username.toLowerCase() === req.params.username.toLowerCase());
    if (!user) {
        return res.status(404).send('User not found.');
    }

    const { title } = req.body;
    const movie = movies.find((m) => m.title.toLowerCase() === title.toLowerCase());
    if (!movie) {
        return res.status(404).send('Movie not found.');
    }

    if (!user.favorites) {
        user.favorites = [];
    }

    if (!user.favorites.includes(title)) {
        user.favorites.push(title);
        return res.status(200).send(`Movie "${title}" added to favorites.`);
    } else {
        return res.status(400).send('Movie is already in favorites.');
    }
});

// DELETE - Remove a movie from user's favorites
app.delete('/users/:username/favorites', (req, res) => {
    const user = users.find((u) => u.username.toLowerCase() === req.params.username.toLowerCase());
    if (!user) {
        return res.status(404).send('User not found.');
    }

    const { title } = req.body;

    if (user.favorites && user.favorites.includes(title)) {
        user.favorites = user.favorites.filter((fav) => fav !== title);
        return res.status(200).send(`Movie "${title}" removed from favorites.`);
    } else {
        return res.status(404).send('Movie not found in favorites.');
    }
});

// GET - List all movies
app.get('/movies', (req, res) => {
    res.json(movies);
});

// Basic Routes
app.get('/', (req, res) => {
    res.send('Welcome to the Movie API!');
});

// Start server
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Your app is listening on port ${PORT}`);
});
