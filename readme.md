# TV Spot Forum

TV Spot Forum is a simple forum application where users can create posts, leave comments, and engage in discussions about their favorite TV shows.

## Features

- **User Authentication**: Users can log in, and log out.
- **Create Posts**: Users can create new posts with titles and comments.
- **Leave Comments**: Users can leave comments on posts to share their thoughts.
- **Post Management**: Users can manage their posts, edit titles, and delete posts.
- **Comment Management**: Users can edit and delete their comments.

\*Users are not able to edit the date that their comments/posts were created.
\*Posts/comments are sorted by date then time they were created.

## Version Information

Node Version: 19.4.0
Browser used for testing:

- Microsoft Edge: Version 119.0.2151.44 (Official build) (64-bit)
- Google Chrome Version 119.0.6045.124 (Official Build) (64-bit)

Postgres Version: (PostgreSQL) 12.16

## Getting Started

### Installation

To install and run the application, follow these steps:
\*Please note the steps assume you have node and postgres already installed

1. Download the zip file of the project.
2. Extract the zip file on your local machine.
3. Open a terminal and navigate to the extracted project directory using the `cd` command.
4. Run `npm install` to install the necessary dependencies.
5. Follow the steps below in `Database Setup` to create the database for the forum. You will have option to create a database with sample data.
6. To run the application, use the `npm start` command. This will start the server and the application will be accessible by default at `http://localhost:3000`, if running it on your own local machine.

### Database Setup

The project includes two scripts in the package.json file for setting up the database. (All scrips run using bash):

- `npm run init-db-sample`: This script checks if the `forum` database exists. If it does, it prompts the user to either drop the existing database and recreate it with seed data and schema, or cancel the operation. If the `forum` database does not exist, it prompts the user to create it with seed data and schema.

- `npm run init-db-schema`: This script checks if the `forum` database exists. If it does, it prompts the user to either delete the existing database and create a new blank database with the schema, or cancel the operation. If the `forum` database does not exist, it prompts the user to create it with the schema.

- You can also set up using the following commands in your terminal.
  - `createdb forum` will create the database. (If you already have a database named forum, you will need to drop it with `dropdb forum`);
  - `psql forum < schema.sql` will add the schema located in `schema.sql` to your new created database
  - `psql forum < ./lib/seed-data.sql` (optional) will load the database with sample data. If you do not want sample data, please skip this step.

### User Data for Sample Database

The following table provides the usernames and their corresponding passwords for the sample database. Please note that for demonstration purposes, all users have the same password, which is `1234`.

| Username       | Password |
| -------------- | -------- |
| tvaddict23     | 1234     |
| bingewatcher99 | 1234     |
| dramaqueen     | 1234     |
| scifigeek      | 1234     |
| comedylover    | 1234     |

### Usage

To run the application, use the `npm start` command. This will start the server and the application will be accessible by default at `http://localhost:3000`.
