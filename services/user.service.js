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
    server.connection.query('SELECT * from userdetails where email_address = ?', email_address, function (error, results, fields) {
        if (results.length == 0) {
            callback({
                message: "Unauthorized : Invalid Username",
                result: ""
            })
        } else {
            if (bcrypt.compareSync(password, results[0].password)) {
                callback({
                    message: "true",
                    result: {
                        id: results[0].id,
                        first_name: results[0].first_name,
                        last_name: results[0].last_name,
                        email_address: results[0].email_address,
                        account_created: results[0].account_created,
                        account_updated: results[0].account_updated
                    }
                })
            } else {
                callback({
                    message: "Unauthorized : Invalid Password",
                    result: ""
                });
            }
        }
    });
}

function isUserExist(email_address, callback){
    server.connection.query('SELECT * from userdetails where email_address = ?', email_address, function (error, results, fields) {
        if(results.length != 0){
            callback(true)
        }
        else{
            callback(false)
        }
    });
}
function insertUser(params, callback) {
    server.connection.query('INSERT INTO userdetails SET ?', params, function (error, results, fields) {
        if (error) {
            callback('error')
        } else {
            callback('success')
        }
    });
}

function updateUser(params, callback) {
    server.connection.query("UPDATE userdetails SET first_name = ?, last_name = ?, password = ?, account_updated = ? WHERE email_address = ? ",
        params,
        function (error, results, fields) {
            if (error) {
                callback(error)
            } else {
                callback('success')
            }
        });
}