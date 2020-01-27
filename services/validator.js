const validator = require('email-validator')
const Regex = require('regex')

/**
 * Helper class which has methods to validate email_address and password.
 */
class Validator{

    checkEmail(email_address){
        if(validator.validate(email_address))
            return true;
        else
            return false;
    }

    checkPassword(password){
        let regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{9,}$/ //Password matching expression.
        // At least one upper case, one lower case, one special character and one digit

        if(regex.test(password))
            return true;
        else
            return false;
    }
}

module.exports = Validator;