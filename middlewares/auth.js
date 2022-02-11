'use strict'

// Import token (encode / decode) services
const TokenService = require('../services/authToken');

function isAuth (req, res, next) {

    if (!req.headers.authorization) {
        // 403: Forbidden
        return res.status(416).send({ message: 'You dont have auth token' })
    }

    // Get auth token
    const token = req.headers.authorization;

    // Decode token and get userid information
    TokenService.decodeToken(token)
        .then(resolve => {
            // Save the user id and then execute the next function
            req.userId = resolve;
            next();
        })
        .catch(reject => {
            // Trow error
            res.status(reject.status).send({message: reject.message});
        });

}

module.exports = isAuth;
