'use strict'

// Import all the libraries
const express = require('express'); // src: https://www.npmjs.com/package/express
const bodyParser = require('body-parser'); // https://www.npmjs.com/package/body-parser
const app = new express();

// Require routes file
const api = require('./routes/api');

// Specify body parser library to use json format
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// Redirect all the petition at routes/api.js
app.use('/api', api);

app.get('/', function (req, res) {
    res.send("Funciono");
});


module.exports = app;
