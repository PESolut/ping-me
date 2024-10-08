#!/bin/bash

# Load environment variables
set -a
source .env
set +a

# Function to create database if it doesn't exist
create_database() {
    local dbname=$1
    PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -tc "SELECT 1 FROM pg_database WHERE datname = '$dbname'" | grep -q 1 || PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -c "CREATE DATABASE $dbname"
}

# Function to run SQL files
run_sql_file() {
    local file=$1
    local dbname=$2
    PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$dbname" -f "$file"
}

# Create databases
create_database "ping_me"
create_database "ping_me_test"

# Set up main database
run_sql_file "backend/db/init.sql" "ping_me"
run_sql_file "backend/db/seed.sql" "ping_me"

# Set up test database
run_sql_file "backend/db/init.sql" "ping_me_test"
# Note: We don't seed the test database here, as it's typically done in the test setup

echo "Database setup complete."