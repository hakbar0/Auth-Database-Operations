# Auth Database Operations

This repository contains code for a basic authentication system built using NestJS and PostgreSQL. It provides the following three endpoints:

- `/register` - Registers a new user with the provided username, email, and password.
- `/login` - Logs in a user with the provided email and password.
- `/profile` - A protected route that requires a JWT token to access and returns the user profile information, excluding the password and id.

## Requirements

To run this application, you must have the following installed:

- Docker
- Docker Compose
- Node.js
- npm or yarn

## Getting Started

1. Clone the repository to your local machine.
2. Run the build-and-run script by executing the `build-and-run.sh` file located in the root directory of the repository. On Windows, you can do this by installing Git Bash, opening the repository in Git Bash, and running `./build-and-run.sh`. On macOS, you can run `sh build-and-run.sh` from the Terminal.
3. Once the script has finished running, navigate to `http://localhost:3000` to access the application.

### Running `.sh` files on Windows

To run `.sh` files on Windows, you'll need to install Git Bash, which provides a Unix-like environment for running shell scripts. You can download Git Bash from the official website [here](https://git-scm.com/downloads). Once installed, you can open the repository in Git Bash and run the `build-and-run.sh` script by typing `./build-and-run.sh` in the terminal.

### Running `.sh` files on macOS

To run `.sh` files on macOS, you can use the Terminal app. Navigate to the repository in the Terminal and run the `build-and-run.sh` script by typing `sh build-and-run.sh` in the terminal.

## Usage

To use the application, you can use any HTTP client such as Postman or cURL. Below are examples of how to use each of the endpoints.

### `/register`

To register a new user, send a POST request to `http://localhost:3000/auth/register` with the following JSON body:

{
"username": "your-username",
"email": "your-email@example.com",
"password": "your-password"
}


If successful, the API will respond with the newly created user object.

### `/login`

To log in a user, send a POST request to `http://localhost:3000/auth/login` with the following JSON body:

{
"email": "your-email@example.com",
"password": "your-password"
}


If successful, the API will respond with an access token that can be used to access protected routes.

### `/profile`

To access a user's profile information, send a GET request to `http://localhost:3000/auth/profile` with an `Authorization` header containing the access token obtained from logging in.
