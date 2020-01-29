const bcrypt = require('bcrypt')
const server = require('./../server')

module.exports = {
    authenticate,
    insertUser,
    updateUser,
    isUserExist
};

/**
 * 
 * Service method to check if provide credentials are valid or not for authentication.
 */
function authenticate(email_address, password, callback) {

    if(email_address != 'roycharlie@gmail.com'){
            callback({
                message: "Unauthorized : Invalid Username",
                result: ""
            })
        } else {
            if (password == 'royCharlie01!' ) {
                callback({
                    message: "true",
                    result: {
                    "id": 'c6a7ea2a-34b3-4ac2-a014-e7acac7e8963',
                    "first_name": 'Roy',
                    "last_name": 'Charlie',
                    "email_address": 'roycharlie@gmail.com',
                    "account_created": "2020-01-29T01:56:58.000Z",
                    "account_updated": "2020-01-29T01:56:59.000Z"
                }
                })
            } else {
                callback({
                    message: "Unauthorized : Invalid Password",
                    result: ""
                });
            }
        }
}


function insertUser(params, callback) {
    callback('success')
}

function updateUser(params, callback) {

    callback('success')

}

function isUserExist(email_address, callback) {
    callback(false)
}