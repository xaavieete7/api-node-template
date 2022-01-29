'use strict'

// Import necessary libraries
const mongoose = require('mongoose'); // src: https://www.npmjs.com/package/mongoose

// if you needed ask Xavi for more information :)
const Schema = mongoose.Schema;

const CarSchema = new Schema({
    brand: {type: String, require: true},
    model: {type: String, require: true},
    color: {type: String, require: true},
    power: {type: Number, require: true},
    price: {type: Number, require: true}
});

module.exports = mongoose.model('Car', CarSchema);
