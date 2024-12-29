const express = require('express');
const morgan = require('morgan'); 
const app = express();

app.use(morgan('common'));

const movies = [
    { title: 'Inception', director: 'Christopher Nolan' },
    { title: 'The Dark Knight', director: 'Christopher Nolan' },
    { title: 'Interstellar', director: 'Christopher Nolan' },
    { title: 'The Godfather', director: 'Francis Ford Coppola' },
    { title: 'Pulp Fiction', director: 'Quentin Tarantino' },
    { title: 'The Shawshank Redemption', director: 'Frank Darabont' },
    { title: 'Fight Club', director: 'David Fincher' },
    { title: 'Forrest Gump', director: 'Robert Zemeckis' },
    { title: 'The Matrix', director: 'The Wachowskis' },
    { title: 'The Lord of the Rings: The Return of the King', director: 'Peter Jackson' }
];

app.get('/movies', (req, res) => {
    res.json(movies);
});

app.get('/', (req, res) => {
    res.send('Welcome to the Movie API!');
});

app.use(express.static('public'));

app.get('/error', (req, res) => {
    throw new Error('Simulated Error!');
});

app.use((req, res, next) => {
    res.status(404).send('Oops! The page you are looking for does not exist.');
});

app.use((err, req, res, next) => {
    console.error(err.stack); 
    res.status(500).send('Something went wrong!'); 
});

const PORT = 8080; 
app.listen(PORT, () => {
    console.log(`Your app is listening on port ${PORT}`);
});


