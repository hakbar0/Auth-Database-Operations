#!/bin/bash

# Build the Docker image
docker build --no-cache --tag test-nest .

# Stop and remove any previous containers with the same name
docker stop test-nest
docker rm test-nest

# Start a new Postgres container with the database "auth" if it doesn't exist
docker run --name pay -p 5432:5432 -e POSTGRES_PASSWORD=root -d postgres
docker exec -it pay bash -c "psql -U postgres -c 'CREATE DATABASE IF NOT EXISTS auth;'"

# Start a new container using the image and publish port 3000
docker run --name test-nest -p 3000:3000 --link pay:test-nest -e POSTGRES_HOST=pay -e POSTGRES_PORT=5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=root -e POSTGRES_DB=auth test-nest
