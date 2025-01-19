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
        description: 'A skilled thief, the absolute best in the dangerous art of extraction, stealing valuable secrets from deep within the subconscious during the dream state.',
        genre: 'Science Fiction',
        featured: true,
        imageURL: 'https://m.media-amazon.com/images/I/51fKZ2s8XBL._AC_.jpg'
    },
    {
        title: 'The Dark Knight',
        director: 'Christopher Nolan',
        description: 'When the menace known as The Joker emerges, he causes chaos and havoc among the people of Gotham.',
        genre: 'Action',
        featured: true,
        imageURL: 'https://m.media-amazon.com/images/I/51v5ZpFyaFL._AC_.jpg'
    },
    {
        title: 'Interstellar',
        director: 'Christopher Nolan',
        description: 'A group of astronauts travel through a wormhole in search of a new home for humanity.',
        genre: 'Adventure',
        featured: false,
        imageURL: 'https://m.media-amazon.com/images/I/71y7xV-OpML._AC_SY679_.jpg'
    },
    {
        title: 'The Godfather',
        director: 'Francis Ford Coppola',
        description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
        genre: 'Crime',
        featured: true,
        imageURL: 'https://m.media-amazon.com/images/I/41--oRi8a-L._AC_.jpg'
    },
    {
        title: 'Pulp Fiction',
        director: 'Quentin Tarantino',
        description: 'The lives of two mob hitmen, a boxer, a gangster, and his wife intertwine in a series of criminal events.',
        genre: 'Crime',
        featured: true,
        imageURL: 'https://m.media-amazon.com/images/I/51zUbui+gbL._AC_.jpg'
    },
    {
        title: 'The Shawshank Redemption',
        director: 'Frank Darabont',
        description: 'Two imprisoned men bond over several years, finding solace and eventual redemption through acts of common decency.',
        genre: 'Drama',
        featured: true,
        imageURL: 'https://m.media-amazon.com/images/I/51NiGlapXlL._AC_.jpg'
    },
    {
        title: 'Fight Club',
        director: 'David Fincher',
        description: 'An insomniac office worker and a soap salesman form an underground fight club that evolves into much more.',
        genre: 'Drama',
        featured: false,
        imageURL: 'https://m.media-amazon.com/images/I/51v5ZpFyaFL._AC_.jpg'
    },
    {
        title: 'Forrest Gump',
        director: 'Robert Zemeckis',
        description: 'The story of Forrest Gump, a man with a low IQ who achieves great things in life.',
        genre: 'Drama',
        featured: true,
        imageURL: 'https://m.media-amazon.com/images/I/41cXB1tyoOL._AC_.jpg'
    },
    {
        title: 'The Matrix',
        director: 'The Wachowskis',
        description: 'A computer hacker learns about the true nature of his reality and his role in the war against its controllers.',
        genre: 'Science Fiction',
        featured: false,
        imageURL: 'https://m.media-amazon.com/images/I/51EG732BV3L._AC_.jpg'
    },
    {
        title: 'The Lord of the Rings: The Return of the King',
        director: 'Peter Jackson',
        description: 'Gandalf and Aragorn lead the World of Men against Sauron\'s army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.',
        genre: 'Fantasy',
        featured: true,
        imageURL: 'https://m.media-amazon.com/images/I/51Qvs9i5a%2BL._AC_.jpg'
    }
];

// User data validation schema
const userSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required()
});

// Routes
// POST - Create user
app.post('/users', async (req, res) => {
    const { error } = userSchema.validate(req.body); 
    if (error) {
        return res.status(400).send(error.details[0].message); 
    }

    const { username, email } = req.body;
    try {
        const userExists = await Users.findOne({ Email: email }); // Use MongoDB query to check if user exists
        if (userExists) {
            return res.status(400).send('User already exists with this email.');
        }

        const newUser = new Users({
            Username: username,
            Email: email,
            Password: req.body.Password, // Make sure password is hashed before storing
            FavoriteMovies: []
        });
        
        await newUser.save(); // Save user to MongoDB

        res.status(201).json(newUser); // Return the created user
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('Error creating user');
    }
});

// GET - List users
app.get('/users', async (req, res) => {
    try {
        const allUsers = await Users.find(); // Fetch all users from the database
        res.json(allUsers);
    } catch (error) {
        res.status(500).send('Error fetching users: ' + error.message);
    }
});

// GET - Find user by username
app.get('/users/:username', async (req, res) => {
    try {
        const user = await Users.findOne({ Username: req.params.username }); // Find user by username
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
app.put('/users/:username', async (req, res) => {
    try {
        const user = await Users.findOne({ Username: req.params.username }); // Find user by username
        if (!user) {
            return res.status(404).send('User not found.');
        }

        const { error } = userSchema.validate(req.body); 
        if (error) {
            return res.status(400).send(error.details[0].message); 
        }

        user.Username = req.body.username; 
        user.Email = req.body.email;

        const updatedUser = await user.save(); // Save updated user

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).send('Error updating user: ' + error.message);
    }
});

// DELETE - Delete user by username
app.delete('/users/:username', async (req, res) => {
    try {
        const user = await Users.findOneAndDelete({ Username: req.params.username }); // Delete user by username
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
app.post('/users/:username/favorites', async (req, res) => {
    try {
        const user = await Users.findOne({ Username: req.params.username });
        if (!user) {
            return res.status(404).send('User not found.');
        }

        const { title } = req.body;
        const movie = movies.find((m) => m.title.toLowerCase() === title.toLowerCase());
        if (!movie) {
            return res.status(404).send('Movie not found.');
        }

        if (!user.FavoriteMovies) {
            user.FavoriteMovies = [];
        }

        if (!user.FavoriteMovies.includes(movie._id)) {
            user.FavoriteMovies.push(movie._id); // Add movie to favorites using ObjectId
            await user.save(); // Save updated user
            return res.status(200).send(`Movie "${title}" added to favorites.`);
        } else {
            return res.status(400).send('Movie is already in favorites.');
        }
    } catch (error) {
        res.status(500).send('Error adding movie to favorites: ' + error.message);
    }
});

// DELETE - Remove a movie from user's favorites
app.delete('/users/:username/favorites', async (req, res) => {
    try {
        const user = await Users.findOne({ Username: req.params.username });
        if (!user) {
            return res.status(404).send('User not found.');
        }

        const { title } = req.body;
        const movie = movies.find((m) => m.title.toLowerCase() === title.toLowerCase());

        if (user.FavoriteMovies && user.FavoriteMovies.includes(movie._id)) {
            user.FavoriteMovies = user.FavoriteMovies.filter(fav => fav.toString() !== movie._id.toString()); // Remove movie from favorites
            await user.save(); // Save updated user
            return res.status(200).send(`Movie "${title}" removed from favorites.`);
        } else {
            return res.status(404).send('Movie not found in favorites.');
        }
    } catch (error) {
        res.status(500).send('Error removing movie from favorites: ' + error.message);
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
