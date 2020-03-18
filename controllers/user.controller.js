var bcrypt = require('bcrypt');
const saltRounds = 10
const uuid = require('uuid/v4')
const Validator = require('./../services/validator')
const validatorObj = new Validator()
const logger = require('../config/winston')
const sdc = require('../config/statsd-client')
var userService = ''
if (process.env.NODE_ENV == 'production') {
    userService = require('./../services/user.service.mock')
} else {
    userService = require('./../services/user.service');
}
/**
 * 
 * This method is used to make a post request. It is a public endpoint.
 * This method helps to create new user.
 */
exports.post = (request, response) => {
    sdc.increment('userPost.counter');
    var timer = new Date();
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
                    userService.isUserExist(email_address, function (msg) {
                        if (msg) {
                            console.log("User Email exists in the database..!!")
                            logger.info("Bad Request : User Email exists in the database..!!");
                            response.status(400).json({
                                message: "Bad Request : User Email exists in the database..!!"
                            });
                        } else {
                            bcrypt.hash(password, saltRounds, function (err, hash) {
                                if (err) {
                                    logger.err(err)
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
                                var DBtimer = new Date();
                                userService.insertUser(params, function (msg) {
                                    if (msg == 'success') {
                                        logger.info("successfully created user" + first_name)
                                        sdc.timing('DBuserPost.timer', DBtimer)
                                        response.status(201).json({
                                            "id": id,
                                            "first_name": first_name,
                                            "last_name": last_name,
                                            email_address: email_address,
                                            "account_created": account_created,
                                            "account_updated": account_updated
                                        });
                                    } else {
                                        logger.info("Bad Request : User Email exists..!!")
                                        response.status(400).json({
                                            message: "Bad Request : User Email exists..!!"
                                        });
                                    }
                                })
                            });
                        }
                    });
                } else {
                    logger.info("Password is not strong enough");
                    response.status(400).json({
                        message: "Bad Request : Password is not strong enough"
                    });
                }
            } else {
                logger.info("Invalid email_address as input");
                response.status(400).json({
                    message: "Bad Request : Invalid email_address as input"
                })
            }
        } else {
            logger.info("Please enter all details");
            response.status(400).json({
                message: "Bad Request : Please enter all details"
            });
        }
    } else {
        logger.info("Please enter valid input");
        response.status(400).json({
            message: "Bad Request : Please enter valid input"
        });
    }
    sdc.timing('userPost.timer', timer)
}

/**
 * 
 * This is a method which gets executed on get request. It is secured end point.
 * This returns user details.
 */
exports.get = (request, response) => {
    sdc.increment('userGet.counter');
    var timer = new Date();
    var DBtimer = new Date();
    let user = request.user
    logger.info("user details with id " + user.id + " successfully retrieved")
    sdc.timing('DBuserGet.timer', DBtimer)
    response.status(200).json({
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email_address: user.email_address,
        account_created: user.account_created,
        account_updated: user.account_updated
    });
    sdc.timing('userGet.timer', timer)
}

/**
 * 
 * This method is used to make a put request. It is a secured endpoint.
 * This method helps to update user details.
 */
exports.put = (request, response) => {
    sdc.increment('userPut.counter');
    var timer = new Date()
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
                            logger.err(err)
                            response.status(500).json({
                                error: err
                            });
                        }
                        const account_updated = new Date()
                        const params = [first_name, last_name, hash, account_updated, email_address];
                        var DBtimer = new Date()
                        userService.updateUser(params, function (msg) {
                            if (msg == 'success') {
                                sdc.timing('userPut.timer', timer)
                                logger.info("successfully updated user details " + email_address)
                                sdc.timing('DBuserPut.timer', DBtimer)
                                response.status(204).send();
                            } else {
                                logger.err('sql error of update')
                                response.status(400).json({
                                    message: msg
                                })
                            }
                        })
                    });
                } else {
                    logger.info("Password is not strong enough");
                    response.status(400).json({
                        message: "Bad Request : Password is not strong enough"
                    });
                }
            } else {
                logger.info("Will not be update email_address. Please enter your email_address which you used for authorization.");
                response.status(400).json({
                    message: "Bad Request : Will not be update email_address. Please enter your email_address which you used for authorization."
                });
            }
        } else {
            logger.info("Please enter all details");
            response.status(400).json({
                message: "Bad Request : Please enter all details"
            });
        }
    } else {
        logger.info("Please give valid input");
        response.status(400).json({
            message: "Bad Request : Please give valid input"
        });
    }
}