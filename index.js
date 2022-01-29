'use strict'

// I use nodemon library to reboot server if any file changes here is the documentation:
// src: https://www.npmjs.com/package/nodemon

// For testing I use Mocha and Chain library
// Mocha src: https://www.npmjs.com/package/mocha
// Chain src: https://github.com/chaijs/chai-http

// Require db library and add main file
const mongoose = require('mongoose'); // src: https://www.npmjs.com/package/mongoose
const app = require('./app');

// Link config file
const config = require('./config/config');

mongoose.connect(config.DB, (err, res) => {

    // 500: Internal error
    if (err) { return res.status(500).send({ message: "Unable connect to database", error: err }) }

    // Start app
    app.listen(config.PORT, () => {
       console.log("Successfully database connection!");
       console.log(`Listening at port ${config.PORT}`);
    });

});

module.exports = app;
