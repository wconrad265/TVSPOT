#!/bin/bash
db_name="forum"  

# Check if the database exists
if psql -lqt | cut -d \| -f 1 | grep -qw "$db_name"; then
  echo "A database with the name '$db_name' already exists."
  read -p "Do you want to drop the existing '$db_name' database and recreate it with seed data and schema? (y/n): " confirm
  action="recreate"
else
  read -p "The '$db_name' database does not exist. Do you want to create it with seed data and schema? (y/n): " confirm
  action="create"
fi

confirm=${confirm,,}

if [ "$confirm" == "y" ]; then
  if [ "$action" == "recreate" ]; then
    # Drops current forum database
    dropdb "$db_name"
  fi

  # Creates the forum database
  createdb "$db_name"

  # Initializes the database schema
  psql -d "$db_name" < schema.sql

  # Seeds the database with data
  psql -d "$db_name" < ./lib/seed-data.sql

  echo "Database '$db_name' has been $action with seed data and schema."
else
  echo "Operation canceled."
fi
