const express = require('express');
const app = express();
const port = process.env.PORT || 3000
const logger = require('./config/winston')
const bodyParser = require('body-parser')
const mysql = require('mysql');
const basicAuth = require('./helpers/basic_authentication');
const sql = require('./helpers/sql_init')
const fileUpload = require('express-fileupload');
require('dotenv').config({
  silent: process.env.NODE_ENV === 'production'
});
if (process.env.NODE_ENV != 'production') {
  var connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD
  });

  connection.query('CREATE DATABASE IF NOT EXISTS ??', process.env.MYSQL_DATABASE, function (err, results) {
    if (err) {
      console.log('error in creating database', err);
      logger.error('error in creating database', err);
      logger.error(process.env.MYSQL_DATABASE);
      logger.error(process.env.MYSQL_HOST);
      return;
    }
    console.log('created a new database');
    logger.info('created a new database');

    connection.changeUser({
      database: process.env.MYSQL_DATABASE
    }, function (err) {
      if (err) {
        console.log('error in changing database', err);
        logger.error('error in changing database', err);
        return;
      }
    });
      console.log('connected as id ' + connection.threadId);
      logger.info('connected as id ' + connection.threadId);
      logger.info(process.env.SQS_QUEUE_URL)
      sql.sqlInit();
  });
};
app.get('/', (req, res) => {
  res.send('CSYE 6225 Assignment 2');
});

app.use(basicAuth);
app.use(bodyParser.json());
//capture JSON format errors
app.use(function (error, req, res, next) {
  if (error instanceof SyntaxError) {
    res.status(400).json({
      message: "Syntax Error: " + error.message
    }).send()
  } else if (error instanceof Error) {
    res.status(400).json({
      message: "Error: " + error.message
    }).send()
  } else {
    next();
  }
});
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(fileUpload());
let initApp = require('./app');
initApp(app);

app.listen(port, () => console.log(`Started listening on port ${port}...`))
module.exports['connection'] = connection
module.exports = app;