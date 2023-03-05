#!/bin/bash

# Check if the container exists
if [ ! "$(docker ps -q -f name=test)" ]; then
    # Start the container if it doesn't exist
    docker run --name test -p 5432:5432 -e POSTGRES_PASSWORD=root -d postgres
fi

# Wait for the container to start
sleep 5

# Check if the "auth" database exists
if [ ! "$(docker exec test psql -U postgres -l | grep auth)" ]; then
    # Create the "auth" database if it doesn't exist
    docker exec test psql -U postgres -c "CREATE DATABASE auth;"
fi
