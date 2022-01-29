'use strict'

// Import models and services
const User = require('../models/user');
const TokenService = require('../services/authToken');

function createAccount(req, res) {

    // 406: Not Acceptable
    if (!req.body.email) { return res.status(406).send( { message: "The email is required" }) }

    // 406: Not Acceptable
    if (!req.body.password) { return res.status(406).send({ message: "The password is required" }) }

    // Create user "Object"
    const user = new User({
       email: req.body.email,
       password: req.body.password
    });

    // Save user with the save schema method
    user.save((err) => {

       // 500: Internal error
       if (err) { return res.status(500).send({ message: "Internal error", error: err}) }

       // Return success code and user token
       // 200: Successfully
       return res.status(200).send({ token: TokenService.createToken(user.id)});

    });

}

function login(req, res) {

    // 406: Not Acceptable
    if (!req.body.email) { return res.status(406).send( { message: "The email is required" }) }

    // 406: Not Acceptable
    if (!req.body.password) { return res.status(406).send({ message: "The password is required" }) }

    // TODO: Mirar com podem validar que el user esta be i el password tambe (perque el password esta xifrat)
    User.findOne({ email: req.body.email }, (err, user) => {

        // 500: Internal error
        if (err) { return res.status(500).send({ message: "Internal error", error: err }) }

        // 404: Not found
        if (!user) { return res.status(404).send({ message: "User not found"}) }

        // 200: Success
        return res.status(200).send({ message: "Successfully logged in", token: TokenService.createToken(user.id) });

    });

}

function getCurrentUser(req, res) {

    // Get the token from the headers. (We don't need to validate them because earlier we validate it with isAuth middleware)
    let token = req.headers.authorization;

    // Decode token and get userid information
    TokenService.decodeToken(token)
        .then(resolve => {
            // Save the user id
            req.userId = resolve;
        })
        .catch(reject => {
            // Trow error
            res.status(reject.status).send({message: reject.message});
        });

    // If we have user id let's find it al the database
    if (req.userId) {

        User.findById(req.userId, (err, user) => {

            // 500: Internal error
            if (err) { return res.status(500).send({ message: "Internal error", error: err }) }

            // 404: Not found
            if (!user) { return res.status(404).send({ message: "Not found"}) }

            // 200: Successfully
            res.status(200).send({ message: "Successfully", user: user });

        });

    }

}

function getUserById(req, res) {

    // Get id param from URL
    let id = req.params.id;

    User.findById(id, (err, user) => {

        // 500: Internal error
        if (err) { return res.status(500).send({ message: "Internal error", error: err }) }

        // 404: Not found
        if (!user) { return res.status(404).send({ message: "Not found"}) }

        // 200: Successfully
        res.status(200).send({ message: "Successfully", user: user });

    });

}

module.exports = {
    createAccount,
    login,
    getCurrentUser,
    getUserById,
}
