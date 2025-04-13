# Movie API

## Description

The **Movie API** is a RESTful API built with Node.js and Express that provides access to a movie database. It allows users to register, authenticate, and manage their favorite movies list. The API uses JWT token-based authentication and includes data validation, password hashing, and proper error handling.

---

## Table of Contents

1. [Features](#features)
2. [Technical Requirements](#technical-requirements)
3. [Dependencies](#dependencies)
4. [Endpoints](#endpoints)
5. [Installation](#installation)
6. [Usage](#usage)
7. [Hosting](#hosting)
8. [Documentation](#documentation)
9. [Version](#version)
10. [Author](#author)
11. [License](#license)

---

## Features

- **Movies**: Retrieve all movies, get details by title, and filter by genre or director.
- **Users**: Register new users, update user information, and manage user accounts, authentication and authorization using JWT tokens. 
- **Password**: Password hashing for secure user data storage. 
- **Favorites**: Add or remove movies from a user's list of favorites.
- **Error Handling**: Provides meaningful error responses for invalid requests.
- **Logging**: Tracks all incoming requests with timestamps and saves them to `log.txt`.
- **Input Validation**: Input validation and sanitization. 
- **CORS**: Support for cross-origin requests.
- **Documentation**: Comprehensive JSDoc documentation for all modules and functions.

---

## Technical Requirements

- Node.js
- Express
- MongoDB
- Mongoose
- Passport JWT
- bcryptjs
- CORS
- Express Validator
- JSDoc (for documentation)

---

## Dependencies

```json
{
  "bcryptjs": "^2.4.3",
  "body-parser": "^1.20.2",
  "cors": "^2.8.5",
  "express": "^4.18.2",
  "express-validator": "^7.0.1",
  "jsonwebtoken": "^9.0.0",
  "mongoose": "^7.0.3",
  "morgan": "^1.10.0",
  "passport": "^0.6.0",
  "passport-jwt": "^4.0.1",
  "passport-local": "^1.0.0",
  "jsdoc": "^4.0.2"
}
```

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
   ```
2. Navigate to the project directory:
   ```bash
   cd movie_api
   ```
3. Install dependencies:
   ```bash
   npm install 
   ```
4. Create a .env file with config: 
   ```
   CONNECTION_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   PORT=8080
   ```
5. Start the server: 
   ```bash
   node index.js 
   ```

--- 

## Usage 

1. Ensure Node.js is installed on your system. 
2. Run the server. 
3. Use an API testing tool to interact with endpoints. 

---

## Hosting

This API is hosted on Heroku with the database hosted on MongoDB Atlas.

---

## Documentation

The API is fully documented using JSDoc. To generate the documentation:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Generate documentation:
   ```bash
   npm run docs
   ```

3. View the documentation:
   - Open `out/index.html` in your web browser
   - The documentation includes:
     - API endpoints and their usage
     - Data models and schemas
     - Authentication flows
     - Request/response formats
     - Error handling

The documentation is automatically generated from JSDoc comments in the source code and is kept up-to-date with the codebase.

---

## Version

1.0.0

---

## Author

Ashley Williams

---

## License

GNU AFFERO GENERAL PUBLIC LICENSE
Version 3, 19 November 2007

