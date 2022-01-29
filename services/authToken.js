'use strict'

// Require jwt library that's encode and decode the api token
const jwt = require('jwt-simple'); // src: https://www.npmjs.com/package/jwt-simple

// Library to get the actual date formatted
const moment = require('moment'); // src: https://www.npmjs.com/package/moment

// Require the config file
const config = require('../config/config');

// Give in a user create an unique token with her information
function createToken(user) {

    const tokenData = {
        sub: user.id,
        // Unique timestamp
        iat: moment().unix(),
        // Timestamp with expire date
        exp: moment().add(14, "days").unix()
    }

    // Return a token with the data and created based on the random string
    return jwt.encode(tokenData, config.SECRET_TOKEN);
}

function decodeToken(token) {

    // Promise is an action which will either be completed or rejected (Sacao de google) :)
    // Return JSON with the result resolve or reject.
    return new Promise((resolve, reject) => {

        try {

            // Returns the json object with all the token information
            const tokenData = jwt.decode(token, config.SECRET_TOKEN);

            // Validate the token expiry
            if (tokenData.exp <= moment().unix()) {

                // If the token is expiry return error with the reason
                reject({
                    // 401: Unauthorized
                    status: 401,
                    message: "Token was expiry"
                });

            }

            // Similar to return (Remember we are inside a promise)
            resolve(tokenData.sub);

        } catch (err) {

            reject({
                // 500: Internal error
                status: 500,
                message: 'Ups! Something went wrong',
                error: err
            });

        }

    });

}

module.exports = {
    createToken,
    decodeToken
}

