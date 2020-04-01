const validator = require('email-validator')
const Regex = require('regex')

/**
 * Helper class which has methods to validate email_address and password.
 */
class Validator {

    checkEmail(email_address) {
        if (validator.validate(email_address))
            return true;
        else
            return false;
    }

    checkPassword(password) {
        let regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{9,}$/ //Password matching expression.
        // At least one upper case, one lower case, one special character and one digit

        if (regex.test(password))
            return true;
        else
            return false;
    }

    validateDateFormat(date) {
        var dateformat = /^[0-9]{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/
        // Match the date format through regular expression
        if (dateformat.test(date)) {
            // Extract the string into month, date and year
        return true;
        }else{
            return false;
        }
    }

    checkDatesValidity(date1, date2) {
        var D1 = new Date(date1)
        var D2 = new Date(date2)
        if(D1<=D2){
            return true;
        }
        else
        {
            return false;
        }
    }

    isValidStatus(ps, PaymentStatusEnum){
        for(var temp in PaymentStatusEnum){
            if(temp == ps){
                return true
            }
        }
        return false
    }

//     getDate(){
//     var todayTime = new Date();
//     var month = format(todayTime .getMonth() + 1);
//     var day = format(todayTime .getDate());
//     var year = format(todayTime .getFullYear());
//     return month + "/" + day + "/" + year;
// }
}

module.exports = Validator;