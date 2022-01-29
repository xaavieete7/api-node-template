'use strict'

// Import necessary libraries
const mongoose = require('mongoose'); // src: https://www.npmjs.com/package/mongoose

// if you needed ask Xavi for more information :)
const Schema = mongoose.Schema;

const CarSchema = new Schema({
    brand: String,
    model: String,
    color: String,
    power: Number,
    price: { type: Number, default: 0 }
});

module.exports = mongoose.model('Car', CarSchema);
