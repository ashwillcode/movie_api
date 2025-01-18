  -- Create the Genres table
CREATE TABLE Genres (
    GenreID serial PRIMARY KEY,
    Name varchar(50) NOT NULL,
    Description varchar(1000)
);

-- Create the Directors table
CREATE TABLE Directors (
    DirectorID serial PRIMARY KEY,
    Name varchar(50) NOT NULL,
    Bio varchar(1000),
    Birthyear date,
    Deathyear date
);

-- Create the Movies table
CREATE TABLE Movies (
    MovieID serial PRIMARY KEY,
    Title varchar(50) NOT NULL,
    Description varchar(1000),
    GenreID integer NOT NULL,
    DirectorID integer NOT NULL,
    ImageURL varchar(300),
    Featured boolean,
    CONSTRAINT fk_Genre FOREIGN KEY (GenreID) REFERENCES Genres (GenreID),
    CONSTRAINT fk_Director FOREIGN KEY (DirectorID) REFERENCES Directors (DirectorID)
);

-- Create the Users table
CREATE TABLE Users (
    UserID serial PRIMARY KEY,
    Username varchar(50) NOT NULL UNIQUE,
    Password varchar(50) NOT NULL,
    Email varchar(50) NOT NULL UNIQUE,
    Birth_date date
);

-- Create the Users-Movies junction table
CREATE TABLE User_Movies (
    UserMovieID serial PRIMARY KEY,
    UserID integer NOT NULL,
    MovieID integer NOT NULL,
    CONSTRAINT UserKey FOREIGN KEY (UserID) REFERENCES Users(UserID),
    CONSTRAINT MovieKey FOREIGN KEY (MovieID) REFERENCES Movies(MovieID)
);

