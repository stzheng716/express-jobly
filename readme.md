# Jobly Backend 🧑‍💻💼💻📝

This is the Express backend API for Jobly, .

### Built With
* Node.js
* PostgreSQL
* Express.js
* Jest
* Bcrypt
* JWT

## Set Up:

1. Clone or fork this repository

2. Install dependencies(ensure you are on the directary with package.json)
  * npm install

3. To run this:

    nodemon server.js

## Run test:

To run the tests:

    jest -i

To run the tests with coverage:

    jest -i --coverage

Available Routes:

* POST: /auth/token 

* POST: /auth/register

* GET/POST: /companies

* GET/PATCH/DELETE: /companies:handle

* GET/POST: /jobs

* GET/PATCH/DELETE: /jobs:id

* GET/POST: /users

* GET/PATCH/DELETE: /users/:username
