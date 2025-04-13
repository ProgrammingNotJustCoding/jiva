#!/bin/bash

CONTAINER_NAME="jiva-postgres"
POSTGRES_USER="user"
POSTGRES_PASSWORD="password"

DATABASES=("authdb" "smpdb" "shiftdb" "incidentdb" "workplandb")

echo "Connecting to PostgreSQL container..."

for DB_NAME in "${DATABASES[@]}"; do
  echo "Creating database: $DB_NAME"
  docker exec -it $CONTAINER_NAME psql -U $POSTGRES_USER -d postgres -c "CREATE DATABASE $DB_NAME;"
  
  if [ $? -eq 0 ]; then
    echo "✅ Database '$DB_NAME' created successfully!"
  else
    echo "❌ Failed to create database '$DB_NAME'."
  fi
done

echo "Database initialization complete."
