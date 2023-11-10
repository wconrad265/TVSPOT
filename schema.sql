-- Create the Users table
CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

-- Create the Posts table
CREATE TABLE Posts (
    id SERIAL PRIMARY KEY,
    title TEXT UNIQUE NOT NULL,
    date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_id INTEGER NOT NULL REFERENCES Users(id) ON DELETE CASCADE
);

-- Create the Comments table
CREATE TABLE Comments (
    id SERIAL PRIMARY KEY,
    date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    markdown_body TEXT NOT NULL,
    user_id INTEGER NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    post_id INTEGER NOT NULL REFERENCES Posts(id) ON DELETE CASCADE
);
