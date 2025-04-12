const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const Movie = require('../models').Movie;

// MongoDB connection
mongoose.connect(process.env.CONNECTION_URI)
    .then(() => console.log('Connected to MongoDB Atlas!'))
    .catch(err => console.error('Error connecting to MongoDB Atlas:', err));

// Read and parse movies.json
const moviesData = fs.readFileSync(path.join(__dirname, 'movies.json'), 'utf8');
const movies = moviesData.split('\n')
    .filter(line => line.trim())
    .map(line => {
        const movie = JSON.parse(line);
        // Remove the _id field to let MongoDB generate new ones
        delete movie._id;
        return movie;
    });

// Function to import movies
async function importMovies() {
    try {
        // Clear existing movies
        await Movie.deleteMany({});
        console.log('Cleared existing movies');

        // Import new movies
        const importedMovies = await Movie.insertMany(movies);
        console.log(`Successfully imported ${importedMovies.length} movies`);

        // Close the connection
        await mongoose.connection.close();
        console.log('Database connection closed');
    } catch (error) {
        console.error('Error importing movies:', error);
        process.exit(1);
    }
}

// Run the import
importMovies(); 