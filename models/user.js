'use strict'

// Import necessary libraries
const mongoose = require('mongoose'); // src: https://www.npmjs.com/package/mongoose
// Library to hash strings in this case to hash passwords
const bcrypt = require('bcrypt-nodejs'); // src: https://www.npmjs.com/package/bcrypt

// Ask Xavi for more information if you needed :)
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: { type: String, unique: true },
    // TODO: Investigar que significa la propiedad select. Crec k siginifica k amb un selec no obtinguis la dada que quedi oculta! Comprovarﬁ
    password: { type: String, select: false }
});

// TODO: Mirar de averigurar perque no es xifra el password!
// This piece of code is executed before (PRE) saving
UserSchema.pre('save', (next => {

    // Get the actual user schema information
    const user = this;

    // Generate one random string for more security
    /*
    // This is a good practise because if you hash Pepe123 twice
    // you don't get the same hash.
     */
    bcrypt.genSalt(10, (err, salt) => {

        // Send the error to the next function
        if (err) { return next(err); }

        // Use hash method and salt (random string) to hash password
        bcrypt.hash(user.password, salt, null, (err, hash) => {

            // Send the error to the next function
            if (err) { return next(err) }

            console.log("old passwrod: " + user.password);
            console.log("new password: " + hash);

            // Save the hashed password into the schema
            user.password = hash;

            // Execute the next function
            next();

        });
    });
}));

module.exports = mongoose.model('User', UserSchema);

