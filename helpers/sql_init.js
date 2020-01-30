const server = require('./../server')

module.exports = {
    sqlInit
};

function sqlInit() {
    server.connection.query('CREATE TABLE IF NOT EXISTS userdetails' + 
    '(id varchar(225) NOT NULL,first_name varchar(255) NOT NULL, '+
    'last_name varchar(255) NOT NULL, email_address varchar(255) NOT NULL,'+ 
    'password varchar(255) NOT NULL, account_created TIMESTAMP NOT NULL, '+
    'account_updated TIMESTAMP NOT NULL,'+
    'PRIMARY KEY (id))', function (error, results, fields) {
        if (error) {
            console.log(error)
        } 
        else{
            console.log('Successfully executed create query for user details')
        }
    });
    server.connection.query('create table IF NOT EXISTS billdetails'+ 
    '( id varchar(250) not null,created_ts TIMESTAMP not null, updated_ts TIMESTAMP not null,' +
    'owner_id varchar(225) not null, vendor varchar(225) not null,'+
    'bill_date date not null, due_date date not null, amount_due double not null,'+
    'categories varchar(225) not null, paymentStatus int not null,'+
    'primary key(id), foreign key(owner_id) references userdetails(id) )', function (error, results, fields) {
        if (error) {
            console.log(error)
        } 
        else{
            console.log('Successfully executed create query for bill details')
        }
    });
}