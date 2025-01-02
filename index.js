const express = require('express');
const morgan = require('morgan'); 
const app = express();

app.use(morgan('common'));

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

app.use(express.json());

let users = [];

app.post('/users', (req, res) => {
    const newUser = req.body;

    if (!newUser.username || !newUser.email) {
        return res.status(400).send('Missing username or email in request body.');
    }

    const userExists = users.some((user) => user.email === newUser.email);
    if (userExists) {
        return res.status(400).send('User already exists with this email.');
    }

    newUser.id = users.length + 1;
    users.push(newUser);
    res.status(201).json(newUser); 
});

app.get('/users', (req, res) => {
    res.json(users);
});

app.get('/users/:username', (req, res) => {
    const user = users.find((u) => u.username.toLowerCase() === req.params.username.toLowerCase());
    if (user) {
        res.json(user);
    } else {
        res.status(404).send('User not found.');
    }
});

app.put('/users/:username', (req, res) => {
    const currentUsername = req.params.username.toLowerCase(); 
    const updatedUsername = req.body.username;

    const user = users.find((u) => u.username.toLowerCase() === currentUsername);
    if (!user) {
        return res.status(404).send('User not found.');
    }

    user.username = updatedUsername;

    res.status(200).json(user)
});

app.delete('/users/:username', (req, res) => {
    const userIndex = users.findIndex((u) => u.username.toLowerCase() === req.params.username.toLowerCase());
    if (userIndex !== -1) {
        users.splice(userIndex, 1);
        res.status(200).send('User has been deregistered.');
    } else {
        res.status(404).send('User not found.');
    }
});

app.post('/users/:username/favorites', (req, res) => {
    console.log('Request received:', req.params.username, req.body);

    const user = users.find((u) => u.username.toLowerCase() === req.params.username.toLowerCase());
    if (!user) {
        console.error('User not found');
        return res.status(404).send('User not found.');
    }

    const { title } = req.body;
    console.log('Movie title:', title);

    const movie = movies.find((m) => m.title.toLowerCase() === title.toLowerCase());
    if (!movie) {
        console.error('Movie not found');
        return res.status(404).send('Movie not found.');
    }

    if (!user.favorites) {
        user.favorites = [];
    }

    console.log('Current favorites:', user.favorites);

    if (!user.favorites.includes(title)) {
        user.favorites.push(title);
        console.log('Movie added to favorites:', user.favorites);
        return res.status(200).send(`Movie "${title}" added to favorites.`);
    } else {
        console.error('Movie is already in favorites');
        return res.status(400).send('Movie is already in favorites.');
    }
});

app.delete('/users/:username/favorites', (req, res) => {
    const user = users.find((u) => u.username.toLowerCase() === req.params.username.toLowerCase());
    if (!user) {
        return res.status(404).send('User not found.');
    }

    const { title } = req.body;

    if (user.favorites && user.favorites.includes(title)) {
        user.favorites = user.favorites.filter((fav) => fav !== title);
        res.status(200).send(`Movie "${title}" removed from favorites.`);
    } else {
        res.status(404).send('Movie not found in favorites.');
    }
});

app.get('/movies', (req, res) => {
    res.json(movies);
});

app.get('/', (req, res) => {
    res.send('Welcome to the Movie API!');
});

app.get('/movies/:title', (req, res) => {
    const movie = movies.find((m) => m.title.toLowerCase() === req.params.title.toLowerCase());
    if (movie) {
        res.json(movie);
    } else {
        res.status(404).send('Movie not found.');
    }
});

app.get('/genres/:name', (req, res) => {
    const genreMovies = movies.filter((m) => m.genre.toLowerCase() === req.params.name.toLowerCase());
    if (genreMovies.length > 0) {
        res.json(genreMovies);
    } else {
        res.status(404).send('Genre not found.');
    }
});

app.get('/directors/:name', (req, res) => {
    const directorMovies = movies.filter((m) => m.director.toLowerCase() === req.params.name.toLowerCase());
    if (directorMovies.length > 0) {
        res.json({
            director: req.params.name,
            movies: directorMovies.map((m) => m.title),
        });
    } else {
        res.status(404).send('Director not found.');
    }
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


