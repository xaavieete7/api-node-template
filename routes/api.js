'use strict'

// Import all the libraries
const express = require('express'); // src: https://www.npmjs.com/package/express

// Create router object (this line declare api.js as router file)
const api = express.Router();

// Import (isAuth function) from auth middleware
const isAuth = require('../middlewares/auth');

// Require controllers
const userCtrl = require('../controllers/user');
const carCtrl = require('../controllers/car');

// GET endpoints
api.get('/cars', isAuth, carCtrl.getCars);
api.get('/car/:id', isAuth, carCtrl.getCarById);
api.get('/user', isAuth, userCtrl.getCurrentUser);
api.get('/user/:id', isAuth, userCtrl.getUserById);

// POST endpoints
api.post('/car', isAuth, carCtrl.saveCar);

// PUT endpoints
api.put('/car/:id', isAuth, carCtrl.updateCar);

// DELETE endpoints
api.delete('/car/:id', isAuth, carCtrl.removeCar);

// Authentication endpoints
api.post('/register', userCtrl.createAccount );
api.post('/login', userCtrl.login );


// Export the api object
module.exports = api;
