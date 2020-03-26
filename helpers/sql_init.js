const server = require('./../server')
const logger = require('../config/winston')
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
            logger.info("Successfully executed create query for user details");
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
            logger.info("Successfully executed create query for bill details")
        }
    });
    server.connection.query('create table IF NOT EXISTS filedetails'+ 
    '( file_name varchar(225) not null,id varchar(250) not null,url varchar(225) not null, key_name varchar(225) not null, '+ 
    'upload_date date not null, file_owner varchar(225) not null, bill_id varchar(225) not null,'+
    'size int not null, md5 varchar(225) not null, encoding varchar(225) not null, mimetype varchar(225) not null, '+
    'primary key(id), foreign key(file_owner) references userdetails(id), foreign key(bill_id) references billdetails(id) )', function (error, results, fields) {
        if (error) {
            console.log(error)
        } 
        else{
            console.log('Successfully executed create query for file details')
            logger.info("Successfully executed create query for bill details")
        }
    });

}