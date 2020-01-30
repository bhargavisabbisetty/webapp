const express = require('express');
const app = express();
const port = process.env.PORT || 3000
const bodyParser = require('body-parser')
const mysql = require('mysql');
const basicAuth = require('./helpers/basic_authentication');
const sql = require('./helpers/sql_init')
require('dotenv').config({
  silent: process.env.NODE_ENV === 'production'
});
if (process.env.NODE_ENV != 'production') {
  var connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
  });

  connection.connect(function (err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
    console.log('connected as id ' + connection.threadId);
    sql.sqlInit();
  });
}
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
let initApp = require('./app');
initApp(app);

app.listen(port, () => console.log(`Started listening on port ${port}...`))
module.exports['connection'] = connection
module.exports = app;