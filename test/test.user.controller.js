var supertest = require("supertest");
let chai = require('chai');
let chaiHttp = require('chai-http');
let temp = require('./../server')
let should = chai.should();
chai.use(chaiHttp);
var expect = chai.expect;
// let should = chai.should();
let assert = require('assert')

// This agent refers to PORT where program is runninng.

var server = supertest.agent("http://localhost:3000/v1");

// UNIT test begin


//POST REQUEST (/user)

describe("Unit test for POST REQUEST: Creating a new User", function () {
    
    it('Will invalid request body is sent',function(done){
        var data = 
            {
                "last_name": "Charlie",
                "email_address": "roycharlie@gmail.com",
                "password": "royCharlie01!"
              };
       server.post('/user').send(data).expect(400).end((err, res) => {
            if(err){
                console.log("Exception case " + err);
            }
            else{
                console.log("Exception case " + res);
            }
            done();
        });       
     });

    it('Bad request when invalid values are given as input',function(done){
        var data = 
            {
                "first_name": "",
                "last_name": "Charlie",
                "email_address": "roycharlie3",
                "password": "royCharlie01!"
              };
        server.post('/user').send(data).expect(400).end((err, res) => {
            console.log("Exception case " + res.body.message);
            done();
        });       
     }); 
    
    it('Will result bad request when invalid email_address is given as input',function(done){
        var data = 
            {
                "first_name": "Roy",
                "last_name": "Charlie",
                "email_address": "roycharlie3",
                "password": "royCharlie01!"
              };
        server.post('/user').send(data).expect(400).end((err, res) => {
            console.log("Exception case " + res.body.message);
            done();
        });       
     });

     it('Will result bad request when invalid password is given as input',function(done){
        var data = 
            {
                "first_name": "Roy",
                "last_name": "Charlie",
                "email_address": "roycharlie@gmail.com",
                "password": "royCha"
              };
        server.post('/user').send(data).expect(400).end((err, res) => {
            console.log("Exception case " + res.body.message);
            done();
        });       
     });

    it('Success case: Will accept the correct details of new user with valid input email',function(done){
        var data = 
            {
                "first_name": "Roy",
                "last_name": "Charlie",
                "email_address": "roycharlie@gmail.com",
                "password": "royCharlie01!"
              };
        server.post('/user').send(data).end((err, res) => {
            if(!err){
            if((res).should.have.status(201)){
                console.log("Exception case " + res.body.message);
            done();
            };
        }else{
            console.log("Invalid inputs or User with email id already present");
            done();
        }
        });       
     });

     it('Throws an error when user creates an account with email_address already present in database',function(done){
        var data = 
            {
                "first_name": "Roy",
                "last_name": "Charlie",
                "email_address": "roycharlie@gmail.com",
                "password": "royCharlie01!"
              };
        server.post('/user').send(data).expect(400).end((err, res) => {
            console.log("Exception case " + res.body.message);
            done();
        });       
     });
});

// GET REQUEST ("/user/self")

describe("Unit test for GET REQUEST: Getting User Details", function () {
    
    it('Success Case: Will succeed if proper credentials are given',function(done){
        server.get('/user/self')
        // .set("Authorization", "basic " + new Buffer("roycharlie3@gmail.com:royCharlie01!").toString("base64"))
        .auth('roycharlie@gmail.com', 'royCharlie01!')
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.details.first_name.should.equal('Roy');
            res.body.details.last_name.should.equal('Charlie');
            res.body.details.email_address.should.equal('roycharlie@gmail.com');
            console.log(res.body.message);
            done();
        });       
     });

     it('Exception Case 401: When basic-auth header is not given along with request',function(done){
        server.get('/user/self')
        .end((err, res) => {
            res.should.have.status(401);
            console.log(res.body.message);
            done();
        });       
     });

     it('Exception Case 401: Will be declined if unauthorized credentials are given',function(done){
        server.get('/user/self')
        .auth('roycharlie@gmail.com', 'royChdarlie01!')
        .end((err, res) => {
            res.should.have.status(401);
            console.log(res.body.message);
            done();
        });       
     });

     it('Exception Case 401: Will be declined if invalid inputs are given',function(done){
        server.get('/user/self')
        .auth('', 'royChdarlie01!')
        .end((err, res) => {
            res.should.have.status(401);
            console.log(res.body.message);
            done();
        });       
     });

    });


// //PUT REQUEST ("/user/self")

    describe("Unit test for PUT REQUEST: Update User Details", function () {
    
        it('Exception Case 401: When basic-auth header is not given along with request',function(done){
            var data = 
            {
                "first_name": "Roy",
                "last_name": "Charlie",
                "email_address": "roycharlie10@gmail.com",
                "password": "royCharlie01!"
              };
            server.put('/user/self')
            .send(data)
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.have.property('message');
                console.log(res.body.message);
                done();
            });       
         });

        //  Will succeed if proper credentials are given

        it('Exception Case 401: When basic-auth header with invalid credentials',function(done){
            var data = 
            {
                "first_name": "Roy",
                "last_name": "Charlie",
                "email_address": "roycharlie10@gmail.com",
                "password": "royCharlie01!"
              };
            server.put('/user/self')
            .send(data)
            .auth('roycharlie@gmail.com', 'royCharlie0!')
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.have.property('message');
                console.log(res.body.message);
                done();
            });       
         });

         it('Exception Case 400: When improper data given in request body',function(done){
            var data = 
            {
                "first_name": "Roy",
                "last_name": "",
                "email_address": "roycharlie@gmail.com",
                "password": "royCharlie01!"
              };
            server.put('/user/self')
            .send(data)
            .auth('roycharlie@gmail.com', 'royCharlie01!')
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('message');
                console.log(res.body.message);
                done();
            });       
         });

         it('Exception Case 400: When invalid request body is sent',function(done){
            var data = 
            {
                "first_name": "Roy",
                "email_address": "roycharlie@gmail.com",
                "password": "royCharlie01!"
              };
            server.put('/user/self')
            .send(data)
            .auth('roycharlie@gmail.com', 'royCharlie01!')
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('message');
                console.log(res.body.message);
                done();
            });       
         });

         it('Exception Case 400: When update info do not satisfy constraints',function(done){
            var data = 
            {
                "first_name": "Roy",
                "last_name": "Charlie",
                "email_address": "roycharlie@gmail.com",
                "password": "royCharli"
              };
            server.put('/user/self')
            .send(data)
            .auth('roycharlie@gmail.com', 'royCharlie01!')
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('message');
                console.log(res.body.message);
                done();
            });       
         });

         it('Exception Case 400: When authorized email_address trying to update email_address',function(done){
            var data = 
            {
                "first_name": "Roy",
                "last_name": "Ch",
                "email_address": "roycharlie1@gmail.com",
                "password": "royCharlie01!"
              };
            server.put('/user/self')
            .send(data)
            .auth('roycharlie@gmail.com', 'royCharlie01!')
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('message');
                console.log(res.body.message);
                done();
            });       
         });

         it('Success Case 204: When valid input by authorized user is given',function(done){
            var data = 
            {
                "first_name": "Roy",
                "last_name": "Charli",
                "email_address": "roycharlie@gmail.com",
                "password": "royCharlie0!"
              };
            server.put('/user/self')
            .send(data)
            .auth('roycharlie@gmail.com', 'royCharlie01!')
            .end((err, res) => {
                res.should.have.status(204);
                console.log("Successfully updated")
                done();
            });       
         });


        });
