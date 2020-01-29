var supertest = require("supertest");
let chai = require('chai');
let chaiHttp = require('chai-http');
let temp = require('./../../server')
let should = chai.should();
chai.use(chaiHttp);
var expect = chai.expect;
let assert = require('assert')


var server = supertest.agent("http://localhost:3000/v1");

describe("Unit test for UPDATE REQUEST: Update a specific bill", function () {
    
    it('Success Case: Update a specific bill',function(done){
        var data = {
            "vendor": "Northeastern University",
            "bill_date": "2020-01-06",
            "due_date": "2020-01-12",
            "amount_due": 7000.51,
            "categories": [
              "college",
              "tuition",
              "spring2020"
            ],
            "paymentStatus": "paid"
        }
        server.put('/bill/cd1bbd2f-43bc-4699-9614-4b5bee40037b')
        .auth('roycharlie@gmail.com', 'royCharlie01!')
        .send(data)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            done();
        });       
    });

    it('Success Case: Update a specific bill',function(done){
        var data = {
            "vendor": "Northeastern University",
            "bill_date": "2020-01-06",
            "due_date": "2020-01-12",
            "amount_due": 0,
            "categories": [
              "college",
              "tuition",
              "spring2020"
            ],
            "paymentStatus": "paid"
        }
        server.put('/bill/cd1bbd2f-43bc-4699-9614-4b5bee40037b')
        .auth('roycharlie@gmail.com', 'royCharlie01!')
        .send(data)
        .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            done();
        });       
    });

    it('Exception Case: UnAuthorized Access',function(done){
        var data = {
            "vendor": "Northeastern University",
            "bill_date": "2020-01-06",
            "due_date": "2020-01-12",
            "amount_due": 7000.51,
            "categories": [
              "college",
              "tuition",
              "spring2020"
            ],
            "paymentStatus": "paid"
        }
        server.put('/bill/a8d787d2-6bc7-4d09-9a9f-7d35187a24f2')
        .auth('roycharlie@gmail.com', 'royCharlie0!')
        .send(data)
        .end((err, res) => {
            res.should.have.status(401);
            done();
        });       
    });

    it('Exception Case: Bill of a different user is accessed',function(done){

        var data = {
            "vendor": "Northeastern University",
            "bill_date": "2020-01-06",
            "due_date": "2020-01-12",
            "amount_due": 7000.51,
            "categories": [
              "college",
              "tuition",
              "spring2020"
            ],
            "paymentStatus": "paid"
        }
        server.put('/bill/cd1b769f-43bc-4699-9614-4b5be897037b')
        .auth('roycharlie@gmail.com', 'royCharlie01!')
        .send(data)
        .end((err, res) => {
            res.should.have.status(401);
            done();
        });       
    });

    it('Exception Case: Bill not found',function(done){
        var data = {
            "vendor": "Northeastern University",
            "bill_date": "2020-01-06",
            "due_date": "2020-01-12",
            "amount_due": 7000.51,
            "categories": [
              "college",
              "tuition",
              "spring2020"
            ],
            "paymentStatus": "paid"
        }
        server.put('/bill/cd1b769f-43bc-4699-9613-4b5be897037b')
        .auth('roycharlie@gmail.com', 'royCharlie01!')
        .end((err, res) => {
            res.should.have.status(404);
            done();
        });       
    });
});