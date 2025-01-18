# Movie API

## Description

The **Movie API** is a RESTful service that allows users to:
- Retrieve details about movies, genres, and directors.
- Manage user accounts, including registration, updates, and deregistration.
- Add or remove movies from a user's list of favorites.

This API is designed for a movie database application and serves as a backend for interacting with movie data.

---

## Table of Contents

1. [Features](#features)
2. [Endpoints](#endpoints)
3. [Installation](#installation)
4. [Usage](#usage)
5. [Technologies](#technologies)
6. [License](#license)

---

## Features

- **Movies**: Retrieve all movies, get details by title, and filter by genre or director.
- **Users**: Register new users, update user information, and manage user accounts.
- **Favorites**: Add or remove movies from a user's list of favorites.
- **Error Handling**: Provides meaningful error responses for invalid requests.
- **Logging**: Tracks all incoming requests with timestamps and saves them to `log.txt`.

---

## Endpoints

### Movies
- **GET /movies**: Returns a list of all movies.
- **GET /movies/:title**: Returns details of a specific movie by title.
- **GET /genres/:name**: Returns all movies in a specific genre.
- **GET /directors/:name**: Returns movies by a specific director.

### Users
- **POST /users**: Registers a new user.
- **GET /users**: Retrieves all registered users.
- **GET /users/:username**: Retrieves a specific user by username.
- **PUT /users/:username**: Updates user information (e.g., username).
- **DELETE /users/:username**: Deletes a user account.

### Favorites
- **POST /users/:username/favorites**: Adds a movie to a user's list of favorites.
- **DELETE /users/:username/favorites**: Removes a movie from a user's list of favorites.

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/movie_api.git
2. Navigate to the project directory:
    cd movie_api
3. Install dependancies:
    npm install 
4. Start the server: 
    node index.js 

## Usage 

1. Ensure Node.js is installed on your system. 
2. Run the server. 
3. use an API testing tool to interact with endpoints. 

## Technologies 

- Node.js: JavaScript runtime environment.
- Express.js: Web framework for Node.js. 
- Morgan: Logging middleware. 
- File System(fs): Logging request data to log.txt. 

## License



