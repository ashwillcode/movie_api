--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8 (Homebrew)
-- Dumped by pg_dump version 15.8 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: directors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.directors (
    directorid integer NOT NULL,
    name character varying(50) NOT NULL,
    bio character varying(1000),
    birthyear date,
    deathyear date
);


ALTER TABLE public.directors OWNER TO postgres;

--
-- Name: directors_directorid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.directors_directorid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.directors_directorid_seq OWNER TO postgres;

--
-- Name: directors_directorid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.directors_directorid_seq OWNED BY public.directors.directorid;


--
-- Name: genres; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.genres (
    genreid integer NOT NULL,
    name character varying(50) NOT NULL,
    description character varying(1000)
);


ALTER TABLE public.genres OWNER TO postgres;

--
-- Name: genres_genreid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.genres_genreid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.genres_genreid_seq OWNER TO postgres;

--
-- Name: genres_genreid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.genres_genreid_seq OWNED BY public.genres.genreid;


--
-- Name: movies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.movies (
    movieid integer NOT NULL,
    title character varying(50) NOT NULL,
    description character varying(1000),
    genreid integer NOT NULL,
    directorid integer NOT NULL,
    imageurl character varying(300),
    featured boolean
);


ALTER TABLE public.movies OWNER TO postgres;

--
-- Name: movies_movieid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.movies_movieid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.movies_movieid_seq OWNER TO postgres;

--
-- Name: movies_movieid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.movies_movieid_seq OWNED BY public.movies.movieid;


--
-- Name: user_movies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_movies (
    usermovieid integer NOT NULL,
    userid integer NOT NULL,
    movieid integer NOT NULL
);


ALTER TABLE public.user_movies OWNER TO postgres;

--
-- Name: user_movies_usermovieid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_movies_usermovieid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_movies_usermovieid_seq OWNER TO postgres;

--
-- Name: user_movies_usermovieid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_movies_usermovieid_seq OWNED BY public.user_movies.usermovieid;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    userid integer NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(50) NOT NULL,
    email character varying(50) NOT NULL,
    birth_date date
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_movies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users_movies (
    usermovieid integer NOT NULL,
    userid integer NOT NULL,
    movieid integer NOT NULL
);


ALTER TABLE public.users_movies OWNER TO postgres;

--
-- Name: users_movies_usermovieid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_movies_usermovieid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_movies_usermovieid_seq OWNER TO postgres;

--
-- Name: users_movies_usermovieid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_movies_usermovieid_seq OWNED BY public.users_movies.usermovieid;


--
-- Name: users_userid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_userid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_userid_seq OWNER TO postgres;

--
-- Name: users_userid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_userid_seq OWNED BY public.users.userid;


--
-- Name: directors directorid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directors ALTER COLUMN directorid SET DEFAULT nextval('public.directors_directorid_seq'::regclass);


--
-- Name: genres genreid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.genres ALTER COLUMN genreid SET DEFAULT nextval('public.genres_genreid_seq'::regclass);


--
-- Name: movies movieid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movies ALTER COLUMN movieid SET DEFAULT nextval('public.movies_movieid_seq'::regclass);


--
-- Name: user_movies usermovieid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_movies ALTER COLUMN usermovieid SET DEFAULT nextval('public.user_movies_usermovieid_seq'::regclass);


--
-- Name: users userid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN userid SET DEFAULT nextval('public.users_userid_seq'::regclass);


--
-- Name: users_movies usermovieid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_movies ALTER COLUMN usermovieid SET DEFAULT nextval('public.users_movies_usermovieid_seq'::regclass);


--
-- Data for Name: directors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.directors (directorid, name, bio, birthyear, deathyear) FROM stdin;
1	Christopher Nolan	British-American director known for innovative and mind-bending films.	1970-07-30	\N
2	Francis Ford Coppola	American director, producer, and screenwriter famous for The Godfather series.	1939-04-07	\N
3	Quentin Tarantino	American filmmaker known for stylized, non-linear storytelling.	1963-03-27	\N
4	Frank Darabont	Hungarian-American director known for The Shawshank Redemption.	1959-01-28	\N
5	David Fincher	American director known for Fight Club and suspenseful storytelling.	1962-08-28	\N
6	Robert Zemeckis	American filmmaker famous for Forrest Gump and Back to the Future.	1952-05-14	\N
7	The Wachowskis	Siblings who directed The Matrix and are known for groundbreaking visual effects.	\N	\N
8	Peter Jackson	New Zealand filmmaker known for The Lord of the Rings trilogy.	1961-10-31	\N
\.


--
-- Data for Name: genres; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.genres (genreid, name, description) FROM stdin;
1	Science Fiction	A genre often exploring futuristic and imaginative concepts, such as advanced technology or space exploration.
2	Action	A genre characterized by physical feats, intense combat, and exciting sequences.
3	Adventure	A genre featuring exploration, daring quests, and new experiences.
4	Crime	A genre focusing on criminal acts, investigations, and their consequences.
5	Drama	A genre that focuses on realistic storytelling, emotions, and character development.
6	Fantasy	A genre set in fictional worlds with magical elements and extraordinary adventures.
\.


--
-- Data for Name: movies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.movies (movieid, title, description, genreid, directorid, imageurl, featured) FROM stdin;
1	Inception	A skilled thief, the absolute best in the dangerous art of extraction, stealing valuable secrets from deep within the subconscious during the dream state.	1	1	https://m.media-amazon.com/images/I/51fKZ2s8XBL._AC_.jpg	t
3	Interstellar	A group of astronauts travel through a wormhole in search of a new home for humanity.	3	1	https://m.media-amazon.com/images/I/71y7xV-OpML._AC_SY679_.jpg	f
4	The Godfather	The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.	4	2	https://m.media-amazon.com/images/I/41--oRi8a-L._AC_.jpg	t
5	Pulp Fiction	The lives of two mob hitmen, a boxer, a gangster, and his wife intertwine in a series of criminal events.	4	3	https://m.media-amazon.com/images/I/51zUbui+gbL._AC_.jpg	t
6	The Shawshank Redemption	Two imprisoned men bond over several years, finding solace and eventual redemption through acts of common decency.	5	4	https://m.media-amazon.com/images/I/51NiGlapXlL._AC_.jpg	t
7	Fight Club	An insomniac office worker and a soap salesman form an underground fight club that evolves into much more.	5	5	https://m.media-amazon.com/images/I/51v5ZpFyaFL._AC_.jpg	f
8	Forrest Gump	The story of Forrest Gump, a man with a low IQ who achieves great things in life.	5	6	https://m.media-amazon.com/images/I/41cXB1tyoOL._AC_.jpg	t
9	The Matrix	A computer hacker learns about the true nature of his reality and his role in the war against its controllers.	1	7	https://m.media-amazon.com/images/I/51EG732BV3L._AC_.jpg	f
10	The Lord of the Rings: The Return of the King	Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.	6	8	https://m.media-amazon.com/images/I/51Qvs9i5a%2BL._AC_.jpg	t
\.


--
-- Data for Name: user_movies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_movies (usermovieid, userid, movieid) FROM stdin;
1	1	1
2	1	3
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (userid, username, password, email, birth_date) FROM stdin;
1	JohnDoe	password123	johndoe@gmail.com	1990-01-15
3	AliceJones	secure789	alicejones@hotmail.com	2000-12-11
2	JaneSmith	qwerty456	newemail@example.com	1985-06-23
\.


--
-- Data for Name: users_movies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users_movies (usermovieid, userid, movieid) FROM stdin;
\.


--
-- Name: directors_directorid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.directors_directorid_seq', 8, true);


--
-- Name: genres_genreid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.genres_genreid_seq', 6, true);


--
-- Name: movies_movieid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.movies_movieid_seq', 10, true);


--
-- Name: user_movies_usermovieid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_movies_usermovieid_seq', 3, true);


--
-- Name: users_movies_usermovieid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_movies_usermovieid_seq', 1, false);


--
-- Name: users_userid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_userid_seq', 3, true);


--
-- Name: directors directors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directors
    ADD CONSTRAINT directors_pkey PRIMARY KEY (directorid);


--
-- Name: genres genres_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.genres
    ADD CONSTRAINT genres_pkey PRIMARY KEY (genreid);


--
-- Name: movies movies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movies
    ADD CONSTRAINT movies_pkey PRIMARY KEY (movieid);


--
-- Name: user_movies user_movies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_movies
    ADD CONSTRAINT user_movies_pkey PRIMARY KEY (usermovieid);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users_movies users_movies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_movies
    ADD CONSTRAINT users_movies_pkey PRIMARY KEY (usermovieid);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (userid);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: movies fk_director; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movies
    ADD CONSTRAINT fk_director FOREIGN KEY (directorid) REFERENCES public.directors(directorid);


--
-- Name: movies fk_genre; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movies
    ADD CONSTRAINT fk_genre FOREIGN KEY (genreid) REFERENCES public.genres(genreid);


--
-- Name: user_movies moviekey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_movies
    ADD CONSTRAINT moviekey FOREIGN KEY (movieid) REFERENCES public.movies(movieid);


--
-- Name: user_movies userkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_movies
    ADD CONSTRAINT userkey FOREIGN KEY (userid) REFERENCES public.users(userid);


--
-- PostgreSQL database dump complete
--

