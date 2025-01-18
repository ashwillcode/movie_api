-- Insert data into Genres table
INSERT INTO Genres (Name, Description) VALUES
('Science Fiction', 'A genre often exploring futuristic and imaginative concepts, such as advanced technology or space exploration.'),
('Action', 'A genre characterized by physical feats, intense combat, and exciting sequences.'),
('Adventure', 'A genre featuring exploration, daring quests, and new experiences.'),
('Crime', 'A genre focusing on criminal acts, investigations, and their consequences.'),
('Drama', 'A genre that focuses on realistic storytelling, emotions, and character development.'),
('Fantasy', 'A genre set in fictional worlds with magical elements and extraordinary adventures.');

-- Insert data into Directors table
INSERT INTO Directors (Name, Bio, Birthyear, Deathyear) VALUES
('Christopher Nolan', 'British-American director known for innovative and mind-bending films.', '1970-07-30', NULL),
('Francis Ford Coppola', 'American director, producer, and screenwriter famous for The Godfather series.', '1939-04-07', NULL),
('Quentin Tarantino', 'American filmmaker known for stylized, non-linear storytelling.', '1963-03-27', NULL),
('Frank Darabont', 'Hungarian-American director known for The Shawshank Redemption.', '1959-01-28', NULL),
('David Fincher', 'American director known for Fight Club and suspenseful storytelling.', '1962-08-28', NULL),
('Robert Zemeckis', 'American filmmaker famous for Forrest Gump and Back to the Future.', '1952-05-14', NULL),
('The Wachowskis', 'Siblings who directed The Matrix and are known for groundbreaking visual effects.', NULL, NULL),
('Peter Jackson', 'New Zealand filmmaker known for The Lord of the Rings trilogy.', '1961-10-31', NULL);

-- Insert data into Movies table
INSERT INTO Movies (Title, Description, GenreID, DirectorID, ImageURL, Featured) VALUES
('Inception', 'A skilled thief, the absolute best in the dangerous art of extraction, stealing valuable secrets from deep within the subconscious during the dream state.', 1, 1, 'https://m.media-amazon.com/images/I/51fKZ2s8XBL._AC_.jpg', TRUE),
('The Dark Knight', 'When the menace known as The Joker emerges, he causes chaos and havoc among the people of Gotham.', 2, 1, 'https://m.media-amazon.com/images/I/51v5ZpFyaFL._AC_.jpg', TRUE),
('Interstellar', 'A group of astronauts travel through a wormhole in search of a new home for humanity.', 3, 1, 'https://m.media-amazon.com/images/I/71y7xV-OpML._AC_SY679_.jpg', FALSE),
('The Godfather', 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.', 4, 2, 'https://m.media-amazon.com/images/I/41--oRi8a-L._AC_.jpg', TRUE),
('Pulp Fiction', 'The lives of two mob hitmen, a boxer, a gangster, and his wife intertwine in a series of criminal events.', 4, 3, 'https://m.media-amazon.com/images/I/51zUbui+gbL._AC_.jpg', TRUE),
('The Shawshank Redemption', 'Two imprisoned men bond over several years, finding solace and eventual redemption through acts of common decency.', 5, 4, 'https://m.media-amazon.com/images/I/51NiGlapXlL._AC_.jpg', TRUE),
('Fight Club', 'An insomniac office worker and a soap salesman form an underground fight club that evolves into much more.', 5, 5, 'https://m.media-amazon.com/images/I/51v5ZpFyaFL._AC_.jpg', FALSE),
('Forrest Gump', 'The story of Forrest Gump, a man with a low IQ who achieves great things in life.', 5, 6, 'https://m.media-amazon.com/images/I/41cXB1tyoOL._AC_.jpg', TRUE),
('The Matrix', 'A computer hacker learns about the true nature of his reality and his role in the war against its controllers.', 1, 7, 'https://m.media-amazon.com/images/I/51EG732BV3L._AC_.jpg', FALSE),
('The Lord of the Rings: The Return of the King', 'Gandalf and Aragorn lead the World of Men against Sauron''s army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.', 6, 8, 'https://m.media-amazon.com/images/I/51Qvs9i5a%2BL._AC_.jpg', TRUE);

-- Insert data into Users table
INSERT INTO Users (Username, Password, Email, Birth_date) VALUES
('JohnDoe', 'password123', 'johndoe@gmail.com', '1990-01-15'),
('JaneSmith', 'qwerty456', 'janesmith@yahoo.com', '1985-06-23'),
('AliceJones', 'secure789', 'alicejones@hotmail.com', '2000-12-11');

INSERT INTO User_Movies (UserID, MovieID) VALUES
(1, 1), -- User 1 loves Movie 1
(1, 3), -- User 1 also loves Movie 3
(2, 2); -- User 2 loves Movie 2
