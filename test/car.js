'use strict'

// Pending to investigate
process.env.NODE_ENV = 'test';

// Import user and car model
const User = require('../models/user');
const Car = require('../models/car');

// Require chai library (We use to "simulate" api petitions)
const chai = require('chai');

// Initialize http server
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

// Import the main file to get all the routes
const app = require('../index');
const bodyParser = require("body-parser");

// Add some "pseudonimo" I don't know how to say in English
const expect = chai.expect;

// Save testing token
let testingToken = "";

describe('Car', () => {

    beforeEach((done) => {
        // This function would be executed before each test
        Car.deleteMany({}, (err) => {
            done();
        });
    });

    describe('POST /api/register', () => {

        // Create testing user
        it('it should create a testing', (done) => {
            let user = new User({
                email: "testing123@gmail.com",
                password: "TestingForFun"
            });

            user.save((err, user) => {

                chai.request(app)
                    .post('/api/login')
                    .send(user)
                    .end((err, res) => {
                        expect(err).to.equals(null);
                        expect(res).to.have.status(200);
                        expect(res.body).to.have.property("message");
                        expect(res.body.message).to.equals("Successfully logged in");
                        testingToken = res.body.token;
                        done();
                    });
            });

        });

    });

    describe('POST /api/car/', () => {

        // Car without brand
        it('it should not POST a car without brand', (done) => {
            let car = {
                model: "Focus",
                color: "Blue",
                price: 2550,
                power: 125
            };
            chai.request(app)
                .post('/api/car')
                .send(car)
                .set("authorization", testingToken)
                .end((err, res) => {
                    expect(err).to.equals(null);
                    expect(res).to.have.status(406);
                    expect(res.body).to.have.property("message");
                    expect(res.body.message).to.equals("Brand is required");
                    done();
                });
        });

        // Car without model
        it('it should not POST a car without model', (done) => {
            let car = {
                brand: "Ford",
                color: "Blue",
                price: 2550,
                power: 125
            };
            chai.request(app)
                .post('/api/car')
                .send(car)
                .set("authorization", testingToken)
                .end((err, res) => {
                    expect(err).to.equals(null);
                    expect(res).to.have.status(406);
                    expect(res.body).to.have.property("message");
                    expect(res.body.message).to.equals("Model is required");
                    done();
                });
        });

        // Car without color
        it('it should not POST a car without color', (done) => {
            let car = {
                brand: "Ford",
                model: "Focus",
                price: 2550,
                power: 125
            };
            chai.request(app)
                .post('/api/car')
                .send(car)
                .set("authorization", testingToken)
                .end((err, res) => {
                    expect(err).to.equals(null);
                    expect(res).to.have.status(406);
                    expect(res.body).to.have.property("message");
                    expect(res.body.message).to.equals("Color is required");
                    done();
                });
        });

        // Car without price
        it('it should not POST a car without price', (done) => {
            let car = {
                brand: "Ford",
                model: "Focus",
                color: "Blue",
                power: 125
            };
            chai.request(app)
                .post('/api/car')
                .send(car)
                .set("authorization", testingToken)
                .end((err, res) => {
                    expect(err).to.equals(null);
                    expect(res).to.have.status(406);
                    expect(res.body).to.have.property("message");
                    expect(res.body.message).to.equals("Price is required");
                    done();
                });
        });

        // Car without power
        it('it should not POST a car without power', (done) => {
            let car = {
                brand: "Ford",
                model: "Focus",
                color: "Blue",
                price: 3345
            };
            chai.request(app)
                .post('/api/car')
                .send(car)
                .set("authorization", testingToken)
                .end((err, res) => {
                    expect(err).to.equals(null);
                    expect(res).to.have.status(406);
                    expect(res.body).to.have.property("message");
                    expect(res.body.message).to.equals("Power is required");
                    done();
                });
        });

        // Car without power
        it('it should POST a car with all the values', (done) => {
            let car = {
                brand: "Ford",
                model: "Focus",
                color: "Blue",
                price: 3345,
                power: 125
            };
            chai.request(app)
                .post('/api/car')
                .send(car)
                .set("authorization", testingToken)
                .end((err, res) => {
                    expect(err).to.equals(null);
                    expect(res).to.have.status(200);
                    expect(res.body.car).to.have.property("brand");
                    expect(res.body.car).to.have.property("model");
                    expect(res.body.car).to.have.property("color");
                    expect(res.body.car).to.have.property("power");
                    expect(res.body.car).to.have.property("price");
                    expect(res.body.car).to.have.property("_id");
                    done();
                });
        });

    });

    describe('GET /api/car/', () => {

        it('it should GET all the cars', (done) => {

            let car = new Car({
                brand: "Ford",
                model: "Focus",
                color: "Blue",
                price: 3345,
                power: 125
            });

            car.save((err, car) => {

                expect(err).to.equals(null);

                chai.request(app)
                    .get('/api/cars')
                    .set("authorization", testingToken)
                    .end((err, res) => {
                        expect(err).to.equals(null);
                        expect(res).to.have.status(200);
                        expect(res.body.cars).to.have.lengthOf(1);
                        expect(res.body.cars[0]).to.have.property("brand");
                        expect(res.body.cars[0]).to.have.property("model");
                        expect(res.body.cars[0]).to.have.property("color");
                        expect(res.body.cars[0]).to.have.property("power");
                        expect(res.body.cars[0]).to.have.property("price");
                        expect(res.body.cars[0]).to.have.property("_id");
                        done();
                    });
            });
        });

        it('it should GET car with id parameter', (done) => {

            let car = new Car({
                brand: "Ford",
                model: "Focus",
                color: "Blue",
                price: 3345,
                power: 125
            });

            car.save((err, car) => {

                expect(err).to.equals(null);

                chai.request(app)
                    .get('/api/car/' + car.id)
                    .set("authorization", testingToken)
                    .end((err, res) => {
                        expect(err).to.equals(null);
                        expect(res).to.have.status(200);
                        expect(res.body.car).to.have.property("brand");
                        expect(res.body.car).to.have.property("model");
                        expect(res.body.car).to.have.property("color");
                        expect(res.body.car).to.have.property("power");
                        expect(res.body.car).to.have.property("price");
                        expect(res.body.car).to.have.property("_id");
                        done();
                    });
            });
        });

    });

    describe('PUT /api/car/', () => {

        it('it should PUT one car', (done) => {

            let car = new Car({
                brand: "Ford",
                model: "Focus",
                color: "Blue",
                price: 3345,
                power: 125
            });

            let newCar = {
                brand: "Peugeot",
                model: "307",
                color: "Gray",
                price: 2355,
                power: 100
            }

            car.save((err, car) => {

                expect(err).to.equals(null);
                expect(car.id).not.undefined;

                chai.request(app)
                    .put('/api/car/' + car.id)
                    .send(newCar)
                    .set("authorization", testingToken)
                    .end((err, res) => {

                        expect(err).to.equals(null);
                        expect(res).to.have.status(200);
                        expect(res.body).to.have.property("message");
                        expect(res.body.message).to.equals("Successfully updated");
                        expect(res.body.car).to.have.property("brand");
                        expect(res.body.car).to.have.property("model");
                        expect(res.body.car).to.have.property("color");
                        expect(res.body.car).to.have.property("power");
                        expect(res.body.car).to.have.property("price");
                        expect(res.body.car).to.have.property("_id");

                        done();
                    });
            });
        });

    });

    describe('DELETE /api/car/', () => {

        it('it should DELETE one car', (done) => {

            let car = new Car({
                brand: "Ford",
                model: "Focus",
                color: "Blue",
                price: 3345,
                power: 125
            });

            car.save((err, car) => {

                expect(err).to.equals(null);
                expect(car.id).not.undefined;

                chai.request(app)
                    .delete('/api/car/' + car.id)
                    .set("authorization", testingToken)
                    .end((err, res) => {

                        expect(err).to.equals(null);
                        expect(res).to.have.status(200);
                        expect(res.body).to.have.property("message");
                        expect(res.body.message).to.equals("Successfully removed");

                        done();

                    });
            });
        });

    });

});
