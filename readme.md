# TV Spot Forum

TV Spot Forum is a simple forum application where users can create posts, leave comments, and engage in discussions about their favorite TV shows.

## Features

- **User Authentication**: Users can log in, and log out.
- **Create Posts**: Users can create new posts with titles and comments.
- **Leave Comments**: Users can leave comments on posts to share their thoughts.
- **Post Management**: Users can manage their posts, edit titles, and delete posts.
- **Comment Management**: Users can edit and delete their comments.

## Version Information

Node Version: 19.4.0
Browser used for testing: Microsoft Edge Version 119.0.2151.44 (Official build) (64-bit)
Postgres Version: (PostgreSQL) 12.16

## Getting Started

## Installation

To install and run the application, follow these steps:

1. Download the zip file of the project.
2. Extract the zip file on your local machine.
3. Open a terminal and navigate to the extracted project directory using the `cd` command.
4. Run `npm install` to install the necessary dependencies.

## Database Setup

The project includes two scripts in the package.json file for setting up the database:

- `init-db-sample`: This script checks if the `forum` database exists. If it does, it prompts the user to either drop the existing database and recreate it with seed data and schema, or cancel the operation. If the `forum` database does not exist, it prompts the user to create it with seed data and schema.

- `init-db-schema`: This script checks if the `forum` database exists. If it does, it prompts the user to either delete the existing database and create a new blank database with the schema, or cancel the operation. If the `forum` database does not exist, it prompts the user to create it with the schema.

## Usage

To run the application, use the `npm start` command. This will start the server and the application will be accessible by default at `http://localhost:3000`.
