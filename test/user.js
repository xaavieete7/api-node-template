'use strict'

process.env.NODE_ENV = 'test';

// Import user model
const User = require('../models/user');

// Require chai library (We use to "simulate" api petitions)
const chai = require('chai');

// Initialize http server
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

// Import the main file to get all the routes
const app = require('../index');
const TokenService = require("../services/authToken");

// Add some "pseudonimo" I don't know how to say in English
const expect = chai.expect;


describe('User', () => {

    beforeEach((done) => {
        // This function would be executed before each test
        User.deleteMany({}, (err) => {
            done();
        });
    });

    describe('/POST /api/register', () => {

        // User without email
        it('it should not register a user without email', (done) => {
            let user = {
                password: "TestingForFun"
            };
            chai.request(app)
                .post('/api/register')
                .send(user)
                .end((err, res) => {
                    expect(err).to.equals(null);
                    expect(res).to.have.status(406);
                    expect(res.body).to.have.property("message");
                    expect(res.body.message).to.equals("The email is required");
                    done();
                });
        });

        // User without password
        it('it should not register a user without password', (done) => {
            let user = {
                email: "xavigrau09@gmail.com"
            };
            chai.request(app)
                .post('/api/register')
                .send(user)
                .end((err, res) => {
                    expect(err).to.equals(null);
                    expect(res).to.have.status(406);
                    expect(res.body).to.have.property("message");
                    expect(res.body.message).to.equals("The password is required");
                    done();
                });
        });

        // User with invalid email
        it('it should not register a user with invalid email', (done) => {

            // Let's validate more than one invalid email
            const email = ["pedroPicapiedra", "xavigraugmail.com", "test@gmail", "HOLA.@gmail.com"];

            for (let i = 0; i < email.length; i++) {

                let user = {
                    email: email[i],
                    password: "testingPassword"
                }

                chai.request(app)
                    .post('/api/register')
                    .send(user)
                    .end((err, res) => {
                        expect(err).to.equals(null);
                        expect(res).to.have.status(500);
                        expect(res.body).to.have.property("error");
                        expect(res.body.error.message).to.length.greaterThanOrEqual(1);
                        expect(res.body.error.message).to.equals("User validation failed: email: Email format is invalid");
                    });
            }
            done();
        });

        // User with valid email
        it('it should register a user with valid email', (done) => {

            // Let's validate more than one invalid email
            const email = ["xavigrau09@gmail.com", "Pedro12@gmail.com", "holaMundo@hotmail.com", "testing@outlook.com"];

            for (let i = 0; i < email.length; i++) {

                let user = {
                    email: email[i],
                    password: "testingPassword"
                }

                chai.request(app)
                    .post('/api/register')
                    .send(user)
                    .end((err, res) => {
                        expect(err).to.equals(null);
                        expect(res).to.have.status(200);
                        expect(res.body.token).to.length.greaterThanOrEqual(1);
                    });
            }
            done();
        });

    });

    describe('/POST /api/login', () => {

        // User without email
        it('it should not login a user without email', (done) => {
            let user = {
                password: "TestingForFun"
            };
            chai.request(app)
                .post('/api/login')
                .send(user)
                .end((err, res) => {
                    expect(err).to.equals(null);
                    expect(res).to.have.status(406);
                    expect(res.body).to.have.property("message");
                    expect(res.body.message).to.equals("The email is required");
                    done();
                });
        });

        // User without password
        it('it should not login a user without password', (done) => {
            let user = {
                email: "xavigrau09@gmail.com"
            };
            chai.request(app)
                .post('/api/login')
                .send(user)
                .end((err, res) => {
                    expect(err).to.equals(null);
                    expect(res).to.have.status(406);
                    expect(res.body).to.have.property("message");
                    expect(res.body.message).to.equals("The password is required");
                    done();
                });
        });

        it('it should not login a user with valid email', (done) => {

            // Let's validate more than one valid email
            const email = ["xavigrau09@gmail.com", "Pedro12@gmail.com", "testing@outlook.com"];

            for (let i = 0; i < email.length; i++) {

                let user = new User ({
                    email: email[i],
                    password: "testingPassword"
                });

                // Fist we have to register the user
                user.save();
            }

            for (let i = 0; i < email.length; i++) {

                let user = new User ({
                    email: email[i],
                    password: "testingPassword"
                });

                chai.request(app)
                    .post("/api/login")
                    .send(user)
                    .end((err, res) => {
                        expect(err).to.equals(null);
                        expect(res).to.have.status(200);
                        expect(res.body).to.have.property("message");
                        expect(res.body.message).to.equals("Successfully logged in");
                        expect(res.body).to.have.property("token");
                        expect(res.body.token).to.length.greaterThanOrEqual(1);
                    });

            }

            done();
        });

    });

    describe('/GET /api/users/', () => {

        it('it should GET user by id', (done) => {

            let user = new User ({
                email: "xavigrau29@gmail.com",
                password: "testingPassword"
            });

            // Fist we have to register user
            user.save((err, user) => {

                expect(err).to.equals(null);

                User.findOne({ email: user.email }, (err, user) => {

                    expect(err).to.equals(null);
                    expect(user).not.undefined;
                    expect(user.id).not.undefined;
                    let authToken = TokenService.createToken(user.id);
                    expect(authToken).not.undefined;

                    chai.request(app)
                        .get("/api/user/" + user.id)
                        .set("authorization", authToken)
                        .end((err, res) => {

                            expect(err).to.equals(null);
                            expect(res).to.have.status(200);
                            expect(res.body).to.have.property("message");
                            expect(res.body.message).to.equals("Successfully");
                            expect(res.body.user).to.have.property("_id");
                            expect(res.body.user).to.have.property("email");

                        });

                });

            });

            done();

        });


        it('it should GET current user information', (done) => {

            let user = new User ({
                email: "xavigrau19@gmail.com",
                password: "testingPassword"
            });

            // Fist we have to register the users
            user.save((err, user) => {

                expect(err).to.equals(null);

                chai.request(app)
                    .post("/api/login")
                    .send(user)
                    .end((err, res) => {

                        expect(err).to.equals(null);
                        expect(res).to.have.status(200);

                        chai.request(app)
                            .get("/api/user/")
                            .set("authorization", res.body.token)
                            .end((err, res) => {
                                expect(err).to.equals(null);
                                expect(res).to.have.status(200);
                                expect(res.body).to.have.property("message");
                                expect(res.body.message).to.equals("Successfully");
                                expect(res.body.user).to.have.property("_id");
                                expect(res.body.user).to.have.property("email");
                            });
                    });
            });
            done();

        });
    });

});
