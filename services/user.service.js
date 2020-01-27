const bcrypt = require('bcrypt')
const server = require('./../server')

module.exports = {
    authenticate
};

/**
 * 
 * Service method to check if provide credentials are valid or not for authentication.
 */
function authenticate(email_address, password,callback) {
    server.connection.query('SELECT * from userdetails where email_address = ?', email_address, function (error, results, fields) {
        if(results.length == 0){
                callback({message: "Unauthorized : Invalid Username",
                          result: ""})   
        }
        else{
            if (bcrypt.compareSync(password, results[0].password)) {
                callback({message : "true",
                         result: results[0]})
            } else {
                callback({message: "Unauthorized : Invalid Password",result: ""});
            }
        }
    });
}