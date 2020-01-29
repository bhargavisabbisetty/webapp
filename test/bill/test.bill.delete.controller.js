var supertest = require("supertest");
let chai = require('chai');
let chaiHttp = require('chai-http');
let temp = require('./../../server')
let should = chai.should();
chai.use(chaiHttp);
var expect = chai.expect;
let assert = require('assert')


var server = supertest.agent("http://localhost:3000/v1");

describe("Unit test for DELETE REQUEST: Retrieve a specific bill", function () {
    
    it('Success Case: Delete a specific bill',function(done){
        server.delete('/bill/cd1bbd2f-43bc-4699-9614-4b5bee40037b')
        .auth('roycharlie@gmail.com', 'royCharlie01!')
        .end((err, res) => {
            res.should.have.status(204);
            done();
        });       
    });

    it('Exception Case: UnAuthorized Access',function(done){

        server.delete('/bill/a8d787d2-6bc7-4d09-9a9f-7d35187a24f2')
        .auth('roycharlie@gmail.com', 'royCharlie0!')
        .end((err, res) => {
            res.should.have.status(401);
            done();
        });       
    });

    it('Exception Case: Bill of a different user is accessed',function(done){

        server.delete('/bill/cd1b769f-43bc-4699-9614-4b5be897037b')
        .auth('roycharlie@gmail.com', 'royCharlie01!')
        .end((err, res) => {
            res.should.have.status(401);
            done();
        });       
    });

    it('Exception Case: Bill not found',function(done){

        server.delete('/bill/cd1b769f-43bc-4699-9613-4b5be897037b')
        .auth('roycharlie@gmail.com', 'royCharlie01!')
        .end((err, res) => {
            res.should.have.status(404);
            done();
        });       
    });
});