CREATE TABLE users (
    id SERIAL UNIQUE PRIMARY KEY,
    username VARCHAR(30) UNIQUE CHECK (username = lower(username)),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    password TEXT NOT NULL,
    email TEXT NOT NULL
        CHECK (position('@' IN email) > 1),
    bio TEXT NOT NULL
);

CREATE TABLE follows (
    user_following_id INTEGER
        REFERENCES users ON DELETE CASCADE,
    user_to_be_followed_id INTEGER
        REFERENCES users ON DELETE CASCADE,
    PRIMARY KEY (user_following_id, user_to_be_followed_id)
);

CREATE TABLE movies (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL
);

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    movie_id TEXT 
        REFERENCES movies ON DELETE CASCADE,
    user_id INTEGER
        REFERENCES users ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 0 AND rating <= 10),
    title TEXT NOT NULL,
    body VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(0)
);

CREATE TABLE likes (
    user_id INTEGER 
        REFERENCES users ON DELETE CASCADE,
    review_id INTEGER
        REFERENCES reviews ON DELETE CASCADE
);
