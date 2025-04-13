const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const Movie = require('../models').Movie;

// MongoDB connection
mongoose.connect(process.env.CONNECTION_URI)
    .then(() => {
        console.log('Connected to MongoDB Atlas!');
        console.log('Database:', mongoose.connection.name);
    })
    .catch(err => console.error('Error connecting to MongoDB Atlas:', err));

// Read and parse movies.json
const moviesData = fs.readFileSync(path.join(__dirname, 'movies.json'), 'utf8');
console.log('Read movies.json file');

const movies = moviesData.split('\n')
    .filter(line => line.trim())
    .map(line => {
        const movie = JSON.parse(line);
        console.log('Processing movie:', movie.Title || movie.title);
        // Remove the _id field to let MongoDB generate new ones
        delete movie._id;
        
        // Ensure consistent casing
        if (movie.title) movie.Title = movie.title;
        if (movie.description) movie.Description = movie.description;
        if (movie.imagePath) movie.ImagePath = movie.imagePath;
        if (movie.featured !== undefined) movie.Featured = movie.featured;
        
        if (movie.genre) {
            movie.Genre = {
                Name: movie.genre.name || movie.genre.Name,
                Description: movie.genre.description || movie.genre.Description
            };
        }
        
        if (movie.director) {
            movie.Director = {
                Name: movie.director.name || movie.director.Name,
                Bio: movie.director.bio || movie.director.Bio,
                Birth: movie.director.birth || movie.director.Birth
            };
        }
        
        return movie;
    });

console.log('Processed', movies.length, 'movies');

// Function to import movies
async function importMovies() {
    try {
        // Clear existing movies
        await Movie.deleteMany({});
        console.log('Cleared existing movies');

        // Import new movies
        const importedMovies = await Movie.insertMany(movies);
        console.log(`Successfully imported ${importedMovies.length} movies`);
        console.log('First movie as example:', JSON.stringify(importedMovies[0], null, 2));

        // Verify the movies are in the database
        const count = await Movie.countDocuments();
        console.log(`Total movies in database: ${count}`);
        
        const firstMovie = await Movie.findOne();
        if (firstMovie) {
            console.log('Sample movie from database:', JSON.stringify(firstMovie, null, 2));
        }

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