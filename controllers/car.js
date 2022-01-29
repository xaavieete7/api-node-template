'use strict'

// Import model
const Car = require('../models/car');

// Return JSON with all the cars
function getCars(req, res) {

    // Execute find method without filters to get all the items
    Car.find({}, (err, cars) => {

        // 500: Internal error
        if (err) { return res.status(500).send({ message: "Internal error", error: err }) }

        // 404: Not found
        if (!cars) { return res.status(404).send({ message: "There are no cars yet" }) }

        // 200: Successfully
        res.status(200).send({ cars: cars });

    });

}

// Return JSON with only one car
function getCarById(req, res) {

    // Get car id form URL params
    let id = req.params.id;

    Car.findById(id, (err, car) => {

        // 500: Internal error
        if (err) { return res.status(500).send({ message: "Internal error", error: err }) }

        // 404: Not found
        if (!car) { return res.status(404).send({ message: "The car doesn't exist" }) }

        // 200: Successfully
        res.status(200).send({ car: car });

    });
}

// Save car and returned created object
function saveCar(req, res) {

    let car = new Car({
       brand: req.body.brand,
       model: req.body.model,
       color: req.body.color,
       power: req.body.power,
       price: req.body.price,
    });

    car.save((err, car) => {

        // 500: Internal error
        if (err) { res.status(500).send({ message: "Internal error", error: err }) }

        // 200: Successfully
        res.status(200).send({ car: car });

    });

}

// Update already created car
function updateCar(req, res) {

    // Get car id form URL params
    let id = req.params.id;

    // Get all the request body ask Xavi for more information :)
    let update = req.body;

    Car.findByIdAndUpdate(id, update, (err, carUpdated) => {

        // 500: Internal error
        if (err) { return res.status(500).send({ message: "Internal error", error: err }) }

        // 200: Successfully
        res.status(200).send( { message: "Successfully updated", car: carUpdated } );

    });

}

function removeCar(req, res) {

    // Get car id form URL params
    let id = req.params.id;

    Car.findById(id, (err, car) => {

        // 500: Internal error
        if (err) { return res.status(500).send({ message: "Internal error", error: err }) }

        car.remove( err => {

            // 500: Internal error
            if (err) { return res.send(500).send({ message: "Internal error", error: err }) }

            // 200: Successfully
            res.status(200).send({ message: "Successfully removed"});

        });
    });
}


module.exports = {
    getCars,
    getCarById,
    saveCar,
    updateCar,
    removeCar
}
