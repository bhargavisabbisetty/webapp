var bcrypt = require('bcrypt');
const saltRounds = 10
const server = require('./../server')
const uuid = require('uuid/v4')
const Validator = require('./../services/validator')
const validatorObj = new Validator()
var userService = ''
if(process.env.NODE_ENV == 'production'){
    // console.log(' I got hit')
// var rewire = require('rewire')
userService = require('./../services/user.service.mock')
}
else{
userService = require('./../services/user.service');
}
/**
 * 
 * This method is used to make a post request. It is a public endpoint.
 * This method helps to create new user.
 */
exports.post = (request, response) => {
    const id = uuid();
    const first_name = request.body.first_name;
    const last_name = request.body.last_name;
    const email_address = request.body.email_address;
    const password = request.body.password;
    const account_created = new Date();
    const account_updated = new Date();
    // console.log(id)
    if (first_name != null && last_name != null && email_address != null && password != null) {
        if (first_name.length > 0 && last_name.length > 0 && password.length > 0 && email_address.length > 0) {
            if (validatorObj.checkEmail(email_address)) {
                if (validatorObj.checkPassword(password)) {
                    userService.isUserExist(email_address, function(msg){
                        if (msg) {
                            console.log("User Email exists in the database..!!")
                            response.status(400).json({
                                message: "Bad Request : User Email exists in the database..!!"
                            });
                        } else {
                            bcrypt.hash(password, saltRounds, function (err, hash) {
                                if (err) {
                                    response.status(500).json({
                                        error: err
                                    });
                                }
                                const params = {
                                    id: id,
                                    first_name: first_name,
                                    last_name: last_name,
                                    email_address: email_address,
                                    password: hash,
                                    account_created: account_created,
                                    account_updated: account_updated
                                };
                                // console.log(params)
                                userService.insertUser(params, function (msg) {
                                    if (msg == 'success') {
                                        response.status(201).json({
                                            message: "User added successfully",
                                            details: {
                                                "id": id,
                                                "first_name": first_name,
                                                "last_name": last_name,
                                                email_address: email_address,
                                                "account_created": account_created,
                                                "account_updated": account_updated
                                            }
                                        });
                                    } else {
                                        response.status(400).json({
                                            message: "Bad Request : User Email exists..!!"
                                        });
                                    }
                                })

                                // response.end(JSON.stringify(results));
                            });
                        }
                    });
                } else {
                    console.log("Password is not strong enough");
                    response.status(400).json({
                        message: "Bad Request : Password is not strong enough"
                    });
                }
            } else {
                console.log("Invalid email_address as input");
                response.status(400).json({
                    message: "Bad Request : Invalid email_address as input"
                })
            }
        } else {
            console.log("Please enter all details");
            response.status(400).json({
                message: "Bad Request : Please enter all details"
            });
        }
    } else {
        console.log("Please enter valid input");
        response.status(400).json({
            message: "Bad Request : Please enter valid input"
        });
    }
}

/**
 * 
 * This is a method which gets executed on get request. It is secured end point.
 * This returns user details.
 */
exports.get = (request, response) => {
    let user = request.user
    response.status(200).json({
        message: "User Details",
        details: {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email_address: user.email_address,
            account_created: user.account_created,
            account_updated: user.account_updated
        }
    });
}

/**
 * 
 * This method is used to make a put request. It is a secured endpoint.
 * This method helps to update user details.
 */
exports.put = (request, response) => {
    const {
        first_name,
        last_name,
        email_address,
        password
    } = request.body
    if (first_name != null && last_name != null && password != null && email_address != null) {
        if (first_name.length > 0 && last_name.length > 0 && password.length > 0 && email_address.length > 0) {
            if (email_address == request.user.email_address) {
                if (validatorObj.checkPassword(password)) {
                    bcrypt.hash(password, saltRounds, function (err, hash) {
                        if (err) {
                            response.status(500).json({
                                error: err
                            });
                        }
                        const account_updated = new Date()
                        const params = [first_name, last_name, hash, account_updated, email_address];
                        userService.updateUser(params, function (msg) {
                            if (msg == 'success') {
                                console.log("successfully updated")
                                response.status(204).send();
                            } else {
                                console.log('sql error')
                                throw msg
                            }
                        })
                    });
                } else {
                    console.log("Password is not strong enough");
                    response.status(400).json({
                        message: "Bad Request : Password is not strong enough"
                    });
                }
            } else {
                console.log("Will not be update email_address. Please enter your email_address which you used for authorization.");
                response.status(400).json({
                    message: "Bad Request : Will not be update email_address. Please enter your email_address which you used for authorization."
                });
            }
        } else {
            console.log("Please enter all details");
            response.status(400).json({
                message: "Bad Request : Please enter all details"
            });
        }
    } else {
        console.log("Please give valid input");
        response.status(400).json({
            message: "Bad Request : Please give valid input"
        });
    }
}