var supertest = require("supertest");
let chai = require('chai');
let chaiHttp = require('chai-http');
let temp = require('./../../server')
let should = chai.should();
chai.use(chaiHttp);
var expect = chai.expect;
let assert = require('assert')


var server = supertest.agent("http://localhost:3000/v1");
describe("Unit test for POST REQUEST: Create a Bill", function () {
    
    it('Success Case: User is successfully inserted',function(done){
        var data = 
        {
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
        server.post('/bill/')
        .auth('roycharlie@gmail.com', 'royCharlie01!')
        .send(data)
        .end((err, res) => {
            res.should.have.status(201);
            res.body.should.be.a('object');
            res.body.message.should.equal('Bill added successfully');
            done();
        });       
    });

    it('Exception Case: UnAuthorized Access',function(done){
        var data = 
        {
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
        server.post('/bill/')
        .auth('roycharlie@gmail.com', 'royCharlie0!')
        .send(data)
        .end((err, res) => {
            res.should.have.status(401);
            done();
        });       
    });

    it('Exception Case: Bad Request',function(done){
        var data = 
        {
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
        server.post('/bill/')
        .auth('roycharlie@gmail.com', 'royCharlie01!')
        .send(data)
        .end((err, res) => {
            res.should.have.status(400);
            done();
        });       
    });
});