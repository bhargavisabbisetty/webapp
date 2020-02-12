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
        var pdate1 = date1.split('-');
        var dd1 = parseInt(pdate1[0]);
        var mm1 = parseInt(pdate1[1]);
        var yy1 = parseInt(pdate1[2]);
        var pdate2 = date2.split('-');
        var dd2 = parseInt(pdate2[0]);
        var mm2 = parseInt(pdate2[1]);
        var yy2 = parseInt(pdate2[2]);

        if (yy2 >= yy1) {
            if (mm2 >= mm1) {
                if (dd2 >= dd1) {
                    return true
                } else {
                    return false
                }
            } else {
                return false
            }
        } else {
            return false
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